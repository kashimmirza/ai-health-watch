import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SpendingInsight } from '@/types/banking';
import { cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  groceries: 'Groceries',
  dining: 'Dining',
  transport: 'Transport',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  health: 'Health',
  income: 'Income',
  transfer: 'Transfers',
  subscription: 'Subscriptions',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  groceries: 'bg-green-500',
  dining: 'bg-orange-500',
  transport: 'bg-blue-500',
  utilities: 'bg-yellow-500',
  entertainment: 'bg-purple-500',
  shopping: 'bg-pink-500',
  health: 'bg-red-500',
  income: 'bg-emerald-500',
  transfer: 'bg-slate-500',
  subscription: 'bg-indigo-500',
  other: 'bg-gray-500',
};

interface SpendingInsightsProps {
  insights: SpendingInsight[];
  monthlySpending: number;
  balanceVisible?: boolean;
}

export const SpendingInsights = ({ 
  insights, 
  monthlySpending,
  balanceVisible = true 
}: SpendingInsightsProps) => {
  const formatCurrency = (amount: number) => {
    return balanceVisible 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
      : '••••';
  };

  return (
    <div className="space-y-6">
      {/* Total spending overview */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">This Month's Spending</p>
            <p className="text-3xl font-bold font-display">{formatCurrency(monthlySpending)}</p>
          </div>
          <div className="flex items-center gap-1 text-destructive">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+8% vs last month</span>
          </div>
        </div>
        
        {/* Spending bar visualization */}
        <div className="h-4 rounded-full overflow-hidden flex bg-muted">
          {insights.slice(0, 5).map((insight, index) => (
            <motion.div
              key={insight.category}
              initial={{ width: 0 }}
              animate={{ width: `${insight.percentage}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn("h-full", categoryColors[insight.category])}
            />
          ))}
        </div>
      </div>
      
      {/* Category breakdown */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-3 h-10 rounded-full",
                categoryColors[insight.category]
              )} />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{categoryLabels[insight.category]}</p>
                  <p className="font-semibold">{formatCurrency(insight.amount)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {insight.percentage}% of spending
                  </p>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    insight.trend === 'up' ? 'text-destructive' : 
                    insight.trend === 'down' ? 'text-success' : 'text-muted-foreground'
                  )}>
                    {insight.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : insight.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    <span>{insight.changePercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
