import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { Shield, ShieldAlert, FileText, Upload, PlusCircle, User, LogOut } from 'lucide-react';

const Header = () => {
  const { account, isAdmin, connectWallet, isConnecting } = useWeb3();
  const location = useLocation();

  if (!account) return (
    <header className="header">
      <div className="logo">
        <Shield color="var(--neon-green)" size={28} />
        <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, marginLeft: '8px' }}>SwiftClaim</span>
      </div>
    </header>
  );

  return (
    <header className="header" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px 24px', boxSizing: 'border-box' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Shield color="var(--neon-green)" size={28} />
          <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, marginLeft: '8px' }}>SwiftClaim</span>
          <span className={`badge ${isAdmin ? 'badge-danger' : 'badge-primary'}`} style={{ marginLeft: '12px' }}>
            {isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="badge badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} />
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        </div>
      </div>
      
      <div className="tabs" style={{ width: '100%', padding: '0 24px', margin: 0, boxSizing: 'border-box' }}>
        {isAdmin ? (
          <>
            <Link to="/admin-dashboard" className={`tab ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} /> Dashboard
              </div>
            </Link>
            <Link to="/claims" className={`tab ${location.pathname === '/claims' ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> Manage Claims
              </div>
            </Link>
            <Link to="/policies" className={`tab ${location.pathname === '/policies' ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={18} /> Policy Editor
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/user-dashboard" className={`tab ${location.pathname === '/user-dashboard' ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> Dashboard
              </div>
            </Link>
            <Link to="/marketplace" className={`tab ${location.pathname === '/marketplace' ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} /> Marketplace
              </div>
            </Link>
            <Link to="/my-policies" className={`tab ${location.pathname === '/my-policies' ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> My Policies
              </div>
            </Link>
            <Link to="/submit-claim" className={`tab ${location.pathname === '/submit-claim' ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} /> Submit Claim
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
