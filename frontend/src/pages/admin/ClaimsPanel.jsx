import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { CheckCircle, XCircle, DollarSign, Clock, ExternalLink } from 'lucide-react';

const ClaimsPanel = () => {
  const { contract } = useWeb3();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0: Pending, 1: Verified, 2: Rejected, 3: Payout Pending

  const fetchClaims = async () => {
    setLoading(true);
    if (contract) {
      try {
        const count = await contract.claimCount();
        const fetchedClaims = [];
        for (let i = 1; i <= count; i++) {
          const c = await contract.claims(i);
          fetchedClaims.push(c);
        }
        setClaims(fetchedClaims.reverse()); // Newest first
      } catch (error) {
        console.error("Error fetching claims", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [contract]);

  const handleAction = async (actionFn, claimId) => {
    try {
      const tx = await actionFn(claimId);
      await tx.wait();
      alert("Action successful!");
      fetchClaims();
    } catch (error) {
      console.error("Action failed", error);
      alert(error.reason || "Transaction failed");
    }
  };

  const filteredClaims = claims.filter(c => Number(c.status) === activeTab);

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Manage <span className="gradient-text">Claims</span></h2>

      <div className="tabs">
        <button className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
          Verification Pending
        </button>
        <button className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
          Verified
        </button>
        <button className={`tab ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>
          Payout Pending
        </button>
        <button className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
          Rejected
        </button>
      </div>

      {loading ? (
        <p>Loading claims...</p>
      ) : filteredClaims.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No claims in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {filteredClaims.map(c => (
            <div key={c.id.toString()} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0 }}>Claim #{c.id.toString()}</h3>
                  <span className="badge badge-outline">{c.claimType}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                  Policy ID: #{c.userPolicyId.toString()} | Claimant: {c.claimant.slice(0,6)}...{c.claimant.slice(-4)}
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', marginBottom: '12px' }}>{c.description}</p>
                {c.metadataURI && c.metadataURI !== 'none' && (
                  <a href={c.metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <ExternalLink size={14} /> View Evidence
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeTab === 0 && (
                  <>
                    <button className="btn btn-primary" onClick={() => handleAction(contract.verifyClaim, c.id)}>
                      <CheckCircle size={16} /> Verify
                    </button>
                    <button className="btn btn-danger" onClick={() => handleAction(contract.rejectClaim, c.id)}>
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    <button className="btn btn-warning" onClick={() => handleAction(contract.approvePayout, c.id)}>
                      <DollarSign size={16} /> Approve Payout
                    </button>
                    <button className="btn btn-danger" onClick={() => handleAction(contract.rejectClaim, c.id)}>
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {activeTab === 3 && (
                  <button className="btn btn-success" style={{ background: 'rgba(0, 255, 102, 0.1)', color: 'var(--success)', border: '1px solid var(--success)' }} onClick={() => handleAction(contract.releasePayout, c.id)}>
                    <DollarSign size={16} /> Release Funds
                  </button>
                )}
                {activeTab === 2 && (
                  <span className="badge badge-danger">Rejected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimsPanel;
