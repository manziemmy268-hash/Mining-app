import React from 'react';

const PerformanceGauge = ({ progress = 0, label = "Yield Progress" }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(100, progress) / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full rotate-[-90deg]">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="transparent"
                        stroke="var(--accent)"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-black text-slate-900">{Math.round(progress)}%</span>
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</p>
        </div>
    );
};

export default PerformanceGauge;
