import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import abi from '../utils/SwiftClaimABI.json';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAutoConnecting, setIsAutoConnecting] = useState(true);

  // Replace with deployed contract address
  const CONTRACT_ADDRESS = "0x20cAB52EacDD1CC1237Af3D2E26b5595fb8B9471"; 

  const [networkError, setNetworkError] = useState('');

  const connectWallet = async (silent = false) => {
    if (!silent) setIsConnecting(true);
    setNetworkError('');
    try {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        
        // Network Check
        const network = await _provider.getNetwork();
        if (network.chainId !== 11155111n) {
          setNetworkError("Please switch your MetaMask network to Sepolia Testnet!");
          if (!silent) setIsConnecting(false);
          return;
        }

        const _signer = await _provider.getSigner();
        const _account = await _signer.getAddress();
        
        // Use abi.abi because Hardhat JSON artifacts wrap the ABI array
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setAccount(_account);
        setContract(_contract);

        // Check if admin
        try {
          const adminStatus = await _contract.isAdmin(_account);
          // Also owner is admin
          const owner = await _contract.owner();
          setIsAdmin(adminStatus || _account.toLowerCase() === owner.toLowerCase());
        } catch(e) {
          console.error("Error checking admin status", e);
        }

      } else {
        if (!silent) alert("Please install MetaMask to use SwiftClaim!");
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      if (!silent) setIsConnecting(false);
    }
  };

  // Auto-connect on page load if MetaMask already has authorized accounts
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          // eth_accounts does NOT trigger a MetaMask popup
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet(true); // silent = true, no popup
          }
        } catch (e) {
          console.error("Auto-connect failed:", e);
        }
      }
      setIsAutoConnecting(false);
    };

    autoConnect();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          connectWallet(true);
        } else {
          setAccount(null);
          setSigner(null);
          setContract(null);
          setIsAdmin(false);
        }
      };

      const handleChainChanged = () => {
        // Reload on network switch — simplest safe approach
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, provider, signer, contract, isAdmin, isConnecting, isAutoConnecting, networkError, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
