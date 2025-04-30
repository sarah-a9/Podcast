// auth/pending/page.tsx

import React from 'react';

export default function PendingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen style={{ backgroundColor: '#060a0d' }}">
      <h2 className="text-2xl font-semibold mb-4">Please verify your email</h2>
      <p className="mb-2 text-center">We’ve sent a verification link to your inbox. Please click the link to activate your account.</p>
      <a
        href="https://mail.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Go to Gmail
      </a>
    </div>
  );
}
