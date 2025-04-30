import { useEffect } from 'react';
import { useRouter } from 'next/router';

const VerifyEmail = () => {
    const router = useRouter();
    const { token } = router.query;

    useEffect(() => {
        if (token) {
          fetch(`http://localhost:3000/auth/verify-email?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
            .then((response) => response.json())
            .then((data) => {
              alert(data.message);
              // Redirect to login
              setTimeout(() => {
                router.push('/auth/login');
              }, 2000);
            })
            .catch((error) => {
              alert('Error verifying email: ' + error.message);
              // Optionally redirect somewhere else
              setTimeout(() => {
                router.push('/');
              }, 2000);
            });
        }
      }, [token]);

    return <div>Verifying your email...</div>;
};

export default VerifyEmail;
