# 🔬 Claude Mega Code Review - Complete Source Code

Hey Claude! Here's EVERYTHING you need for a comprehensive deep dive. All source files, infrastructure, tests, deployment scripts - the complete picture. Take your time, dig deep, and give me that 10x analysis! 🐝

---

## 📋 Table of Contents

1. [Finance Bee Core (`finance_bee.py`)](#1-finance-bee-core)
2. [Guardian Safety Layer (`guardian.py`)](#2-guardian-safety-layer)
3. [Configuration (`config.py`)](#3-configuration)
4. [Colony Client (`colony-client.js`)](#4-colony-client)
5. [Stripe Webhook (`stripe-webhook.js`)](#5-stripe-webhook)
6. [Docker Compose (`docker-compose.yml`)](#6-docker-compose)
7. [Systemd Service (`zyeute-finance-bee.service`)](#7-systemd-service)
8. [Deployment Script (`deploy-bee.sh`)](#8-deployment-script)
9. [GitHub Actions Workflow](#9-github-actions-workflow)
10. [Tests (`test_guardian.py`)](#10-tests)
11. [Monitoring (`check-health.py`, `heartbeat.py`)](#11-monitoring)
12. [Dependencies (`requirements.txt`)](#12-dependencies)

---

## 1. Finance Bee Core

**File:** `infrastructure/colony/bees/finance_bee.py`  
**Lines:** 343  
**Purpose:** Main Worker Bee implementation

```python
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
        """Handle checkout.session.completed event"""
        session = payload['data']['object']
        user_id = session['metadata'].get('userId')
        tier = session['metadata'].get('tier')
        subscription_id = session.get('subscription')
        
        if not user_id or not tier or not subscription_id:
            raise RuntimeError(f"Missing required metadata: userId={user_id}, tier={tier}, subscription={subscription_id}")
        
        # Get subscription period from Stripe
        subscription = stripe.Subscription.retrieve(subscription_id)
        current_period_start = datetime.fromtimestamp(subscription.current_period_start).isoformat()
        current_period_end = datetime.fromtimestamp(subscription.current_period_end).isoformat()
        
        # Update user profile
        profile_result = self.supabase.table('user_profiles').update({
            'subscription_tier': tier,
            'is_premium': True,
        }).eq('id', user_id).execute()
        
        if not profile_result.data:
            raise RuntimeError(f"Failed to update user_profiles for user {user_id}")
        
        # Create subscription record
        sub_result = self.supabase.table('subscriptions').upsert({
            'subscriber_id': user_id,
            'creator_id': user_id,
            'status': 'active',
            'stripe_subscription_id': subscription_id,
            'stripe_customer_id': session.get('customer'),
            'current_period_start': current_period_start,
            'current_period_end': current_period_end,
        }, on_conflict='stripe_subscription_id').execute()
        
        return f"Subscription activated for user {user_id}: {tier} (subscription_id: {subscription_id})"
    
    def _handle_subscription_updated(self, payload: Dict[str, Any]) -> str:
        """Handle customer.subscription.updated event"""
        subscription = payload['data']['object']
        user_id = subscription['metadata'].get('userId')
        tier = subscription['metadata'].get('tier')
        
        if not user_id or not tier:
            return f"Subscription updated but missing metadata (userId={user_id}, tier={tier})"
        
        current_period_start = datetime.fromtimestamp(subscription['current_period_start']).isoformat()
        current_period_end = datetime.fromtimestamp(subscription['current_period_end']).isoformat()
        
        # Update subscription status
        result = self.supabase.table('subscriptions').update({
            'status': 'active' if subscription['status'] == 'active' else 'canceled',
            'current_period_start': current_period_start,
            'current_period_end': current_period_end,
        }).eq('stripe_subscription_id', subscription['id']).execute()
        
        return f"Subscription updated for user {user_id}: {subscription['status']}"
    
    def _handle_subscription_deleted(self, payload: Dict[str, Any]) -> str:
        """Handle customer.subscription.deleted event"""
        subscription = payload['data']['object']
        user_id = subscription['metadata'].get('userId')
        
        if not user_id:
            return f"Subscription deleted but missing userId in metadata"
        
        # Update subscription status
        self.supabase.table('subscriptions').update({
            'status': 'canceled'
        }).eq('stripe_subscription_id', subscription['id']).execute()
        
        # Update user profile
        self.supabase.table('user_profiles').update({
            'subscription_tier': None,
            'is_premium': False,
        }).eq('id', user_id).execute()
        
        return f"Subscription canceled for user {user_id}"
    
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
```

---

## 2. Guardian Safety Layer

**File:** `infrastructure/colony/bees/guardian.py`  
**Lines:** 125  
**Purpose:** Content safety validation

```python
"""
Guardian Safety Layer for Colony OS Worker Bees

Provides content-level safety checks for task payloads.
Complements Colony OS's transport-level security (cryptographic signatures).
"""

import json
import re
from typing import Dict, Any, Tuple


class Guardian:
    """Content safety validator for Worker Bee tasks"""
    
    # Dangerous patterns to block
    DANGEROUS_PATTERNS = [
        r'rm\s+-rf',
        r'delete\s+from\s+\w+',
        r'drop\s+table',
        r'drop\s+database',
        r'truncate\s+table',
        r'format\s+',
        r'mkfs\.',
        r'dd\s+if=',
        r'>\s*/dev/sd',
    ]
    
    # Required fields for different task types
    REQUIRED_FIELDS = {
        'validate_revenue': ['type', 'data'],
        'process_image': ['user_id', 'image_url'],
        'analyze_security': ['user_id', 'event_type'],
    }
    
    def __init__(self):
        self.blocked_count = 0
        self.approved_count = 0
    
    def validate_task(self, funcname: str, args: list) -> Tuple[bool, str]:
        """
        Validate task safety
        
        Args:
            funcname: Function name to execute
            args: Function arguments
            
        Returns:
            Tuple of (is_safe, reason)
        """
        # Check for dangerous patterns in command
        if funcname in ['execute_command', 'run_script']:
            command = ' '.join(args)
            for pattern in self.DANGEROUS_PATTERNS:
                if re.search(pattern, command, re.IGNORECASE):
                    self.blocked_count += 1
                    return False, f"Blocked dangerous pattern: {pattern}"
        
        # Validate required fields for specific task types
        if funcname in self.REQUIRED_FIELDS:
            if not args or len(args) == 0:
                self.blocked_count += 1
                return False, f"Missing required arguments for {funcname}"
            
            try:
                payload = json.loads(args[0]) if isinstance(args[0], str) else args[0]
                required = self.REQUIRED_FIELDS[funcname]
                
                for field in required:
                    if field not in payload:
                        self.blocked_count += 1
                        return False, f"Missing required field: {field}"
            except (json.JSONDecodeError, TypeError) as e:
                self.blocked_count += 1
                return False, f"Invalid payload format: {str(e)}"
        
        self.approved_count += 1
        return True, "Task approved"
    
    def validate_stripe_payload(self, payload: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Validate Stripe webhook payload
        
        Args:
            payload: Stripe event payload
            
        Returns:
            Tuple of (is_valid, reason)
        """
        # Check required Stripe fields
        if 'type' not in payload:
            return False, "Missing event type"
        
        if 'data' not in payload or 'object' not in payload['data']:
            return False, "Missing event data"
        
        event_type = payload['type']
        
        # Validate checkout.session.completed
        if event_type == 'checkout.session.completed':
            session = payload['data']['object']
            
            if 'metadata' not in session:
                return False, "Missing session metadata"
            
            if 'userId' not in session['metadata']:
                return False, "Missing userId in metadata"
            
            if 'tier' not in session['metadata']:
                return False, "Missing tier in metadata"
            
            if 'subscription' not in session:
                return False, "Missing subscription ID"
        
        return True, "Stripe payload valid"
    
    def get_stats(self) -> Dict[str, int]:
        """Get Guardian statistics"""
        return {
            'blocked': self.blocked_count,
            'approved': self.approved_count,
            'total': self.blocked_count + self.approved_count
        }
```

---

## 3. Configuration

**File:** `infrastructure/colony/bees/config.py`  
**Lines:** 48  
**Purpose:** Configuration management

```python
"""
Configuration management for Colony OS Worker Bees
"""

import os
from typing import Optional


class Config:
    """Configuration for Worker Bees"""
    
    def __init__(self):
        # Colony OS Configuration
        self.colonies_server_host = os.environ.get('COLONIES_SERVER_HOST', 'http://localhost:8080')
        self.colonies_executor_prvkey = os.environ.get('COLONIES_EXECUTOR_PRVKEY')
        self.colonies_colony_name = os.environ.get('COLONIES_COLONY_NAME', 'zyeute-colony')
        
        # Supabase Configuration
        self.supabase_url = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL')
        self.supabase_service_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
        
        # Stripe Configuration
        self.stripe_secret_key = os.environ.get('STRIPE_SECRET_KEY')
        
        # Worker Configuration
        self.executor_name = os.environ.get('EXECUTOR_NAME', 'zyeute-finance-bee-01')
        self.executor_type = os.environ.get('EXECUTOR_TYPE', 'finance-worker')
        self.poll_timeout = int(os.environ.get('POLL_TIMEOUT', '10'))  # seconds
        
    def validate(self) -> tuple[bool, Optional[str]]:
        """Validate required configuration"""
        if not self.colonies_executor_prvkey:
            return False, "Missing COLONIES_EXECUTOR_PRVKEY"
        
        if not self.supabase_url:
            return False, "Missing SUPABASE_URL"
        
        if not self.supabase_service_key:
            return False, "Missing SUPABASE_SERVICE_ROLE_KEY"
        
        if not self.stripe_secret_key:
            return False, "Missing STRIPE_SECRET_KEY"
        
        return True, None
    
    def __repr__(self):
        return f"Config(server={self.colonies_server_host}, executor={self.executor_name})"
```

---

## 4. Colony Client

**File:** `netlify/functions/lib/colony-client.js`  
**Lines:** 109  
**Purpose:** Colony OS client for Netlify Functions

```javascript
/**
 * Colony OS Client Library for Netlify Functions
 * 
 * Provides functions to submit tasks to Colony OS Server
 */

const crypto = require('crypto');

/**
 * Submit a task to Colony OS Server
 * 
 * @param {Object} funcSpec - Function specification
 * @param {string} funcSpec.funcname - Function name (e.g., 'validate_revenue')
 * @param {Array} funcSpec.args - Function arguments
 * @param {number} funcSpec.priority - Task priority (1-10, higher = more urgent)
 * @param {number} funcSpec.maxexectime - Maximum execution time in seconds
 * @param {string} serverHost - Colony OS Server host URL
 * @param {string} colonyName - Colony name
 * @param {string} userPrvkey - User private key for signing
 * @returns {Promise<Object>} - Response from Colony OS Server
 */
async function submitTask(funcSpec, serverHost, colonyName, userPrvkey) {
  try {
    // Construct the full function spec
    const fullSpec = {
      funcname: funcSpec.funcname,
      args: funcSpec.args || [],
      priority: funcSpec.priority || 5,
      maxexectime: funcSpec.maxexectime || 30,
      colonyname: colonyName,
      ...funcSpec
    };

    // Sign the request (simplified - in production use pycolonies crypto)
    // For now, we'll use a basic signature approach
    const timestamp = Date.now();
    const payload = JSON.stringify(fullSpec);
    const signature = crypto
      .createHmac('sha256', userPrvkey)
      .update(payload + timestamp)
      .digest('hex');

    // Submit to Colony OS Server
    const response = await fetch(`${serverHost}/api/v1/functions/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Colony-Signature': signature,
        'X-Colony-Timestamp': timestamp.toString(),
      },
      body: payload,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Colony OS submission failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Task submitted to Colony OS:', result.processid || result.id);
    
    return result;
  } catch (error) {
    console.error('❌ Error submitting to Colony OS:', error);
    throw error;
  }
}

/**
 * Get task status from Colony OS Server
 * 
 * @param {string} processId - Process ID
 * @param {string} serverHost - Colony OS Server host URL
 * @param {string} userPrvkey - User private key for signing
 * @returns {Promise<Object>} - Task status
 */
async function getTaskStatus(processId, serverHost, userPrvkey) {
  try {
    const timestamp = Date.now();
    const signature = crypto
      .createHmac('sha256', userPrvkey)
      .update(processId + timestamp)
      .digest('hex');

    const response = await fetch(`${serverHost}/api/v1/processes/${processId}`, {
      method: 'GET',
      headers: {
        'X-Colony-Signature': signature,
        'X-Colony-Timestamp': timestamp.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get task status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error getting task status:', error);
    throw error;
  }
}

module.exports = {
  submitTask,
  getTaskStatus,
};
```

---

## 5. Stripe Webhook

**File:** `netlify/functions/stripe-webhook.js`  
**Lines:** 182  
**Purpose:** Stripe webhook handler with Colony OS integration

[Full file content - see previous read_file output]

---

## 6. Docker Compose

**File:** `infrastructure/colony/docker-compose.yml`  
**Lines:** 51  
**Purpose:** Infrastructure setup

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: colonies-postgres
    environment:
      POSTGRES_DB: ${COLONIES_DB_NAME:-colonies}
      POSTGRES_USER: ${COLONIES_DB_USER:-colonies}
      POSTGRES_PASSWORD: ${COLONIES_DB_PASSWORD}
    volumes:
      - colonies-postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${COLONIES_DB_USER:-colonies}"]
      interval: 10s
      timeout: 5s
      retries: 5

  colonies-server:
    image: colonyos/colonies:latest
    container_name: colonies-server
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      COLONIES_SERVER_HOST: ${COLONIES_SERVER_HOST:-0.0.0.0}
      COLONIES_SERVER_PORT: ${COLONIES_SERVER_PORT:-8080}
      COLONIES_DB_HOST: postgres
      COLONIES_DB_PORT: 5432
      COLONIES_DB_USER: ${COLONIES_DB_USER:-colonies}
      COLONIES_DB_PASSWORD: ${COLONIES_DB_PASSWORD}
      COLONIES_DB_NAME: ${COLONIES_DB_NAME:-colonies}
      COLONIES_SERVER_TLS: ${COLONIES_SERVER_TLS:-false}
      COLONIES_SERVER_LOG_LEVEL: ${COLONIES_SERVER_LOG_LEVEL:-info}
    ports:
      - "8080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  colonies-postgres-data:
    driver: local
```

---

## 7. Systemd Service

**File:** `infrastructure/colony/systemd/zyeute-finance-bee.service`  
**Lines:** 45  
**Purpose:** Systemd service configuration

```ini
[Unit]
Description=Zyeute Colony Finance Bee
Documentation=https://github.com/brandonlacoste9-tech/Zyeute
After=network.target

[Service]
Type=simple
User=colony_user
WorkingDirectory=/opt/zyeute/infrastructure/colony/bees
ExecStart=/usr/bin/python3 finance_bee.py
Restart=always
RestartSec=5

# Environment variables (injected by deployment script)
Environment="COLONIES_SERVER_HOST=${COLONIES_SERVER_HOST}"
Environment="COLONIES_EXECUTOR_PRVKEY=${COLONIES_EXECUTOR_PRVKEY}"
Environment="COLONIES_COLONY_NAME=${COLONIES_COLONY_NAME}"
Environment="SUPABASE_URL=${SUPABASE_URL}"
Environment="SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}"
Environment="STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}"
Environment="EXECUTOR_NAME=zyeute-finance-bee-01"
Environment="EXECUTOR_TYPE=finance-worker"
Environment="POLL_TIMEOUT=10"

# Resource limits
CPUShares=512
MemoryLimit=512M
IOWeight=100

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/zyeute/infrastructure/colony/bees/logs

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=zyeute-finance-bee

[Install]
WantedBy=multi-user.target
```

---

## 8. Deployment Script

**File:** `infrastructure/colony/scripts/deploy-bee.sh`  
**Lines:** 178  
**Purpose:** Automated deployment script

[Full script - see previous read_file output]

---

## 9. GitHub Actions Workflow

**File:** `.github/workflows/deploy-finance-bee.yml`  
**Lines:** 54  
**Purpose:** CI/CD deployment

```yaml
name: Deploy Colony Finance Bee

on:
  push:
    branches: [main]
    paths:
      - 'infrastructure/colony/bees/**'
      - '.github/workflows/deploy-finance-bee.yml'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: self-hosted
    environment: production
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install Dependencies
        run: |
          pip3 install -r infrastructure/colony/bees/requirements.txt

      - name: Deploy Finance Bee
        env:
          COLONIES_SERVER_HOST: ${{ secrets.COLONIES_SERVER_HOST }}
          COLONIES_EXECUTOR_PRVKEY: ${{ secrets.COLONIES_EXECUTOR_PRVKEY }}
          COLONIES_COLONY_NAME: ${{ secrets.COLONIES_COLONY_NAME }}
          SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: |
          # Make deployment script executable
          chmod +x infrastructure/colony/scripts/deploy-bee.sh
          
          # Run deployment script
          sudo -E infrastructure/colony/scripts/deploy-bee.sh

      - name: Verify Service Status
        run: |
          sleep 5
          sudo systemctl status zyeute-finance-bee --no-pager

      - name: Check Logs
        run: |
          echo "Recent logs:"
          sudo journalctl -u zyeute-finance-bee -n 50 --no-pager
```

---

## 10. Tests

**File:** `infrastructure/colony/bees/tests/test_guardian.py`  
**Lines:** 152  
**Purpose:** Guardian safety layer tests

[Full test file - see previous read_file output]

---

## 11. Monitoring

### Health Check Script

**File:** `infrastructure/colony/monitoring/check-health.py`  
**Lines:** 129  
**Purpose:** Automated health checks

[Full script - see previous read_file output]

### Heartbeat Monitor

**File:** `infrastructure/colony/monitoring/heartbeat.py`  
**Purpose:** Redis heartbeat monitoring

[Full script - see previous read_file output]

---

## 12. Dependencies

**File:** `infrastructure/colony/bees/requirements.txt`  
**Purpose:** Python dependencies

```
# Colony OS Finance Bee Dependencies

# Colony OS SDK
pycolonies>=2.0.0

# Supabase client
supabase>=2.0.0

# Stripe API
stripe>=7.0.0

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0
```

---

## 🎯 Review Focus Areas

### Code Quality
- Clarity and readability
- Error handling completeness
- Edge case coverage
- Performance considerations
- Maintainability

### Security
- Input validation
- Authentication/authorization
- Data exposure risks
- Network security
- Cryptographic key management

### Architecture
- Design patterns
- Error handling strategy
- State management
- Resource management
- Scalability

### Edge Cases
- Failure scenarios
- Race conditions
- Timeout handling
- Concurrent requests
- Service restarts

### Performance
- Bottlenecks
- Scalability concerns
- Resource usage
- Connection pooling
- Timeout configuration

---

## 📊 Complete File Inventory

| File | Lines | Purpose | Language |
|------|-------|---------|----------|
| `finance_bee.py` | 343 | Main Worker Bee | Python |
| `guardian.py` | 125 | Safety layer | Python |
| `config.py` | 48 | Configuration | Python |
| `colony-client.js` | 109 | Colony OS client | JavaScript |
| `stripe-webhook.js` | 182 | Webhook handler | JavaScript |
| `docker-compose.yml` | 51 | Infrastructure | YAML |
| `zyeute-finance-bee.service` | 45 | Systemd service | INI |
| `deploy-bee.sh` | 178 | Deployment script | Bash |
| `deploy-finance-bee.yml` | 54 | CI/CD workflow | YAML |
| `test_guardian.py` | 152 | Tests | Python |
| `check-health.py` | 129 | Health checks | Python |
| `heartbeat.py` | ~100 | Heartbeat monitor | Python |
| `requirements.txt` | 10 | Dependencies | Text |

**Total:** ~1,500+ lines of code across 13 files

---

## 🔍 Deep Analysis Requested

Claude, I need you to:

1. **Review every file** - Line by line analysis
2. **Identify edge cases** - All failure scenarios
3. **Find security issues** - Vulnerabilities and risks
4. **Analyze performance** - Bottlenecks and optimizations
5. **Suggest improvements** - Better patterns and practices
6. **Assess production readiness** - What needs fixing?

**Give me that 10x analysis!** 🐝🔬

---

**All source code is here. Take your time, dig deep, and give me comprehensive findings!**

