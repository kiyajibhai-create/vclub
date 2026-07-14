'use client';

import Link from 'next/link';
import dashStyles from '../dashboard.module.css';

const ORDERS = [
  { id: 'ORD-001', date: '2024-11-14', items: 3, total: '$46.00', status: 'completed' },
  { id: 'ORD-002', date: '2024-11-10', items: 1, total: '$18.00', status: 'completed' },
  { id: 'ORD-003', date: '2024-11-08', items: 5, total: '$95.00', status: 'pending' },
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

export default function OrdersPage() {
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
              className={`${dashStyles.navItem} ${item.label === 'Orders' ? dashStyles.navActive : ''}`}>
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
          <span className={dashStyles.topbarTitle}>📦 Orders</span>
          <div className={dashStyles.topbarRight}>
            <span className={dashStyles.userBadge}>👤 member123</span>
            <span className={dashStyles.balanceBadge}>💰 $0.00</span>
          </div>
        </header>

        <div className={dashStyles.content}>
          <div className="card" style={{ overflowX: 'auto' }}>
            <div className="card-header">Order History</div>
            <table className="table table-hover" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#555', padding: '30px' }}>
                      No orders yet
                    </td>
                  </tr>
                )}
                {ORDERS.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', color: '#2a9fd6' }}>{o.id}</td>
                    <td style={{ fontSize: '13px', color: '#555' }}>{o.date}</td>
                    <td>{o.items}</td>
                    <td style={{ color: '#2a9fd6', fontWeight: 'bold' }}>{o.total}</td>
                    <td>
                      <span className={`badge ${o.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{ background: 'none', border: '1px solid #282828', borderRadius: '4px', color: '#adafae', cursor: 'pointer', padding: '3px 10px', fontSize: '12px' }}
                        onClick={() => alert(`Order ${o.id} details`)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
