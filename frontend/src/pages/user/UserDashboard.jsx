import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { contract, account } = useWeb3();
  const [stats, setStats] = useState({ activePolicies: 0, claims: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (contract && account) {
        try {
          const policies = await contract.getUserPolicies(account);
          setStats({ activePolicies: policies.length, claims: 0 });
        } catch (error) {
          console.error('Error fetching user stats', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, [contract, account]);

  const shortAddr = account
    ? `${account.slice(0, 6)}…${account.slice(-4)}`
    : '';

  return (
    <div className="animate-fade-in">
      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Hello,
        </p>
        <h1 style={{ marginBottom: '4px' }}>Policyholder 👋</h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '28px' }}>
          {shortAddr}
        </p>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '14px 20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Active Policies</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {loading ? '—' : stats.activePolicies}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '14px 20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Claims Filed</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {loading ? '—' : stats.claims}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <p className="section-title">Quick Actions</p>
      <div className="grid grid-cols-2" style={{ marginBottom: '32px' }}>
        {/* Browse Policies */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="icon-box icon-box-purple">
            <Shield size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>Need Coverage?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Browse our decentralised insurance policies and protect your assets instantly.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
          >
            Browse Policies <ArrowRight size={15} />
          </Link>
        </div>

        {/* Submit Claim */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="icon-box icon-box-warning">
            <AlertCircle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>File a Claim</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Transparent, frictionless claims process fully secured by smart contracts.
            </p>
          </div>
          <Link
            to="/submit-claim"
            className="btn btn-secondary"
            style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
          >
            Start Claim <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
