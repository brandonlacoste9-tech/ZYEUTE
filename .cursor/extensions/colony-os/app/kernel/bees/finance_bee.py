"""
FinanceBee - Financial Operations Worker Bee
Specialist in Payments, Subscriptions, and Revenue Defense.
Uses Stripe Agent Toolkit via Model Context Protocol (MCP) for secure financial operations.
"""

import logging
from typing import Dict, Any, Optional
from app.kernel.bees.base import BaseBee
from app.services.stripe_toolkit import StripeToolkit

logger = logging.getLogger(__name__)


class FinanceBee(BaseBee):
    """
    FinanceBee - Specialist Worker Bee for financial operations.
    
    Responsibilities:
    - Handle Stripe webhook events (payment failures, cancellations)
    - Manage subscription lifecycle
    - Generate personalized retention offers in Joual
    - Execute revenue defense strategies
    
    This bee uses the Stripe Toolkit (MCP wrapper) to perform financial actions
    securely, with full auditability and controlled access.
    """
    
    def __init__(self):
        super().__init__(
            name="Maitre-Financier",
            role="FinanceBee",
            skills=["manage_subscriptions", "issue_invoices", "retention_strategy", "payment_recovery"]
        )
        self.stripe_toolkit = StripeToolkit()
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    async def execute(self, payload: Dict[str, Any], task_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Execute a financial task (typically triggered by Stripe webhook events).
        
        Routes the task to the appropriate handler based on event type.
        
        Args:
            payload: Task payload containing event_type and event_data
            task_id: UUID of the task record in Supabase (optional)
            
        Returns:
            Dict containing the processing result
        """
        try:
            # Update task status to in_progress
            self.update_task_status(task_id, "in_progress")
            self.logger.info(f"FinanceBee processing task {task_id}")
            
            event_type = payload.get("event_type")
            event_data = payload.get("event_data", {})
            
            # Route to appropriate handler
            if event_type == "invoice.payment_failed":
                result = await self._handle_failed_payment(event_data)
            elif event_type == "customer.subscription.deleted":
                result = await self._handle_cancellation(event_data)
            elif event_type == "customer.subscription.updated":
                result = await self._handle_subscription_update(event_data)
            elif event_type == "checkout.session.completed":
                result = await self._handle_checkout_completion(event_data)
            else:
                # Default: acknowledge and log
                result = {
                    "status": "acknowledged",
                    "event": event_type,
                    "message": f"Event {event_type} received but no handler defined"
                }
                self.logger.info(f"Acknowledged event: {event_type}")
            
            # Update task status to completed
            self.update_task_status(task_id, "completed", result=result)
            self.logger.info(f"✅ Task {task_id} completed successfully")
            
            return result
            
        except Exception as e:
            error_msg = str(e)
            self.logger.error(f"❌ FinanceBee execution error: {error_msg}")
            
            # Update task status to failed
            self.update_task_status(task_id, "failed", error=error_msg)
            
            raise
    
    async def _handle_failed_payment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle failed payment event - Revenue Defense Strategy.
        
        Triggers AI agent to generate a personalized retention email in Joual
        with a discount offer to save the account.
        
        This is a critical revenue defense mechanism that turns payment failures
        into retention opportunities.
        
        Args:
            data: Stripe invoice.payment_failed event data
            
        Returns:
            Dict containing retention action result
        """
        self.logger.info("Processing failed payment - initiating retention strategy")
        
        # Extract customer information
        customer_id = data.get("customer")
        subscription_id = data.get("subscription")
        
        # Get customer details from Supabase (using FinanceBee's supabase client)
        try:
            customer_response = self.supabase.table("user_profiles").select(
                "id, email, subscription_tier"
            ).eq("stripe_customer_id", customer_id).single().execute()
            
            customer_email = customer_response.data.get("email") if customer_response.data else None
            user_id = customer_response.data.get("id") if customer_response.data else None
            
            if not customer_email:
                self.logger.warning(f"Customer email not found for Stripe customer: {customer_id}")
                return {
                    "status": "skipped",
                    "reason": "customer_email_not_found"
                }
        except Exception as e:
            self.logger.error(f"Error fetching customer: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
        
        # 1. Generate personalized retention email using AI (Ti-Guy/Gemini)
        offer_prompt = (
            f"Subscription {subscription_id} failed payment. "
            f"Customer email: {customer_email}. "
            f"Generate a highly persuasive, personalized retention email in authentic Quebec French (Joual). "
            f"Offer a 20% discount for 3 months to save the account. "
            f"Be warm, friendly, and conversational (Joual style)."
        )
        
        retention_copy = await self.stripe_toolkit.call_ai_tool(
            "generate_email",
            offer_prompt
        )
        
        # 2. Send the retention email
        send_result = await self.stripe_toolkit.call_tool("send_email", {
            "to": customer_email,
            "subject": "Oups! Problème avec ton abonnement Zyeuté 🚨",
            "body": retention_copy
        })
        
        # 3. Log the retention action in Supabase (optional: create notification)
        if user_id:
            try:
                self.supabase.table("notifications").insert({
                    "user_id": user_id,
                    "type": "payment_failed_retention",
                    "title": "Problème de paiement - offre spéciale",
                    "body": "On t'a envoyé un courriel avec une offre spéciale!",
                    "metadata": {
                        "subscription_id": subscription_id,
                        "retention_offer": "20%_discount_3months",
                        "email_sent": send_result.get("status") == "sent"
                    }
                }).execute()
            except Exception as e:
                self.logger.warning(f"Could not create notification: {str(e)}")
        
        self.logger.info(f"✅ Retention email sent to {customer_email}")
        
        return {
            "status": "retention_initiated",
            "email_status": send_result.get("status"),
            "action": "sent_joual_retention_offer",
            "subscription_id": subscription_id,
            "customer_email": customer_email,
            "discount_offer": "20%_for_3months"
        }
    
    async def _handle_cancellation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle subscription cancellation event.
        
        Performs post-cancellation cleanup:
        - Removes premium access in Supabase
        - Sends final survey to understand cancellation reason
        - Logs cancellation for analytics
        
        Args:
            data: Stripe customer.subscription.deleted event data
            
        Returns:
            Dict containing cancellation processing result
        """
        self.logger.info("Processing subscription cancellation")
        
        subscription_id = data.get("id")
        customer_id = data.get("customer")
        
        # 1. Remove premium access in Supabase
        try:
            # Find user by stripe_customer_id
            user_response = self.supabase.table("user_profiles").select("id, email").eq(
                "stripe_customer_id", customer_id
            ).single().execute()
            
            if user_response.data:
                user_id = user_response.data.get("id")
                user_email = user_response.data.get("email")
                
                # Downgrade to free tier
                update_response = self.supabase.table("user_profiles").update({
                    "subscription_tier": None,
                    "plan": "free",
                    "is_premium": False,
                    "stripe_customer_id": None  # Clear customer ID
                }).eq("id", user_id).select().execute()
                
                # Verify that the update actually affected a row
                if not update_response.data or len(update_response.data) == 0:
                    self.logger.error(f"❌ Update failed: No profile found with id {user_id}. Subscription canceled but user not downgraded.")
                    return {
                        "status": "error",
                        "error": f"Profile not found for user_id: {user_id}",
                        "subscription_id": subscription_id
                    }
                
                self.logger.info(f"✅ User {user_id} downgraded to free tier")
                
                # 2. Send cancellation survey (optional)
                # TODO: Implement survey email sending
                
                return {
                    "status": "cancellation_processed",
                    "subscription_id": subscription_id,
                    "user_id": user_id,
                    "action": "downgraded_to_free"
                }
            else:
                self.logger.warning(f"User not found for Stripe customer: {customer_id}")
                return {
                    "status": "skipped",
                    "reason": "user_not_found"
                }
                
        except Exception as e:
            self.logger.error(f"Error processing cancellation: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def _handle_subscription_update(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle subscription update event.
        
        Updates user profile based on subscription status changes.
        
        Args:
            data: Stripe customer.subscription.updated event data
            
        Returns:
            Dict containing update result
        """
        self.logger.info("Processing subscription update")
        
        subscription_id = data.get("id")
        customer_id = data.get("customer")
        status = data.get("status")
        
        # Update user profile based on subscription status
        try:
            user_response = self.supabase.table("user_profiles").select("id").eq(
                "stripe_customer_id", customer_id
            ).single().execute()
            
            if user_response.data:
                user_id = user_response.data.get("id")
                
                update_data = {}
                if status == "active":
                    update_data["is_premium"] = True
                elif status == "canceled" or status == "unpaid":
                    update_data["is_premium"] = False
                    update_data["subscription_tier"] = None
                    update_data["plan"] = "free"
                
                if update_data:
                    update_response = self.supabase.table("user_profiles").update(update_data).eq(
                        "id", user_id
                    ).select().execute()
                    
                    # Verify that the update actually affected a row
                    if not update_response.data or len(update_response.data) == 0:
                        self.logger.error(f"❌ Update failed: No profile found with id {user_id}. Subscription updated but user status not changed.")
                        return {
                            "status": "error",
                            "error": f"Profile not found for user_id: {user_id}",
                            "subscription_id": subscription_id
                        }
                
                return {
                    "status": "subscription_updated",
                    "subscription_id": subscription_id,
                    "subscription_status": status,
                    "user_id": user_id
                }
        except Exception as e:
            self.logger.error(f"Error updating subscription: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def _handle_checkout_completion(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle checkout session completion.
        
        This is already handled by the Netlify webhook, but FinanceBee
        can be used for additional processing if needed.
        
        Args:
            data: Stripe checkout.session.completed event data
            
        Returns:
            Dict containing processing result
        """
        self.logger.info("Checkout session completed - acknowledged by FinanceBee")
        
        # Additional processing can be added here if needed
        # The main fulfillment is handled by netlify/functions/stripe-webhook.js
        
        return {
            "status": "acknowledged",
            "event": "checkout.session.completed",
            "message": "Fulfillment handled by Netlify webhook"
        }

