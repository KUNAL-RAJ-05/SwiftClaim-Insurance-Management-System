import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';
import { PlusCircle } from 'lucide-react';

const PolicyEditor = () => {
  const { contract } = useWeb3();
  const [formData, setFormData] = useState({
    policyType: '',
    premium: '',
    coverageAmount: '',
    expiryDays: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.policyType || !formData.premium || !formData.coverageAmount || !formData.expiryDays || !formData.description) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const premiumWei = ethers.parseEther(formData.premium);
      const coverageWei = ethers.parseEther(formData.coverageAmount);
      const durationSeconds = parseInt(formData.expiryDays) * 24 * 60 * 60;

      const tx = await contract.addPolicyTemplate(
        formData.policyType,
        premiumWei,
        coverageWei,
        durationSeconds,
        formData.description
      );
      
      await tx.wait();
      alert("Policy template added successfully!");
      setFormData({ policyType: '', premium: '', coverageAmount: '', expiryDays: '', description: '' });
    } catch (error) {
      console.error("Error adding policy", error);
      alert("Failed to add policy template.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '8px' }}>Policy <span className="gradient-text">Editor</span></h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Create new insurance products for the marketplace.</p>

      <form className="glass-panel" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Policy Type Title</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. Premium Health Cover" 
            value={formData.policyType}
            onChange={e => setFormData({...formData, policyType: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2" style={{ gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Premium (ETH)</label>
            <input 
              type="number" 
              step="0.0001"
              className="form-control" 
              placeholder="0.01" 
              value={formData.premium}
              onChange={e => setFormData({...formData, premium: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Coverage Amount (ETH)</label>
            <input 
              type="number" 
              step="0.0001"
              className="form-control" 
              placeholder="0.1" 
              value={formData.coverageAmount}
              onChange={e => setFormData({...formData, coverageAmount: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Expiry Duration (Days)</label>
          <input 
            type="number" 
            className="form-control" 
            placeholder="365" 
            value={formData.expiryDays}
            onChange={e => setFormData({...formData, expiryDays: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Policy Description</label>
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Describe what this policy covers..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '16px' }}
          disabled={submitting}
        >
          {submitting ? 'Creating On-Chain...' : <><PlusCircle size={18} /> Add Policy Template</>}
        </button>
      </form>
    </div>
  );
};

export default PolicyEditor;
