'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './register.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '', referral: '', agree: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password || !form.confirm) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!form.agree) {
      setError('You must agree to the terms.');
      return;
    }
    
    // Redirect directly to the external login page
    window.location.href = 'https://vclub.one/usercp/auth/signin/';
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.logo}>V</span>
          <span className={styles.logoTitle}>CLUB</span>
          <div className={styles.tagline}>Registration</div>
        </div>

        <div className={styles.regBanner}>
          Registration: <strong>Open</strong> &nbsp;|&nbsp; Fee: <strong>$50</strong>
        </div>

        {success ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✅</div>
            <h3>Registration Submitted</h3>
            <p>Your account is pending approval. You will receive access after payment of the $50 registration fee.</p>
            <Link href="/" className={styles.backBtn}>← Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off" className={styles.form}>
            <div className={styles.field}>
              <label>Username *</label>
              <input
                name="username"
                type="text"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label>Password *</label>
              <input
                name="password"
                type="password"
                placeholder="Choose a password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Confirm Password *</label>
              <input
                name="confirm"
                type="password"
                placeholder="Confirm your password"
                value={form.confirm}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Referral Code (optional)</label>
              <input
                name="referral"
                type="text"
                placeholder="Referral code"
                value={form.referral}
                onChange={handleChange}
              />
            </div>
            <div className={styles.checkRow}>
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={form.agree}
                onChange={handleChange}
              />
              <label htmlFor="agree" style={{ display: 'inline', marginLeft: '8px', fontSize: '13px' }}>
                I agree to the terms and conditions
              </label>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>Register</button>
              <Link href="/" className={styles.cancelBtn}>Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
