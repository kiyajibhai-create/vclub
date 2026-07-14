'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../dashboard.module.css';
import fbStyles from './freshbase.module.css';

const COUNTRIES = ['All', 'US', 'UK', 'CA', 'DE', 'FR', 'AU', 'JP', 'RU', 'BR'];
const TYPES = ['All', 'VISA', 'MC', 'AMEX', 'DISC', 'JCB'];
const LEVELS = ['All', 'CLASSIC', 'GOLD', 'PLATINUM', 'BUSINESS', 'INFINITE'];

const CARDS = [
  { id: 1, bin: '424242', bank: 'Chase', type: 'VISA', level: 'CLASSIC', country: 'US', price: '$12.00', zip: '10001', city: 'New York', balance: '$500+' },
  { id: 2, bin: '531283', bank: 'Citi', type: 'MC', level: 'GOLD', country: 'UK', price: '$18.00', zip: 'SW1A', city: 'London', balance: '$1000+' },
  { id: 3, bin: '374245', bank: 'Amex', type: 'AMEX', level: 'PLATINUM', country: 'CA', price: '$25.00', zip: 'M5H', city: 'Toronto', balance: '$5000+' },
  { id: 4, bin: '601100', bank: 'Discover', type: 'DISC', level: 'CLASSIC', country: 'US', price: '$10.00', zip: '90210', city: 'Beverly Hills', balance: '$200+' },
  { id: 5, bin: '356900', bank: 'JCB', type: 'JCB', level: 'GOLD', country: 'JP', price: '$22.00', zip: '100-0001', city: 'Tokyo', balance: '$800+' },
  { id: 6, bin: '411111', bank: 'Wells Fargo', type: 'VISA', level: 'INFINITE', country: 'US', price: '$35.00', zip: '94105', city: 'San Francisco', balance: '$10000+' },
  { id: 7, bin: '545454', bank: 'HSBC', type: 'MC', level: 'BUSINESS', country: 'UK', price: '$30.00', zip: 'EC1A', city: 'London', balance: '$3000+' },
  { id: 8, bin: '378282', bank: 'Barclays', type: 'AMEX', level: 'GOLD', country: 'DE', price: '$20.00', zip: '10115', city: 'Berlin', balance: '$1500+' },
  { id: 9, bin: '6011000', bank: 'BNP', type: 'DISC', level: 'PLATINUM', country: 'FR', price: '$28.00', zip: '75001', city: 'Paris', balance: '$2000+' },
  { id: 10, bin: '3566000', bank: 'CBA', type: 'JCB', level: 'CLASSIC', country: 'AU', price: '$15.00', zip: '2000', city: 'Sydney', balance: '$600+' },
];

export default function FreshbasePage() {
  const [country, setCountry] = useState('All');
  const [type, setType] = useState('All');
  const [level, setLevel] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<number[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = CARDS.filter(c =>
    (country === 'All' || c.country === country) &&
    (type === 'All' || c.type === type) &&
    (level === 'All' || c.level === level) &&
    (search === '' || c.bin.includes(search) || c.bank.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const addToCart = (id: number, bin: string) => {
    if (!cart.includes(id)) {
      setCart(c => [...c, id]);
      setNotification(`Card ${bin} added to cart!`);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoText}>V</span>
          <span className={styles.logoFull}>CLUB</span>
        </div>
        <nav className={styles.sidebarNav}>
          {[
            { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
            { label: 'Freshbase', href: '/dashboard/freshbase', icon: '💳' },
            { label: 'Checker', href: '/dashboard/checker', icon: '✅' },
            { label: 'Cart', href: '/dashboard/cart', icon: '🛒' },
            { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
            { label: 'Support', href: '/dashboard/support', icon: '🎫' },
            { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
          ].map(item => (
            <Link key={item.label} href={item.href} className={`${styles.navItem} ${item.label === 'Freshbase' ? styles.navActive : ''}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.logoutBtn}>🚪 Logout</Link>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.topbarTitle}>💳 Freshbase</span>
          <div className={styles.topbarRight}>
            <span className={styles.userBadge}>👤 member123</span>
            <span className={styles.balanceBadge}>💰 $0.00</span>
            <Link href="/dashboard/cart" className={styles.balanceBadge} style={{ color: '#2a9fd6', textDecoration: 'none', fontSize: '13px' }}>
              🛒 {cart.length}
            </Link>
          </div>
        </header>

        {notification && <div className={styles.toast}>{notification}</div>}

        <div className={styles.content}>
          {/* Filters */}
          <div className={fbStyles.filters}>
            <input
              className={fbStyles.searchInput}
              placeholder="Search by BIN or bank..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            <select className={fbStyles.select} value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c === 'All' ? '🌍 Country' : c}</option>)}
            </select>
            <select className={fbStyles.select} value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
              {TYPES.map(t => <option key={t} value={t}>{t === 'All' ? '💳 Type' : t}</option>)}
            </select>
            <select className={fbStyles.select} value={level} onChange={e => { setLevel(e.target.value); setPage(1); }}>
              {LEVELS.map(l => <option key={l} value={l}>{l === 'All' ? '⭐ Level' : l}</option>)}
            </select>
            <button className={fbStyles.resetBtn} onClick={() => { setCountry('All'); setType('All'); setLevel('All'); setSearch(''); setPage(1); }}>
              Reset
            </button>
          </div>

          <div style={{ marginBottom: '12px', color: '#555', fontSize: '13px' }}>
            Showing {filtered.length} cards
          </div>

          {/* Card table */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="table table-hover" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>BIN</th>
                  <th>Bank</th>
                  <th>Type</th>
                  <th>Level</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Balance</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(card => (
                  <tr key={card.id}>
                    <td className="tdsmall">{card.id}</td>
                    <td><span className="ticket-info ccnum">{card.bin}</span></td>
                    <td style={{ fontSize: '13px' }}>{card.bank}</td>
                    <td><span className="badge badge-primary">{card.type}</span></td>
                    <td style={{ fontSize: '12px' }}>{card.level}</td>
                    <td>
                      <span className="badge badge-secondary">{card.country}</span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#555' }}>{card.city}</td>
                    <td style={{ color: '#77b300', fontSize: '12px' }}>{card.balance}</td>
                    <td style={{ color: '#2a9fd6', fontWeight: 'bold' }}>{card.price}</td>
                    <td>
                      <button
                        className={`btn btn-secondary ${fbStyles.buyBtn} ${cart.includes(card.id) ? fbStyles.inCart : ''}`}
                        onClick={() => addToCart(card.id, card.bin)}
                        disabled={cart.includes(card.id)}
                      >
                        {cart.includes(card.id) ? '✓ Added' : 'Buy'}
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={10} style={{ textAlign: 'center', color: '#555', padding: '30px' }}>No cards found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={fbStyles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`${fbStyles.pageBtn} ${p === page ? fbStyles.pageBtnActive : ''}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
