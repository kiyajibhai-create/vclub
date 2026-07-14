'use client';

import { useState } from 'react';
import Link from 'next/link';
import dashStyles from '../dashboard.module.css';
import styles from './support.module.css';

type TicketStatus = 'open' | 'answered' | 'closed';

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  date: string;
  messages: { from: string; text: string; time: string }[];
}

const SAMPLE_TICKETS: Ticket[] = [
  {
    id: 'TKT-0042',
    subject: 'Card not working after purchase',
    status: 'answered',
    date: '2024-11-12',
    messages: [
      { from: 'member123', text: 'Card I bought yesterday shows invalid when checked.', time: '14:32' },
      { from: 'Support', text: 'We have issued a replacement. Please check your orders.', time: '16:10' },
    ],
  },
  {
    id: 'TKT-0038',
    subject: 'Refund request',
    status: 'closed',
    date: '2024-11-05',
    messages: [
      { from: 'member123', text: 'Requesting refund for order ORD-002.', time: '09:15' },
      { from: 'Support', text: 'Refund processed to your account balance.', time: '11:45' },
    ],
  },
];

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Freshbase', href: '/dashboard/freshbase', icon: '💳' },
  { label: 'Checker', href: '/dashboard/checker', icon: '✅' },
  { label: 'Cart', href: '/dashboard/cart', icon: '🛒' },
  { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
  { label: 'Support', href: '/dashboard/support', icon: '🎫' },
  { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
];

const statusColor: Record<TicketStatus, string> = {
  open: '#2a9fd6',
  answered: '#77b300',
  closed: '#555',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(SAMPLE_TICKETS);
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [replyText, setReplyText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const createTicket = () => {
    if (!newSubject.trim() || !newMsg.trim()) return;
    const t: Ticket = {
      id: `TKT-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      subject: newSubject,
      status: 'open',
      date: new Date().toISOString().split('T')[0],
      messages: [{ from: 'member123', text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
    };
    setTickets(prev => [t, ...prev]);
    setNewSubject('');
    setNewMsg('');
    setView('list');
    showNotif('Ticket created successfully!');
  };

  const sendReply = () => {
    if (!replyText.trim() || !selected) return;
    const msg = { from: 'member123', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updated = tickets.map(t =>
      t.id === selected.id ? { ...t, messages: [...t.messages, msg], status: 'open' as TicketStatus } : t
    );
    setTickets(updated);
    setSelected(updated.find(t => t.id === selected.id) || null);
    setReplyText('');
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
              className={`${dashStyles.navItem} ${item.label === 'Support' ? dashStyles.navActive : ''}`}>
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
          <span className={dashStyles.topbarTitle}>🎫 Support Tickets</span>
          <div className={dashStyles.topbarRight}>
            <span className={dashStyles.userBadge}>👤 member123</span>
            <span className={dashStyles.balanceBadge}>💰 $0.00</span>
          </div>
        </header>

        {notification && <div className={dashStyles.toast}>{notification}</div>}

        <div className={dashStyles.content}>

          {/* LIST VIEW */}
          {view === 'list' && (
            <div className={styles.wrapper}>
              <div className={styles.actions}>
                <button className={styles.newBtn} onClick={() => setView('new')}>
                  + New Ticket
                </button>
              </div>

              {tickets.length === 0 && (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
                  No tickets yet. Open a new ticket to contact support.
                </div>
              )}

              <div className={styles.ticketList}>
                {tickets.map(t => (
                  <div key={t.id} className={styles.ticketCard}
                    onClick={() => { setSelected(t); setView('detail'); }}>
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketId}>{t.id}</span>
                      <span className={styles.ticketStatus}
                        style={{ background: statusColor[t.status] }}>
                        {t.status.toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.ticketSubject}>{t.subject}</div>
                    <div className={styles.ticketMeta}>
                      <span>📅 {t.date}</span>
                      <span>💬 {t.messages.length} message{t.messages.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW TICKET */}
          {view === 'new' && (
            <div className={styles.wrapper}>
              <button className={styles.backBtn} onClick={() => setView('list')}>← Back</button>
              <div className="card">
                <div className="card-header">New Support Ticket</div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Subject *</label>
                    <input
                      className={styles.input}
                      placeholder="Briefly describe your issue"
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Message *</label>
                    <textarea
                      className={styles.textarea}
                      placeholder="Describe your issue in detail..."
                      rows={6}
                      value={newMsg}
                      onChange={e => setNewMsg(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className={styles.submitBtn} onClick={createTicket}
                      disabled={!newSubject.trim() || !newMsg.trim()}>
                      Submit Ticket
                    </button>
                    <button className={styles.cancelBtn2} onClick={() => setView('list')}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL VIEW */}
          {view === 'detail' && selected && (
            <div className={styles.wrapper}>
              <button className={styles.backBtn} onClick={() => setView('list')}>← Back to Tickets</button>
              <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span>{selected.subject}</span>
                  <span className={styles.ticketStatus} style={{ background: statusColor[selected.status] }}>
                    {selected.status.toUpperCase()}
                  </span>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selected.messages.map((m, i) => (
                    <div key={i} className={`${styles.message} ${m.from === 'Support' ? styles.supportMsg : styles.userMsg}`}>
                      <div className={styles.msgHeader}>
                        <strong style={{ color: m.from === 'Support' ? '#2a9fd6' : '#77b300' }}>{m.from}</strong>
                        <span style={{ fontSize: '11px', color: '#555' }}>{m.time}</span>
                      </div>
                      <div className={styles.msgText}>{m.text}</div>
                    </div>
                  ))}

                  {selected.status !== 'closed' && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <textarea
                        className={styles.textarea}
                        placeholder="Type your reply..."
                        rows={3}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                      />
                      <button className={styles.submitBtn} onClick={sendReply} disabled={!replyText.trim()}>
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
