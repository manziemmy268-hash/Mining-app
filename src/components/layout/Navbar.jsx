import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="h-20 px-8 flex items-center justify-between bg-primary text-white border-b border-white/5 z-50">
      <div className="flex items-center gap-8">
        <div className="nav-logo flex items-center gap-3">
          <img 
            src="https://trinity-metals.com/_next/image?url=https%3A%2F%2Fcontents.trinity-metals.com%2Fwp-content%2Fuploads%2F2025%2F02%2Fsite-logo1.png&w=384&q=75" 
            alt="Trinity Metals Logo" 
            className="h-10 object-contain"
          />
        </div>
        
        <div className="desktop-only items-center gap-2 px-3 py-1.5 rounded-full bg-emerald/10 border border-emerald/20">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></div>
           <span className="text-[10px] font-black tracking-widest text-emerald uppercase">Secure Link Active</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
            <p className="text-[11px] font-black leading-none mb-1 tracking-tight text-slate-100 italic">
                {user?.email.split('@')[0].toUpperCase()}
            </p>
            <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded ${
                user?.role === 'General Manager' ? 'bg-emerald/10 text-emerald-400' :
                user?.role === 'Manager' ? 'bg-orange/10 text-orange-400' :
                'bg-slate-800 text-slate-400'
            }`}>
                {user?.role || 'OPERATOR'}
            </span>
        </div>
        
        <div className="w-px h-8 bg-white/10"></div>
        
        <button 
            onClick={logout} 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
            <span>Terminate</span>
            <div className="text-xl">⇥</div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
