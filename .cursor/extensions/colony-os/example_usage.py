"""
Example Usage - Colony OS Kernel with Supabase Integration

This demonstrates how to use the Foreman to dispatch tasks
that are automatically persisted to Supabase.
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.kernel.foreman import Foreman
from app.kernel.bees.doc_bee import DocBee


async def main():
    """Example: Dispatch a task and see it persisted to Supabase"""
    
    # Initialize Foreman
    foreman = Foreman()
    
    # Register DocBee
    doc_bee = DocBee()
    foreman.register_worker("DocBee", doc_bee)
    
    # Dispatch a task
    task = {
        "type": "document_summary",
        "payload": {
            "text": "This is a sample document about Quebec culture and poutine.",
            "task_type": "summarize"
        },
        "priority": "high"
    }
    
    print("🚀 Dispatching task...")
    result = await foreman.dispatch(task)
    
    print(f"✅ Task completed: {result}")
    print("\n💡 Check your Supabase 'tasks' table to see the persisted task!")


if __name__ == "__main__":
    # Ensure environment variables are set
    if not os.getenv("SUPABASE_URL"):
        print("⚠️  Please set SUPABASE_URL environment variable")
    if not os.getenv("SUPABASE_KEY"):
        print("⚠️  Please set SUPABASE_KEY environment variable")
    
    asyncio.run(main())

