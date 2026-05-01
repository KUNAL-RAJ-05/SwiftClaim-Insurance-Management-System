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
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { policyType, premium, coverageAmount, expiryDays, description } = formData;
    if (!policyType || !premium || !coverageAmount || !expiryDays || !description) {
      alert('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      const premiumWei    = ethers.parseEther(premium);
      const coverageWei   = ethers.parseEther(coverageAmount);
      const durationSecs  = parseInt(expiryDays) * 24 * 60 * 60;

      const tx = await contract.addPolicyTemplate(
        policyType,
        premiumWei,
        coverageWei,
        durationSecs,
        description
      );
      await tx.wait();
      alert('Policy template added successfully!');
      setFormData({ policyType: '', premium: '', coverageAmount: '', expiryDays: '', description: '' });
    } catch (error) {
      console.error('Error adding policy', error);
      alert('Failed to add policy template.');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '580px', margin: '0 auto' }}>
      <div className="page-header">
        <h2>Policy <span className="gradient-text">Editor</span></h2>
        <p>Create new insurance products and publish them to the marketplace.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Policy Type Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Premium Health Cover"
            value={formData.policyType}
            onChange={set('policyType')}
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
              onChange={set('premium')}
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
              onChange={set('coverageAmount')}
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
            onChange={set('expiryDays')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Policy Description</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Describe what this policy covers…"
            value={formData.description}
            onChange={set('description')}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '8px' }}
          disabled={submitting}
        >
          {submitting ? 'Creating On-Chain…' : <><PlusCircle size={18} /> Add Policy Template</>}
        </button>
      </form>
    </div>
  );
};

export default PolicyEditor;
