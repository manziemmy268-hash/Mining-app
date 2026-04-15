import React, { useState, useEffect } from 'react';
import { useData, MINERALS, LOCATIONS } from '../../context/DataContext';
import { Button, Card, Input, Select, Skeleton } from '../common/UI';

const ProductionPage = () => {
    const { productionLogs, addProductionLog, workers } = useData();
    const [isLogging, setIsLogging] = useState(false);
    const [form, setForm] = useState({ mineral: MINERALS[0], location: LOCATIONS[0], operator: '', quantity: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleLog = (e) => {
        e.preventDefault();
        const qty = parseFloat(form.quantity);
        if (!qty || qty <= 0) return;
        addProductionLog({ ...form, quantity: qty });
        setIsLogging(false);
        setForm({ ...form, operator: '', quantity: '' });
    };

    return (
        <div className="main-content">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Extraction Ledger</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Real-time Wolframite Yield Tracking // Site Alpha
                    </p>
                </div>
                <Button variant="primary" className="h-12 px-8 flex items-center gap-3" onClick={() => setIsLogging(true)}>
                    <span className="text-xl">+</span>
                    <span>Log New Extraction</span>
                </Button>
            </header>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
                <Card title="Global Extraction Manifest">
                    {isLoading ? (
                        <div className="space-y-4 p-2">
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                            <Skeleton height="3rem" />
                        </div>
                    ) : productionLogs.length > 0 ? (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Resource Stream</th>
                                        <th>Extraction Site</th>
                                        <th>Operator</th>
                                        <th>Net Yield</th>
                                        <th>Audit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productionLogs.map(l => (
                                        <tr key={l.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="font-black text-accent tracking-tighter">{l.mineral}</td>
                                            <td className="font-bold text-slate-600">{l.location}</td>
                                            <td className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{l.operator ? l.operator.split('@')[0] : 'UNASSIGNED'}</td>
                                            <td className="font-black text-slate-900">{l.quantity.toFixed(2)} <span className="text-[10px] text-slate-400 font-mono">T</span></td>
                                            <td><span className="tag tag-success">VERIFIED</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                            <span className="text-4xl mb-4 opacity-30">📋</span>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No extraction cycles recorded</p>
                        </div>
                    )}
                </Card>

                <Card title="Mineral Grade Reference // Wolframite ROM">
                    <div className="space-y-6">
                        <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 group shadow-lg">
                            {isLoading ? <Skeleton height="100%" width="100%" /> : (
                                <>
                                    <img 
                                        src="/assets/images/mineral_sample.png" 
                                        alt="Wolframite Sample" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <p className="text-[9px] font-black text-emerald uppercase tracking-[0.2em] mb-1">Standard Grade Alpha</p>
                                        <p className="text-sm font-black text-white italic tracking-tight">Spectral Density: 94.2%</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sample Analytics</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-bold text-slate-600">Visual Quality Index</span>
                                    <span className="font-black text-emerald">PREMIUM</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-bold text-slate-600">Site Specific Gravity</span>
                                    <span className="font-black text-slate-900">7.2 - 7.5 g/cm³</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-bold text-slate-600">Sector Hardness (Mohs)</span>
                                    <span className="font-black text-slate-900">4.5 - 5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {isLogging && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/80 backdrop-blur-md animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300" title="System Production Entry">
                        <form onSubmit={handleLog} className="space-y-6">
                            <Select 
                                label="Primary Resource Stream" 
                                options={MINERALS.map(m => ({ label: m, value: m }))}
                                value={form.mineral}
                                onChange={e => setForm({...form, mineral: e.target.value})}
                            />
                            <Select 
                                label="Sector Extraction Node" 
                                options={LOCATIONS.map(l => ({ label: l, value: l }))}
                                value={form.location}
                                onChange={e => setForm({...form, location: e.target.value})}
                            />
                            <Select 
                                label="Assigned Worker / Operator" 
                                options={[{ label: '-- Select Worker --', value: '' }, ...(workers || []).map(w => ({ label: w?.email?.split('@')[0] || 'Unknown', value: w.email }))]}
                                value={form.operator}
                                onChange={e => setForm({...form, operator: e.target.value})}
                            />
                            <Input 
                                label="Net Quantified Volume (Metric Tons)" 
                                type="number" 
                                step="0.1" 
                                placeholder="0.0"
                                value={form.quantity}
                                onChange={e => setForm({...form, quantity: e.target.value})}
                            />
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" variant="primary" className="flex-1 h-12">Commit to Ledger</Button>
                                <Button variant="secondary" className="px-8 h-12" onClick={() => setIsLogging(false)}>Abort</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ProductionPage;
