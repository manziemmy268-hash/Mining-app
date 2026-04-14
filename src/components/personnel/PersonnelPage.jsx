import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData, SHIFTS } from '../../context/DataContext';
import { Button, Card, Select, Skeleton } from '../common/UI';

const PersonnelPage = () => {
    const { user } = useAuth();
    const { attendanceLogs, addAttendance, updateAttendance } = useData();
    const [selectedShift, setSelectedShift] = useState(SHIFTS[0]);
    const [isLoading, setIsLoading] = useState(true);

    // Track active duty for the currently logged-in user
    const [activeDuty, setActiveDuty] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const found = attendanceLogs.find(l => l.email === user?.email && l.status === 'On Site');
        setActiveDuty(found || null);
    }, [attendanceLogs, user]);

    const handleCheckIn = () => {
        if (!user) return;
        addAttendance(user.email, selectedShift);
    };

    const handleCheckOut = () => {
        if (activeDuty) {
            updateAttendance(activeDuty.id);
        }
    };

    return (
        <div className="main-content">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Personnel Command</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Site: Trinity Nyakabingo // Attendance & Duty Registry
                    </p>
                </div>
                {activeDuty ? (
                    <Button variant="danger" className="h-12 px-8 flex items-center gap-3" onClick={handleCheckOut}>
                        <span className="text-xl">⇥</span>
                        <span>End Active Duty (Clock Out)</span>
                    </Button>
                ) : (
                    <div className="flex gap-4 items-end">
                        <Select 
                            label="Target Shift Assignment"
                            options={SHIFTS.map(s => ({ label: s, value: s }))}
                            value={selectedShift}
                            onChange={e => setSelectedShift(e.target.value)}
                            className="w-[240px]"
                        />
                        <Button variant="primary" className="h-12 px-8 flex items-center gap-3" onClick={handleCheckIn}>
                            <span className="text-xl">👤</span>
                            <span>Initiate Active Duty</span>
                        </Button>
                    </div>
                )}
            </header>

            <Card className="mb-12" title="Operational Attendance Matrix">
                {isLoading ? (
                    <div className="space-y-4 p-2">
                        <Skeleton height="3rem" />
                        <Skeleton height="3rem" />
                        <Skeleton height="3rem" />
                        <Skeleton height="3rem" />
                        <Skeleton height="3rem" />
                    </div>
                ) : attendanceLogs.length > 0 ? (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Personnel Identity</th>
                                    <th>Assigned Shift Sector</th>
                                    <th>Operational Status</th>
                                    <th>Check-In</th>
                                    <th>Check-Out</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceLogs.map(l => (
                                    <tr key={l.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="font-black text-slate-900 tracking-tight">{l.email}</td>
                                        <td className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{l.shift}</td>
                                        <td>
                                            <span className={`tag ${l.status === 'On Site' ? 'tag-success' : 'tag-secondary'}`}>
                                                {l.status === 'On Site' ? 'ACTIVE' : 'OFF DUTY'}
                                            </span>
                                        </td>
                                        <td className="font-mono text-[10px] font-black text-slate-400 tracking-widest">{l.checkIn}</td>
                                        <td className="font-mono text-[10px] font-black text-slate-400 tracking-widest">{l.checkOut}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <span className="text-5xl mb-6 opacity-30">👥</span>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No active personnel recorded</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default PersonnelPage;
