import React from 'react';
import { Card } from './UI';

const Leaderboard = ({ data = [], title = "Production Leaderboard" }) => {
    return (
        <Card title={title}>
            <div className="space-y-4">
                {data.length > 0 ? data.slice(0, 5).map((entry, idx) => (
                    <div key={entry.email} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400">#0{idx + 1}</span>
                            <p className="text-xs font-bold text-slate-700">{entry.email.split('@')[0]}</p>
                        </div>
                        <p className="text-xs font-black text-accent">{entry.total.toFixed(1)} T</p>
                    </div>
                )) : (
                    <p className="text-[10px] text-slate-400 uppercase font-black text-center py-4">No data available</p>
                )}
            </div>
        </Card>
    );
};

export default Leaderboard;
