import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Card, Skeleton } from '../common/UI';
import PerformanceGauge from '../common/PerformanceGauge';

const WorkerDashboard = () => {
    const { productionLogs, userEmail, MONTHLY_TARGET } = useData();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter logs for this specific worker only
    const myLogs = useMemo(() => {
        return productionLogs.filter(log => log.operator === userEmail);
    }, [productionLogs, userEmail]);

    // Calculate current month's yield (non-concentrate)
    const monthlyYield = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return myLogs
            .filter(log => {
                const logDate = new Date(log.id || log.created_at);
                return logDate >= startOfMonth && !log.mineral.includes('Concentrate');
            })
            .reduce((sum, log) => sum + parseFloat(log.quantity || 0), 0);
    }, [myLogs]);

    const totalLifeYield = useMemo(() => {
        return myLogs
            .filter(l => !l.mineral.includes('Concentrate'))
            .reduce((sum, log) => sum + parseFloat(log.quantity || 0), 0);
    }, [myLogs]);

    const targetDelta = Math.max(0, MONTHLY_TARGET - monthlyYield);
    const progressPercent = Math.min(100, (monthlyYield / MONTHLY_TARGET) * 100);

    return (
        <div className="main-content">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Operator Command Node</h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
                    Authenticated: {userEmail} // Sector 4 Active
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <Card className="border-l-4 border-l-accent shadow-xl shadow-accent/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Current Month Yield</p>
                            <div className="stat-value text-slate-900">{monthlyYield.toFixed(2)} <span className="text-sm font-normal text-slate-400">TONS</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className={`tag ${monthlyYield >= MONTHLY_TARGET ? 'tag-success' : 'tag-warning'}`}>
                                    {monthlyYield >= MONTHLY_TARGET ? 'TARGET MET' : 'IN PROGRESS'}
                                </span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-primary shadow-xl shadow-primary/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Lifecycle Yield</p>
                            <div className="stat-value text-slate-900">{totalLifeYield.toFixed(1)} <span className="text-sm font-normal text-slate-400">TONS</span></div>
                            <div className="flex items-center gap-2 mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Cumulative ROM Output
                            </div>
                        </Card>
                    </div>

                    <Card title="Personal Extraction Log">
                        {isLoading ? (
                            <div className="space-y-4 p-2">
                                <Skeleton height="3rem" />
                                <Skeleton height="3rem" />
                                <Skeleton height="3rem" />
                            </div>
                        ) : myLogs.length > 0 ? (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Stream</th>
                                            <th>Location</th>
                                            <th>Quantity</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myLogs.slice(0, 8).map(l => (
                                            <tr key={l.id}>
                                                <td className="font-black text-accent tracking-tighter">{l.mineral}</td>
                                                <td className="font-bold text-slate-600">{l.location}</td>
                                                <td className="font-black text-slate-900">{parseFloat(l.quantity || 0).toFixed(1)} <span className="text-[10px] text-slate-400">T</span></td>
                                                <td className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                                                    {(l.timestamp || l.created_at || '').split('T')[0]}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                <span className="text-4xl mb-4 opacity-50">📋</span>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No personal logs found</p>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Performance Status">
                        <div className="flex flex-col items-center py-6">
                            <PerformanceGauge progress={progressPercent} label="Monthly Target" />
                            
                            <div className="w-full mt-8 space-y-6">
                                <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Goal</p>
                                        <p className="text-xl font-black text-slate-900">{MONTHLY_TARGET.toFixed(1)} T</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
                                        <p className="text-xl font-black text-accent">{targetDelta.toFixed(2)} T</p>
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                                        "Focus on optimal extraction paths to meet the monthly quota. Efficiency is safety."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Safety Checklist Status">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald/5 border border-emerald/10">
                                <span className="text-emerald">✔</span>
                                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">PPE Compliance Verified</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald/5 border border-emerald/10">
                                <span className="text-emerald">✔</span>
                                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Shaft V4 Pre-check</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
