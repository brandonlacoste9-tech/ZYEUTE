"""
Base Worker Bee - Abstract base class for all Worker Bees
Provides common interface and Supabase integration
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.services.database import get_supabase_client


class BaseBee(ABC):
    """
    Abstract base class for all Worker Bees.
    Provides common functionality for task execution and Supabase integration.
    """
    
    def __init__(self, name: str, role: str, skills: list):
        """
        Initialize a Worker Bee.
        
        Args:
            name: Human-readable name (e.g., "DocBee", "CodeBee")
            role: Role identifier (e.g., "DocBee", "CodeBee")
            skills: List of skills this bee can perform
        """
        self.name = name
        self.role = role
        self.skills = skills
        self.supabase = get_supabase_client()
    
    @abstractmethod
    async def execute(self, payload: Dict[str, Any], task_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Execute a task. Must be implemented by subclasses.
        
        Args:
            payload: Task payload containing input data
            task_id: UUID of the task record in Supabase (optional)
            
        Returns:
            Dict containing the processing result
        """
        pass
    
    def update_task_status(self, task_id: Optional[str], status: str, result: Optional[Dict[str, Any]] = None, error: Optional[str] = None):
        """
        Helper method to update task status in Supabase.
        
        Args:
            task_id: UUID of the task (optional)
            status: New status ('in_progress', 'completed', 'failed')
            result: Result data (for 'completed' status)
            error: Error message (for 'failed' status)
        """
        if not task_id:
            return
        
        update_data = {"status": status}
        
        if result is not None:
            update_data["result"] = result
        
        if error is not None:
            update_data["error"] = error
        
        try:
            self.supabase.table("tasks").update(update_data).eq("id", task_id).execute()
            print(f"📝 Task {task_id} status updated: {status}")
        except Exception as e:
            print(f"⚠️  Failed to update task status: {str(e)}")

