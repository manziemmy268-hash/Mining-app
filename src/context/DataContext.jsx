import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import * as productionSvc from '../services/productionService';
import * as attendanceSvc from '../services/attendanceService';
import * as safetySvc from '../services/safetyService';
import * as assetsSvc from '../services/assetsService';
import * as workerSvc from '../services/workerService';

const DataContext = createContext(null);

export const MINERALS = ['Wolframite (ROM)', 'Tungsten Concentrate', 'Waste Rock', 'Tailings'];
export const LOCATIONS = ['Shaft 4 (Upper)', 'Main Adit (Underground)', 'Open Pit North', 'Processing Plant A', 'Tailings Facility'];
export const SHIFTS = ['Shift A (6AM - 2PM)', 'Shift B (2PM - 10PM)', 'Shift C (10PM - 6AM)'];
export const MONTHLY_TARGET = 1.0; // Metric Tons

// Normalize DB row (snake_case) → camelCase for components
const normalizeAttendance = (row) => ({
  id: row.id,
  email: row.email,
  shift: row.shift,
  checkIn: row.check_in,
  checkOut: row.check_out,
  status: row.status,
  created_at: row.created_at,
});

const normalizeIncident = (row) => ({
  id: row.id,
  type: row.type,
  location: row.location,
  severity: row.severity,
  description: row.description,
  reportedBy: row.reported_by,
  timestamp: row.created_at,
});

const normalizeAsset = (row) => ({
  id: row.id,
  name: row.name,
  status: row.status,
  lastMaintenance: row.last_maintenance,
});

export const DataProvider = ({ children, showToast }) => {
  const [productionLogs, setProductionLogs] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [safetyIncidents, setSafetyIncidents] = useState([]);
  const [assets, setAssets] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ── Initial data fetch ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setDataLoading(true);
      const [prod, attend, safety, assetList, workerList] = await Promise.all([
        productionSvc.getProductionLogs(),
        attendanceSvc.getAttendanceLogs(),
        safetySvc.getSafetyIncidents(),
        assetsSvc.getAssets(),
        workerSvc.getWorkers(),
      ]);
      setProductionLogs(prod);
      setAttendanceLogs(attend.map(normalizeAttendance));
      setSafetyIncidents(safety.map(normalizeIncident));
      setAssets(assetList.map(normalizeAsset));
      setWorkers(workerList);
      setDataLoading(false);
    };

    fetchAll();
  }, []);

  // ── Real-time subscriptions ───────────────────────────────────────────────
  useEffect(() => {
    const prodChannel = supabase
      .channel('production_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'production_logs' }, (payload) => {
        setProductionLogs((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    const attendChannel = supabase
      .channel('attendance_logs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_logs' }, () => {
        // Re-fetch on any change for simplicity
        attendanceSvc.getAttendanceLogs().then((data) =>
          setAttendanceLogs(data.map(normalizeAttendance))
        );
      })
      .subscribe();

    const safetyChannel = supabase
      .channel('safety_incidents_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'safety_incidents' }, (payload) => {
        setSafetyIncidents((prev) => [normalizeIncident(payload.new), ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(prodChannel);
      supabase.removeChannel(attendChannel);
      supabase.removeChannel(safetyChannel);
    };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const addProductionLog = async (log) => {
    const newLog = await productionSvc.addProductionLog(log);
    if (newLog) {
      // Real-time subscription will update the list automatically
      showToast('Production Extract Logged Successfully.');
    } else {
      showToast('Error logging production entry. Please try again.');
    }
  };

  const addAttendance = async (email, shift) => {
    const newLog = await attendanceSvc.addAttendanceLog({ email, shift });
    if (newLog) {
      const normalized = normalizeAttendance(newLog);
      setAttendanceLogs((prev) => [normalized, ...prev]);
      showToast(`Checked into ${shift} for active duty.`);
      return normalized;
    }
    showToast('Error logging attendance. Please try again.');
    return null;
  };

  const updateAttendance = async (id) => {
    const updated = await attendanceSvc.updateAttendanceCheckOut(id);
    if (updated) {
      setAttendanceLogs((prev) =>
        prev.map((l) => (l.id === id ? normalizeAttendance(updated) : l))
      );
      showToast('Shift Ended. Duty Completed.');
    }
  };

  const addIncident = async (incident) => {
    const newIncident = await safetySvc.addSafetyIncident(incident);
    if (newIncident) {
      // Real-time subscription will update the list automatically
      showToast('Safety Incident Logged. Safety Officer Notified.');
    } else {
      showToast('Error logging incident. Please try again.');
    }
  };

  // ── Dashboard stats ───────────────────────────────────────────────────────
  const dashboardStats = useMemo(() => {
    const totalProduction = productionLogs.reduce(
      (sum, l) => sum + (l.mineral?.includes('Concentrate') ? 0 : parseFloat(l.quantity) || 0), 0
    );
    const totalConcentrate = productionLogs.reduce(
      (sum, l) => sum + (l.mineral?.includes('Concentrate') ? parseFloat(l.quantity) || 0 : 0), 0
    );
    const activePersonnel = attendanceLogs.filter((l) => l.status === 'On Site').length;
    const daysSinceIncident =
      safetyIncidents.length > 0
        ? Math.floor((Date.now() - new Date(safetyIncidents[0].timestamp).getTime()) / (1000 * 60 * 60 * 24))
        : 342;

    return { totalProduction, totalConcentrate, activePersonnel, daysSinceIncident };
  }, [productionLogs, attendanceLogs, safetyIncidents]);

  // ── Leaderboards & Personal Analytics ──────────────────────────────────────
  const leaderboardData = useMemo(() => {
    const workerTotals = {};
    productionLogs.forEach(log => {
      const email = log.operator || 'Unknown';
      if (!workerTotals[email]) workerTotals[email] = 0;
      // Only count raw ore (not concentrate) for simple extraction leaderboard
      if (!log.mineral?.includes('Concentrate')) {
        workerTotals[email] += parseFloat(log.quantity) || 0;
      }
    });

    return Object.entries(workerTotals)
      .map(([email, total]) => ({ email, total }))
      .sort((a, b) => b.total - a.total);
  }, [productionLogs]);

  return (
    <DataContext.Provider value={{
      productionLogs, addProductionLog,
      attendanceLogs, addAttendance, updateAttendance,
      safetyIncidents, addIncident,
      assets,
      workers,
      dashboardStats,
      leaderboardData,
      dataLoading,
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
