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
          /* ─── Sign In / Sign Up Page ─── */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 160px)',
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '48px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)'
            }}>
              {/* Hero icon */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, var(--purple), var(--indigo))',
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 12px 32px rgba(124,58,237,0.35)',
                }}
              >
                <Shield size={40} color="#fff" />
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
                Welcome to <span className="gradient-text">SwiftClaim</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.6 }}>
                Sign in or create an account using your Web3 wallet. No password required.
              </p>

              <button
                className="btn btn-primary btn-lg"
                onClick={connectWallet}
                disabled={isConnecting}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                {isConnecting ? (
                  'Connecting...'
                ) : (
                  <>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" style={{ width: 24, height: 24 }} />
                    Sign In / Sign Up with MetaMask
                  </>
                )}
              </button>

              <div style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                By connecting, you agree to our Terms of Service and Privacy Policy.
              </div>
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
