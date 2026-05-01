import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Shield, Clock, DollarSign } from 'lucide-react';
import { ethers } from 'ethers';

const PolicyMarketplace = () => {
  const { contract, account } = useWeb3();
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
          
          const fetchedTemplates = [];
          for (let i = 1; i <= count; i++) {
            const temp = await contract.policyTemplates(i);
            if (temp.isActive) {
              fetchedTemplates.push(temp);
            }
          }
          setTemplates(fetchedTemplates);
        } catch (error) {
          console.error("Error fetching templates:", error);
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
      alert("Policy purchased successfully!");
    } catch (error) {
      console.error("Purchase error", error);
      alert("Failed to purchase policy.");
    } finally {
      setBuyingId(null);
    }
  };

  if (loading) return <div className="animate-fade-in">Loading marketplace...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '8px' }}>Policy <span className="gradient-text">Marketplace</span></h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Browse and purchase decentralized insurance coverage.</p>
      
      {templates.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No active policy templates found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {templates.map((t) => (
            <div key={t.id.toString()} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{t.policyType}</h3>
                <Shield size={24} color="var(--neon-green)" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', flex: 1 }}>{t.description}</p>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Premium:</span>
                  <strong style={{ color: 'var(--neon-green)' }}>{ethers.formatEther(t.premium)} ETH</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Coverage:</span>
                  <strong>{ethers.formatEther(t.coverageAmount)} ETH</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Duration:</span>
                  <strong>{Number(t.expiryDuration) / (60 * 60 * 24)} Days</strong>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => handleBuy(t)}
                disabled={buyingId === t.id.toString()}
              >
                {buyingId === t.id.toString() ? 'Processing...' : 'Buy Policy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyMarketplace;
