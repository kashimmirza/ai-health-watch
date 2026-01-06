import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Utensils, 
  Car, 
  Zap, 
  Film, 
  ShoppingCart,
  Heart,
  Briefcase,
  ArrowLeftRight,
  CreditCard,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import type { Transaction, TransactionCategory } from '@/types/banking';
import { cn } from '@/lib/utils';

const categoryIcons: Record<TransactionCategory, React.ReactNode> = {
  groceries: <ShoppingCart className="w-5 h-5" />,
  dining: <Utensils className="w-5 h-5" />,
  transport: <Car className="w-5 h-5" />,
  utilities: <Zap className="w-5 h-5" />,
  entertainment: <Film className="w-5 h-5" />,
  shopping: <ShoppingBag className="w-5 h-5" />,
  health: <Heart className="w-5 h-5" />,
  income: <Briefcase className="w-5 h-5" />,
  transfer: <ArrowLeftRight className="w-5 h-5" />,
  subscription: <CreditCard className="w-5 h-5" />,
  other: <MoreHorizontal className="w-5 h-5" />,
};

const categoryColors: Record<TransactionCategory, string> = {
  groceries: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  dining: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  transport: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  utilities: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  entertainment: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  shopping: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  health: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  income: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  transfer: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
  subscription: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
};

interface TransactionListProps {
  transactions: Transaction[];
  showAll?: boolean;
  balanceVisible?: boolean;
}

export const TransactionList = ({ 
  transactions, 
  showAll = false,
  balanceVisible = true 
}: TransactionListProps) => {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);
  
  const formatCurrency = (amount: number) => {
    return balanceVisible 
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
      : '••••';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-2">
      {displayTransactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl transition-colors",
            "hover:bg-muted/50 cursor-pointer",
            transaction.isFlagged && "bg-destructive/5 border border-destructive/20"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            categoryColors[transaction.category]
          )}>
            {categoryIcons[transaction.category]}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{transaction.merchant}</p>
              {transaction.isFlagged && (
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {transaction.description}
            </p>
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className={cn(
              "font-semibold",
              transaction.type === 'credit' ? 'text-success' : 'text-foreground'
            )}>
              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(transaction.date)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
