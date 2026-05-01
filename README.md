This **README.md** guide provides a full-stack blueprint for building a decentralized insurance system like **SwiftClaim**. It covers the blockchain logic (Smart Contracts), the interactive interface (Frontend), and the bridge between them (MetaMask).

---

## 📋 SwiftClaim: Insurance Management System

### 1. Project Overview
SwiftClaim is a decentralized platform designed to replace slow, manual insurance processes with "Zero-Touch" automation. It uses a shared digital ledger to ensure every claim is transparent, tamper-proof, and paid out instantly upon verification.

### 2. System Architecture
The system consists of three primary layers:
* **Blockchain (The Ledger):** Solidity smart contracts handle policy creation, claim filing, and automatic payouts.
* **Frontend (The Interface):** A React.js application where users connect their MetaMask wallets to interact with the blockchain.
* **Backend (The Oracle/Data):** Connects to external data sources (like hospital or police records) to trigger "Instant Verification".

---

## 🛠️ Requirements & Setup

### For the Blockchain Part
* **Foundry or Hardhat:** Development frameworks for compiling and deploying contracts.
* **Solidity:** The language used to write the smart contract logic.
* **MetaMask:** A browser extension wallet to sign transactions and manage funds.

### For the Frontend Part
* **React.js:** For building the user dashboard.
* **Ethers.js or Viem:** Libraries used to connect the frontend to the smart contract via MetaMask.

---

## 🦊 Connecting MetaMask to Base Sepolia

Before deploying, you must configure your wallet to the **Base Sepolia Testnet** so you can test without using real money.

### Step 1: Add Base Sepolia to MetaMask
1.  Open MetaMask and click the **Network Selection** dropdown (top left).
2.  Click **Add Network** -> **Add a network manually**.
3.  Enter the following details:
    * **Network Name:** Base Sepolia
    * **RPC URL:** `https://sepolia.base.org`
    * **Chain ID:** `84532`
    * **Currency Symbol:** ETH
    * **Block Explorer:** `https://sepolia.basescan.org`

### Step 2: Get Testnet Tokens (Faucets)
To pay for "gas fees" (transaction costs), you need free test ETH:
* Visit a faucet like **Alchemy Base Sepolia Faucet** or **Chainlink Faucets**.
* Paste your MetaMask wallet address and click **Send Me ETH**.
* Alternatively, you can bridge Sepolia ETH from Ethereum to Base using the **Base Bridge**.

---

## 🚀 Deployment Steps

### 1. Smart Contract Deployment
Use Hardhat or Foundry to deploy your contract to the network you just added.
```bash
# Example using Foundry
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC --private-key $PRIVATE_KEY --broadcast
```
* **Note:** Your `PRIVATE_KEY` is found in MetaMask under **Account Details > Export Private Key**. **Never share this!**

### 2. Connecting the Frontend
In your React app, use a provider to detect MetaMask:
```javascript
import { ethers } from "ethers";

async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // This triggers the MetaMask popup
    console.log("Connected:", await signer.getAddress());
  } else {
    alert("Please install MetaMask!");
  }
}
```


### 3. Interacting with the Contract
To call functions (like `fileClaim`), you need the **Contract Address** (from step 1) and the **ABI** (generated during compilation).
```javascript
const contract = new ethers.Contract(contractAddress, contractABI, signer);
await contract.fileClaim(policyId, "Accident Report Data");
```


---

## ✨ Core Functionalities to Implement
* **Policy Issuance:** A function that lets users "buy" a policy by sending ETH to the contract.
* **Claim Submission:** An immutable record where users upload evidence.
* **Automated Payouts:** A logic gate that sends funds to the user's address if conditions are met.
