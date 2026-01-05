import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Activity, Thermometer, Wind, Droplets } from 'lucide-react';
import { type HealthStatus } from '@/hooks/useVitals';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  status: HealthStatus;
  subtitle?: string;
  delay?: number;
}

const statusColors = {
  normal: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  critical: 'bg-critical/10 border-critical/30 text-critical',
};

const statusBgColors = {
  normal: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
};

export function VitalCard({ title, value, unit, icon, status, subtitle, delay = 0 }: VitalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={cn(
        'glass-card rounded-xl p-4 relative overflow-hidden',
        status === 'critical' && 'vital-glow pulse-ring'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-lg', statusColors[status])}>
          {icon}
        </div>
        <div className={cn('w-2 h-2 rounded-full status-pulse', statusBgColors[status])} />
      </div>
      
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

interface VitalsGridProps {
  vitals: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    oxygenSaturation: number;
    temperature: number;
    respiratoryRate: number;
  };
  status: {
    heartRate: HealthStatus;
    bloodPressure: HealthStatus;
    oxygenSaturation: HealthStatus;
    temperature: HealthStatus;
    respiratoryRate: HealthStatus;
  };
}

export function VitalsGrid({ vitals, status }: VitalsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <VitalCard
        title="Heart Rate"
        value={vitals.heartRate}
        unit="bpm"
        icon={<Heart className="w-5 h-5" />}
        status={status.heartRate}
        delay={0}
      />
      <VitalCard
        title="Blood Pressure"
        value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
        unit="mmHg"
        icon={<Activity className="w-5 h-5" />}
        status={status.bloodPressure}
        delay={1}
      />
      <VitalCard
        title="O₂ Saturation"
        value={vitals.oxygenSaturation}
        unit="%"
        icon={<Droplets className="w-5 h-5" />}
        status={status.oxygenSaturation}
        delay={2}
      />
      <VitalCard
        title="Temperature"
        value={vitals.temperature}
        unit="°C"
        icon={<Thermometer className="w-5 h-5" />}
        status={status.temperature}
        delay={3}
      />
      <div className="col-span-2">
        <VitalCard
          title="Respiratory Rate"
          value={vitals.respiratoryRate}
          unit="breaths/min"
          icon={<Wind className="w-5 h-5" />}
          status={status.respiratoryRate}
          delay={4}
        />
      </div>
    </div>
  );
}
