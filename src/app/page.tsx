'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GateOrSplashPage() {
  const router = useRouter();
  const [hasPCP, setHasPCP] = useState<boolean | null>(null);

  // Safely check for PCP cookie on client side
  useEffect(() => {
    const pcpExists = document.cookie.split('; ').some(row => row.startsWith('PCP='));
    setHasPCP(pcpExists);
  }, []);

  // Automatic redirect if PCP is present and we show the Splash logo
  useEffect(() => {
    if (hasPCP === true) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [hasPCP, router]);

  function login() {
    document.cookie = 'PCP=2dbac1ec46be4d4e41c893c3c095e0e8; path=/; SameSite=Lax';
    setHasPCP(true);
  }

  // Prevent flash while loading cookie status
  if (hasPCP === null) {
    return null;
  }

  // 1. If PCP cookie is set, show Splash (logo on black bg, redirects to /login)
  if (hasPCP) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
      }}>
        <a href="/login" onClick={e => { e.preventDefault(); router.push('/login'); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="LOGIN" style={{ width: '40vw', border: 'none', display: 'block' }} />
        </a>
      </div>
    );
  }

  // 2. If PCP is not set, show the plain Gate input submit button
  return (
    <input
      type="submit"
      value="LOGIN"
      onClick={login}
      id="gate-login-btn"
    />
  );
}
