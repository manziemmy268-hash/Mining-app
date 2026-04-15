import React from 'react';

const PerformanceGauge = ({ current, target, size = 200 }) => {
    const percentage = Math.min(Math.round((current / target) * 100), 100);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 200 200" className="rotate-[-90deg]">
                {/* Background Track */}
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="12"
                />
                {/* Progress Bar */}
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="var(--accent)"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    style={{ 
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: 'drop-shadow(0 0 8px var(--accent-alpha))'
                    }}
                    strokeLinecap="round"
                />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black tracking-tight text-white mb-1">
                    {percentage}%
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Yield Target
                </span>
            </div>

            {percentage >= 100 && (
                <div className="absolute -top-2 bg-emerald text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg shadow-emerald/40 animate-bounce">
                    Target Met
                </div>
            )}
        </div>
    );
};

export default PerformanceGauge;
