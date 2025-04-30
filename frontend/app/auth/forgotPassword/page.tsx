'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`http://localhost:3000/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur serveur');
      }

      setMessage('Email de réinitialisation envoyé ! Vérifiez votre boîte mail.');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#060a0d' }}>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md" style={{ backgroundColor: 'rgba(12, 13, 21, 0.5)' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">Mot de passe oublié</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            {...register('email', { required: true })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Envoyer le lien
          </button>
        </form>
      </div>
    </div>
  );
}
