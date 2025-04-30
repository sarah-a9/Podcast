'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormData = {
  newPassword: string;
};

export default function ResetPasswordPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`http://localhost:3000/auth/reset-password?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword: data.newPassword }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur serveur');
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  if (!token) return <p className="p-4 text-red-500">Token manquant dans l’URL.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center " style={{ backgroundColor: '#060a0d' }}>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md" style={{ backgroundColor: 'rgba(12, 13, 21, 0.5)' }}>
        <h1 className="text-2xl font-bold mb-4 text-center">Réinitialiser le mot de passe</h1>

        {success ? (
          <p className="text-green-600 text-center">Mot de passe mis à jour ! Redirection…</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              {...register('newPassword', { required: true, minLength: 6 })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              Réinitialiser
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
