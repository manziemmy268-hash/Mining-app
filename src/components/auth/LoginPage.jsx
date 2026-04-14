import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Input, Select } from '../common/UI';

const LoginPage = () => {
    const { login, register } = useAuth();
    const [viewMode, setViewMode] = useState('welcome');
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ email: '', key: '', role: 'Mining Supervisor' });

    const roles = [
        { value: 'Mining Supervisor', label: 'Mining Supervisor' },
        { value: 'HR', label: 'HR' },
        { value: 'Manager', label: 'Manager' },
        { value: 'General Manager', label: 'General Manager' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(async () => {
            if (viewMode === 'register') {
                await register(form.email, form.key, form.role);
            } else if (viewMode === 'login') {
                await login(form.email, form.key);
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
            {/* Cinematic Background */}
            <div 
                style={{ position: 'absolute', inset: 0, opacity: 0.35, backgroundImage: `url('/assets/images/login_bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            
            {/* Main Terminal Card */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px', padding: '1rem' }}>
                <div className="card" style={{ padding: '3.5rem 3rem', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    
                    {/* Header Logo */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '14px', width: '100%', display: 'flex', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            <img 
                                src="https://trinity-metals.com/_next/image?url=https%3A%2F%2Fcontents.trinity-metals.com%2Fwp-content%2Fuploads%2F2025%2F02%2Fsite-logo1.png&w=384&q=75" 
                                alt="Trinity Metals Logo" 
                                style={{ height: '3.5rem', objectFit: 'contain' }}
                            />
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#f97316' }}>
                                Sector Portal
                            </p>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', marginBottom: '2rem' }}></div>

                    {/* View: Welcome */}
                    {viewMode === 'welcome' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>System Access</h1>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>Please authenticate to access the sector control node.</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <Button 
                                    type="button" 
                                    variant="primary"
                                    onClick={() => setViewMode('login')}
                                    style={{ width: '100%', padding: '1.1rem', fontSize: '0.9rem' }}
                                >
                                    LOGIN TO SECTOR →
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="secondary"
                                    onClick={() => setViewMode('register')}
                                    style={{ width: '100%', padding: '1.1rem', fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    REGISTER NEW IDENTITY
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* View: Login / Register */}
                    {viewMode !== 'welcome' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
                                    {viewMode === 'login' ? 'Welcome Back' : 'Create Identity'}
                                </h1>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                                    {viewMode === 'login' 
                                        ? 'Enter your operational credentials.' 
                                        : 'Request sector access clearance.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                        placeholder="operator@trinitymetals.rw"
                                        style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Security Key</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={form.key}
                                        onChange={e => setForm({...form, key: e.target.value})}
                                        placeholder="••••••••"
                                        style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '0.9rem' }}
                                    />
                                </div>

                                {viewMode === 'register' && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Access Level</label>
                                        <select 
                                            value={form.role}
                                            onChange={e => setForm({...form, role: e.target.value})}
                                            style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '0.9rem' }}
                                        >
                                            {roles.map(r => (
                                                <option key={r.value} value={r.value} style={{ backgroundColor: '#0f172a' }}>{r.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    variant="primary"
                                    style={{ width: '100%', padding: '1.2rem', marginTop: '0.5rem', fontSize: '0.9rem' }}
                                >
                                    {isLoading ? 'SYNCING...' : (viewMode === 'login' ? 'ESTABLISH LINK →' : 'REQUEST ACCESS →')}
                                </Button>
                            </form>

                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <button 
                                    type="button"
                                    onClick={() => setViewMode('welcome')}
                                    style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    ← Cancel & Return
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default LoginPage;
