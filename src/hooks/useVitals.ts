import { useState, useEffect, useCallback } from 'react';

export interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
}

export type HealthStatus = 'normal' | 'warning' | 'critical';

export interface VitalStatus {
  heartRate: HealthStatus;
  bloodPressure: HealthStatus;
  oxygenSaturation: HealthStatus;
  temperature: HealthStatus;
  respiratoryRate: HealthStatus;
  overall: HealthStatus;
}

function generateRealisticVitals(): VitalSigns {
  return {
    heartRate: Math.floor(65 + Math.random() * 25),
    bloodPressure: {
      systolic: Math.floor(110 + Math.random() * 25),
      diastolic: Math.floor(70 + Math.random() * 15),
    },
    oxygenSaturation: Math.floor(95 + Math.random() * 5),
    temperature: parseFloat((36.2 + Math.random() * 1.2).toFixed(1)),
    respiratoryRate: Math.floor(14 + Math.random() * 6),
  };
}

function getVitalStatus(vitals: VitalSigns): VitalStatus {
  const heartRateStatus: HealthStatus =
    vitals.heartRate < 60 || vitals.heartRate > 100
      ? vitals.heartRate < 50 || vitals.heartRate > 120
        ? 'critical'
        : 'warning'
      : 'normal';

  const bpStatus: HealthStatus =
    vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90
      ? vitals.bloodPressure.systolic > 160 || vitals.bloodPressure.diastolic > 100
        ? 'critical'
        : 'warning'
      : 'normal';

  const o2Status: HealthStatus =
    vitals.oxygenSaturation < 95
      ? vitals.oxygenSaturation < 90
        ? 'critical'
        : 'warning'
      : 'normal';

  const tempStatus: HealthStatus =
    vitals.temperature > 37.5 || vitals.temperature < 36
      ? vitals.temperature > 38.5 || vitals.temperature < 35
        ? 'critical'
        : 'warning'
      : 'normal';

  const respStatus: HealthStatus =
    vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20
      ? vitals.respiratoryRate < 10 || vitals.respiratoryRate > 25
        ? 'critical'
        : 'warning'
      : 'normal';

  const statuses = [heartRateStatus, bpStatus, o2Status, tempStatus, respStatus];
  const overallStatus: HealthStatus = statuses.includes('critical')
    ? 'critical'
    : statuses.includes('warning')
    ? 'warning'
    : 'normal';

  return {
    heartRate: heartRateStatus,
    bloodPressure: bpStatus,
    oxygenSaturation: o2Status,
    temperature: tempStatus,
    respiratoryRate: respStatus,
    overall: overallStatus,
  };
}

export function useVitals(refreshInterval = 3000) {
  const [vitals, setVitals] = useState<VitalSigns>(generateRealisticVitals);
  const [status, setStatus] = useState<VitalStatus>(() => getVitalStatus(generateRealisticVitals()));
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [history, setHistory] = useState<Array<VitalSigns & { timestamp: Date }>>([]);

  const updateVitals = useCallback(() => {
    const newVitals = generateRealisticVitals();
    setVitals(newVitals);
    setStatus(getVitalStatus(newVitals));
    setHistory((prev) => [...prev.slice(-19), { ...newVitals, timestamp: new Date() }]);
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(updateVitals, refreshInterval);
    return () => clearInterval(interval);
  }, [isMonitoring, refreshInterval, updateVitals]);

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring((prev) => !prev);
  }, []);

  return {
    vitals,
    status,
    isMonitoring,
    history,
    toggleMonitoring,
    updateVitals,
  };
}
