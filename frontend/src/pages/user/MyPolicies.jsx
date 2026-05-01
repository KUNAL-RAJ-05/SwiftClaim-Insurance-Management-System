import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { FileText, Shield, ShieldOff } from 'lucide-react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const MyPolicies = () => {
  const { contract, account } = useWeb3();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPolicies = async () => {
      if (contract && account) {
        try {
          const policyIds = await contract.getUserPolicies(account);
          const fetched = [];
          for (let i = 0; i < policyIds.length; i++) {
            const p = await contract.userPolicies(policyIds[i]);
            const template = await contract.policyTemplates(p.templateId);
            fetched.push({
              id: p.id,
              templateId: p.templateId,
              policyholder: p.policyholder,
              startTime: p.startTime,
              expiryTime: p.expiryTime,
              isActive: p.isActive,
              template,
            });
          }
          setPolicies(fetched);
        } catch (error) {
          console.error('Error fetching my policies', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMyPolicies();
  }, [contract, account]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px', gap: '14px' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading your policies…</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>
          My <span className="gradient-text">Policies</span>
        </h2>
        <p>Manage your active and expired insurance coverage.</p>
      </div>

      {policies.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <FileText size={32} />
          </div>
          <h3>No Policies Yet</h3>
          <p>You don't own any policies yet. Head over to the Marketplace to get covered.</p>
          <Link to="/marketplace" className="btn btn-primary">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {policies.map((p) => {
            const now = Math.floor(Date.now() / 1000);
            const isExpired = now > Number(p.expiryTime);
            const isActive = p.isActive && !isExpired;
            const statusLabel = isActive ? 'Active' : isExpired ? 'Expired' : 'Consumed';
            const expiryDate = new Date(Number(p.expiryTime) * 1000).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={p.id.toString()}
                className={`card ${isActive ? 'policy-card-active' : 'policy-card-inactive'}`}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      className="icon-box"
                      style={{
                        background: isActive ? 'var(--success-dim)' : 'var(--danger-dim)',
                        color: isActive ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {isActive ? <Shield size={20} /> : <ShieldOff size={20} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>
                        {p.template.policyType}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID #{p.id.toString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      isActive ? 'badge-success' : 'badge-danger'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* Info rows */}
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                  <div className="info-row">
                    <span className="label">Coverage</span>
                    <span className="value">{ethers.formatEther(p.template.coverageAmount)} ETH</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Expires On</span>
                    <span
                      className="value"
                      style={{ color: isActive ? 'var(--text-primary)' : 'var(--danger)' }}
                    >
                      {expiryDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
