import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Phone, MapPin, AlertCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type HealthStatus } from '@/hooks/useVitals';

interface PatientHeaderProps {
  overallStatus: HealthStatus;
}

const statusLabels = {
  normal: 'Stable',
  warning: 'Monitoring',
  critical: 'Critical',
};

const statusColors = {
  normal: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  critical: 'bg-critical text-critical-foreground',
};

export function PatientHeader({ overallStatus }: PatientHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-foreground">John Doe</h2>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              statusColors[overallStatus]
            )}>
              {statusLabels[overallStatus]}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>45 years old</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>ID: P-2024-0742</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Room 204-B</span>
            </div>
          </div>
        </div>
      </div>

      {overallStatus !== 'normal' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={cn(
            'mt-4 p-3 rounded-lg flex items-start gap-2',
            overallStatus === 'critical' ? 'bg-critical/10' : 'bg-warning/10'
          )}
        >
          <AlertCircle className={cn(
            'w-5 h-5 flex-shrink-0 mt-0.5',
            overallStatus === 'critical' ? 'text-critical' : 'text-warning'
          )} />
          <div>
            <p className={cn(
              'font-medium text-sm',
              overallStatus === 'critical' ? 'text-critical' : 'text-warning'
            )}>
              {overallStatus === 'critical' ? 'Immediate attention required' : 'Elevated readings detected'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {overallStatus === 'critical'
                ? 'One or more vital signs are outside safe parameters'
                : 'Some readings are outside normal range'}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
