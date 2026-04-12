"""
Adaptive Reward Learning System
Dynamic reward calculation based on historical performance
"""

import json
import os
from typing import Dict, List, Optional
from datetime import datetime

class AdaptiveRewardLearning:
    """Self-improving reward system that learns from action performance"""
    
    def __init__(self, memory_file: str = "action_performance_memory.json"):
        self.memory_file = memory_file
        self.action_history: Dict[str, List[float]] = {}
        self.action_count: Dict[str, int] = {}
        self.load_memory()
    
    def load_memory(self):
        """Load action performance memory from file"""
        try:
            if os.path.exists(self.memory_file):
                with open(self.memory_file, 'r') as f:
                    data = json.load(f)
                    self.action_history = data.get('history', {})
                    self.action_count = data.get('counts', {})
                print(f"[LEARNING] Memory system initialized")
            else:
                print("[LEARNING] Starting with fresh memory")
        except Exception as e:
            print(f"[LEARNING] Error loading memory: {e}")
            self.action_history = {}
            self.action_count = {}
    
    def save_memory(self):
        """Save action performance memory to file"""
        try:
            data = {
                'history': self.action_history,
                'counts': self.action_count,
                'last_updated': datetime.now().isoformat()
            }
            with open(self.memory_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"[LEARNING] Error saving memory: {e}")
    
    def record_action_performance(self, action: str, reward: float):
        """Record the performance of an action"""
        if action not in self.action_history:
            self.action_history[action] = []
            self.action_count[action] = 0
        
        self.action_history[action].append(reward)
        self.action_count[action] += 1
        
        # Keep only last 20 performances per action (rolling window)
        if len(self.action_history[action]) > 20:
            self.action_history[action] = self.action_history[action][-20:]
        
        self.save_memory()
    
    def get_adaptive_reward(self, action: str, base_reward: float) -> float:
        """Get adaptive reward based on historical performance"""
        if action not in self.action_history or len(self.action_history[action]) == 0:
            # No history - use base reward
            print(f"[LEARNING] No history for {action}, using base reward: {base_reward:.2f}")
            return base_reward
        
        # Calculate adaptive reward based on historical performance
        history = self.action_history[action]
        avg_reward = sum(history) / len(history)
        
        # Weight the adaptive reward: 30% historical, 70% base (prioritize current calculations)
        adaptive_reward = 0.3 * avg_reward + 0.7 * base_reward
        
        # Ensure valid range
        adaptive_reward = max(0.05, min(adaptive_reward, 0.95))
        
        print(f"[LEARNING] {action}: base={base_reward:.2f} -> adaptive={adaptive_reward:.2f} (avg_history={avg_reward:.2f})")
        return adaptive_reward
    
    def get_action_insights(self) -> Dict[str, Dict]:
        """Get learning insights for all actions"""
        insights = {}
        
        for action, rewards in self.action_history.items():
            if len(rewards) == 0:
                continue
            
            avg_reward = sum(rewards) / len(rewards)
            recent_rewards = rewards[-5:]  # Last 5 rewards
            recent_avg = sum(recent_rewards) / len(recent_rewards) if recent_rewards else avg_reward
            
            # Calculate trend
            if len(rewards) >= 3:
                older_rewards = rewards[:-3]
                if len(older_rewards) > 0:
                    older_avg = sum(older_rewards) / len(older_rewards)
                    trend = "up" if recent_avg > older_avg else "down" if recent_avg < older_avg else "stable"
                else:
                    trend = "stable"
            else:
                trend = "stable"
            
            success_rate = int(avg_reward * 100)
            
            insights[action] = {
                'success_rate': success_rate,
                'avg_reward': round(avg_reward, 2),
                'recent_avg': round(recent_avg, 2),
                'trend': trend,
                'total_uses': len(rewards),
                'performance': 'high' if avg_reward > 0.7 else 'medium' if avg_reward > 0.4 else 'low'
            }
        
        return insights
    
    def get_top_actions(self, limit: int = 5) -> List[Dict]:
        """Get top performing actions"""
        insights = self.get_action_insights()
        
        # Sort by average reward
        sorted_actions = sorted(
            insights.items(),
            key=lambda x: x[1]['avg_reward'],
            reverse=True
        )
        
        return [
            {
                'action': action,
                **insight
            }
            for action, insight in sorted_actions[:limit]
        ]
    
    def reset_memory(self):
        """Reset learning memory"""
        self.action_history = {}
        self.action_count = {}
        if os.path.exists(self.memory_file):
            os.remove(self.memory_file)
        print("[LEARNING] Memory reset")

# Global instance
reward_learner = AdaptiveRewardLearning()
