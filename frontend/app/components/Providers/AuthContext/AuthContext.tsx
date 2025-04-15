'use client';

import { AuthContextType, User } from '@/app/Types';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) 
            {throw new Error(`HTTP error! status: ${res.status}`);}
          return res.json();
        })
        .then((data) => {
          console.log("Fetched user from /auth/me:", data); // 👈
          setUser(data);
          if (data && data._id){
            localStorage.setItem('userId', data._id); // Store user ID in localStorage
          }
        })
        .catch((err) => {
          console.error("Error fetching current user:", err);
          setUser(null);
        });
    }
  }, []);
 

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
