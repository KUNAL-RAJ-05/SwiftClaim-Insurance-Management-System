import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { uploadToIPFS } from '../../utils/ipfs';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmitClaim = () => {
  const { contract, account } = useWeb3();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    policyId: '',
    claimType: '',
    incidentDate: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchActivePolicies = async () => {
      if (contract && account) {
        try {
          const policyIds = await contract.getUserPolicies(account);
          const activePol = [];
          const now = Math.floor(Date.now() / 1000);
          for (let i = 0; i < policyIds.length; i++) {
            const p = await contract.userPolicies(policyIds[i]);
            if (p.isActive && now <= Number(p.expiryTime)) {
              const template = await contract.policyTemplates(p.templateId);
              activePol.push({
                id: p.id,
                templateId: p.templateId,
                policyholder: p.policyholder,
                startTime: p.startTime,
                expiryTime: p.expiryTime,
                isActive: p.isActive,
                template,
              });
            }
          }
          setPolicies(activePol);
          if (activePol.length > 0)
            setFormData((f) => ({ ...f, policyId: activePol[0].id.toString() }));
        } catch (error) {
          console.error('Error fetching policies', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchActivePolicies();
  }, [contract, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.policyId ||
      !formData.claimType ||
      !formData.incidentDate ||
      !formData.description
    ) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      let metadataURI = 'none';
      if (file) {
        try {
          metadataURI = await uploadToIPFS(file);
        } catch (err) {
          console.error('IPFS Upload failed', err);
          alert('IPFS upload failed. Proceeding without file.');
        }
      }

      const timestamp = Math.floor(new Date(formData.incidentDate).getTime() / 1000);
      const tx = await contract.submitClaim(
        formData.policyId,
        formData.claimType,
        timestamp,
        formData.description,
        metadataURI
      );
      await tx.wait();
      alert('Claim submitted successfully!');
      setFormData({ ...formData, description: '', claimType: '', incidentDate: '' });
      setFile(null);
    } catch (error) {
      console.error('Claim submission error', error);
      alert(error.reason || 'Failed to submit claim. Check cooldown or policy status.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '80px', gap: '14px' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading your policies…</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '580px', margin: '0 auto' }}>
      <div className="page-header">
        <h2>
          Submit <span className="gradient-text">Claim</span>
        </h2>
        <p>File a new insurance claim secured on the blockchain.</p>
      </div>

      {policies.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <AlertCircle size={32} />
          </div>
          <h3>No Eligible Policies</h3>
          <p>
            You don't have any active policies to claim against. Purchase a policy
            first.
          </p>
          <Link to="/marketplace" className="btn btn-primary">
            Go to Marketplace
          </Link>
        </div>
      ) : (
        <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* Select Policy */}
          <div className="form-group">
            <label className="form-label">Select Policy</label>
            <select
              className="form-control"
              value={formData.policyId}
              onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
            >
              {policies.map((p) => (
                <option key={p.id.toString()} value={p.id.toString()}>
                  #{p.id.toString()} — {p.template.policyType}
                </option>
              ))}
            </select>
          </div>

          {/* Claim Type */}
          <div className="form-group">
            <label className="form-label">Claim Type</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Car Accident, Hospitalisation"
              value={formData.claimType}
              onChange={(e) => setFormData({ ...formData, claimType: e.target.value })}
            />
          </div>

          {/* Incident Date */}
          <div className="form-group">
            <label className="form-label">Incident Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.incidentDate}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description of Incident</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe what happened in detail…"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Evidence */}
          <div className="form-group">
            <label className="form-label">
              Evidence / Proof{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                (optional — uploaded to IPFS)
              </span>
            </label>
            {/* Custom file input */}
            <label
              htmlFor="evidence-file"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg)',
                border: '1.5px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
              }}
            >
              {file ? (
                <>
                  <FileCheck size={18} color="var(--success)" />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{file.name}</span>
                </>
              ) : (
                <>
                  <Upload size={18} color="var(--purple)" />
                  Click to upload file
                </>
              )}
            </label>
            <input
              id="evidence-file"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting to Blockchain…' : '🚀 Submit Claim'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitClaim;
