"""
Helper script to create .env file for Colony OS
Run this script to set up your environment variables
"""

import os

def create_env_file():
    """Create .env file with Supabase configuration"""
    
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_path):
        print("⚠️  .env file already exists!")
        response = input("Do you want to overwrite it? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled.")
            return
    
    supabase_url = input("Enter your Supabase URL (or press Enter for default): ").strip()
    if not supabase_url:
        supabase_url = "https://vuanulvyqkfefmjcikfk.supabase.co"
    
    supabase_key = input("Enter your Supabase service_role key: ").strip()
    if not supabase_key:
        print("❌ Service role key is required!")
        print("\nTo get your service role key:")
        print("1. Go to Supabase Dashboard > Project Settings > API")
        print("2. Copy the 'service_role' key (not the 'anon' key)")
        return
    
    env_content = f"""# Supabase Configuration for Colony OS Kernel
# Get these from: Supabase Dashboard > Project Settings > API

SUPABASE_URL="{supabase_url}"
SUPABASE_KEY="{supabase_key}"

# Note: Service role key has full access (bypasses RLS) - use for backend operations
# Keep this file secret and never commit it to version control!
"""
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print(f"✅ Created .env file at: {env_path}")
    print("\n⚠️  Remember: Never commit .env to version control!")


if __name__ == "__main__":
    create_env_file()

