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

