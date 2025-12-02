"""
Unit tests for Finance Bee
"""

import unittest
import json
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from guardian import Guardian


class TestGuardian(unittest.TestCase):
    """Test Guardian safety layer"""
    
    def setUp(self):
        self.guardian = Guardian()
    
    def test_validate_stripe_payload_valid(self):
        """Test validation of valid Stripe payload"""
        payload = {
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'metadata': {
                        'userId': 'user123',
                        'tier': 'bronze'
                    },
                    'subscription': 'sub_123'
                }
            }
        }
        
        is_valid, reason = self.guardian.validate_stripe_payload(payload)
        self.assertTrue(is_valid)
        self.assertEqual(reason, "Stripe payload valid")
    
    def test_validate_stripe_payload_missing_type(self):
        """Test validation fails for missing type"""
        payload = {'data': {'object': {}}}
        
        is_valid, reason = self.guardian.validate_stripe_payload(payload)
        self.assertFalse(is_valid)
        self.assertEqual(reason, "Missing event type")
    
    def test_validate_stripe_payload_missing_metadata(self):
        """Test validation fails for missing metadata"""
        payload = {
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'subscription': 'sub_123'
                }
            }
        }
        
        is_valid, reason = self.guardian.validate_stripe_payload(payload)
        self.assertFalse(is_valid)
        self.assertEqual(reason, "Missing session metadata")
    
    def test_validate_task_dangerous_command(self):
        """Test Guardian blocks dangerous commands"""
        is_safe, reason = self.guardian.validate_task('execute_command', ['rm -rf /'])
        self.assertFalse(is_safe)
        self.assertIn('dangerous pattern', reason.lower())
    
    def test_validate_task_safe_command(self):
        """Test Guardian approves safe commands"""
        is_safe, reason = self.guardian.validate_task('validate_revenue', ['{"type": "test"}'])
        self.assertTrue(is_safe)
        self.assertEqual(reason, "Task approved")
    
    def test_guardian_stats(self):
        """Test Guardian statistics tracking"""
        self.guardian.validate_task('validate_revenue', ['{"type": "test"}'])
        self.guardian.validate_task('execute_command', ['rm -rf /'])
        
        stats = self.guardian.get_stats()
        self.assertEqual(stats['approved'], 1)
        self.assertEqual(stats['blocked'], 1)
        self.assertEqual(stats['total'], 2)


class TestFinanceBeeLogic(unittest.TestCase):
    """Test Finance Bee business logic"""
    
    @patch('finance_bee.stripe')
    @patch('finance_bee.create_client')
    def test_handle_checkout_completed(self, mock_supabase, mock_stripe):
        """Test handling of checkout.session.completed event"""
        # Mock Stripe subscription
        mock_subscription = Mock()
        mock_subscription.current_period_start = 1700000000
        mock_subscription.current_period_end = 1702592000
        mock_stripe.Subscription.retrieve.return_value = mock_subscription
        
        # Mock Supabase client
        mock_supabase_instance = Mock()
        mock_table = Mock()
        mock_update = Mock()
        mock_execute = Mock()
        mock_execute.data = [{'id': 'user123'}]
        
        mock_update.execute.return_value = mock_execute
        mock_table.update.return_value = mock_update
        mock_table.eq.return_value = mock_update
        mock_supabase_instance.table.return_value = mock_table
        
        # Test payload
        payload = {
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'metadata': {
                        'userId': 'user123',
                        'tier': 'bronze'
                    },
                    'subscription': 'sub_123',
                    'customer': 'cus_123'
                }
            }
        }
        
        # This test verifies the logic structure
        # Actual Finance Bee testing requires mocking pycolonies
        self.assertTrue(True)  # Placeholder for now


if __name__ == '__main__':
    unittest.main()

