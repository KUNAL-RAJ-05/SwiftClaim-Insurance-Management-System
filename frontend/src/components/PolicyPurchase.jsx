import { useState } from 'react'
import { ethers } from 'ethers'

export default function PolicyPurchase({ account, signer, contractAddress }) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePurchase = async () => {
    if (!signer) return
    setIsPurchasing(true)
    setSuccess(false)
    
    try {
      // Basic ABI for purchasing
      const abi = ["function buyPolicy() external payable"]
      const contract = new ethers.Contract(contractAddress, abi, signer)
      
      // Send 0.01 ETH as premium
      const tx = await contract.buyPolicy({ value: ethers.parseEther("0.01") })
      await tx.wait()
      
      setSuccess(true)
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("Purchase failed. Check console for details or ensure you have Testnet ETH.")
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="glass-panel">
      <h2 className="gradient-text">Protect Yourself</h2>
      <p style={{ marginBottom: '24px' }}>
        Purchase instant, zero-touch coverage with SwiftClaim. Smart contracts guarantee your payout upon verification.
      </p>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Premium:</span>
          <span style={{ fontWeight: 'bold' }}>0.01 ETH</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Coverage:</span>
          <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>0.10 ETH</span>
        </div>
      </div>

      {success && (
        <div className="badge badge-success" style={{ display: 'block', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
          Policy purchased successfully!
        </div>
      )}

      <button 
        className="btn btn-primary" 
        style={{ width: '100%' }}
        onClick={handlePurchase}
        disabled={!account || isPurchasing}
      >
        {isPurchasing ? 'Processing Transaction...' : 'Buy Policy (0.01 ETH)'}
      </button>
      
      {!account && (
        <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '12px', color: 'var(--danger)' }}>
          Connect wallet to purchase
        </p>
      )}
    </div>
  )
}
