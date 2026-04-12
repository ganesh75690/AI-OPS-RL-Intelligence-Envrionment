"""
Adaptive Policy Learning System
Meta-RL implementation that learns which strategies work best and adapts decision policy over time
"""

import random
from typing import Dict, List, Tuple
from collections import defaultdict
import json

class PolicyLearner:
    """Adaptive policy learning system that evolves decision logic"""
    
    def __init__(self):
        # Policy version tracking
        self.policy_version = "v1.0"
        self.run_count = 0
        
        # Strategy performance tracking
        self.strategy_scores = defaultdict(list)
        self.strategy_sequences = defaultdict(int)
        self.strategy_success_rates = defaultdict(float)
        
        # Action sequence tracking
        self.action_sequences = []
        self.current_sequence = []
        self.sequence_performance = defaultdict(list)
        
        # Policy confidence and adaptation
        self.policy_confidence = 0.5
        self.best_strategy = None
        self.best_confidence = 0.0
        
        # Learning parameters
        self.learning_rate = 0.1
        self.exploration_rate = 0.15
        self.success_threshold = 0.75
        
    def calculate_policy_score(self, success_rate: float, stability_gain: float, time_to_recover: float) -> float:
        """
        Policy Score = f(success_rate, stability_gain, time_to_recover)
        Combines multiple metrics to evaluate strategy effectiveness
        """
        # Weight components
        w_success = 0.4
        w_stability = 0.35
        w_time = 0.25
        
        # Normalize time_to_recover (lower is better, invert for scoring)
        time_score = max(0.1, 1.0 - (time_to_recover / 10.0))  # Assume 10 steps as max
        
        # Calculate weighted policy score
        policy_score = (
            w_success * success_rate +
            w_stability * stability_gain +
            w_time * time_score
        )
        
        return round(min(0.99, max(0.01, policy_score)), 3)
    
    def track_action_sequence(self, action: str, reward: float):
        """Track which sequence of actions worked best"""
        self.current_sequence.append(action)
        
        # End of sequence detection (when reward pattern indicates completion)
        if reward > 0.8 or len(self.current_sequence) >= 7:
            sequence_key = " -> ".join(self.current_sequence)
            self.sequence_performance[sequence_key].append(reward)
            self.action_sequences.append(self.current_sequence.copy())
            self.current_sequence = []
            
            # Update strategy probabilities based on performance
            self._update_strategy_probabilities(sequence_key)
    
    def _update_strategy_probabilities(self, sequence_key: str):
        """Increase probability of successful sequences, penalize bad strategies"""
        if sequence_key not in self.sequence_performance:
            return
            
        rewards = self.sequence_performance[sequence_key]
        avg_reward = sum(rewards) / len(rewards)
        
        # Update strategy success rate
        self.strategy_success_rates[sequence_key] = avg_reward
        
        # Track best performing strategy
        if avg_reward > self.best_confidence:
            self.best_confidence = avg_reward
            self.best_strategy = sequence_key
            self.policy_confidence = min(0.99, self.policy_confidence + 0.05)
        
        # Penalize consistently poor strategies
        if avg_reward < 0.3 and len(rewards) > 2:
            self.strategy_sequences[sequence_key] = max(0, self.strategy_sequences[sequence_key] - 1)
    
    def get_adaptive_action(self, available_actions: List[str], context: Dict = None) -> str:
        """Get action with adaptive policy based on learned strategies"""
        # Exploration vs exploitation
        if random.random() < self.exploration_rate:
            # Explore: random action
            return random.choice(available_actions)
        
        # Exploit: use best learned strategy
        if self.best_strategy and self.policy_confidence > 0.7:
            # Follow best strategy pattern
            strategy_actions = self.best_strategy.split(" -> ")
            if self.current_sequence and len(strategy_actions) > len(self.current_sequence):
                next_action = strategy_actions[len(self.current_sequence)]
                if next_action in available_actions:
                    return next_action
        
        # Fallback to context-based selection
        return self._select_context_action(available_actions, context)
    
    def _select_context_action(self, available_actions: List[str], context: Dict = None) -> str:
        """Select action based on current system context"""
        if not context:
            return random.choice(available_actions)
        
        # Context-aware action selection
        cpu_high = context.get("cpu_usage", 0) > 80
        memory_high = context.get("memory_usage", 0) > 80
        error_high = context.get("error_rate", 0) > 0.15
        
        # Prioritize actions based on context
        priority_actions = []
        
        if cpu_high:
            priority_actions.extend([a for a in available_actions if "cpu" in a or "scale" in a])
        if memory_high:
            priority_actions.extend([a for a in available_actions if "memory" in a or "free" in a])
        if error_high:
            priority_actions.extend([a for a in available_actions if "stabilize" in a or "recover" in a])
        
        if priority_actions:
            return random.choice(priority_actions)
        
        return random.choice(available_actions)
    
    def record_strategy_performance(self, strategy: str, success_rate: float, 
                                  stability_gain: float, time_to_recover: float):
        """Record strategy performance for policy learning"""
        policy_score = self.calculate_policy_score(success_rate, stability_gain, time_to_recover)
        self.strategy_scores[strategy].append(policy_score)
        self.strategy_sequences[strategy] += 1
    
    def get_policy_update(self) -> Dict:
        """Generate policy update information for logging"""
        if not self.best_strategy:
            return {
                "strategy": "None",
                "confidence": round(self.policy_confidence, 2),
                "adaptation": "Initial learning phase",
                "version": self.policy_version
            }
        
        # Extract action pattern from best strategy
        action_pattern = self.best_strategy.split(" -> ")
        
        # Determine adaptation reason
        adaptation = "Increased priority for "
        if "balance" in self.best_strategy.lower():
            adaptation += "load balancing actions"
        elif "memory" in self.best_strategy.lower():
            adaptation += "memory optimization actions"
        elif "cpu" in self.best_strategy.lower():
            adaptation += "CPU management actions"
        elif "detect" in self.best_strategy.lower():
            adaptation += "detection and analysis actions"
        else:
            adaptation += "system stabilization actions"
        
        return {
            "strategy": " -> ".join(action_pattern),
            "confidence": round(self.best_confidence, 2),
            "adaptation": adaptation,
            "version": self.policy_version
        }
    
    def update_policy_version(self):
        """Update policy version after learning"""
        self.run_count += 1
        
        # Version increment logic
        if self.run_count % 5 == 0:  # Every 5 runs
            version_num = float(self.policy_version[1:]) + 0.1
            self.policy_version = f"v{version_num:.1f}"
            
            # Reduce exploration as policy matures
            self.exploration_rate = max(0.05, self.exploration_rate - 0.02)
    
    def get_learning_summary(self) -> Dict:
        """Get comprehensive learning summary"""
        total_strategies = len(self.strategy_scores)
        successful_strategies = len([s for s, scores in self.strategy_scores.items() 
                                   if scores and sum(scores)/len(scores) > self.success_threshold])
        
        return {
            "policy_version": self.policy_version,
            "total_runs": self.run_count,
            "strategies_tried": total_strategies,
            "successful_strategies": successful_strategies,
            "best_strategy": self.best_strategy,
            "policy_confidence": round(self.policy_confidence, 2),
            "exploration_rate": round(self.exploration_rate, 2),
            "learning_maturity": "High" if self.policy_confidence > 0.8 else "Medium" if self.policy_confidence > 0.5 else "Low"
        }
    
    def reset_episode(self):
        """Reset for new episode"""
        self.current_sequence = []

# Global policy learner instance
policy_learner = PolicyLearner()
