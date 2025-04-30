'use client';

import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/Providers/AuthContext/AuthContext';
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const { setToken, setUser } = useAuth();  // Use the context here
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Authentication failed');
      }

      const { token, user } = await res.json();

      // Save the token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));  // Save user to localStorage

      // Update the context with the user and token
      setToken(token);
      setUser(user);

      // Redirect to the home page or dashboard
      router.push('/');
      console.log('userId', user.userId);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex flex-row-reverse" style={{ backgroundColor: '#060a0d' }}>

    {/* {Image */}
    <div className="w-1/2 hidden md:block" >
      <div className="relative w-full h-screen">
        <Image
          src="/images/auth.png"
          alt="Login visual"
          layout="fill"
          className="object-contain"
        />
      </div>
    </div>

    {/* form*/}
    <div className="min-h-screen bg-black flex items-center justify-center p-4 w-full md:w-1/2" style={{ backgroundColor: '#060a0d' }}>
    <div
    className="rounded-xl p-8 shadow-2xl w-full max-w-md"
    style={{ backgroundColor: 'rgba(12, 13, 21, 0.5)' }} // semi-transparent dark background
    >
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">Login</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            <Link href="/auth/signup" className="text-blue-400 hover:underline" >
              Create an account
            </Link>
            {' '}or{' '}
            <Link href="/auth/forgotPassword" className="text-blue-400 hover:underline" >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
    
    
   </div>
  );
}
