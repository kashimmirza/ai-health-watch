import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VitalsGrid } from '@/components/VitalCard';
import { AIVisionPanel } from '@/components/AIVisionPanel';
import { PatientHeader } from '@/components/PatientHeader';
import { AlertsPanel, type Alert } from '@/components/AlertsPanel';
import { TopHeader, BottomNav } from '@/components/Navigation';
import { useVitals } from '@/hooks/useVitals';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'info',
      title: 'Scheduled Check-up',
      message: 'Routine examination at 2:00 PM today',
      timestamp: new Date(),
    },
  ]);

  const { vitals, status, isMonitoring } = useVitals();

  // Auto-generate alerts based on vitals
  useEffect(() => {
    if (status.overall === 'critical') {
      const existingCritical = alerts.find(a => a.id === 'vital-critical');
      if (!existingCritical) {
        setAlerts(prev => [{
          id: 'vital-critical',
          type: 'critical',
          title: 'Critical Vital Signs',
          message: 'Immediate medical attention recommended',
          timestamp: new Date(),
        }, ...prev]);
      }
    } else if (status.overall === 'warning') {
      const existingWarning = alerts.find(a => a.id === 'vital-warning');
      if (!existingWarning) {
        setAlerts(prev => [{
          id: 'vital-warning',
          type: 'warning',
          title: 'Elevated Readings',
          message: 'Some vitals are outside normal range',
          timestamp: new Date(),
        }, ...prev.filter(a => a.id !== 'vital-critical')]);
      }
    } else {
      setAlerts(prev => prev.filter(a => !a.id.startsWith('vital-')));
    }
  }, [status.overall]);

  const handleDismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('dark', newValue);
      return newValue;
    });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <PatientHeader overallStatus={status.overall} />
            <VitalsGrid vitals={vitals} status={status} />
            {alerts.length > 0 && alerts.some(a => a.type !== 'info') && (
              <AlertsPanel 
                alerts={alerts.filter(a => a.type !== 'info').slice(0, 2)} 
                onDismiss={handleDismissAlert} 
              />
            )}
          </motion.div>
        );

      case 'vitals':
        return (
          <motion.div
            key="vitals"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="glass-card rounded-xl p-4 mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Live Vitals</h2>
              <p className="text-sm text-muted-foreground">
                {isMonitoring ? 'Real-time monitoring active' : 'Monitoring paused'}
              </p>
            </div>
            <VitalsGrid vitals={vitals} status={status} />
          </motion.div>
        );

      case 'scan':
        return (
          <motion.div
            key="scan"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <AIVisionPanel />
          </motion.div>
        );

      case 'alerts':
        return (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <AlertsPanel alerts={alerts} onDismiss={handleDismissAlert} />
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <PatientHeader overallStatus={status.overall} />
            <div className="glass-card rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Medical History</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Blood Type</span>
                  <span className="font-medium">O+</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Allergies</span>
                  <span className="font-medium">Penicillin</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Primary Physician</span>
                  <span className="font-medium">Dr. Sarah Chen</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Last Visit</span>
                  <span className="font-medium">Dec 15, 2024</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader isDark={isDark} onToggleTheme={toggleTheme} />
      
      <main className="pt-20 pb-24 px-4">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
