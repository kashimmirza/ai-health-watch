import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { SavingsGoal } from '@/types/banking';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  balanceVisible?: boolean;
}

export const SavingsGoals = ({ goals, balanceVisible = true }: SavingsGoalsProps) => {
  const formatCurrency = (amount: number) => {
    return balanceVisible 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
      : '••••';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-display">Savings Goals</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          <Plus className="w-4 h-4 mr-1" />
          Add Goal
        </Button>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{goal.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{goal.name}</p>
                  {goal.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Target: {new Date(goal.deadline).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{progress}%</p>
                </div>
              </div>
              
              <Progress value={progress} className="h-2 mb-2" />
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatCurrency(goal.currentAmount)}
                </span>
                <span className="font-medium">
                  {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
