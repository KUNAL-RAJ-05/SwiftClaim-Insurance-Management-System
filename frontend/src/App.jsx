import React from 'react';
import { useWeb3 } from './context/Web3Context';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import { Shield } from 'lucide-react';

// User Pages
import UserDashboard    from './pages/user/UserDashboard';
import PolicyMarketplace from './pages/user/PolicyMarketplace';
import MyPolicies       from './pages/user/MyPolicies';
import SubmitClaim      from './pages/user/SubmitClaim';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ClaimsPanel    from './pages/admin/ClaimsPanel';
import PolicyEditor   from './pages/admin/PolicyEditor';

function App() {
  const { account, isAdmin, isConnecting, isAutoConnecting, networkError, connectWallet } = useWeb3();

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        {/* Network error banner */}
        {networkError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--danger-dim)',
              border: '1px solid rgba(239,68,68,0.25)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              marginBottom: '20px',
              fontSize: '0.9rem',
            }}
          >
            <span style={{ fontWeight: 700 }}>Network Error:</span> {networkError}
          </div>
        )}

        {/* Restoring session */}
        {isAutoConnecting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '160px', gap: '16px' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Restoring session…</p>
          </div>

        ) : !account && !networkError ? (
          /* ─── Landing / Connect Wallet ─── */
          <div style={{ textAlign: 'center', marginTop: '80px', maxWidth: '480px', margin: '80px auto 0' }}>
            {/* Hero icon */}
            <div
              style={{
                width: 88,
                height: 88,
                background: 'linear-gradient(135deg, var(--purple), var(--indigo))',
                borderRadius: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 28px',
                boxShadow: '0 12px 32px rgba(124,58,237,0.35)',
              }}
            >
              <Shield size={44} color="#fff" />
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
              Welcome to{' '}
              <span className="gradient-text">SwiftClaim</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '36px', lineHeight: 1.7 }}>
              Decentralized, trustless insurance — buy policies and file claims
              secured by smart contracts.
            </p>

            <button
              className="btn btn-primary btn-lg"
              onClick={connectWallet}
              disabled={isConnecting}
              style={{ width: '100%', maxWidth: '320px' }}
            >
              {isConnecting ? 'Connecting…' : '🔗 Connect Wallet to Start'}
            </button>

            {/* Feature chips */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '32px', flexWrap: 'wrap' }}>
              {['Trustless', 'Transparent', 'Instant Payout', 'IPFS Proofs'].map(f => (
                <span key={f} className="pill" style={{ background: 'var(--purple-dim)', color: 'var(--purple)' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

        ) : !networkError ? (
          <Routes>
            <Route path="/" element={<Navigate to={isAdmin ? '/admin-dashboard' : '/user-dashboard'} />} />

            {!isAdmin && (
              <>
                <Route path="/user-dashboard"  element={<UserDashboard />} />
                <Route path="/marketplace"     element={<PolicyMarketplace />} />
                <Route path="/my-policies"     element={<MyPolicies />} />
                <Route path="/submit-claim"    element={<SubmitClaim />} />
              </>
            )}

            {isAdmin && (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/claims"          element={<ClaimsPanel />} />
                <Route path="/policies"        element={<PolicyEditor />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : null}
      </main>
    </div>
  );
}

export default App;
