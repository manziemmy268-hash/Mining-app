import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card, Button, Skeleton } from '../common/UI';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Leaderboard from '../common/Leaderboard';

const ManagerDashboard = () => {
    const { dashboardStats, productionLogs, leaderboardData } = useData();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const chartData = React.useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const dayName = days[date.getDay()];
            
            const dailyTotal = productionLogs
                .filter(log => new Date(log.id).toDateString() === dateStr && !log.mineral.includes('Concentrate'))
                .reduce((sum, log) => sum + parseFloat(log.quantity || 0), 0);
                
            data.push({
                name: dayName,
                volume: parseFloat(dailyTotal.toFixed(1)),
                fullDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            });
        }
        return data;
    }, [productionLogs]);

    const exportToCSV = () => {
        const headers = ['ID', 'Mineral', 'Location', 'Quantity', 'Status', 'Timestamp'];
        const rows = productionLogs.map(l => [l.id, l.mineral, l.location, l.quantity, l.status, l.timestamp]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `production_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="main-content">
            {/* Manager Header */}
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Operations Intelligence</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Site: Trinity Nyakabingo // Lead Manager Portal
                    </p>
                </div>
                <Button variant="primary" className="h-12 px-8 flex items-center gap-3" onClick={exportToCSV}>
                    <span className="text-lg">📥</span>
                    <span>Generate Operations Report</span>
                </Button>
            </header>

            <div className="stats-grid mb-12">
                {isLoading ? (
                    [1, 2, 3].map(i => <Card key={i}><Skeleton height="1.5rem" width="40%" /><Skeleton height="3rem" className="mt-4" /></Card>)
                ) : (
                    <>
                        <Card className="border-l-4 border-l-accent shadow-xl shadow-accent/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Accumulated ROM Production</p>
                            <div className="stat-value text-slate-900">{dashboardStats.totalProduction.toFixed(1)} <span className="text-sm font-normal text-slate-400">TONS</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-success">Active Cycle</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Optimized Yield</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-emerald shadow-xl shadow-emerald/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Focus: Performance Status</p>
                            <div className="stat-value text-slate-900">{leaderboardData.filter(e => e.total >= 1).length} <span className="text-sm font-normal text-slate-400">ON TRACK</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-warning">Monitoring</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Target: 1T/Month</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-primary shadow-xl shadow-primary/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Recovery Efficiency</p>
                            <div className="stat-value text-slate-900">13.5% <span className="text-sm font-normal text-slate-400">AVERAGE</span></div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="tag tag-success">OPTIMAL</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Industry Standard: 12.8%</span>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2.5rem', marginBottom: '2.5rem' }}>
                <div className="space-y-8">
                    <Card title="Production Trend (Last 7 Days)">
                        {isLoading ? (
                             <div className="flex items-end gap-2 h-[200px] px-4">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => <Skeleton key={i} height={`${Math.random()*60 + 20}%`} width="10%" />)}
                             </div>
                        ) : (
                            <div className="h-64 w-full p-6 bg-slate-900/5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                                            dy={10}
                                        />
                                        <YAxis hide domain={[0, 'dataMax + 5']} />
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white p-3 border border-slate-100 shadow-2xl rounded-xl animate-in fade-in zoom-in duration-200">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.fullDate}</p>
                                                            <p className="text-sm font-black text-slate-900">{payload[0].value} <span className="text-[10px] text-slate-400 font-mono">TONS</span></p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="volume" 
                                            stroke="var(--accent)" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorVolume)" 
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </Card>

                    <Card title="Extraction Performance Ledger">
                        {isLoading ? (
                            <div className="space-y-4 p-2">
                                <Skeleton height="3rem" />
                                <Skeleton height="3rem" />
                                <Skeleton height="3rem" />
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Mineral Type</th>
                                            <th>Avg Quantity</th>
                                            <th>Audit Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['Wolframite (ROM)', 'Tungsten Concentrate', 'Waste Rock'].map(m => {
                                            const logs = productionLogs.filter(l => l.mineral === m);
                                            const avg = logs.length > 0 ? (logs.reduce((s, l) => s + parseFloat(l.quantity || 0), 0) / logs.length).toFixed(1) : 0;
                                            return (
                                                <tr key={m}>
                                                    <td className="font-black text-accent tracking-tight">{m}</td>
                                                    <td className="font-black text-slate-900">{avg} <span className="text-[10px] text-slate-400 font-mono">T</span></td>
                                                    <td><span className="tag tag-success">VERIFIED</span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>

                <Leaderboard data={leaderboardData} currentUserEmail={null} />
            </div>

            {/* Manager Alpha Command Terminal Visual */}
            <Card title="Station Node: Manager Alpha // Connectivity Status">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="w-full lg:w-3/5 h-64 rounded-3xl overflow-hidden border border-slate-200 relative group shadow-2xl">
                        {isLoading ? <Skeleton height="100%" width="100%" /> : (
                            <>
                                <img 
                                    src="/assets/images/control_center.png" 
                                    alt="Control Center" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent"></div>
                                <div className="absolute top-6 right-8">
                                    <span className="tag bg-emerald text-white border-none animate-pulse">ACTIVE NODE</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="w-full lg:w-2/5 space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Diagnostic Stream</p>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600">Terminal Encryption</span>
                                    <span className="text-[11px] font-black text-emerald font-mono">AES-256 SECURE</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600">Satellite Sync Delay</span>
                                    <span className="text-[11px] font-black text-slate-900 font-mono">14ms</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-[11px] font-bold text-slate-600">Operations Window</span>
                                    <span className="text-[11px] font-black text-slate-900 font-mono italic">0600 - 2200 CAT</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full h-12 text-[10px]" disabled={isLoading}>
                            Re-Authorize Terminal Access
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ManagerDashboard;
