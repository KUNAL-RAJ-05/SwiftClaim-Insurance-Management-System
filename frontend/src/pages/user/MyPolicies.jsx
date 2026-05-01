import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Shield, ShieldOff } from 'lucide-react';
import { ethers } from 'ethers';

const MyPolicies = () => {
  const { contract, account } = useWeb3();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPolicies = async () => {
      if (contract && account) {
        try {
          const policyIds = await contract.getUserPolicies(account);
          const fetchedPolicies = [];
          for (let i = 0; i < policyIds.length; i++) {
            const id = policyIds[i];
            const p = await contract.userPolicies(id);
            const template = await contract.policyTemplates(p.templateId);
            fetchedPolicies.push({ 
              id: p.id,
              templateId: p.templateId,
              policyholder: p.policyholder,
              startTime: p.startTime,
              expiryTime: p.expiryTime,
              isActive: p.isActive,
              template 
            });
          }
          setPolicies(fetchedPolicies);
        } catch (error) {
          console.error("Error fetching my policies", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMyPolicies();
  }, [contract, account]);

  if (loading) return <div className="animate-fade-in">Loading policies...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '8px' }}>My <span className="gradient-text">Policies</span></h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Manage your active and expired insurance coverage.</p>

      {policies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>You don't own any policies yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {policies.map((p) => {
            const now = Math.floor(Date.now() / 1000);
            const isExpired = now > Number(p.expiryTime);
            const isActive = p.isActive && !isExpired;

            return (
              <div key={p.id.toString()} className="glass-panel" style={{ borderLeft: `4px solid ${isActive ? 'var(--neon-green)' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}>{p.template.policyType}</h3>
                  {isActive ? <Shield color="var(--neon-green)" /> : <ShieldOff color="var(--danger)" />}
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                    {isActive ? 'ACTIVE' : (isExpired ? 'EXPIRED' : 'CONSUMED')}
                  </span>
                  <span className="badge badge-outline">ID: #{p.id.toString()}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Coverage</div>
                    <strong style={{ color: '#fff' }}>{ethers.formatEther(p.template.coverageAmount)} ETH</strong>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Expires On</div>
                    <strong style={{ color: '#fff' }}>{new Date(Number(p.expiryTime) * 1000).toLocaleDateString()}</strong>
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
