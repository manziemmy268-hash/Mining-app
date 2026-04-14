import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Button, Card, Input, Select, Skeleton } from '../common/UI';

const SafetyPage = () => {
    const { safetyIncidents, addIncident, dashboardStats, assets } = useData();
    const [isReporting, setIsReporting] = useState(false);
    const [form, setForm] = useState({ type: 'Near-miss', description: '', location: 'Main Adit' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleReport = (e) => {
        e.preventDefault();
        if (!form.description) return;
        addIncident(form);
        setIsReporting(false);
        setForm({ type: 'Near-miss', description: '', location: 'Main Adit' });
    };

    return (
        <div className="main-content">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">HSE Command Center</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
                        Site: Trinity Nyakabingo // Safety & Environment Control
                    </p>
                </div>
                <Button variant="danger" className="h-12 px-8 flex items-center gap-3 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsReporting(true)}>
                    <span>! Report Safety Incident</span>
                </Button>
            </header>

            <div className="stats-grid mb-12">
                {isLoading ? (
                    [1, 2, 3].map(i => <Card key={i}><Skeleton height="1.5rem" width="40%" /><Skeleton height="3rem" className="mt-4" /></Card>)
                ) : (
                    <>
                        <Card className="border-l-4 border-l-danger shadow-2xl shadow-danger/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Global LTI Clock</p>
                            <div className="stat-value text-slate-900">{dashboardStats.daysSinceIncident} <span className="text-sm font-normal text-slate-400 font-mono">DAYS</span></div>
                            <div className="mt-6 flex items-center gap-2">
                                <span className="tag tag-success">STABLE</span>
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-emerald shadow-2xl shadow-emerald/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Total Resolved Incidents</p>
                            <div className="stat-value text-slate-900">{safetyIncidents.length} <span className="text-sm font-normal text-slate-400 font-mono">CASES</span></div>
                            <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-emerald uppercase tracking-widest">
                                Clearance: 100%
                            </div>
                        </Card>
                        <Card className="border-l-4 border-l-orange shadow-2xl shadow-orange/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Asset Operationality</p>
                            <div className="stat-value text-slate-900">{assets.filter(a => a.status === 'Operational').length} / {assets.length}</div>
                            <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-orange uppercase tracking-widest">
                                Maintenance Required: {assets.filter(a => a.status !== 'Operational').length}
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2.5rem' }}>
                <Card title="HSE Global Incident Manifest">
                    {isLoading ? (
                        <div className="space-y-4 p-2">
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                        </div>
                    ) : safetyIncidents.length > 0 ? (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Classification</th>
                                        <th>Event Description</th>
                                        <th>Node Location</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safetyIncidents.map(i => (
                                        <tr key={i.id} className="group hover:bg-slate-50 transition-colors">
                                            <td>
                                                <span className={`tag ${i.type === 'LTI' ? 'tag-danger' : 'tag-warning'}`}>
                                                    {i.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="font-bold text-slate-700">{i.description}</td>
                                            <td className="font-black text-slate-400 text-[11px] uppercase tracking-tighter">{i.location}</td>
                                            <td className="font-mono text-[10px] font-black text-slate-400 tracking-widest">{i.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                            <span className="text-5xl mb-6 opacity-30">🛡️</span>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Zero active safety incidents logged</p>
                        </div>
                    )}
                </Card>

                <div className="flex flex-col gap-8">
                    <Card title="Facility Perimeter Monitor">
                        {isLoading ? <Skeleton height="180px" /> : (
                            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 group">
                                <img 
                                    src="/assets/images/aerial_mine.png" 
                                    alt="Perimeter Monitor" 
                                    className="w-full h-full object-cover transition-transform duration-[25s] group-hover:scale-125"
                                />
                                <div className="absolute inset-0 bg-emerald/5 mix-blend-overlay"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="text-[9px] font-black text-emerald uppercase tracking-[0.3em] drop-shadow-md">Perimeter: Secure</span>
                                </div>
                                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-ping"></div>
                                    <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">Active Scan</span>
                                </div>
                                {/* Scanning Line Animation */}
                                <div className="absolute top-0 left-0 w-full h-px bg-emerald/30 shadow-[0_0_15px_var(--emerald)] animate-[scanLine_4s_linear_infinite] pointer-events-none"></div>
                            </div>
                        )}
                    </Card>

                    <Card title="Critical Asset Integrity">
                        {isLoading ? (
                            <div className="space-y-4 p-2">
                                <Skeleton height="60px" />
                                <Skeleton height="60px" />
                                <Skeleton height="60px" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {assets.map(a => (
                                    <div key={a.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all duration-300 flex justify-between items-center group">
                                        <div>
                                            <p className="font-black text-slate-900 tracking-tight text-sm mb-1">{a.name}</p>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Last Auth: {a.lastMaintenance}</p>
                                        </div>
                                        <span className={`tag ${a.status === 'Operational' ? 'tag-success' : 'tag-danger'}`}>
                                            {a.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {isReporting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300" title="System Safety Transaction">
                        <form onSubmit={handleReport} className="space-y-6">
                            <Select 
                                label="Incident Global Classification" 
                                options={[
                                    { label: 'Near-miss (Non-injury)', value: 'Near-miss' },
                                    { label: 'First Aid Case (FAC)', value: 'FAC' },
                                    { label: 'Medical Treatment Case (MTC)', value: 'MTC' },
                                    { label: 'Lost Time Injury (LTI)', value: 'LTI' }
                                ]}
                                value={form.type}
                                onChange={e => setForm({...form, type: e.target.value})}
                            />
                            <Input 
                                label="Detailed Accident Narration" 
                                placeholder="Describe the event, personnel involved, and immediate actions taken..."
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                required
                            />
                             <Select 
                                label="Sector Location Node" 
                                options={[
                                    { label: 'Main Adit (Underground)', value: 'Main Adit' },
                                    { label: 'Shaft 4 Sector', value: 'Shaft 4' },
                                    { label: 'Processing Plant A', value: 'Plant A' },
                                    { label: 'Open Pit North', value: 'Open Pit' }
                                ]}
                                value={form.location}
                                onChange={e => setForm({...form, location: e.target.value})}
                            />
                            <div className="flex gap-4 pt-4">
                                <Button variant="danger" type="submit" className="flex-1 h-12 font-black uppercase tracking-widest text-[10px]">Submit Incident Report</Button>
                                <Button variant="secondary" className="px-8 h-12" onClick={() => setIsReporting(false)}>Dismiss</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SafetyPage;
