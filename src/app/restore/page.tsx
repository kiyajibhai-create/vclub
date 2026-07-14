'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../register/register.module.css';

export default function RestorePage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your username or email.');
      return;
    }
    setSent(true);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.logo}>V</span>
          <span className={styles.logoTitle}>CLUB</span>
          <div className={styles.tagline}>Password Recovery</div>
        </div>

        {sent ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>📧</div>
            <h3>Request Sent</h3>
            <p>If an account with that username exists, recovery instructions will be provided by support.</p>
            <Link href="/" className={styles.backBtn}>← Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off" className={styles.form}>
            <p style={{ color: '#adafae', fontSize: '13px', textAlign: 'center', margin: '0 0 12px' }}>
              Enter your username to request a password reset via support ticket.
            </p>
            <div className={styles.field}>
              <label>Username *</label>
              <input
                type="text"
                placeholder="Your username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>Send Recovery</button>
              <Link href="/" className={styles.cancelBtn}>Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
