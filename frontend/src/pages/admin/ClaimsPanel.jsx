import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { CheckCircle, XCircle, DollarSign, ExternalLink, ClipboardList } from 'lucide-react';

const STATUS_TABS = [
  { label: 'Pending',       status: 0 },
  { label: 'Verified',      status: 1 },
  { label: 'Payout Pending',status: 3 },
  { label: 'Rejected',      status: 2 },
];

const ClaimsPanel = () => {
  const { contract } = useWeb3();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const fetchClaims = async () => {
    setLoading(true);
    if (contract) {
      try {
        const count = await contract.claimCount();
        const fetched = [];
        for (let i = 1; i <= count; i++) {
          const c = await contract.claims(i);
          fetched.push(c);
        }
        setClaims(fetched.reverse());
      } catch (error) {
        console.error('Error fetching claims', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => { fetchClaims(); }, [contract]);

  const handleAction = async (actionFn, claimId) => {
    try {
      const tx = await actionFn(claimId);
      await tx.wait();
      alert('Action successful!');
      fetchClaims();
    } catch (error) {
      console.error('Action failed', error);
      alert(error.reason || 'Transaction failed');
    }
  };

  const filteredClaims = claims.filter(c => Number(c.status) === activeTab);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Manage <span className="gradient-text">Claims</span></h2>
        <p>Review and process user insurance claims.</p>
      </div>

      {/* ── Filter Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '6px',
          width: 'fit-content',
        }}
      >
        {STATUS_TABS.map(({ label, status }) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              fontSize: '0.85rem',
              fontWeight: activeTab === status ? 700 : 500,
              background: activeTab === status ? 'linear-gradient(135deg, var(--purple), var(--indigo))' : 'transparent',
              color: activeTab === status ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', gap: '14px' }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)' }}>Loading claims…</p>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <ClipboardList size={32} />
          </div>
          <h3>No Claims Here</h3>
          <p>There are no claims in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {filteredClaims.map(c => (
            <div
              key={c.id.toString()}
              className="card"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}
            >
              {/* Left: info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Claim #{c.id.toString()}</h3>
                  <span className="badge badge-outline">{c.claimType}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '6px' }}>
                  Policy ID: #{c.userPolicyId.toString()} &nbsp;·&nbsp; Claimant: {c.claimant.slice(0, 6)}…{c.claimant.slice(-4)}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {c.description}
                </p>
                {c.metadataURI && c.metadataURI !== 'none' && (
                  <a
                    href={c.metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--purple)' }}
                  >
                    <ExternalLink size={13} /> View Evidence
                  </a>
                )}
              </div>

              {/* Right: actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                {activeTab === 0 && (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAction(contract.verifyClaim, c.id)}>
                      <CheckCircle size={14} /> Verify
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleAction(contract.rejectClaim, c.id)}>
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    <button className="btn btn-warning btn-sm" onClick={() => handleAction(contract.approvePayout, c.id)}>
                      <DollarSign size={14} /> Approve Payout
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleAction(contract.rejectClaim, c.id)}>
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {activeTab === 3 && (
                  <button
                    className="btn btn-sm"
                    style={{ background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)' }}
                    onClick={() => handleAction(contract.releasePayout, c.id)}
                  >
                    <DollarSign size={14} /> Release Funds
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
