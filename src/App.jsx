import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Button, Card } from './components/common/UI';

// Layout & Modules
import Navbar from './components/layout/Navbar';
import Toast from './components/layout/Toast';
import LoginPage from './components/auth/LoginPage';
import ProductionPage from './components/production/ProductionPage';
import PersonnelPage from './components/personnel/PersonnelPage';
import SafetyPage from './components/safety/SafetyPage';

// Specialized Dashboards
import GMDashboard from './components/dashboards/GMDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import HRDashboard from './components/dashboards/HRDashboard';
import SupervisorDashboard from './components/dashboards/SupervisorDashboard';
import WorkerDashboard from './components/dashboards/WorkerDashboard';

// Access Control
import RoleGuard from './components/common/RoleGuard';

// --- Dashboard Component (Home View) ---
const DashboardRouter = () => {
    const { user } = useAuth();

    switch (user?.role) {
        case 'General Manager': return <GMDashboard />;
        case 'Manager': return <ManagerDashboard />;
        case 'HR': return <HRDashboard />;
        case 'Mining Supervisor': return <SupervisorDashboard />;
        case 'Worker': return <WorkerDashboard />;
        case 'Super Admin': return <GMDashboard />; // Admin sees everything
        default: return <WorkerDashboard />;
    }
};

// --- Main App Shell ---
const DashboardShell = () => {
    const [view, setView] = useState('dashboard');
    const { user } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: '📊 Dashboard', roles: ['General Manager', 'Manager', 'HR', 'Mining Supervisor', 'Super Admin', 'Worker'] },
        { id: 'production', label: '⛏️ Extraction', roles: ['General Manager', 'Manager', 'Mining Supervisor', 'Super Admin'] },
        { id: 'personnel', label: '👷 Personnel', roles: ['General Manager', 'HR', 'Super Admin'] },
        { id: 'safety', label: '🛡️ Safety / HSE', roles: ['General Manager', 'Manager', 'Mining Supervisor', 'Super Admin'] },
    ];

    const allowedMenu = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="app-layout" style={{ height: '100vh', overflow: 'hidden' }}>
            <Navbar />
            <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>
                <aside style={{ width: '280px', display: 'flex', flexDirection: 'column' }}>
                    <div className="mb-10 px-2">
                        <p className="text-[10px] tracking-[0.3em] font-black text-slate-500 uppercase">Sector Command</p>
                    </div>

                    <nav className="flex flex-col gap-2" style={{ flex: 1 }}>
                        {allowedMenu.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group
                                    ${view === item.id
                                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                                `}
                            >
                                <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">
                                    {item.label.split(' ')[0]}
                                </span>
                                <span className="text-[11px] font-black uppercase tracking-widest">
                                    {item.label.split(' ').slice(1).join(' ')}
                                </span>
                                {view === item.id && (
                                    <div className="ml-auto w-1 h-4 bg-white/40 rounded-full animate-pulse"></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)' }}>
                    {view === 'dashboard' && <DashboardRouter />}
                    {view === 'production' && (
                        <RoleGuard roles={['General Manager', 'Manager', 'Mining Supervisor', 'Super Admin']}>
                            <ProductionPage />
                        </RoleGuard>
                    )}
                    {view === 'personnel' && (
                        <RoleGuard roles={['General Manager', 'HR', 'Super Admin']}>
                            <PersonnelPage />
                        </RoleGuard>
                    )}
                    {view === 'safety' && (
                        <RoleGuard roles={['General Manager', 'Manager', 'Mining Supervisor', 'Super Admin']}>
                            <SafetyPage />
                        </RoleGuard>
                    )}
                </main>
            </div>
        </div>
    );
};

function AppContent() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <DashboardShell /> : <LoginPage />;
}

function App() {
    const [toasts, setToasts] = useState([]);

    const showToast = (message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4500);
    };

    return (
        <AuthProvider showToast={showToast}>
            <DataProvider showToast={showToast}>
                <AppContent />
                <Toast toasts={toasts} />
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
