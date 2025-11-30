"""
Database Service - Supabase Client
Initializes and provides the Supabase client for Colony OS Kernel
"""

import os
from supabase import create_client, Client
from typing import Optional

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # python-dotenv not installed, skip loading .env
    pass

# Global Supabase client instance
_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Get or create the Supabase client instance.
    Uses environment variables SUPABASE_URL and SUPABASE_KEY.
    
    Returns:
        Client: Supabase client instance
        
    Raises:
        ValueError: If SUPABASE_URL or SUPABASE_KEY are not set
    """
    global _supabase_client
    
    if _supabase_client is None:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if not supabase_url:
            raise ValueError("SUPABASE_URL environment variable is not set")
        if not supabase_key:
            raise ValueError("SUPABASE_KEY environment variable is not set")
        
        _supabase_client = create_client(supabase_url, supabase_key)
        print("✅ Supabase client initialized")
    
    return _supabase_client


# Export the getter function for direct use
__all__ = ['get_supabase_client']

