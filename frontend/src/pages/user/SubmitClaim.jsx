import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { uploadToIPFS } from '../../utils/ipfs';

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
                template 
              });
            }
          }
          setPolicies(activePol);
          if (activePol.length > 0) setFormData(f => ({ ...f, policyId: activePol[0].id.toString() }));
        } catch (error) {
          console.error("Error fetching policies", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchActivePolicies();
  }, [contract, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.policyId || !formData.claimType || !formData.incidentDate || !formData.description) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      let metadataURI = "none";
      if (file) {
        try {
          metadataURI = await uploadToIPFS(file);
        } catch (err) {
          console.error("IPFS Upload failed", err);
          alert("IPFS upload failed. Proceeding without file or check your Pinata keys.");
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
      alert("Claim submitted successfully!");
      setFormData({ ...formData, description: '', claimType: '' });
      setFile(null);
    } catch (error) {
      console.error("Claim submission error", error);
      alert(error.reason || "Failed to submit claim. Check cooldown or policy status.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-fade-in">Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '8px' }}>Submit <span className="gradient-text">Claim</span></h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>File a new insurance claim on the blockchain.</p>

      {policies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--warning)' }}>You do not have any active policies eligible for a claim.</p>
        </div>
      ) : (
        <form className="glass-panel" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Policy</label>
            <select 
              className="form-control" 
              value={formData.policyId} 
              onChange={e => setFormData({...formData, policyId: e.target.value})}
            >
              {policies.map(p => (
                <option key={p.id.toString()} value={p.id.toString()}>
                  ID #{p.id.toString()} - {p.template.policyType}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Claim Type</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Car Accident, Hospitalization" 
              value={formData.claimType}
              onChange={e => setFormData({...formData, claimType: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Incident Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={formData.incidentDate}
              onChange={e => setFormData({...formData, incidentDate: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description of Incident</label>
            <textarea 
              className="form-control" 
              rows="4" 
              placeholder="Describe what happened in detail..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Evidence / Proof (Optional, uploaded to IPFS)</label>
            <input 
              type="file" 
              className="form-control" 
              style={{ padding: '8px' }}
              onChange={e => setFile(e.target.files[0])}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting to Blockchain...' : 'Submit Claim'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitClaim;
