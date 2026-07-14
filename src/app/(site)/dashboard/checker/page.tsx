'use client';

import { useState } from 'react';
import Link from 'next/link';
import dashStyles from '../dashboard.module.css';
import styles from './checker.module.css';

type CheckResult = 'live' | 'dead' | 'unknown' | null;

interface CardCheck {
  id: number;
  number: string;
  result: CheckResult;
  timestamp: string;
}

export default function CheckerPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<CardCheck[]>([]);
  const [checking, setChecking] = useState(false);
  const [balance, setBalance] = useState(10); // $10 per check

  const parseCards = (raw: string) => {
    return raw
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);
  };

  const simulateCheck = (num: string): CheckResult => {
    const hash = num.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    if (hash % 3 === 0) return 'live';
    if (hash % 3 === 1) return 'dead';
    return 'unknown';
  };

  const runCheck = async () => {
    const cards = parseCards(input);
    if (!cards.length) return;
    if (balance < cards.length) {
      alert('Insufficient balance for this many checks.');
      return;
    }
    setChecking(true);
    setResults([]);
    for (let i = 0; i < cards.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      const result = simulateCheck(cards[i]);
      const ts = new Date().toLocaleTimeString();
      setResults(prev => [...prev, { id: i + 1, number: cards[i], result, timestamp: ts }]);
      setBalance(b => b - 1);
    }
    setChecking(false);
  };

  const getResultBadge = (r: CheckResult) => {
    if (r === 'live') return <span className="badge badge-success">✓ LIVE</span>;
    if (r === 'dead') return <span className="badge badge-danger">✗ DEAD</span>;
    return <span className="badge badge-secondary">? UNKNOWN</span>;
  };

  const live = results.filter(r => r.result === 'live').length;
  const dead = results.filter(r => r.result === 'dead').length;
  const unknown = results.filter(r => r.result === 'unknown').length;

  return (
    <div className={dashStyles.layout}>
      <aside className={dashStyles.sidebar}>
        <div className={dashStyles.sidebarLogo}>
          <span className={dashStyles.logoText}>V</span>
          <span className={dashStyles.logoFull}>CLUB</span>
        </div>
        <nav className={dashStyles.sidebarNav}>
          {[
            { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
            { label: 'Freshbase', href: '/dashboard/freshbase', icon: '💳' },
            { label: 'Checker', href: '/dashboard/checker', icon: '✅' },
            { label: 'Cart', href: '/dashboard/cart', icon: '🛒' },
            { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
            { label: 'Support', href: '/dashboard/support', icon: '🎫' },
            { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
          ].map(item => (
            <Link key={item.label} href={item.href} className={`${dashStyles.navItem} ${item.label === 'Checker' ? dashStyles.navActive : ''}`}>
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
          <span className={dashStyles.topbarTitle}>✅ Card Checker</span>
          <div className={dashStyles.topbarRight}>
            <span className={dashStyles.userBadge}>👤 member123</span>
            <span className={dashStyles.balanceBadge} style={{ color: '#f80' }}>🔑 {balance} checks</span>
          </div>
        </header>

        <div className={dashStyles.content}>
          {/* Info banner */}
          <div className={styles.infoBanner}>
            <span className="badge badge-primary">Gate: VClub v2</span>
            <span className="badge badge-secondary" style={{ marginLeft: '8px' }}>$1.00 / check</span>
            <span className="badge badge-warning" style={{ marginLeft: '8px' }}>Max 50 per batch</span>
          </div>

          <div className={styles.checkerGrid}>
            {/* Input */}
            <div className={styles.inputPanel}>
              <div className="card">
                <div className="card-header">
                  Card Numbers
                  <span style={{ float: 'right', fontSize: '12px', color: '#555', fontWeight: 'normal' }}>
                    Format: 4111111111111111|12|25|123
                  </span>
                </div>
                <div className="card-body">
                  <textarea
                    className={styles.textarea}
                    placeholder={"4111111111111111|12|25|123\n5500005555555559|05|26|456\n374251018720955|08|27|789"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={10}
                  />
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                    <button
                      className={styles.checkBtn}
                      onClick={runCheck}
                      disabled={checking || !input.trim()}
                    >
                      {checking ? '⏳ Checking...' : '▶ Run Check'}
                    </button>
                    <button
                      className={styles.clearBtn}
                      onClick={() => { setInput(''); setResults([]); }}
                    >
                      🗑 Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className={styles.resultsPanel}>
              <div className="card">
                <div className="card-header">
                  Results
                  {results.length > 0 && (
                    <span style={{ float: 'right', fontSize: '12px', fontWeight: 'normal' }}>
                      <span style={{ color: '#77b300', marginRight: '8px' }}>✓ {live}</span>
                      <span style={{ color: '#c00', marginRight: '8px' }}>✗ {dead}</span>
                      <span style={{ color: '#555' }}>? {unknown}</span>
                    </span>
                  )}
                </div>
                <div className="card-body" style={{ padding: 0, maxHeight: '380px', overflowY: 'auto' }}>
                  {results.length === 0 && (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#555' }}>
                      No results yet. Paste card numbers and click Run Check.
                    </div>
                  )}
                  {results.map(r => (
                    <div key={r.id} className={`${styles.resultRow} ${styles[r.result || 'unknown']}`}>
                      <span className="ticket-info ccnum">{r.number.split('|')[0]?.slice(0, 6)}****</span>
                      <span style={{ flex: 1, fontSize: '12px', color: '#555', marginLeft: '8px' }}>
                        {r.number}
                      </span>
                      {getResultBadge(r.result)}
                      <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>{r.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live cards export */}
              {live > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div className="card">
                    <div className="card-header">✓ Live Cards ({live})</div>
                    <div className="card-body" style={{ padding: '10px 16px' }}>
                      <textarea
                        className={styles.textarea}
                        readOnly
                        rows={Math.min(live + 1, 6)}
                        value={results.filter(r => r.result === 'live').map(r => r.number).join('\n')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
