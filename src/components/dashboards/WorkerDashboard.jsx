import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData, MONTHLY_TARGET } from '../../context/DataContext';
import { Card, Skeleton } from '../common/UI';
import PerformanceGauge from '../common/PerformanceGauge';

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
    
    // Calculate Monthly Yield (simplified for demo based on all verified logs)
    const monthlyYield = totalMined; 

    return (
        <div className="main-content">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Operator Command Node</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Operator: {user?.email?.split('@')[0] || 'Unknown'} // Individual Performance
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-6">
                    <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Shift Status</p>
                        <p className="text-[10px] font-black text-emerald uppercase tracking-tighter">ACTIVE // EN-ROUTE</p>
                    </div>
                </div>
            </header>

            <div className="responsive-grid mb-12" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2.5rem' }}>
                <Card className="flex flex-col items-center justify-center py-10 bg-slate-900 border-none shadow-2xl relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 relative z-10">Monthly Recovery Target</p>
                    {isLoading ? (
                        <div className="w-44 h-44 rounded-full border-4 border-white/5 animate-pulse"></div>
                    ) : (
                        <PerformanceGauge current={monthlyYield} target={MONTHLY_TARGET} />
                    )}
                    <div className="mt-8 text-center relative z-10">
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                            Current Yield: <span className="text-white font-mono">{monthlyYield.toFixed(2)} / {MONTHLY_TARGET.toFixed(1)} T</span>
                        </p>
                    </div>
                </Card>

                <div className="space-y-6">
                    <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {isLoading ? (
                            [1, 2].map(i => <Card key={i}><Skeleton height="1.5rem" width="40%" /><Skeleton height="2.5rem" className="mt-4" /></Card>)
                        ) : (
                            <>
                                <Card className="border-l-4 border-l-accent shadow-lg shadow-accent/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Life-Cycle Yield</p>
                                    <div className="stat-value text-3xl text-slate-900">{totalMined.toFixed(1)} <span className="text-xs font-normal text-slate-400">TONS</span></div>
                                </Card>
                                <Card className="border-l-4 border-l-emerald shadow-lg shadow-emerald/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Verification Audits</p>
                                    <div className="stat-value text-3xl text-slate-900">{myLogs.length} <span className="text-xs font-normal text-slate-400">LOGS</span></div>
                                </Card>
                            </>
                        )}
                    </div>
                    
                    <Card title="Quick Insights" className="bg-slate-50 border-slate-100">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                                <span className="uppercase tracking-tighter">Target Delta</span>
                                <span className={monthlyYield >= MONTHLY_TARGET ? 'text-emerald' : 'text-amber-500'}>
                                    {monthlyYield >= MONTHLY_TARGET ? 'SURPLUS' : `${(MONTHLY_TARGET - monthlyYield).toFixed(2)}T REMAINING`}
                                </span>
                            </div>
                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-accent transition-all duration-1000" 
                                    style={{ width: `${Math.min((monthlyYield / MONTHLY_TARGET) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Card title="Individual Extraction Manifest">
                {isLoading ? (
                    <div className="space-y-4 p-2">
                        <Skeleton height="3.5rem" />
                        <Skeleton height="3.5rem" />
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
                                        <td className="font-black text-slate-900">{parseFloat(l.quantity).toFixed(2)} <span className="text-[10px] text-slate-400 font-mono">T</span></td>
                                        <td className="font-mono text-[10px] font-black text-slate-400 tracking-widest">{l.timestamp || l.created_at}</td>
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
