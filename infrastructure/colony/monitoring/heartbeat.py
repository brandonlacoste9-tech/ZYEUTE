#!/usr/bin/env python3
"""
Colony OS Heartbeat Monitor

Writes heartbeat data to Redis for real-time monitoring
"""

import os
import time
import sys
from datetime import datetime

try:
    import redis
except ImportError:
    print("❌ redis not installed. Run: pip install redis")
    sys.exit(1)


class HeartbeatMonitor:
    """Heartbeat monitor for Worker Bees"""
    
    def __init__(self, executor_name: str, redis_url: str):
        self.executor_name = executor_name
        self.redis_client = redis.from_url(redis_url)
        self.heartbeat_key = f"executor:{executor_name}:heartbeat"
        self.stats_key = f"executor:{executor_name}:stats"
    
    def send_heartbeat(self):
        """Send heartbeat to Redis"""
        try:
            timestamp = datetime.utcnow().isoformat()
            self.redis_client.set(self.heartbeat_key, timestamp, ex=120)  # Expire after 2 minutes
            return True
        except Exception as e:
            print(f"⚠️ Failed to send heartbeat: {e}")
            return False
    
    def update_stats(self, stats: dict):
        """Update executor statistics in Redis"""
        try:
            self.redis_client.hset(self.stats_key, mapping=stats)
            self.redis_client.expire(self.stats_key, 3600)  # Expire after 1 hour
            return True
        except Exception as e:
            print(f"⚠️ Failed to update stats: {e}")
            return False
    
    def get_heartbeat(self) -> str:
        """Get last heartbeat timestamp"""
        try:
            return self.redis_client.get(self.heartbeat_key).decode('utf-8')
        except:
            return None
    
    def is_alive(self) -> bool:
        """Check if executor is alive (heartbeat within last 2 minutes)"""
        heartbeat = self.get_heartbeat()
        if not heartbeat:
            return False
        
        try:
            last_beat = datetime.fromisoformat(heartbeat)
            now = datetime.utcnow()
            delta = (now - last_beat).total_seconds()
            return delta < 120  # Alive if heartbeat within last 2 minutes
        except:
            return False


def main():
    """Main heartbeat loop"""
    executor_name = os.environ.get('EXECUTOR_NAME', 'zyeute-finance-bee-01')
    redis_url = os.environ.get('REDIS_URL') or os.environ.get('UPSTASH_REDIS_URL')
    
    if not redis_url:
        print("❌ REDIS_URL or UPSTASH_REDIS_URL not set")
        sys.exit(1)
    
    monitor = HeartbeatMonitor(executor_name, redis_url)
    
    print(f"💓 Heartbeat monitor starting for {executor_name}")
    print(f"   Redis: {redis_url[:30]}...")
    print("")
    
    while True:
        try:
            if monitor.send_heartbeat():
                print(f"💓 Heartbeat sent at {datetime.utcnow().isoformat()}")
            
            time.sleep(60)  # Send heartbeat every 60 seconds
        
        except KeyboardInterrupt:
            print("\n🛑 Heartbeat monitor stopping...")
            sys.exit(0)
        
        except Exception as e:
            print(f"❌ Error in heartbeat loop: {e}")
            time.sleep(5)


if __name__ == '__main__':
    main()

