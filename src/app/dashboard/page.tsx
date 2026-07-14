'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Freshbase', href: '/dashboard/freshbase', icon: '💳' },
  { label: 'Checker', href: '/dashboard/checker', icon: '✅' },
  { label: 'Cart', href: '/dashboard/cart', icon: '🛒' },
  { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
  { label: 'Support', href: '/dashboard/support', icon: '🎫' },
  { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
];

const STATS = [
  { label: 'Balance', value: '$0.00', color: '#2a9fd6' },
  { label: 'Orders', value: '0', color: '#77b300' },
  { label: 'Referrals', value: '0', color: '#93c' },
  { label: 'Checks Today', value: '0', color: '#f80' },
];

const SAMPLE_CARDS = [
  { id: 1, bin: '424242', bank: 'Chase', type: 'VISA', level: 'CLASSIC', country: 'US', price: '$12.00', valid: true },
  { id: 2, bin: '531283', bank: 'Citi', type: 'MC', level: 'GOLD', country: 'UK', price: '$18.00', valid: true },
  { id: 3, bin: '374245', bank: 'Amex', type: 'AMEX', level: 'PLATINUM', country: 'CA', price: '$25.00', valid: true },
  { id: 4, bin: '601100', bank: 'Discover', type: 'DISC', level: 'CLASSIC', country: 'US', price: '$10.00', valid: false },
  { id: 5, bin: '356900', bank: 'JCB', type: 'JCB', level: 'GOLD', country: 'JP', price: '$22.00', valid: true },
];

const ANNOUNCEMENTS = [
  { date: '2024-11-15', title: 'New BINs added from US banks', content: 'Fresh bases from major US financial institutions now available.' },
  { date: '2024-11-10', title: 'System maintenance scheduled', content: 'Brief downtime expected. All orders processed after maintenance.' },
  { date: '2024-11-05', title: 'Checker updated', content: 'Improved accuracy for VISA and Mastercard verification.' },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoText}>V</span>
          <span className={styles.logoFull}>CLUB</span>
        </div>
        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navItem} ${activeNav === item.label ? styles.navActive : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.logoutBtn}>
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        {/* Top navbar */}
        <header className={styles.topbar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <span className={styles.topbarTitle}>VClub Member Panel</span>
          <div className={styles.topbarRight}>
            <span className={styles.userBadge}>👤 member123</span>
            <span className={styles.balanceBadge}>💰 $0.00</span>
          </div>
        </header>

        {/* Notification toast */}
        {notification && (
          <div className={styles.toast}>{notification}</div>
        )}

        <div className={styles.content}>
          {/* Stats row */}
          <div className={styles.statsRow}>
            {STATS.map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Announcements */}
          <div className={styles.section}>
            <div className="card">
              <div className="card-header">📢 Announcements</div>
              <div className="card-body" style={{ padding: 0 }}>
                {ANNOUNCEMENTS.map((a, i) => (
                  <div key={i} className={styles.announcement}>
                    <div className={styles.announcementDate}>{a.date}</div>
                    <div className={styles.announcementTitle}>{a.title}</div>
                    <div className={styles.announcementContent}>{a.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent cards (sample freshbase) */}
          <div className={styles.section}>
            <div className="card">
              <div className="card-header">💳 Recent Fresh Cards</div>
              <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="table table-hover" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>BIN</th>
                      <th>Bank</th>
                      <th>Type</th>
                      <th>Level</th>
                      <th>Country</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_CARDS.map(card => (
                      <tr key={card.id}>
                        <td className="tdsmall">{card.id}</td>
                        <td><span className="ticket-info ccnum">{card.bin}</span></td>
                        <td>{card.bank}</td>
                        <td>
                          <span className="badge badge-primary">{card.type}</span>
                        </td>
                        <td>{card.level}</td>
                        <td>{card.country}</td>
                        <td style={{ color: '#77b300', fontWeight: 'bold' }}>{card.price}</td>
                        <td>
                          <span className={`badge ${card.valid ? 'badge-success' : 'badge-danger'}`}>
                            {card.valid ? 'VALID' : 'INVALID'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '12px', padding: '2px 10px' }}
                            onClick={() => showNotification(`Card ${card.bin} added to cart!`)}
                          >
                            Buy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick tools */}
          <div className={styles.section}>
            <div className={styles.quickTools}>
              <Link href="/dashboard/freshbase" className={styles.toolCard}>
                <div className={styles.toolIcon}>💳</div>
                <div className={styles.toolName}>Freshbase</div>
                <div className={styles.toolDesc}>Browse fresh CC dumps</div>
              </Link>
              <Link href="/dashboard/checker" className={styles.toolCard}>
                <div className={styles.toolIcon}>✅</div>
                <div className={styles.toolName}>Checker</div>
                <div className={styles.toolDesc}>Verify card validity</div>
              </Link>
              <Link href="/dashboard/cart" className={styles.toolCard}>
                <div className={styles.toolIcon}>🛒</div>
                <div className={styles.toolName}>Cart</div>
                <div className={styles.toolDesc}>View selected cards</div>
              </Link>
              <Link href="/dashboard/support" className={styles.toolCard}>
                <div className={styles.toolIcon}>🎫</div>
                <div className={styles.toolName}>Support</div>
                <div className={styles.toolDesc}>Open a ticket</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
