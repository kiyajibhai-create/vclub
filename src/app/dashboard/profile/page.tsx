'use client';

import { useState } from 'react';
import Link from 'next/link';
import dashStyles from '../dashboard.module.css';
import styles from './profile.module.css';

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Freshbase', href: '/dashboard/freshbase', icon: '💳' },
  { label: 'Checker', href: '/dashboard/checker', icon: '✅' },
  { label: 'Cart', href: '/dashboard/cart', icon: '🛒' },
  { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
  { label: 'Support', href: '/dashboard/support', icon: '🎫' },
  { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<'info' | 'security' | 'deposit'>('info');
  const [saved, setSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotif('Profile saved successfully!');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={dashStyles.layout}>
      <aside className={dashStyles.sidebar}>
        <div className={dashStyles.sidebarLogo}>
          <span className={dashStyles.logoText}>V</span>
          <span className={dashStyles.logoFull}>CLUB</span>
        </div>
        <nav className={dashStyles.sidebarNav}>
          {NAV.map(item => (
            <Link key={item.label} href={item.href}
              className={`${dashStyles.navItem} ${item.label === 'Profile' ? dashStyles.navActive : ''}`}>
              <span className={dashStyles.navIcon}>{item.icon}</span>
              <span className={dashStyles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={dashStyles.sidebarFooter}>
          <Link href="/" className={dashStyles.logoutBtn}>🚪 Logout</Link>
        </div>
      </aside>

      <div className={dashStyles.main}>
        <header className={dashStyles.topbar}>
          <span className={dashStyles.topbarTitle}>👤 Profile</span>
          <div className={dashStyles.topbarRight}>
            <span className={dashStyles.userBadge}>👤 member123</span>
            <span className={dashStyles.balanceBadge}>💰 $0.00</span>
          </div>
        </header>

        {notification && <div className={dashStyles.toast}>{notification}</div>}

        <div className={dashStyles.content}>
          {/* Avatar & stats */}
          <div className={styles.profileHero}>
            <div className={styles.avatar}>M</div>
            <div className={styles.profileInfo}>
              <h2 className={styles.username}>member123</h2>
              <div className={styles.memberSince}>Member since: November 2024</div>
              <div className={styles.badges}>
                <span className="badge badge-primary">MEMBER</span>
                <span className="badge badge-secondary" style={{ marginLeft: '6px' }}>VERIFIED</span>
              </div>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.pStat}><span className={styles.pStatVal} style={{ color: '#2a9fd6' }}>$0.00</span><span className={styles.pStatLabel}>Balance</span></div>
              <div className={styles.pStat}><span className={styles.pStatVal} style={{ color: '#77b300' }}>3</span><span className={styles.pStatLabel}>Orders</span></div>
              <div className={styles.pStat}><span className={styles.pStatVal} style={{ color: '#93c' }}>0</span><span className={styles.pStatLabel}>Referrals</span></div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {(['info', 'security', 'deposit'] as const).map(t => (
              <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                onClick={() => setTab(t)}>
                {t === 'info' ? '📋 Info' : t === 'security' ? '🔒 Security' : '💳 Deposit'}
              </button>
            ))}
          </div>

          {/* INFO TAB */}
          {tab === 'info' && (
            <div className="card">
              <div className="card-header">Account Information</div>
              <div className="card-body">
                <form onSubmit={handleSave} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Username</label>
                      <input className={styles.input} defaultValue="member123" readOnly />
                    </div>
                    <div className={styles.formField}>
                      <label>Email (optional)</label>
                      <input className={styles.input} type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Jabber / XMPP</label>
                      <input className={styles.input} placeholder="user@jabber.org" />
                    </div>
                    <div className={styles.formField}>
                      <label>ICQ</label>
                      <input className={styles.input} placeholder="123456789" />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Referral Link</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input className={styles.input} readOnly
                          value="https://vclub.example/ref/member123" />
                        <button type="button" className={styles.copyBtn}
                          onClick={() => { navigator.clipboard.writeText('https://vclub.example/ref/member123'); showNotif('Copied!'); }}>
                          📋
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className={styles.saveBtn}>
                    {saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {tab === 'security' && (
            <div className="card">
              <div className="card-header">🔒 Security Settings</div>
              <div className="card-body">
                <form className={styles.form} onSubmit={e => { e.preventDefault(); showNotif('Password changed!'); }}>
                  <div className={styles.formField}>
                    <label>Current Password</label>
                    <input className={styles.input} type="password" placeholder="••••••••" />
                  </div>
                  <div className={styles.formField}>
                    <label>New Password</label>
                    <input className={styles.input} type="password" placeholder="••••••••" />
                  </div>
                  <div className={styles.formField}>
                    <label>Confirm New Password</label>
                    <input className={styles.input} type="password" placeholder="••••••••" />
                  </div>
                  <div className={styles.securityInfo}>
                    <div className={styles.securityRow}>
                      <span>🔒 Two-Factor Authentication</span>
                      <span className="badge badge-secondary">Disabled</span>
                    </div>
                    <div className={styles.securityRow}>
                      <span>🌐 Last Login IP</span>
                      <span style={{ fontFamily: 'monospace', color: '#2a9fd6' }}>127.0.0.1</span>
                    </div>
                    <div className={styles.securityRow}>
                      <span>📅 Last Login</span>
                      <span style={{ color: '#555' }}>2024-11-15 14:32</span>
                    </div>
                  </div>
                  <button type="submit" className={styles.saveBtn}>Change Password</button>
                </form>
              </div>
            </div>
          )}

          {/* DEPOSIT TAB */}
          {tab === 'deposit' && (
            <div className="card">
              <div className="card-header">💳 Deposit Funds</div>
              <div className="card-body">
                <div className={styles.depositGrid}>
                  {[
                    { coin: 'Bitcoin', symbol: 'BTC', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', icon: '₿', color: '#f80' },
                    { coin: 'Monero', symbol: 'XMR', address: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A', icon: 'ɱ', color: '#93c' },
                    { coin: 'Litecoin', symbol: 'LTC', address: 'LcDkAj4XxtoPWP19RC9bKaddiDm1tnm5pG', icon: 'Ł', color: '#adafae' },
                  ].map(w => (
                    <div key={w.symbol} className={styles.walletCard}>
                      <div className={styles.walletIcon} style={{ color: w.color }}>{w.icon}</div>
                      <div className={styles.walletName}>{w.coin} <span className="badge badge-secondary">{w.symbol}</span></div>
                      <div className={styles.walletAddress}>{w.address.slice(0, 20)}...{w.address.slice(-6)}</div>
                      <button className={styles.copyBtn2}
                        onClick={() => { navigator.clipboard.writeText(w.address); showNotif(`${w.symbol} address copied!`); }}>
                        📋 Copy Address
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.depositNote}>
                  ⚠️ After sending, wait for 3 network confirmations. Balance will be updated automatically.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
