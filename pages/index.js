import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className="container">
      <h1>Farm Connect</h1>
      {user ? (
        <div>
          <p>Welcome {user.email}</p>
          <Link href="/dashboard">Go to Dashboard</Link>
        </div>
      ) : (
        <div>
          <Link href="/signup">Sign Up</Link>
          <Link href="/login">Login</Link>
        </div>
      )}
      <Link href="/farms">Browse Farms</Link>
    </div>
  );
}
