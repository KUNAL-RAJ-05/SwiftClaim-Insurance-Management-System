import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ShoppingBag, Shield, Clock, Zap } from 'lucide-react';
import { ethers } from 'ethers';

const PolicyMarketplace = () => {
  const { contract } = useWeb3();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (contract) {
        setLoading(true);
        try {
          const countBigInt = await contract.policyTemplateCount();
          const count = Number(countBigInt);
          const fetched = [];
          for (let i = 1; i <= count; i++) {
            const temp = await contract.policyTemplates(i);
            if (temp.isActive) fetched.push(temp);
          }
          setTemplates(fetched);
        } catch (error) {
          console.error('Error fetching templates:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTemplates();
  }, [contract]);

  const handleBuy = async (template) => {
    try {
      setBuyingId(template.id.toString());
      const tx = await contract.buyPolicy(template.id, { value: template.premium });
      await tx.wait();
      alert('Policy purchased successfully!');
    } catch (error) {
      console.error('Purchase error', error);
      alert('Failed to purchase policy.');
    } finally {
      setBuyingId(null);
    }
  };

  const categoryIcons = {
    'Car': '🚗',
    'Health': '🏥',
    'Home': '🏠',
    'Travel': '✈️',
    'Bike': '🚲',
  };

  const getIcon = (type = '') => {
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (type.toLowerCase().includes(key.toLowerCase())) return icon;
    }
    return '🛡️';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px', gap: '14px' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading marketplace…</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>
          Policy <span className="gradient-text">Marketplace</span>
        </h2>
        <p>Browse and purchase decentralised insurance coverage on-chain.</p>
      </div>

      {templates.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <ShoppingBag size={32} />
          </div>
          <h3>No Active Policies</h3>
          <p>The admin hasn't published any policy templates yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.id.toString()}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
            >
              {/* Card top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div
                  style={{
                    width: 48, height: 48,
                    background: 'var(--purple-dim)',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {getIcon(t.policyType)}
                </div>
                <span className="badge badge-primary">Active</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{t.policyType}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', flex: 1 }}>
                {t.description}
              </p>

              {/* Info rows */}
              <div
                style={{
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  marginBottom: '18px',
                }}
              >
                <div className="info-row">
                  <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={13} /> Premium
                  </span>
                  <span className="value text-purple">
                    {ethers.formatEther(t.premium)} ETH
                  </span>
                </div>
                <div className="info-row">
                  <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={13} /> Coverage
                  </span>
                  <span className="value">{ethers.formatEther(t.coverageAmount)} ETH</span>
                </div>
                <div className="info-row">
                  <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} /> Duration
                  </span>
                  <span className="value">{Number(t.expiryDuration) / (60 * 60 * 24)} Days</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => handleBuy(t)}
                disabled={buyingId === t.id.toString()}
              >
                {buyingId === t.id.toString() ? 'Processing…' : 'Buy Policy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyMarketplace;
