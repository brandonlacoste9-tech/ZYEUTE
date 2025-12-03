"""
Comprehensive tests for Guardian safety layer
"""

import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from guardian import Guardian


class TestGuardianDangerousPatterns(unittest.TestCase):
    """Test Guardian blocks dangerous patterns"""
    
    def setUp(self):
        self.guardian = Guardian()
    
    def test_blocks_rm_rf(self):
        """Test blocking rm -rf commands"""
        is_safe, reason = self.guardian.validate_task('execute_command', ['rm -rf /tmp'])
        self.assertFalse(is_safe)
    
    def test_blocks_delete_from(self):
        """Test blocking SQL DELETE commands"""
        is_safe, reason = self.guardian.validate_task('execute_command', ['delete from users'])
        self.assertFalse(is_safe)
    
    def test_blocks_drop_table(self):
        """Test blocking DROP TABLE commands"""
        is_safe, reason = self.guardian.validate_task('execute_command', ['drop table users'])
        self.assertFalse(is_safe)
    
    def test_blocks_truncate(self):
        """Test blocking TRUNCATE commands"""
        is_safe, reason = self.guardian.validate_task('execute_command', ['truncate table logs'])
        self.assertFalse(is_safe)
    
    def test_allows_safe_commands(self):
        """Test allowing safe commands"""
        is_safe, reason = self.guardian.validate_task('execute_command', ['echo "hello"'])
        self.assertTrue(is_safe)


class TestGuardianRequiredFields(unittest.TestCase):
    """Test Guardian validates required fields"""
    
    def setUp(self):
        self.guardian = Guardian()
    
    def test_validate_revenue_requires_fields(self):
        """Test validate_revenue requires type and data"""
        import json
        
        # Missing fields
        is_safe, reason = self.guardian.validate_task('validate_revenue', [json.dumps({})])
        self.assertFalse(is_safe)
        
        # Valid fields
        is_safe, reason = self.guardian.validate_task('validate_revenue', [
            json.dumps({'type': 'checkout.session.completed', 'data': {}})
        ])
        self.assertTrue(is_safe)


class TestGuardianStripeValidation(unittest.TestCase):
    """Test Guardian Stripe payload validation"""
    
    def setUp(self):
        self.guardian = Guardian()
    
    def test_valid_checkout_payload(self):
        """Test validation of valid checkout payload"""
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
    
    def test_missing_user_id(self):
        """Test validation fails for missing userId"""
        payload = {
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'metadata': {
                        'tier': 'bronze'
                    },
                    'subscription': 'sub_123'
                }
            }
        }
        
        is_valid, reason = self.guardian.validate_stripe_payload(payload)
        self.assertFalse(is_valid)
        self.assertIn('userId', reason)
    
    def test_missing_tier(self):
        """Test validation fails for missing tier"""
        payload = {
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'metadata': {
                        'userId': 'user123'
                    },
                    'subscription': 'sub_123'
                }
            }
        }
        
        is_valid, reason = self.guardian.validate_stripe_payload(payload)
        self.assertFalse(is_valid)
        self.assertIn('tier', reason)


class TestGuardianStatistics(unittest.TestCase):
    """Test Guardian statistics tracking"""
    
    def test_stats_tracking(self):
        """Test Guardian tracks approved and blocked tasks"""
        guardian = Guardian()
        
        # Approve some tasks
        guardian.validate_task('validate_revenue', ['{"type": "test", "data": {}}'])
        guardian.validate_task('validate_revenue', ['{"type": "test", "data": {}}'])
        
        # Block some tasks
        guardian.validate_task('execute_command', ['rm -rf /'])
        
        stats = guardian.get_stats()
        self.assertEqual(stats['approved'], 2)
        self.assertEqual(stats['blocked'], 1)
        self.assertEqual(stats['total'], 3)


if __name__ == '__main__':
    unittest.main()

