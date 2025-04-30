'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          throw new Error(data.message || "Signup failed");
        } catch {
          throw new Error(text || "Signup failed. Server did not return JSON.");
        }
      }
      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => router.push("../../auth/pending"), 2000); // 
      // router.push("/"); // Redirect to homepage after successful signup
    } catch (error: any) {
      setError(error.message);
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
        <h2 className="text-3xl font-semibold text-center text-gray-100 mb-6">
          Sign Up
        </h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              required
            />
          </div>
          <div className="mb-6">
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-400 hover:underline">
              Login &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
