import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, showToast }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's role from the profiles table
  const fetchProfile = async (authUser) => {
    if (!authUser) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error || !data) {
      // Fallback: return user with default role
      return { id: authUser.id, email: authUser.email, role: 'Mining Supervisor' };
    }
    return { id: authUser.id, email: data.email || authUser.email, role: data.role };
  };

  useEffect(() => {
    // Restore session on page load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      }
      setLoading(false);
    });

    // Listen for login / logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, key) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: key,
    });

    if (error) {
      showToast('Authentication Failed. Invalid Credentials.');
      return false;
    }

    const profile = await fetchProfile(data.user);
    setUser(profile);
    showToast(`Authentication Successful. Welcome to TNOM Command Center.`);
    return true;
  };

  const register = async (email, key, role = 'Mining Supervisor') => {
    if (!email || !key) return false;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: key,
      options: {
        data: { role }, // stored in raw_user_meta_data, trigger copies to profiles
      },
    });

    if (error) {
      showToast(error.message || 'Registration failed.');
      return false;
    }

    showToast(`Access Profile for ${role} Created Successfully.`);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showToast('Session Terminated. Logging Out.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
