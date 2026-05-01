import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useWeb3 } from './context/Web3Context';
import Header from './components/common/Header';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import PolicyMarketplace from './pages/user/PolicyMarketplace';
import MyPolicies from './pages/user/MyPolicies';
import SubmitClaim from './pages/user/SubmitClaim';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ClaimsPanel from './pages/admin/ClaimsPanel';
import PolicyEditor from './pages/admin/PolicyEditor';

function App() {
  const { account, isAdmin, isConnecting, isAutoConnecting, networkError, connectWallet } = useWeb3();
  const navigate = useNavigate();

  // Initial routing is handled by the <Navigate> component in the Routes below.

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {networkError && (
          <div style={{ textAlign: 'center', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid var(--danger)', padding: '16px', borderRadius: '8px', color: 'var(--danger)', marginBottom: '20px' }}>
            <strong>Network Error:</strong> {networkError}
          </div>
        )}
        {isAutoConnecting ? (
          <div style={{ textAlign: 'center', marginTop: '150px' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid var(--border)', borderTop: '3px solid var(--neon-green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Restoring session...</p>
          </div>
        ) : !account && !networkError ? (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to SwiftClaim</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '40px' }}>Decentralized, trustless, and swift insurance policies.</p>
            <button className="btn btn-primary" onClick={connectWallet} disabled={isConnecting} style={{ fontSize: '1.2rem', padding: '15px 40px' }}>
              {isConnecting ? 'Connecting...' : 'Connect Wallet to Start'}
            </button>
          </div>
        ) : !networkError ? (
          <Routes>
            {/* Base */}
            <Route path="/" element={<Navigate to={isAdmin ? "/admin-dashboard" : "/user-dashboard"} />} />
            
            {/* User Routes */}
            {!isAdmin && (
              <>
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/marketplace" element={<PolicyMarketplace />} />
                <Route path="/my-policies" element={<MyPolicies />} />
                <Route path="/submit-claim" element={<SubmitClaim />} />
              </>
            )}

            {/* Admin Routes */}
            {isAdmin && (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/claims" element={<ClaimsPanel />} />
                <Route path="/policies" element={<PolicyEditor />} />
              </>
            )}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : null}
      </main>
    </div>
  );
}

export default App;
