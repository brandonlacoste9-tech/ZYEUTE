"""
Foreman - Task Dispatcher for Colony OS Kernel
Routes tasks to appropriate Worker Bees and manages task lifecycle
"""

from typing import Dict, Any, Optional
from app.services.database import get_supabase_client


class Foreman:
    """
    The Foreman dispatches tasks to Worker Bees and manages the task registry.
    Now integrated with Supabase for persistent task tracking.
    """
    
    def __init__(self):
        self.registry: Dict[str, Any] = {}
        self.supabase = get_supabase_client()
    
    def register_worker(self, role: str, worker: Any):
        """Register a Worker Bee in the registry"""
        self.registry[role] = worker
        print(f"✅ Registered worker: {role}")
    
    async def dispatch(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Dispatch a task to the appropriate Worker Bee.
        
        Process:
        1. Persist task to Supabase (status: 'pending')
        2. Route to appropriate Worker Bee
        3. Worker executes and updates task status
        
        Args:
            task: Task dictionary with 'type', 'payload', etc.
            
        Returns:
            Dict containing task result
        """
        try:
            # 1. Persist Request to Supabase
            task_type = task.get("type")
            task_payload = task.get("payload", {})
            
            task_record = self.supabase.table("tasks").insert({
                "type": task_type,
                "payload": task_payload,
                "status": "pending",
                "priority": task.get("priority", "medium")
            }).execute()
            
            if not task_record.data:
                raise ValueError("Failed to create task record in database")
            
            task_id = task_record.data[0]['id']
            print(f"📝 Task persisted to DB: {task_id} (type: {task_type})")
            
            # 2. Route to appropriate Worker Bee
            required_role = self._determine_worker_role(task_type)
            
            if required_role not in self.registry:
                # Update task status to failed
                self.supabase.table("tasks").update({
                    "status": "failed",
                    "error": f"No worker registered for role: {required_role}"
                }).eq("id", task_id).execute()
                
                raise ValueError(f"No worker registered for role: {required_role}")
            
            worker = self.registry.get(required_role)
            
            # Update task status to assigned
            self.supabase.table("tasks").update({
                "status": "assigned",
                "assigned_to": None  # Will be set by worker if needed
            }).eq("id", task_id).execute()
            
            # 3. Execute (Worker updates DB as side-effect)
            result = await worker.execute(task_payload, task_id)
            
            return result
            
        except Exception as e:
            print(f"❌ Dispatch error: {str(e)}")
            # Try to update task status if we have a task_id
            if 'task_id' in locals():
                try:
                    self.supabase.table("tasks").update({
                        "status": "failed",
                        "error": str(e)
                    }).eq("id", task_id).execute()
                except:
                    pass  # Best effort
            raise
    
    def _determine_worker_role(self, task_type: str) -> str:
        """
        Determine which Worker Bee should handle this task type.
        
        Args:
            task_type: Type of task (e.g., 'document_summary', 'code_generation')
            
        Returns:
            str: Worker role name (e.g., 'DocBee', 'CodeBee')
        """
        # Map task types to worker roles
        task_role_map = {
            'document_summary': 'DocBee',
            'document_analysis': 'DocBee',
            'content_generation': 'DocBee',
            'code_generation': 'CodeBee',
            'code_review': 'CodeBee',
            'visual_analysis': 'VisionBee',
            'image_processing': 'VisionBee',
            'data_analysis': 'DataBee',
            'analytics': 'DataBee',
        }
        
        return task_role_map.get(task_type, 'DocBee')  # Default to DocBee

