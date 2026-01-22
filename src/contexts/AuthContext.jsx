import { createContext, useState, useEffect, useMemo } from 'react';
import supabase from '../config/supabase';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (username, password, fullName, role = 'staff') => {
        try {
            // Convert username to email format for Supabase (username@local.app)
            const email = `${ username }@local.app`;

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        username: username,
                        full_name: fullName,
                    }
                }
            });

            if (error) throw error;

            // Create profile with username
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            role: role,
                            username: username,
                        }
                    ]);

                if (profileError) throw profileError;
            }

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const signIn = async (username, password) => {
        try {
            // Convert username to email format for Supabase (username@local.app)
            const email = `${ username }@local.app`;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const updateProfile = async (updates) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            setProfile(data);
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const updatePassword = async (newPassword) => {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const value = useMemo(() => ({
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        updatePassword,
    }), [user, profile, loading, signUp, signIn, signOut, updateProfile, updatePassword]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
