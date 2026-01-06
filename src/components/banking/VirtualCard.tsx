import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff, Copy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Card } from '@/types/banking';
import { toast } from 'sonner';

interface VirtualCardProps {
  card: Card;
  isLocked: boolean;
  onToggleLock: () => void;
}

export const VirtualCard = ({ card, isLocked, onToggleLock }: VirtualCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          relative aspect-[1.586/1] max-w-sm mx-auto rounded-2xl p-6 
          gradient-hero text-primary-foreground overflow-hidden
          ${isLocked ? 'grayscale opacity-70' : ''}
        `}
      >
        {/* Card chip design */}
        <div className="absolute top-6 left-6">
          <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
            <div className="w-6 h-5 border border-yellow-600/30 rounded-sm" />
          </div>
        </div>
        
        {/* Contactless icon */}
        <div className="absolute top-6 right-6">
          <svg className="w-8 h-8 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 10c1.1 0 2 .9 2 2s-.9 2-2 2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Card number */}
        <div className="absolute bottom-20 left-6 right-6">
          <p className="font-mono text-xl tracking-widest">
            •••• •••• •••• {card.lastFour}
          </p>
        </div>
        
        {/* Card details */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div>
            <p className="text-xs text-white/60 mb-1">CARDHOLDER</p>
            <p className="font-medium tracking-wide">{card.cardholderName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60 mb-1">EXPIRES</p>
            <p className="font-medium">{card.expiryDate}</p>
          </div>
        </div>
        
        {/* Lock overlay */}
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <Lock className="w-12 h-12 text-white" />
          </motion.div>
        )}
        
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
      </motion.div>
      
      {/* Card actions */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <Button
          variant={isLocked ? "default" : "outline"}
          onClick={onToggleLock}
          className="gap-2"
        >
          {isLocked ? (
            <>
              <Unlock className="w-4 h-4" />
              Unlock Card
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Lock Card
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="gap-2"
        >
          {showDetails ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Details
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              View Details
            </>
          )}
        </Button>
      </div>
      
      {/* Card details panel */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-4 rounded-xl max-w-sm mx-auto space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Card Number</p>
              <p className="font-mono">•••• •••• •••• {card.lastFour}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleCopy(`************${card.lastFour}`, 'Card number')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Expiry</p>
              <p className="font-mono">{card.expiryDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CVV</p>
              <p className="font-mono">•••</p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Limit</span>
              <span className="font-medium">${card.dailyLimit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">ATM Limit</span>
              <span className="font-medium">${card.atmLimit.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
