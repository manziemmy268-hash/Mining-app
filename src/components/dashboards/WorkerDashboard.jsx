import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, Skeleton } from '../common/UI';

const WorkerDashboard = () => {
    const { user } = useAuth();
    const { productionLogs } = useData();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const myLogs = productionLogs.filter(l => l.operator === user?.email);
    const totalMined = myLogs.reduce((sum, l) => sum + (l.mineral.includes('Concentrate') ? 0 : parseFloat(l.quantity) || 0), 0);

    return (
        <div className="main-content">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Personal Performance Node</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Operator: {user?.email.split('@')[0]} // Individual Output
                    </p>
                </div>
            </header>

            <div className="stats-grid responsive-grid mb-12" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {isLoading ? (
                    [1, 2].map(i => <Card key={i}><Skeleton height="1.5rem" width="40%" /><Skeleton height="3rem" className="mt-4" /></Card>)
                ) : (
                    <>
                        <Card className="border-l-4 border-l-accent shadow-xl shadow-accent/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Personal Yield (ROM)</p>
                            <div className="stat-value text-slate-900">{totalMined.toFixed(1)} <span className="text-sm font-normal text-slate-400">TONS</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-success">VERIFIED</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-emerald shadow-xl shadow-emerald/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Recorded Sectors</p>
                            <div className="stat-value text-slate-900">{myLogs.length} <span className="text-sm font-normal text-slate-400">LOGS</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-success">AUDITED</span>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <Card title="My Verified Extractions">
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
                                    <th>Resource Stream</th>
                                    <th>Extraction Site</th>
                                    <th>Net Yield</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myLogs.map(l => (
                                    <tr key={l.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="font-black text-accent tracking-tighter">{l.mineral}</td>
                                        <td className="font-bold text-slate-600">{l.location}</td>
                                        <td className="font-black text-slate-900">{l.quantity.toFixed(2)} <span className="text-[10px] text-slate-400 font-mono">T</span></td>
                                        <td className="font-mono text-[10px] font-black text-slate-400 tracking-widest">{l.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <span className="text-4xl mb-4 opacity-30">📋</span>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No extraction cycles recorded for your profile</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default WorkerDashboard;
