from typing import List
import random
from ai_ops_env.models import Task

# Explicit task definitions
TASKS = [
    {
        "id": 1,
        "name": "Email Triage",
        "difficulty": "easy",
        "description": "Prioritize incoming emails based on urgency"
    },
    {
        "id": 2,
        "name": "Customer Support Routing",
        "difficulty": "medium",
        "description": "Assign support tickets to correct departments"
    },
    {
        "id": 3,
        "name": "Incident Resolution Optimization",
        "difficulty": "hard",
        "description": "Optimize multi-step resolution for system incidents"
    }
]

class EnvState:
    def __init__(self):
        self.tasks: List[Task] = []
        self.step_count = 0
        self.current_task = None

    def reset(self):
        # Select random task from explicit task list
        self.current_task = random.choice(TASKS)
        
        base_tasks = [
            Task(id=1, description="Server down", priority="high"),
            Task(id=2, description="Feature request", priority="low"),
            Task(id=3, description="Payment issue", priority="medium"),
        ]

        # random shuffle (adds realism)
        random.shuffle(base_tasks)

        self.tasks = base_tasks
        self.step_count = 0
