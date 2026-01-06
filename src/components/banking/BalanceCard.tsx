import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BalanceCardProps {
  balance: number;
  available: number;
  type: 'spending' | 'savings';
  visible: boolean;
  onToggleVisibility: () => void;
}

export const BalanceCard = ({ 
  balance, 
  available, 
  type, 
  visible, 
  onToggleVisibility 
}: BalanceCardProps) => {
  const formatCurrency = (amount: number) => {
    return visible 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
      : '••••••';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-hero rounded-2xl p-6 text-primary-foreground relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
            {type === 'spending' ? 'Spending Account' : 'Savings Account'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVisibility}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-white/70 mb-1">Available Balance</p>
          <p className="text-4xl font-bold font-display tracking-tight">
            {formatCurrency(balance)}
          </p>
        </div>
        
        {type === 'spending' && (
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send
            </Button>
            <Button 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
