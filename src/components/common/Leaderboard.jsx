import React from 'react';
import { Card } from './UI';

const Leaderboard = ({ data, currentUserEmail, title = "Sector Standings // Monthly Yield" }) => {
    return (
        <Card title={title}>
            <div className="space-y-4">
                {data.length > 0 ? (
                    data.slice(0, 5).map((entry, index) => {
                        const isMe = entry.email === currentUserEmail;
                        const rank = index + 1;
                        
                        return (
                            <div 
                                key={entry.email} 
                                className={`
                                    p-4 rounded-xl border transition-all duration-300 flex justify-between items-center group
                                    ${isMe 
                                        ? 'bg-accent/10 border-accent/20 border-l-4 border-l-accent' 
                                        : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-black text-xs
                                        ${rank === 1 ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/30' : 
                                          rank === 2 ? 'bg-slate-300 text-white shadow-lg shadow-slate-300/30' : 
                                          rank === 3 ? 'bg-orange-400 text-white shadow-lg shadow-orange-400/30' : 
                                          'bg-slate-100 text-slate-400'}
                                    `}>
                                        {rank}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 tracking-tight text-sm">
                                            {entry.email.split('@')[0].toUpperCase()}
                                            {isMe && <span className="ml-2 text-[8px] bg-accent text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black">YOU</span>}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Operator Node</p>
                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active Duty</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="stat-value text-lg text-slate-900 leading-none mb-1">
                                        {entry.total.toFixed(2)}
                                        <span className="text-[10px] text-slate-400 font-normal ml-1">T</span>
                                    </p>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${index < 3 ? 'bg-emerald animate-pulse' : 'bg-slate-300'}`}></div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verified ROM</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Extraction Data</p>
                    </div>
                )}
            </div>
            {data.length > 5 && (
                <button className="w-full mt-6 py-3 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-accent transition-colors">
                    View Full Manifest ↓
                </button>
            )}
        </Card>
    );
};

export default Leaderboard;
