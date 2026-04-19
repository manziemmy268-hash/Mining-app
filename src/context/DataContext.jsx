import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getProductionLogs, addProductionLog as addProductionLogService } from '../services/productionService';
import { getAttendanceLogs, addAttendanceLog as addAttendanceService, updateAttendanceCheckOut as updateAttendanceService } from '../services/attendanceService';
import { getSafetyIncidents, addSafetyIncident as addSafetyIncidentService } from '../services/safetyService';
import { getWorkers } from '../services/workerService';
import { getAssets } from '../services/assetsService';
import { useAuth } from './AuthContext';

export const MINERALS = [
  'Wolframite (ROM)',
  'Tungsten Concentrate',
  'Waste Rock',
  'Tailings'
];

export const LOCATIONS = [
  'Shaft V1 - Alpha',
  'Shaft V2 - Beta',
  'Shaft V3 - Gamma',
  'Open Pit - Sector 4',
  'Processing Plant'
];

export const SHIFTS = [
  'Day Shift (06:00 - 14:00)',
  'Afternoon Shift (14:00 - 22:00)',
  'Night Shift (22:00 - 06:00)',
  'Maintenance Cycle'
];

const DataContext = createContext(null);

export const DataProvider = ({ children, showToast }) => {
  const { user } = useAuth();
  const [productionLogs, setProductionLogs] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [safetyIncidents, setSafetyIncidents] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const MONTHLY_TARGET = 1.5;

  const refreshData = async () => {
    try {
      const [prod, att, safety, wrks, asts] = await Promise.all([
        getProductionLogs(),
        getAttendanceLogs(),
        getSafetyIncidents(),
        getWorkers(),
        getAssets()
      ]);
      setProductionLogs(prod);
      setAttendanceLogs(att);
      setSafetyIncidents(safety);
      setWorkers(wrks);
      setAssets(asts);
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (showToast) showToast('Sync Failure. Offline Mode Active.');
    } finally {
      setLoading(false);
    }
  };

  const addProductionLog = async (logData) => {
    try {
      const result = await addProductionLogService(logData);
      if (result) {
        if (showToast) showToast('Extraction Cycle Committed to Ledger.');
        await refreshData();
        return true;
      }
    } catch (error) {
      console.error('Error adding production log:', error);
      if (showToast) showToast('Commit Failed. Integrity Guard Active.');
    }
    return false;
  };

  const addAttendance = async (email, shift) => {
    try {
      const result = await addAttendanceService({ email, shift });
      if (result) {
        if (showToast) showToast('Personnel Check-In Recorded.');
        await refreshData();
        return true;
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      if (showToast) showToast('Personnel Sync Failed.');
    }
    return false;
  };

  const updateAttendance = async (id) => {
    try {
      const result = await updateAttendanceService(id);
      if (result) {
        if (showToast) showToast('Personnel Check-Out Recorded.');
        await refreshData();
        return true;
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
    return false;
  };

  const addIncident = async (incidentData) => {
    try {
      const result = await addSafetyIncidentService(incidentData);
      if (result) {
        if (showToast) showToast('Safety Incident Logged & Alerted.');
        await refreshData();
        return true;
      }
    } catch (error) {
      console.error('Error adding incident:', error);
    }
    return false;
  };

  useEffect(() => {
    refreshData();
  }, []);

  const dashboardStats = useMemo(() => {
    const totalProduction = productionLogs.reduce((sum, log) => sum + parseFloat(log.quantity || 0), 0);
    const totalConcentrate = productionLogs
      .filter(log => log.mineral?.toLowerCase().includes('concentrate'))
      .reduce((sum, log) => sum + parseFloat(log.quantity || 0), 0);
    
    // Count active personnel (actually on site)
    const activePersonnel = attendanceLogs.filter(log => log.status === 'On Site').length;
    
    // Days since last incident
    let daysSinceIncident = 0;
    if (safetyIncidents.length > 0) {
      const lastIncidentDate = new Date(safetyIncidents[0].created_at || safetyIncidents[0].timestamp);
      const today = new Date();
      const diffTime = Math.abs(today - lastIncidentDate);
      daysSinceIncident = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } else {
      daysSinceIncident = 14; // Baseline if no incidents logged
    }

    return {
      totalProduction,
      totalConcentrate,
      activePersonnel,
      daysSinceIncident
    };
  }, [productionLogs, attendanceLogs, safetyIncidents]);

  const leaderboardData = useMemo(() => {
    const aggregation = {};
    productionLogs.forEach(log => {
      const op = log.operator || 'Unknown';
      aggregation[op] = (aggregation[op] || 0) + parseFloat(log.quantity || 0);
    });

    return Object.entries(aggregation)
      .map(([email, total]) => ({ email, total }))
      .sort((a, b) => b.total - a.total);
  }, [productionLogs]);

  const value = {
    productionLogs,
    attendanceLogs,
    safetyIncidents,
    workers,
    assets,
    dashboardStats,
    leaderboardData,
    loading,
    refreshData,
    addProductionLog,
    addAttendance,
    updateAttendance,
    addIncident,
    MONTHLY_TARGET,
    userEmail: user?.email
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
