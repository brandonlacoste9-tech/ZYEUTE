#!/usr/bin/env python3
"""
Zyeute Finance Bee - Revenue Validation Executor

Handles Stripe webhook events via Colony OS task queue.
Processes subscription events and updates Supabase database.

Location: infrastructure/colony/bees/finance_bee.py
"""

import os
import sys
import json
import time
import traceback
from datetime import datetime
from typing import Optional, Dict, Any

# Colony OS SDK
try:
    from pycolonies import colonies_client
    from pycolonies.crypto import Crypto
except ImportError:
    print("❌ pycolonies not installed. Run: pip install pycolonies")
    sys.exit(1)

# Supabase client
try:
    from supabase import create_client, Client
except ImportError:
    print("❌ supabase not installed. Run: pip install supabase")
    sys.exit(1)

# Stripe API
try:
    import stripe
except ImportError:
    print("❌ stripe not installed. Run: pip install stripe")
    sys.exit(1)

# Local imports
from config import Config
from guardian import Guardian


class FinanceBee:
    """Finance Worker Bee for Stripe webhook processing"""
    
    def _execute_with_retry(self, func, max_retries=3, base_delay=1, operation_name="operation"):
        """
        Execute function with exponential backoff retry
        
        Args:
            func: Function to execute
            max_retries: Maximum number of retry attempts
            base_delay: Base delay in seconds (doubles each retry)
            operation_name: Name of operation for logging
            
        Returns:
            Result from function
            
        Raises:
            Exception: If all retries exhausted
        """
        for attempt in range(max_retries):
            try:
                return func()
            except Exception as e:
                # Check if error is retryable
                error_str = str(e).lower()
                non_retryable = ['invalid', 'not found', 'unauthorized', 'forbidden']
                
                if any(term in error_str for term in non_retryable):
                    # Don't retry non-retryable errors
                    print(f"   ❌ Non-retryable error in {operation_name}: {e}")
                    raise
                
                if attempt == max_retries - 1:
                    # Last attempt failed
                    print(f"   ❌ {operation_name} failed after {max_retries} attempts")
                    raise
                
                # Calculate delay with exponential backoff
                delay = base_delay * (2 ** attempt)
                print(f"   ⚠️  {operation_name} failed (attempt {attempt + 1}/{max_retries}), retrying in {delay}s: {e}")
                time.sleep(delay)
    
    def __init__(self):
        print("🐝 Initializing Finance Bee...")
        
        # Load configuration
        self.config = Config()
        is_valid, error = self.config.validate()
        if not is_valid:
            print(f"❌ Configuration error: {error}")
            sys.exit(1)
        
        print(f"✅ Configuration loaded: {self.config}")
        
        # Initialize Guardian
        self.guardian = Guardian()
        print("✅ Guardian initialized")
        
        # Initialize Colony OS client
        try:
            self.colonies, self.colonyname, self.colony_prvkey, _, _ = colonies_client()
            self.crypto = Crypto()
            print("✅ Colony OS client initialized")
        except Exception as e:
            print(f"❌ Failed to initialize Colony OS client: {e}")
            sys.exit(1)
        
        # Set up executor identity
        self.executor_prvkey = self.config.colonies_executor_prvkey
        self.executorid = self.crypto.id(self.executor_prvkey)
        self.executorname = self.config.executor_name
        self.executortype = self.config.executor_type
        
        print(f"✅ Executor identity: {self.executorname} ({self.executorid})")
        
        # Initialize Supabase client
        try:
            self.supabase: Client = create_client(
                self.config.supabase_url,
                self.config.supabase_service_key
            )
            print("✅ Supabase client initialized")
        except Exception as e:
            print(f"❌ Failed to initialize Supabase client: {e}")
            sys.exit(1)
        
        # Initialize Stripe client
        stripe.api_key = self.config.stripe_secret_key
        print("✅ Stripe client initialized")
        
        # Register executor
        self.register_executor()
    
    def register_executor(self):
        """Register the executor with the Colonies server"""
        executor_spec = {
            "executorname": self.executorname,
            "executorid": self.executorid,
            "colonyname": self.colonyname,
            "executortype": self.executortype
        }
        
        try:
            # Add executor definition to the colony
            self.colonies.add_executor(executor_spec, self.colony_prvkey)
            
            # Self-approve (requires Colony Owner privileges)
            self.colonies.approve_executor(
                self.colonyname,
                self.executorname,
                self.colony_prvkey
            )
            
            print(f"✅ Executor {self.executorname} registered and approved")
        except Exception as e:
            # Registration might fail if executor already exists
            print(f"ℹ️  Executor registration: {e}")
            print("   (This is OK if executor already exists)")
    
    def validate_revenue(self, payload_json: str) -> str:
        """
        Core business logic for revenue validation
        
        Args:
            payload_json: JSON string containing Stripe event
            
        Returns:
            Result message
            
        Raises:
            RuntimeError: If processing fails
        """
        try:
            # Parse payload
            payload = json.loads(payload_json)
            
            # Guardian validation
            is_valid, reason = self.guardian.validate_stripe_payload(payload)
            if not is_valid:
                raise RuntimeError(f"Guardian blocked payload: {reason}")
            
            event_type = payload.get('type')
            print(f"   Processing event: {event_type}")
            
            # Handle checkout.session.completed
            if event_type == 'checkout.session.completed':
                return self._handle_checkout_completed(payload)
            
            # Handle subscription updates
            elif event_type == 'customer.subscription.updated':
                return self._handle_subscription_updated(payload)
            
            # Handle subscription cancellations
            elif event_type == 'customer.subscription.deleted':
                return self._handle_subscription_deleted(payload)
            
            else:
                return f"Event {event_type} received (no action taken)"
        
        except Exception as e:
            error_msg = f"Processing failed: {str(e)}\n{traceback.format_exc()}"
            print(f"❌ {error_msg}")
            raise RuntimeError(error_msg)
    
    def _handle_checkout_completed(self, payload: Dict[str, Any]) -> str:
        """
        Handle checkout.session.completed event
        
        Uses compensating transactions pattern for atomicity:
        - Store original state before updates
        - On failure, rollback changes
        - Idempotency via stripe_subscription_id
        """
        session = payload['data']['object']
        user_id = session['metadata'].get('userId')
        tier = session['metadata'].get('tier')
        subscription_id = session.get('subscription')
        
        if not user_id or not tier or not subscription_id:
            raise RuntimeError(f"Missing required metadata: userId={user_id}, tier={tier}, subscription={subscription_id}")
        
        # Check for idempotency - if subscription already exists, skip
        existing_sub = self.supabase.table('subscriptions').select('id').eq('stripe_subscription_id', subscription_id).execute()
        if existing_sub.data and len(existing_sub.data) > 0:
            print(f"   ℹ️  Subscription {subscription_id} already processed (idempotent)")
            return f"Subscription already activated for user {user_id}: {tier} (idempotent)"
        
        # Get original user profile state for rollback
        original_profile = self.supabase.table('user_profiles').select('subscription_tier, is_premium').eq('id', user_id).execute()
        original_state = original_profile.data[0] if original_profile.data else None
        
        # Get subscription period from Stripe (with retry)
        subscription = self._execute_with_retry(
            lambda: stripe.Subscription.retrieve(subscription_id),
            operation_name="Stripe subscription retrieve"
        )
        current_period_start = datetime.fromtimestamp(subscription.current_period_start).isoformat()
        current_period_end = datetime.fromtimestamp(subscription.current_period_end).isoformat()
        
        try:
            # Step 1: Update user profile (with retry)
            profile_result = self._execute_with_retry(
                lambda: self.supabase.table('user_profiles').update({
                    'subscription_tier': tier,
                    'is_premium': True,
                }).eq('id', user_id).execute(),
                operation_name="Update user_profiles"
            )
            
            if not profile_result.data:
                raise RuntimeError(f"Failed to update user_profiles for user {user_id}")
            
            # Step 2: Create subscription record (with retry)
            sub_result = self._execute_with_retry(
                lambda: self.supabase.table('subscriptions').upsert({
                    'subscriber_id': user_id,
                    'creator_id': user_id,
                    'status': 'active',
                    'stripe_subscription_id': subscription_id,
                    'stripe_customer_id': session.get('customer'),
                    'current_period_start': current_period_start,
                    'current_period_end': current_period_end,
                }, on_conflict='stripe_subscription_id').execute(),
                operation_name="Upsert subscription"
            )
            
            if not sub_result.data:
                # Rollback: Revert user profile to original state
                if original_state:
                    self.supabase.table('user_profiles').update(original_state).eq('id', user_id).execute()
                raise RuntimeError(f"Failed to create subscription record for {subscription_id}")
            
            return f"Subscription activated for user {user_id}: {tier} (subscription_id: {subscription_id})"
        
        except Exception as e:
            # Compensating transaction: Rollback profile update
            if original_state:
                print(f"   🔄 Rolling back user profile update for {user_id}")
                try:
                    self.supabase.table('user_profiles').update(original_state).eq('id', user_id).execute()
                except Exception as rollback_error:
                    print(f"   ⚠️  Rollback failed: {rollback_error}")
            raise
    
    def _handle_subscription_updated(self, payload: Dict[str, Any]) -> str:
        """Handle customer.subscription.updated event"""
        subscription = payload['data']['object']
        user_id = subscription['metadata'].get('userId')
        tier = subscription['metadata'].get('tier')
        
        if not user_id or not tier:
            return f"Subscription updated but missing metadata (userId={user_id}, tier={tier})"
        
        current_period_start = datetime.fromtimestamp(subscription['current_period_start']).isoformat()
        current_period_end = datetime.fromtimestamp(subscription['current_period_end']).isoformat()
        
        # Update subscription status (with retry)
        result = self._execute_with_retry(
            lambda: self.supabase.table('subscriptions').update({
                'status': 'active' if subscription['status'] == 'active' else 'canceled',
                'current_period_start': current_period_start,
                'current_period_end': current_period_end,
            }).eq('stripe_subscription_id', subscription['id']).execute(),
            operation_name="Update subscription"
        )
        
        return f"Subscription updated for user {user_id}: {subscription['status']}"
    
    def _handle_subscription_deleted(self, payload: Dict[str, Any]) -> str:
        """
        Handle customer.subscription.deleted event
        
        Uses compensating transactions pattern for atomicity
        """
        subscription = payload['data']['object']
        user_id = subscription['metadata'].get('userId')
        
        if not user_id:
            return f"Subscription deleted but missing userId in metadata"
        
        # Get original state for rollback
        original_profile = self.supabase.table('user_profiles').select('subscription_tier, is_premium').eq('id', user_id).execute()
        original_state = original_profile.data[0] if original_profile.data else None
        
        try:
            # Step 1: Update subscription status (with retry)
            sub_result = self._execute_with_retry(
                lambda: self.supabase.table('subscriptions').update({
                    'status': 'canceled'
                }).eq('stripe_subscription_id', subscription['id']).execute(),
                operation_name="Cancel subscription"
            )
            
            # Step 2: Update user profile (with retry)
            profile_result = self._execute_with_retry(
                lambda: self.supabase.table('user_profiles').update({
                    'subscription_tier': None,
                    'is_premium': False,
                }).eq('id', user_id).execute(),
                operation_name="Update user profile (cancel)"
            )
            
            if not profile_result.data:
                # Rollback: Revert subscription status
                self.supabase.table('subscriptions').update({
                    'status': 'active'
                }).eq('stripe_subscription_id', subscription['id']).execute()
                raise RuntimeError(f"Failed to update user profile for {user_id}")
            
            return f"Subscription canceled for user {user_id}"
        
        except Exception as e:
            # Compensating transaction: Rollback if needed
            if original_state:
                print(f"   🔄 Rolling back subscription cancellation for {user_id}")
                try:
                    self.supabase.table('user_profiles').update(original_state).eq('id', user_id).execute()
                except Exception as rollback_error:
                    print(f"   ⚠️  Rollback failed: {rollback_error}")
            raise
    
    def start(self):
        """Main event loop - polls for tasks and executes them"""
        print(f"🐝 {self.executorname} is buzzing. Waiting for jobs...")
        print(f"   Colony: {self.colonyname}")
        print(f"   Server: {self.config.colonies_server_host}")
        print(f"   Poll timeout: {self.config.poll_timeout}s")
        print("")
        
        while True:
            try:
                # Long polling - blocks for poll_timeout seconds waiting for a job
                process = self.colonies.assign(
                    self.colonyname,
                    self.config.poll_timeout,
                    self.executor_prvkey
                )
                
                print(f"⚡ Process {process.processid} assigned")
                print(f"   Function: {process.spec.funcname}")
                print(f"   Priority: {process.spec.priority}")
                print(f"   Args: {len(process.spec.args)} argument(s)")
                
                # Guardian validation
                is_safe, reason = self.guardian.validate_task(
                    process.spec.funcname,
                    process.spec.args
                )
                
                if not is_safe:
                    error_msg = f"Guardian blocked task: {reason}"
                    print(f"🛡️  {error_msg}")
                    
                    # Report failure to Colony Server
                    self.colonies.fail(
                        process.processid,
                        [error_msg],
                        self.executor_prvkey
                    )
                    continue
                
                # Execute task based on function name
                if process.spec.funcname == "validate_revenue":
                    result = self.validate_revenue(process.spec.args[0])
                    
                    # Report success to Colony Server
                    self.colonies.close(
                        process.processid,
                        [result],
                        self.executor_prvkey
                    )
                    
                    print(f"✅ Process {process.processid} completed successfully")
                    print(f"   Result: {result}")
                
                else:
                    error_msg = f"Unknown function: {process.spec.funcname}"
                    print(f"❌ {error_msg}")
                    
                    self.colonies.fail(
                        process.processid,
                        [error_msg],
                        self.executor_prvkey
                    )
                
                print("")
                
            except KeyboardInterrupt:
                print("\n🛑 Shutting down Finance Bee...")
                print(f"   Guardian stats: {self.guardian.get_stats()}")
                sys.exit(0)
            
            except Exception as e:
                # "No processes found" is normal during polling
                # Other exceptions should be logged but not crash the bee
                error_str = str(e)
                if "no processes" not in error_str.lower():
                    print(f"⚠️  Error in event loop: {error_str}")
                    time.sleep(1)  # Brief pause before retrying


if __name__ == '__main__':
    print("=" * 60)
    print("🐝 Zyeute Finance Bee")
    print("=" * 60)
    print("")
    
    try:
        bee = FinanceBee()
        bee.start()
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        traceback.print_exc()
        sys.exit(1)

