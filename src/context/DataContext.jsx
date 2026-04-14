import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DataContext = createContext(null);

export const MINERALS = ['Wolframite (ROM)', 'Tungsten Concentrate', 'Waste Rock', 'Tailings'];
export const LOCATIONS = ['Shaft 4 (Upper)', 'Main Adit (Underground)', 'Open Pit North', 'Processing Plant A', 'Tailings Facility'];
export const SHIFTS = ['Shift A (6AM - 2PM)', 'Shift B (2PM - 10PM)', 'Shift C (10PM - 6AM)'];

export const DataProvider = ({ children, showToast }) => {
  const [productionLogs, setProductionLogs] = useLocalStorage('tnom_production', [
    { id: Date.now() - (6 * 24 * 60 * 60 * 1000), mineral: "Wolframite (ROM)", location: "Main Adit (Underground)", quantity: 12.5, status: "Verified", timestamp: "09:00 AM", operator: "admin@trinitymetals.rw" },
    { id: Date.now() - (5 * 24 * 60 * 60 * 1000), mineral: "Wolframite (ROM)", location: "Open Pit North", quantity: 14.2, status: "Verified", timestamp: "11:30 AM", operator: "admin@trinitymetals.rw" },
    { id: Date.now() - (4 * 24 * 60 * 60 * 1000), mineral: "Wolframite (ROM)", location: "Shaft 4 (Upper)", quantity: 10.8, status: "Verified", timestamp: "02:15 PM", operator: "admin@trinitymetals.rw" },
    { id: Date.now() - (3 * 24 * 60 * 60 * 1000), mineral: "Wolframite (ROM)", location: "Main Adit (Underground)", quantity: 16.1, status: "Verified", timestamp: "08:45 AM", operator: "admin@trinitymetals.rw" },
    { id: Date.now() - (2 * 24 * 60 * 60 * 1000), mineral: "Wolframite (ROM)", location: "Processing Plant A", quantity: 13.4, status: "Verified", timestamp: "10:00 AM", operator: "admin@trinitymetals.rw" },
    { id: Date.now() - (1 * 24 * 60 * 60 * 1000), mineral: "Wolframite (ROM)", location: "Open Pit North", quantity: 18.5, status: "Verified", timestamp: "04:30 PM", operator: "admin@trinitymetals.rw" },
    { id: Date.now(), mineral: "Wolframite (ROM)", location: "Main Adit (Underground)", quantity: 15.5, status: "Verified", timestamp: "09:15 AM", operator: "admin@trinitymetals.rw" }
  ]);

  const [attendanceLogs, setAttendanceLogs] = useLocalStorage('tnom_attendance', []);
  const [safetyIncidents, setSafetyIncidents] = useLocalStorage('tnom_safety', []);
  const [assets, setAssets] = useLocalStorage('tnom_assets', [
    { id: 'BC-01', name: 'Bobcat S450', status: 'Operational', lastMaintenance: '2024-03-25' },
    { id: 'VN-04', name: 'Ventilation Fan #4', status: 'Operational', lastMaintenance: '2024-03-20' },
    { id: 'PM-02', name: 'Dewatering Pump B', status: 'Maintenance', lastMaintenance: '2024-03-29' }
  ]);

  const addProductionLog = (log) => {
    const newLog = {
      id: Date.now(),
      ...log,
      status: 'Verified',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setProductionLogs([newLog, ...productionLogs]);
    showToast('Production Extract Logged Successfully.');
  };

  const addAttendance = (email, shift) => {
    const newLog = {
      id: Date.now(),
      email,
      shift,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: '--:--',
      status: 'On Site'
    };
    setAttendanceLogs([newLog, ...attendanceLogs]);
    showToast(`Checked into ${shift} for active duty.`);
    return newLog;
  };

  const updateAttendance = (id) => {
    const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendanceLogs(attendanceLogs.map(l => 
      l.id === id ? { ...l, checkOut: checkOutTime, status: 'Checked Out' } : l
    ));
    showToast('Shift Ended. Duty Completed.');
  };

  const addIncident = (incident) => {
    const newIncident = {
      id: Date.now(),
      ...incident,
      timestamp: new Date().toLocaleString()
    };
    setSafetyIncidents([newIncident, ...safetyIncidents]);
    showToast('Safety Incident Logged. Safety Officer Notified.');
  };

  const dashboardStats = useMemo(() => {
    const totalProduction = productionLogs.reduce((sum, l) => sum + (l.mineral.includes('Concentrate') ? 0 : l.quantity), 0);
    const totalConcentrate = productionLogs.reduce((sum, l) => sum + (l.mineral.includes('Concentrate') ? l.quantity : 0), 0);
    const activePersonnel = attendanceLogs.filter(l => l.status === 'On Site').length;
    const daysSinceIncident = safetyIncidents.length > 0 
      ? Math.floor((Date.now() - new Date(safetyIncidents[0].timestamp).getTime()) / (1000 * 60 * 60 * 24))
      : 342; // Placeholder for established mine

    return { totalProduction, totalConcentrate, activePersonnel, daysSinceIncident };
  }, [productionLogs, attendanceLogs, safetyIncidents]);

  return (
    <DataContext.Provider value={{
      productionLogs, addProductionLog,
      attendanceLogs, addAttendance, updateAttendance,
      safetyIncidents, addIncident,
      assets,
      dashboardStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
};
