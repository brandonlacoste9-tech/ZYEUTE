#!/usr/bin/env python3
"""
Colony OS Health Check Script

Checks health of Colony Server and Finance Bee
"""

import os
import sys
import requests
from datetime import datetime

try:
    import redis
except ImportError:
    print("⚠️ redis not installed. Skipping Redis checks.")
    redis = None


def check_colony_server(server_host: str) -> bool:
    """Check Colony Server health"""
    try:
        response = requests.get(f"{server_host}/api/v1/health", timeout=5)
        if response.ok:
            print("✅ Colony Server: Healthy")
            return True
        else:
            print(f"❌ Colony Server: Unhealthy (status {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Colony Server: Down ({str(e)})")
        return False


def check_finance_bee(redis_url: str, executor_name: str) -> bool:
    """Check Finance Bee heartbeat"""
    if not redis:
        print("⚠️ Redis not available, skipping Finance Bee check")
        return None
    
    try:
        r = redis.from_url(redis_url)
        heartbeat_key = f"executor:{executor_name}:heartbeat"
        heartbeat = r.get(heartbeat_key)
        
        if heartbeat:
            last_beat = datetime.fromisoformat(heartbeat.decode('utf-8'))
            delta = (datetime.utcnow() - last_beat).total_seconds()
            
            if delta < 120:
                print(f"✅ Finance Bee: Alive (last beat {delta:.0f}s ago)")
                return True
            else:
                print(f"❌ Finance Bee: Dead (last beat {delta:.0f}s ago)")
                return False
        else:
            print("❌ Finance Bee: No heartbeat found")
            return False
    except Exception as e:
        print(f"❌ Finance Bee: Error checking heartbeat ({str(e)})")
        return False


def check_systemd_service(service_name: str) -> bool:
    """Check systemd service status"""
    try:
        import subprocess
        result = subprocess.run(
            ['systemctl', 'is-active', service_name],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"✅ Systemd Service ({service_name}): Active")
            return True
        else:
            print(f"❌ Systemd Service ({service_name}): Inactive")
            return False
    except Exception as e:
        print(f"⚠️ Systemd check failed: {str(e)}")
        return None


def main():
    """Main health check"""
    print("🏥 Colony OS Health Check")
    print("=" * 50)
    print("")
    
    # Configuration
    colonies_server_host = os.environ.get('COLONIES_SERVER_HOST', 'http://localhost:8080')
    redis_url = os.environ.get('REDIS_URL') or os.environ.get('UPSTASH_REDIS_URL')
    executor_name = os.environ.get('EXECUTOR_NAME', 'zyeute-finance-bee-01')
    service_name = 'zyeute-finance-bee'
    
    # Run checks
    results = []
    
    print("1. Checking Colony Server...")
    results.append(check_colony_server(colonies_server_host))
    print("")
    
    print("2. Checking Finance Bee (systemd)...")
    results.append(check_systemd_service(service_name))
    print("")
    
    if redis_url:
        print("3. Checking Finance Bee (heartbeat)...")
        results.append(check_finance_bee(redis_url, executor_name))
        print("")
    
    # Summary
    print("=" * 50)
    healthy = sum(1 for r in results if r is True)
    total = len([r for r in results if r is not None])
    
    if healthy == total:
        print(f"✅ All systems healthy ({healthy}/{total})")
        sys.exit(0)
    else:
        print(f"⚠️ Some systems unhealthy ({healthy}/{total})")
        sys.exit(1)


if __name__ == '__main__':
    main()

