import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card, Skeleton } from '../common/UI';
import Leaderboard from '../common/Leaderboard';

const GMDashboard = () => {
    const { dashboardStats, productionLogs, leaderboardData } = useData();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);
    
    // Simulating ROI Logic
    const yieldEfficiency = ((dashboardStats.totalConcentrate / (dashboardStats.totalProduction || 1)) * 100).toFixed(1);
    const costPerTon = (840 + (dashboardStats.activePersonnel * 12.5)).toFixed(0);

    return (
        <div className="main-content">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Global Operations Command</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
                        Trinity Metals // Nyakabingo Site Alpha // Executive Node
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald/5 border border-emerald/10">
                    <span className="text-[10px] font-black tracking-widest text-emerald uppercase">Level 1 Security Clear</span>
                </div>
            </header>

            {/* Satellite Site Intelligence Banner */}
            <div className="relative w-full h-48 mb-12 rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
                {isLoading ? (
                    <Skeleton height="100%" width="100%" />
                ) : (
                    <>
                        <img 
                            src="/assets/images/aerial_mine.png" 
                            alt="Satellite Feed" 
                            className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-8 flex items-center gap-6">
                            <div>
                                <p className="text-[9px] font-black text-emerald uppercase tracking-[0.3em] mb-1">Satellite System Active</p>
                                <p className="text-lg font-black text-white tracking-tight italic">Nyakabingo Surface Vector // Station: HQ-1</p>
                            </div>
                            <div className="h-8 w-px bg-white/20"></div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Last Scan</p>
                                <p className="text-lg font-black text-white tracking-tight italic">2m 14s Ago</p>
                            </div>
                        </div>
                        <div className="absolute top-6 right-8">
                            <span className="tag tag-success bg-emerald/90 text-white border-none backdrop-blur-md">LIVE TELEMETRY</span>
                        </div>
                    </>
                )}
            </div>

            <div className="stats-grid mb-12">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => <Card key={i}><Skeleton height="1.5rem" width="40%" /><Skeleton height="3rem" className="mt-4" /></Card>)
                ) : (
                    <>
                        <Card className="border-l-4 border-l-accent shadow-2xl shadow-accent/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Site Output</p>
                            <div className="stat-value text-slate-900">{dashboardStats.totalProduction.toFixed(1)} <span className="text-sm font-normal text-slate-400 font-mono">TONS</span></div>
                            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-accent" style={{ width: '78%' }}></div>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-emerald shadow-2xl shadow-emerald/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Personnel Performance</p>
                            <div className="stat-value text-slate-900">{leaderboardData.filter(e => e.total >= 1).length} <span className="text-sm font-normal text-slate-400">ON TARGET</span></div>
                            <div className="mt-6 flex justify-between items-baseline">
                                <span className="text-[9px] font-black text-emerald uppercase tracking-widest">Goal: 1T / Monthly</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-danger shadow-2xl shadow-danger/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Global HSE Health</p>
                            <div className="stat-value text-slate-900">{dashboardStats.daysSinceIncident} <span className="text-sm font-normal text-slate-400 font-mono">LTI-FREE</span></div>
                            <div className="mt-6 flex items-center gap-2">
                                <span className="tag tag-success">COMPLIANT</span>
                            </div>
                        </Card>
                         <Card className="border-l-4 border-l-primary shadow-2xl shadow-primary/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Staffing</p>
                            <div className="stat-value text-slate-900">{dashboardStats.activePersonnel} <span className="text-sm font-normal text-slate-400 font-mono">OFFICERS</span></div>
                            <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Cycle: ALPHA SHIFT
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px 300px', gap: '2.5rem' }}>
                <Card title="Global Extraction Breakdown">
                    {isLoading ? <div className="space-y-4"><Skeleton height="3rem"/><Skeleton height="3rem"/></div> : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Resource</th>
                                        <th>Volume</th>
                                        <th>Efficiency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['Wolframite (ROM)', 'Tungsten Concentrate', 'Waste Rock'].map(m => (
                                        <tr key={m}>
                                            <td className="font-black text-accent tracking-tighter">{m}</td>
                                            <td className="font-black text-slate-900">{productionLogs.filter(l => l.mineral === m).reduce((s, l) => s+parseFloat(l.quantity || 0), 0).toFixed(1)} <span className="text-[10px] text-slate-400 font-mono">T</span></td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black">{Math.floor(Math.random() * 5 + 92)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Executive ROI Forecast</p>
                        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] font-black text-emerald uppercase tracking-widest mb-1">Projected OpEx Density</p>
                                    <p className="stat-value text-2xl">${costPerTon}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Alpha Gradient</p>
                                    <p className="stat-value text-2xl text-emerald">+12.4%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Leaderboard data={leaderboardData} currentUserEmail={null} title="Sector Performance Matrix" />

                <Card title="Compliance Shield">
                    {isLoading ? <Skeleton height="150px"/> : (
                        <div className="flex flex-col items-center justify-center h-full py-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-emerald/10 flex items-center justify-center group-hover:border-emerald/30 transition-all duration-500">
                                    <div className="text-4xl">🛡️</div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald text-white text-[9px] font-black px-2 py-1 rounded shadow-xl tracking-tighter">
                                    100% SECURE
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 text-center mt-6 uppercase font-black tracking-[0.2em] max-w-[140px] leading-relaxed">
                                Zero critical safety flags in site alpha.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default GMDashboard;
