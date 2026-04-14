import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, showToast }) => {
  const [user, setUser] = useLocalStorage('tnom_user', null);
  const [registeredUsers, setRegisteredUsers] = useLocalStorage('tnom_registered_users', [
    { email: 'gm@trinitymetals.rw', key: '1234', role: 'General Manager' },
    { email: 'manager@trinitymetals.rw', key: '1234', role: 'Manager' },
    { email: 'hr@trinitymetals.rw', key: '1234', role: 'HR' },
    { email: 'supervisor@trinitymetals.rw', key: '1234', role: 'Mining Supervisor' },
    { email: 'admin@trinitymetals.rw', key: '3210', role: 'Super Admin' }
  ]);

  const login = (email, key) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.key === key);
    if (foundUser) {
      setUser(foundUser);
      showToast('Authentication Successful. Welcome to TNOM Command Center.');
      return true;
    }
    showToast('Authentication Failed. Invalid Credentials.');
    return false;
  };

  const register = (email, key, role = 'Mining Supervisor') => {
    if (!email || !key) return false;
    const exists = registeredUsers.find(u => u.email === email);
    if (exists) {
        showToast('Personnel already registered in the system.');
        return false;
    }
    const newUser = { email, key, role };
    setRegisteredUsers([...registeredUsers, newUser]);
    setUser(newUser);
    showToast(`Access Profile for ${role} Created Successfully.`);
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('Session Terminated. Logging Out.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
