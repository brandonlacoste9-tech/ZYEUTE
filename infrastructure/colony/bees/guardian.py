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

