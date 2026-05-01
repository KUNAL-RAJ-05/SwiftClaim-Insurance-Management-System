import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import {
  Shield, LayoutDashboard, ShoppingBag, FileText, Upload,
  ClipboardList, PlusCircle, Wallet
} from 'lucide-react';

const Header = () => {
  const { account, isAdmin, contract } = useWeb3();
  const location = useLocation();
  const [policyCount, setPolicyCount] = useState(null);
  const [claimCount, setClaimCount]   = useState(null);

  /* ── Dynamic stats ── */
  useEffect(() => {
    if (!contract || !account) return;

    const load = async () => {
      try {
        if (isAdmin) {
          const pc = await contract.userPolicyCount();
          const cc = await contract.claimCount();
          setPolicyCount(Number(pc));
          setClaimCount(Number(cc));
        } else {
          const ids = await contract.getUserPolicies(account);
          setPolicyCount(ids.length);
        }
      } catch (_) { /* silent */ }
    };

    load();
  }, [contract, account, isAdmin]);

  const userNav = [
    { to: '/user-dashboard', label: 'Dashboard',    icon: <LayoutDashboard size={15} /> },
    { to: '/marketplace',    label: 'Marketplace',  icon: <ShoppingBag size={15} /> },
    { to: '/my-policies',    label: 'My Policies',  icon: <FileText size={15} /> },
    { to: '/submit-claim',   label: 'Submit Claim', icon: <Upload size={15} /> },
  ];

  const adminNav = [
    { to: '/admin-dashboard', label: 'Dashboard',     icon: <LayoutDashboard size={15} /> },
    { to: '/claims',          label: 'Manage Claims', icon: <ClipboardList size={15} /> },
    { to: '/policies',        label: 'Policy Editor', icon: <PlusCircle size={15} /> },
  ];

  const navItems = isAdmin ? adminNav : userNav;

  return (
    <header className="header">
      {/* ── Top bar ── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          height: 64,
          boxSizing: 'border-box',
        }}
      >
        {/* LEFT: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="logo-icon">
            <Shield size={18} color="#fff" />
          </div>
          <span className="logo-text">
            Swift<span>Claim</span>
          </span>
          {account && (
            <span
              className={`badge ${isAdmin ? 'badge-danger' : 'badge-primary'}`}
              style={{ marginLeft: 6, fontSize: '0.68rem' }}
            >
              {isAdmin ? '⚙ Admin' : '👤 User'}
            </span>
          )}
        </div>

        {/* RIGHT: Dynamic stats + wallet chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Dynamic stat badges — only when connected */}
          {account && policyCount !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                title="Policies"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'var(--purple-dim)',
                  border: '1px solid var(--border)',
                  borderRadius: 100,
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--purple)',
                }}
              >
                <Shield size={12} />
                {policyCount} {isAdmin ? 'Policies' : 'My Policies'}
              </div>

              {isAdmin && claimCount !== null && (
                <div
                  title="Claims"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'var(--warning-dim)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: 100,
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--warning)',
                  }}
                >
                  <ClipboardList size={12} />
                  {claimCount} Claims
                </div>
              )}
            </div>
          )}

          {/* Wallet address chip */}
          {account && (
            <div className="wallet-chip">
              <Wallet size={13} />
              {account.slice(0, 6)}…{account.slice(-4)}
            </div>
          )}
        </div>
      </div>

      {/* ── Nav tabs — only when connected ── */}
      {account && (
        <nav
          style={{
            display: 'flex',
            gap: 0,
            padding: '0 28px',
            borderTop: '1px solid var(--border-light)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-tab ${location.pathname === to ? 'active' : ''}`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
