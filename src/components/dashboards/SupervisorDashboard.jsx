import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card, Button, Skeleton } from '../common/UI';
import QuickLogModal from '../production/QuickLogModal';

const SupervisorDashboard = () => {
    const { dashboardStats, productionLogs, assets } = useData();
    const [isLogModalOpen, setLogModalOpen] = useState(false);
    const [safetyChecked, setSafetyChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const recentLogs = productionLogs.slice(0, 5);

    return (
        <div className="main-content">
            {/* Quick Actions Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Sector Alpha Portal</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald"></span>
                        Site: Trinity Nyakabingo // Sector 4 Active Node
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        className="h-12 px-6"
                        onClick={() => setSafetyChecked(!safetyChecked)}
                        style={{
                            borderColor: safetyChecked ? 'var(--emerald)' : 'var(--border)',
                            color: safetyChecked ? 'var(--emerald)' : 'var(--text-main)',
                            background: safetyChecked ? 'var(--emerald-glow)' : 'transparent'
                        }}
                    >
                        {safetyChecked ? '✅ Safety Verified' : '🔘 Mark Safety Check'}
                    </Button>
                    <Button variant="primary" className="h-12 px-8" onClick={() => setLogModalOpen(true)}>
                        ⚡ Quick production Log
                    </Button>
                </div>
            </div>

            <div className="stats-grid mb-12">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => <Card key={i}><Skeleton height="1.5rem" width="40%" /><Skeleton height="3rem" className="mt-4" /></Card>)
                ) : (
                    <>
                        <Card className="border-l-4 border-l-accent shadow-xl shadow-accent/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Shift Production (ROM)</p>
                            <div className="stat-value text-slate-900">{dashboardStats.totalProduction.toFixed(1)} <span className="text-sm font-normal text-slate-400">TONS</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-success">+ 4.2%</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Efficiency Peak</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-emerald shadow-xl shadow-emerald/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">HSE Safety Status</p>
                            <div className="stat-value text-slate-900">{dashboardStats.daysSinceIncident} <span className="text-sm font-normal text-slate-400">LTI-FREE</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-success">SECURE</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Global Compliance</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-warning shadow-xl shadow-warning/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">On-Site Force</p>
                            <div className="stat-value text-slate-900">{dashboardStats.activePersonnel} <span className="text-sm font-normal text-slate-400">STAFF</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-warning">ACTIVE</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Shift Cycle: AM</span>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
                <Card title="Extraction Activity Stream">
                    {/* ... recentLogs table ... */}
                    {isLoading ? (
                        <div className="space-y-4 p-2">
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                        </div>
                    ) : recentLogs.length > 0 ? (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Resource Stream</th>
                                        <th>Location</th>
                                        <th>Yield</th>
                                        <th>Vector</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {recentLogs.map(l => (
                                            <tr key={l.id}>
                                                <td className="font-black text-accent tracking-tight">{l.mineral}</td>
                                                <td className="font-bold text-slate-600">{l.location}</td>
                                                <td className="font-black text-slate-900">{parseFloat(l.quantity || 0).toFixed(1)} <span className="text-[10px] text-slate-400">T</span></td>
                                                <td className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                                                    {(l.timestamp || l.created_at || '').split('T')[0] || (l.timestamp || '').split(' ')[1]}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                <span className="text-4xl mb-4 opacity-50">📋</span>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No activity logs recorded in Sector 4</p>
                            </div>
                        )}
                    </Card>

                    <Card title="Sector Alpha Live Feed">
                        {isLoading ? <Skeleton height="200px" /> : (
                            <div className="relative h-48 rounded-2xl overflow-hidden group">
                                <img
                                    src="/assets/images/underground_shaft.png"
                                    alt="Shaft Feed"
                                    className="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest drop-shadow-md">Recording // S-4/V-2</span>
                                </div>
                                <div className="absolute inset-0 border-2 border-white/5 rounded-2xl pointer-events-none"></div>
                                <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/60">
                                    {new Date().toISOString()}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card title="Sector Machinery Status">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton height="5rem" />
                                <Skeleton height="5rem" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {assets.map(a => (
                                    <div key={a.id} className="flex justify-between items-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-accent/40 transition-all group">
                                        <div>
                                            <p className="font-black text-sm tracking-tight text-slate-900 group-hover:text-accent transition-colors">{a.name}</p>
                                            <p className="text-[9px] text-slate-400 tracking-[0.2em] uppercase font-black mt-1 font-mono">{a.id?.slice(0, 8) || 'N/A'}</p>
                                        </div>
                                        <span className={`tag ${a.status === 'Operational' ? 'tag-success' : 'tag-danger'}`}>
                                            {a.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button variant="secondary" className="w-full mt-6 h-12 text-[10px]" disabled={isLoading}>
                            View Comprehensive Asset Log
                        </Button>
                    </Card>
            </div>

            <QuickLogModal isOpen={isLogModalOpen} onClose={() => setLogModalOpen(false)} />
        </div>
    );
};

export default SupervisorDashboard;
