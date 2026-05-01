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
    platformBalance: '0',
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (contract && provider) {
        try {
          const userPolCount  = await contract.userPolicyCount();
          const claimCount    = await contract.claimCount();
          const payouts       = await contract.totalPayouts();
          const address       = await contract.getAddress();
          const balance       = await provider.getBalance(address);

          setStats({
            totalPolicies:   Number(userPolCount),
            totalClaims:     Number(claimCount),
            totalPayouts:    ethers.formatEther(payouts),
            platformBalance: ethers.formatEther(balance),
          });

          const templateCount = await contract.policyTemplateCount();
          const fetched = [];
          for (let i = 1; i <= templateCount; i++) {
            const temp = await contract.policyTemplates(i);
            if (temp.isActive) fetched.push(temp);
          }
          setTemplates(fetched);
        } catch (error) {
          console.error('Error fetching admin data', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAdminData();
  }, [contract, provider]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px', gap: '14px' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading admin data…</p>
      </div>
    );
  }

  const statItems = [
    { icon: <ShieldAlert size={22} />, value: stats.totalPolicies,   label: 'Policies Sold',        color: 'purple'  },
    { icon: <Users size={22} />,       value: stats.totalClaims,     label: 'Total Claims',         color: 'warning' },
    { icon: <Database size={22} />,    value: stats.totalPayouts,    label: 'ETH Paid Out',         color: 'danger'  },
    { icon: <DollarSign size={22} />,  value: stats.platformBalance, label: 'Contract ETH Balance', color: 'success' },
  ];

  const colorMap = {
    purple:  'icon-box-purple',
    warning: 'icon-box-warning',
    danger:  'icon-box-danger',
    success: 'icon-box-success',
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Admin <span className="gradient-text">Overview</span></h2>
        <p>Platform statistics and active policy templates.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4" style={{ marginBottom: '32px' }}>
        {statItems.map(({ icon, value, label, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div className={`icon-box ${colorMap[color]}`} style={{ margin: '0 auto 14px' }}>
              {icon}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>
              {value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Active Templates ── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Active Policy Templates</h3>
          <span className="badge badge-primary">{templates.length} Active</span>
        </div>

        {templates.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No active templates yet. Go to Policy Editor to add one.
          </p>
        ) : (
          <div className="grid grid-cols-3">
            {templates.map((t) => (
              <div
                key={t.id.toString()}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                {/* Title row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {t.policyType}
                  </h4>
                  <div className="icon-box icon-box-purple" style={{ width: 32, height: 32, borderRadius: '8px' }}>
                    <Shield size={15} />
                  </div>
                </div>

                {/* Info rows */}
                <div className="info-row">
                  <span className="label">Premium</span>
                  <span className="value text-purple">{ethers.formatEther(t.premium)} ETH</span>
                </div>
                <div className="info-row">
                  <span className="label">Coverage</span>
                  <span className="value">{ethers.formatEther(t.coverageAmount)} ETH</span>
                </div>
                <div className="info-row">
                  <span className="label">Duration</span>
                  <span className="value">{Number(t.expiryDuration) / (60 * 60 * 24)} Days</span>
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
