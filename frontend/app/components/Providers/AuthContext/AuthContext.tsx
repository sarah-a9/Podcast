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
      setToken(savedToken);
      fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Fetched user from /auth/me:", data);
          setUser(data);  // Update the state
          localStorage.setItem('user', JSON.stringify(data));  // Persist user data
          setLoading(false);  // Once user data is fetched, stop loading
        })
        .catch((err) => {
          console.error("Error fetching current user:", err);
          setLoading(false);  // In case of error, stop loading
        });
    } else if (savedUser) {
      setUser(JSON.parse(savedUser));  // Set user from localStorage if available
      setLoading(false);  // Stop loading once we have the user data from localStorage
    }
  };

  // Only fetch data once component is mounted
  useEffect(() => {
    loadUserData();
  }, []);  // Run once on initial load

  // Update the user data in localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Persist user data
    }
  }, [user]);  // Persist whenever user state changes

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
