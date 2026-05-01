import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ShieldAlert, Users, Database, DollarSign, Shield } from 'lucide-react';
import { ethers } from 'ethers';

const AdminDashboard = () => {
  const { contract, provider } = useWeb3();
  const [stats, setStats] = useState({
    totalPolicies: 0,
    totalClaims: 0,
    totalPayouts: '0',
    platformBalance: '0'
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (contract && provider) {
        try {
          const userPolCount = await contract.userPolicyCount();
          const claimCount = await contract.claimCount();
          const payouts = await contract.totalPayouts();
          const address = await contract.getAddress();
          const balance = await provider.getBalance(address);

          setStats({
            totalPolicies: Number(userPolCount),
            totalClaims: Number(claimCount),
            totalPayouts: ethers.formatEther(payouts),
            platformBalance: ethers.formatEther(balance)
          });

          // Fetch Policy Templates
          const templateCount = await contract.policyTemplateCount();
          const fetchedTemplates = [];
          for (let i = 1; i <= templateCount; i++) {
            const temp = await contract.policyTemplates(i);
            if (temp.isActive) {
              fetchedTemplates.push(temp);
            }
          }
          setTemplates(fetchedTemplates);

        } catch (error) {
          console.error("Error fetching admin data", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAdminData();
  }, [contract, provider]);

  if (loading) return <div className="animate-fade-in">Loading admin data...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Admin <span className="gradient-text">Overview</span></h2>
      
      <div className="grid grid-cols-4" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <ShieldAlert color="var(--neon-green)" size={32} style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalPolicies}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Policies Sold</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Users color="var(--warning)" size={32} style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalClaims}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Claims</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Database color="var(--danger)" size={32} style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalPayouts}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>ETH Paid Out</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', border: '1px solid var(--neon-green)' }}>
          <DollarSign color="var(--neon-green)" size={32} style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--neon-green)' }}>{stats.platformBalance}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Contract ETH Balance</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Active Policy Templates</h3>
          <span className="badge badge-primary">{templates.length} Active</span>
        </div>
        
        {templates.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No active policy templates created yet. Go to Policy Editor to add one.</p>
        ) : (
          <div className="grid grid-cols-3">
            {templates.map((t) => (
              <div key={t.id.toString()} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>{t.policyType}</h4>
                  <Shield size={18} color="var(--neon-green)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Premium:</span>
                  <span style={{ color: 'var(--neon-green)', fontSize: '0.85rem', fontWeight: 600 }}>{ethers.formatEther(t.premium)} ETH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coverage:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ethers.formatEther(t.coverageAmount)} ETH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Duration:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{Number(t.expiryDuration) / (60 * 60 * 24)} Days</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
