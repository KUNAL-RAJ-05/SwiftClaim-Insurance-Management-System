import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Activity, Shield, AlertTriangle } from 'lucide-react';
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
          // Simplified stats fetch: in a real app, we'd query all claims or use a subgraph
          setStats({ activePolicies: policies.length, claims: 0 }); // Hardcoded claims for now without subgraph
        } catch (error) {
          console.error("Error fetching user stats", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, [contract, account]);

  if (loading) return <div className="animate-fade-in">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Welcome back, <span className="gradient-text">Policyholder</span></h2>
      
      <div className="grid grid-cols-2" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--neon-green-dim)', padding: '16px', borderRadius: '50%' }}>
            <Shield color="var(--neon-green)" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.activePolicies}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Active Policies</p>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(255, 204, 0, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Activity color="var(--warning)" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.claims}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Submitted Claims</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={20} color="var(--neon-green)" /> Need Coverage?</h3>
          <p style={{ color: 'var(--text-muted)' }}>Explore our decentralized insurance policies and protect your digital assets instantly.</p>
          <Link to="/marketplace" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Policies</Link>
        </div>
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="var(--neon-green)" /> File a Claim</h3>
          <p style={{ color: 'var(--text-muted)' }}>Experience a frictionless, transparent claims process secured by smart contracts.</p>
          <Link to="/submit-claim" className="btn btn-outline" style={{ marginTop: '16px', border: '1px solid var(--text-muted)' }}>Start Claim Process</Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
