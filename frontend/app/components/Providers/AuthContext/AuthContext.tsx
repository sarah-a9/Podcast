'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profilePic?: string;
}

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
        })
        .catch((err) => {
          console.error("Error fetching current user:", err);
          //setUser(null);
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
