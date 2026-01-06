import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, X, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FraudAlert } from '@/types/banking';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FraudAlertsProps {
  alerts: FraudAlert[];
  onResolve: (id: string) => void;
  onLockCard: () => void;
}

const severityConfig = {
  low: {
    bg: 'bg-info/10 border-info/30',
    icon: 'text-info',
    label: 'Low Risk',
  },
  medium: {
    bg: 'bg-warning/10 border-warning/30',
    icon: 'text-warning',
    label: 'Medium Risk',
  },
  high: {
    bg: 'bg-destructive/10 border-destructive/30',
    icon: 'text-destructive',
    label: 'High Risk',
  },
};

export const FraudAlerts = ({ alerts, onResolve, onLockCard }: FraudAlertsProps) => {
  const unresolvedAlerts = alerts.filter(a => !a.isResolved);
  
  const handleMarkSafe = (id: string) => {
    onResolve(id);
    toast.success('Transaction marked as safe');
  };

  if (unresolvedAlerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 rounded-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-lg font-semibold font-display mb-2">All Clear!</h3>
        <p className="text-muted-foreground">
          No suspicious activity detected. Your account is secure.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold font-display">
            {unresolvedAlerts.length} Alert{unresolvedAlerts.length > 1 ? 's' : ''}
          </h3>
        </div>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onLockCard}
          className="gap-2"
        >
          <Lock className="w-4 h-4" />
          Lock Card
        </Button>
      </div>
      
      <AnimatePresence mode="popLayout">
        {unresolvedAlerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border",
                config.bg
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5", config.icon)}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      alert.severity === 'high' ? 'bg-destructive text-destructive-foreground' :
                      alert.severity === 'medium' ? 'bg-warning text-warning-foreground' :
                      'bg-info text-info-foreground'
                    )}>
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium mb-3">{alert.message}</p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkSafe(alert.id)}
                      className="gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      This was me
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onLockCard}
                      className="gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Not me - Lock Card
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
