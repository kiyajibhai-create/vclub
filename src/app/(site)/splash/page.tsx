'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <a href="/login" onClick={e => { e.preventDefault(); router.push('/login'); }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="LOGIN" style={{ width: '40vw', border: 'none', display: 'block' }} />
      </a>
    </div>
  );
}
