import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const alertStyles = {
  info: {
    bg: 'bg-accent/10 border-accent/30',
    icon: Info,
    iconColor: 'text-accent',
  },
  warning: {
    bg: 'bg-warning/10 border-warning/30',
    icon: AlertTriangle,
    iconColor: 'text-warning',
  },
  critical: {
    bg: 'bg-critical/10 border-critical/30',
    icon: AlertTriangle,
    iconColor: 'text-critical',
  },
};

export function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const priority = { critical: 0, warning: 1, info: 2 };
    return priority[a.type] - priority[b.type];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Active Alerts</h3>
          <p className="text-xs text-muted-foreground">{alerts.length} notifications</p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sortedAlerts.length > 0 ? (
            sortedAlerts.map((alert) => {
              const style = alertStyles[alert.type];
              const IconComponent = style.icon;

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className={cn(
                    'p-3 rounded-lg border flex items-start gap-3',
                    style.bg,
                    alert.type === 'critical' && 'pulse-ring'
                  )}
                >
                  <IconComponent className={cn('w-5 h-5 flex-shrink-0 mt-0.5', style.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={() => onDismiss(alert.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">All clear! No active alerts.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
