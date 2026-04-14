import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card, Button, Skeleton, Input, Select } from '../common/UI';

const HRDashboard = () => {
    const { dashboardStats, attendanceLogs, addAttendance, updateAttendance } = useData();
    const [showOnboard, setShowOnboard] = useState(false);
    const [newPersonnel, setNewPersonnel] = useState({ email: '', shift: 'Shift A (6AM - 2PM)' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleOnboard = (e) => {
        e.preventDefault();
        if (!newPersonnel.email) return;
        addAttendance(newPersonnel.email, newPersonnel.shift);
        setNewPersonnel({ email: '', shift: 'Shift A (6AM - 2PM)' });
        setShowOnboard(false);
    };

    return (
        <div className="main-content">
            {/* HR Header */}
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Workforce Command</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Site: Trinity Nyakabingo // Personnel Registry
                    </p>
                </div>
                <Button variant={showOnboard ? 'secondary' : 'primary'} className="h-12 px-8 flex items-center gap-3" onClick={() => setShowOnboard(!showOnboard)}>
                    <span>{showOnboard ? '✕ Terminate Form' : '👤 Onboard Personnel'}</span>
                </Button>
            </header>

            {showOnboard && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card title="Personnel Deployment Registry">
                        <form onSubmit={handleOnboard} className="flex gap-6 items-end p-2">
                            <Input 
                                label="Personnel Email Address"
                                type="email" 
                                placeholder="name@trinitymetals.rw"
                                value={newPersonnel.email}
                                onChange={(e) => setNewPersonnel({...newPersonnel, email: e.target.value})}
                                required 
                                className="flex-1"
                            />
                            <Select 
                                label="Sector Shift Assignment"
                                value={newPersonnel.shift}
                                onChange={(e) => setNewPersonnel({...newPersonnel, shift: e.target.value})}
                                options={[
                                    { label: 'Shift A (06:00 - 14:00)', value: 'Shift A (6AM - 2PM)' },
                                    { label: 'Shift B (14:00 - 22:00)', value: 'Shift B (2PM - 10PM)' },
                                    { label: 'Shift C (22:00 - 06:00)', value: 'Shift C (10PM - 6AM)' }
                                ]}
                                className="flex-1"
                            />
                            <Button type="submit" variant="primary" className="h-12 px-10 mb-[6px]">Deploy to Site</Button>
                        </form>
                    </Card>
                </div>
            )}

            <div className="stats-grid mb-12">
                {isLoading ? (
                    [1, 2, 3].map(i => <Card key={i}><Skeleton height="1.5rem" width="40%" /><Skeleton height="3rem" className="mt-4" /></Card>)
                ) : (
                    <>
                        <Card className="border-l-4 border-l-primary shadow-2xl shadow-primary/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">On-Site Personnel</p>
                            <div className="stat-value text-slate-900">{dashboardStats.activePersonnel} <span className="text-sm font-normal text-slate-400 font-mono">ACTIVE</span></div>
                            <div className="mt-6 flex items-center gap-2">
                                <span className="tag tag-success">SAFE</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Accounted For</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-orange shadow-2xl shadow-orange/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Shift Capacity Utilization</p>
                            <div className="stat-value text-slate-900">94%</div>
                            <div className="mt-6 flex items-center gap-2">
                                <span className="tag tag-warning">PEAK</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">High Site Density</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-emerald shadow-2xl shadow-emerald/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">LTI Incident Clock</p>
                            <div className="stat-value text-slate-900">{dashboardStats.daysSinceIncident} <span className="text-sm font-normal text-slate-400 font-mono">DAYS</span></div>
                            <div className="mt-6 text-[9px] font-black text-emerald uppercase tracking-widest">
                                Global Safety Record
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div className="flex flex-col gap-10">
                <Card title="Real-time Sector Attendance Matrix">
                    {isLoading ? (
                        <div className="grid grid-cols-3 gap-6 p-2">
                            {[1, 2, 3].map(i => <Skeleton key={i} height="100px" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {attendanceLogs.filter(l => l.status === 'On Site').map(l => (
                                <div key={l.id} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex justify-between items-center group hover:border-accent/40 transition-all duration-300">
                                    <div>
                                        <p className="font-black text-slate-900 tracking-tight mb-1">{l.email.split('@')[0]}</p>
                                        <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase mb-3">{l.shift}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-emerald"></div>
                                            <span className="text-[9px] font-black text-emerald font-mono uppercase">IN // {l.checkIn}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="secondary" 
                                        className="h-10 px-4 text-[9px] font-black uppercase tracking-widest"
                                        onClick={() => updateAttendance(l.id)}
                                    >
                                        End Shift
                                    </Button>
                                </div>
                            ))}
                            {attendanceLogs.filter(l => l.status === 'On Site').length === 0 && (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                    <span className="text-4xl mb-4 opacity-50">👥</span>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No active personnel in sector</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                <Card title="Shift Transaction History">
                    {isLoading ? (
                        <div className="space-y-4 p-2">
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Personnel Registry</th>
                                        <th>Shift Sector</th>
                                        <th>Node Status</th>
                                        <th>Departure Sequence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceLogs.slice(0, 5).map(l => (
                                        <tr key={l.id}>
                                            <td className="font-black text-slate-900 tracking-tight">{l.email}</td>
                                            <td className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{l.shift}</td>
                                            <td>
                                                <span className={`tag ${l.status === 'On Site' ? 'tag-success' : 'tag-secondary'}`}>
                                                    {l.status === 'On Site' ? 'ACTIVE' : 'OFF DUTY'}
                                                </span>
                                            </td>
                                            <td className="font-mono text-[10px] font-black text-slate-400 tracking-widest">{l.checkOut || 'PENDING'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default HRDashboard;
