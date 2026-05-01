import { useState } from 'react'
import { ethers } from 'ethers'

export default function ClaimSubmission({ account, signer, contractAddress }) {
  const [policyId, setPolicyId] = useState('')
  const [evidence, setEvidence] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!signer || !policyId || !evidence) return
    
    setIsSubmitting(true)
    setSuccess(false)
    
    try {
      // Basic ABI for filing a claim
      const abi = ["function fileClaim(uint256 _policyId, string memory _evidence) external"]
      const contract = new ethers.Contract(contractAddress, abi, signer)
      
      const tx = await contract.fileClaim(policyId, evidence)
      await tx.wait()
      
      setSuccess(true)
      setPolicyId('')
      setEvidence('')
    } catch (error) {
      console.error("Claim submission failed:", error)
      alert("Submission failed. Ensure the Policy ID belongs to you and is active.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-panel">
      <h2 className="gradient-text">File a Claim</h2>
      <p style={{ marginBottom: '24px' }}>
        Submit an instant claim request. Our decentralized oracle network will verify your evidence automatically.
      </p>

      {success && (
        <div className="badge badge-success" style={{ display: 'block', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
          Claim submitted successfully! Pending verification.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="policyId">Policy ID</label>
          <input 
            type="number" 
            id="policyId" 
            className="input-field" 
            placeholder="e.g. 1" 
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            disabled={!account || isSubmitting}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="evidence">Evidence Hash / Report URL</label>
          <input 
            type="text" 
            id="evidence" 
            className="input-field" 
            placeholder="ipfs://... or https://..." 
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            disabled={!account || isSubmitting}
            required
          />
        </div>

        <button 
          type="submit"
          className="btn btn-outline" 
          style={{ width: '100%', marginTop: '8px' }}
          disabled={!account || isSubmitting || !policyId || !evidence}
        >
          {isSubmitting ? 'Submitting to Ledger...' : 'Submit Claim'}
        </button>
      </form>
      
      {!account && (
        <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '16px', color: 'var(--danger)' }}>
          Connect wallet to file a claim
        </p>
      )}
    </div>
  )
}
