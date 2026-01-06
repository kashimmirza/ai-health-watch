import { motion } from 'framer-motion';
import { Calendar, Zap, AlertCircle, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Bill } from '@/types/banking';
import { cn } from '@/lib/utils';

interface BillTrackerProps {
  bills: Bill[];
  balanceVisible?: boolean;
}

export const BillTracker = ({ bills, balanceVisible = true }: BillTrackerProps) => {
  const formatCurrency = (amount: number) => {
    return balanceVisible 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
      : '••••';
  };

  const getDaysUntil = (dateString: string) => {
    const due = new Date(dateString);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalUpcoming = bills
    .filter(b => b.status === 'upcoming')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Upcoming Bills</p>
            <p className="text-3xl font-bold font-display">{formatCurrency(totalUpcoming)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {bills.filter(b => b.status === 'upcoming').length} bills due this month
        </p>
      </div>
      
      {/* Bills list */}
      <div className="space-y-3">
        {bills.map((bill, index) => {
          const daysUntil = getDaysUntil(bill.dueDate);
          const isUrgent = daysUntil <= 3 && daysUntil > 0;
          const isOverdue = daysUntil < 0;
          
          return (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "glass-card p-4 rounded-xl",
                isOverdue && "border-destructive/30 bg-destructive/5",
                isUrgent && "border-warning/30 bg-warning/5"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  bill.status === 'paid' ? 'bg-success/10' :
                  isOverdue ? 'bg-destructive/10' :
                  isUrgent ? 'bg-warning/10' : 'bg-muted'
                )}>
                  {bill.status === 'paid' ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : isOverdue ? (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  ) : (
                    <Zap className="w-5 h-5 text-primary" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{bill.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bill.status === 'paid' ? (
                      'Paid'
                    ) : isOverdue ? (
                      <span className="text-destructive">Overdue by {Math.abs(daysUntil)} days</span>
                    ) : daysUntil === 0 ? (
                      <span className="text-warning">Due today</span>
                    ) : (
                      `Due in ${daysUntil} days`
                    )}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    {bill.isAutopay ? (
                      <ToggleRight className="w-4 h-4 text-success" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {bill.isAutopay ? 'Autopay' : 'Manual'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* AI Suggestion */}
      <div className="glass-card p-4 rounded-xl border-l-4 border-primary">
        <p className="text-sm font-medium mb-1">💡 AI Suggestion</p>
        <p className="text-sm text-muted-foreground">
          Enable autopay for your Phone Bill to avoid late fees. Based on your balance, 
          you have enough funds to cover all upcoming bills.
        </p>
      </div>
    </div>
  );
};
