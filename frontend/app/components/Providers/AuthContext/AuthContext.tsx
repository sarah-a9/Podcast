'use client';

import { User } from '@/app/Types';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);  // Add loading state
  

  // Function to load user data and token from localStorage
  const loadUserData = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);  // Set token
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));  // Set user from localStorage if available
      setLoading(false);  // Stop loading once we have the user data from localStorage
    } else {
      setLoading(false);  // In case there's no user or token, stop loading
    }
  };

  // Fetch user data based on token
  const fetchUserData = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const res = await fetch('http://localhost:3000/auth/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data)); // Persist user data
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);  // Stop loading once the fetch is done
      }
    }
  };

  // Run when the token or savedUser changes
  useEffect(() => {
    loadUserData();
  }, []);  // Initial load when component mounts

  useEffect(() => {
    if (token) {
      fetchUserData();  // Fetch user data when token is set
    }
  }, [token]);  // Run only when token is updated

  // If loading, show nothing or a loading spinner
  if (loading) {
    return null; // Or you can return a loading spinner here
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}