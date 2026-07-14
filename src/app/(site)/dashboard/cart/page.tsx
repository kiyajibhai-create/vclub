'use client';

import { useState } from 'react';
import Link from 'next/link';
import dashStyles from '../dashboard.module.css';

const INITIAL_CART = [
  { id: 1, bin: '424242', bank: 'Chase', type: 'VISA', level: 'CLASSIC', country: 'US', price: 12.00 },
  { id: 3, bin: '374245', bank: 'Amex', type: 'AMEX', level: 'PLATINUM', country: 'CA', price: 25.00 },
];

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART);
  const [ordered, setOrdered] = useState(false);

  const remove = (id: number) => setCart(c => c.filter(x => x.id !== id));
  const total = cart.reduce((s, c) => s + c.price, 0);

  const checkout = () => {
    if (!cart.length) return;
    setOrdered(true);
  };

  const NAV = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Freshbase', href: '/dashboard/freshbase', icon: '💳' },
    { label: 'Checker', href: '/dashboard/checker', icon: '✅' },
    { label: 'Cart', href: '/dashboard/cart', icon: '🛒' },
    { label: 'Orders', href: '/dashboard/orders', icon: '📦' },
    { label: 'Support', href: '/dashboard/support', icon: '🎫' },
    { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ];

  return (
    <div className={dashStyles.layout}>
      <aside className={dashStyles.sidebar}>
        <div className={dashStyles.sidebarLogo}>
          <span className={dashStyles.logoText}>V</span>
          <span className={dashStyles.logoFull}>CLUB</span>
        </div>
        <nav className={dashStyles.sidebarNav}>
          {NAV.map(item => (
            <Link key={item.label} href={item.href} className={`${dashStyles.navItem} ${item.label === 'Cart' ? dashStyles.navActive : ''}`}>
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
          <span className={dashStyles.topbarTitle}>🛒 Cart</span>
          <div className={dashStyles.topbarRight}>
            <span className={dashStyles.userBadge}>👤 member123</span>
            <span className={dashStyles.balanceBadge}>💰 $0.00</span>
          </div>
        </header>
        <div className={dashStyles.content}>
          {ordered ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ color: '#77b300' }}>Order Placed!</h3>
              <p style={{ color: '#adafae', fontSize: '14px' }}>Your cards will be delivered to your account. Check Orders for details.</p>
              <Link href="/dashboard/orders" style={{ display: 'inline-block', marginTop: '16px', padding: '8px 24px', border: '2px solid #2a9fd6', borderRadius: '20px', color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                View Orders →
              </Link>
            </div>
          ) : (
            <>
              <div className="card" style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <div className="card-header">Cart Items ({cart.length})</div>
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>BIN</th><th>Bank</th><th>Type</th><th>Level</th><th>Country</th><th>Price</th><th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 && (
                      <tr><td colSpan={7} style={{ textAlign: 'center', color: '#555', padding: '24px' }}>Cart is empty</td></tr>
                    )}
                    {cart.map(c => (
                      <tr key={c.id}>
                        <td><span className="ticket-info ccnum">{c.bin}</span></td>
                        <td>{c.bank}</td>
                        <td><span className="badge badge-primary">{c.type}</span></td>
                        <td>{c.level}</td>
                        <td><span className="badge badge-secondary">{c.country}</span></td>
                        <td style={{ color: '#2a9fd6', fontWeight: 'bold' }}>${c.price.toFixed(2)}</td>
                        <td>
                          <button
                            onClick={() => remove(c.id)}
                            style={{ background: 'none', border: '1px solid #c00', borderRadius: '4px', color: '#c00', cursor: 'pointer', padding: '2px 8px', fontSize: '12px' }}
                          >✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ color: '#555', fontSize: '13px' }}>Total: </span>
                    <span style={{ color: '#2a9fd6', fontSize: '22px', fontWeight: 'bold' }}>${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={checkout}
                    disabled={cart.length === 0}
                    style={{ border: '2px solid #77b300', background: 'rgba(119,179,0,0.15)', borderRadius: '20px', color: '#fff', padding: '10px 32px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit', transition: 'background 0.2s' }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
