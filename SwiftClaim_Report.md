## **VISVESVARAYA TECHNOLOGICAL UNIVERSITY**

### **"Jnana Sangama", Belagavi \-590018, Karnataka.**

### **Web3 Development Report On "SWIFTCLAIM — BLOCKCHAIN-BASED INSURANCE MANAGEMENT SYSTEM"**

***Submitted by***

## **KUNAL RAJ S**

***Under the Guidance of***

### **[Guide Name] Assistant Professor**

***in partial fulfillment for the award of the degree of***

## **BACHELOR OF ENGINEERING**

***in***

## **COMPUTER SCIENCE AND ENGINEERING**

### **(IoT & CYBERSECURITY INCLUDING BLOCKCHAIN)**

## **B.M.S. COLLEGE OF ENGINEERING**

**(Autonomous Institution under VTU) BENGALURU-560019**

**June 2025**

**B. M. S. College of Engineering,**

**Bull Temple Road, Bengaluru 560019**

(Affiliated To Visvesvaraya Technological University, Belagavi)

### **Department of Computer Science and Engineering (IoT & Cybersecurity including Blockchain)**

**CERTIFICATE**

This is to certify that the project work entitled **"SwiftClaim — Blockchain-based Insurance Management System"** carried out by **Kunal Raj S** who is a bonafide student of

**B. M. S. College of Engineering.** It is in partial fulfillment for the award of **Bachelor of Engineering in Computer Science and Engineering (IoT & Cybersecurity including Blockchain)** of the Visvesvaraya Technological University, Belagavi during the year 2025-26. The project report has been approved as it satisfies the academic requirements in respect of **Web3 Development (23IC6AEWEB)** work prescribed for the said degree.

Signature of the Guide

[Guide Name]

Assistant Professor Dept. of CSE(ICB) BMSCE, Bengaluru

Signature of the HOD

Dr Prasad G R Professor & HOD Dept. of CSE BMSCE, Bengaluru

### **External Viva**

Name of the Examiner	Signature with date

## **B.M.S. COLLEGE OF ENGINEERING DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**

**(IoT & CYBERSECURITY INCLUDING BLOCKCHAIN)**

## **DECLARATION**

I, **Kunal Raj S**, student of 6th Semester, B.E, Department of Computer Science and Engineering (IoT & Cybersecurity including Blockchain), BMS College of Engineering, Bengaluru, hereby declare that, this Web3 Project in security entitled **"SwiftClaim — Blockchain-based Insurance Management System"** has been carried out by me under the guidance of [Guide Name], Assistant Professor, Department of CSE(ICB), BMS College of Engineering, Bengaluru during the academic semester February 2025 \- July 2025\.

I also declare to the best of my knowledge and belief that the development reported here is not from part of any other report by any other students.

**Signature**

**Kunal Raj S**

---

# **TABLE OF CONTENTS**

| SI No. | TITLE | Page No. |
| :---: | :---: | ----- |
| **1** | **Introduction** | 1 |
| **1.1** | Overview | 1 |
| **1.2** | Motivation | 1 |
| **2** | **Requirement Specification** | 2 |
| **2.1** | Functional Requirements | 2 |
| **2.2** | Non-Functional Requirements | 3 |
| **2.3** | Hardware Requirements | 3 |
| **2.4** | Software Requirements | 3 |
| **3** | **Design** | 4-5 |
| **3.1** | Flow of Control | 4 |
| **3.2** | Module Design | 4 |
| **3.3** | Security Design | 5 |
| **4** | **Implementation** | 6 |
| **5** | **Results** | 7-9 |
| **6** | **Conclusion** | 10 |
| **7** | **References** | 11 |

## **LIST OF FIGURES**

| SL.no | Figure | Page No. |
| :---- | ----- | :---- |
| 5.1 | Landing Page / Connect Wallet | 7 |
| 5.2 | User Dashboard | 7 |
| 5.3 | Policy Marketplace | 8 |
| 5.4 | My Policies | 8 |
| 5.5 | Submit Claim | 9 |
| 5.6 | Admin Dashboard | 9 |
| 5.7 | Claims Panel (Admin) | 9 |

---

# **INTRODUCTION**

The traditional insurance industry is plagued by inefficiencies — manual claim verification, lengthy settlement cycles, opaque pricing, and a heavy reliance on intermediaries who slow down the process and increase costs. Claimants are often forced to wait weeks or months for payouts, and fraudulent claims further erode trust in the system. There is an urgent need for a transparent, automated, and trustless insurance platform.

SwiftClaim addresses these challenges by leveraging **Ethereum blockchain technology** and **smart contracts** to deliver a decentralized insurance management system. The platform enables users to browse and purchase insurance policies on-chain, submit claims backed by IPFS-stored proofs, and receive instant, automated payouts — all without relying on a centralised authority.

1. ### **Overview**

   SwiftClaim is a full-stack decentralized application (dApp) that brings insurance policy management entirely on-chain. The platform is built on Ethereum (Sepolia testnet) and exposes two distinct role-based interfaces:

   * **User Interface** — allows policyholders to connect their MetaMask wallet, browse available policy templates on a marketplace, purchase policies by paying the premium in ETH, view their active policies, and submit insurance claims with supporting metadata stored on IPFS.

   * **Admin Interface** — enables platform administrators to create and manage policy templates, review pending claims, verify or reject them, approve payouts, and release funds directly to the claimant's wallet — all via smart contract calls.

   The frontend is built with **React.js (Vite)**, uses **Ethers.js v6** for blockchain communication, and features a modern dark-themed UI with purple branding, micro-animations, and role-based routing.

2. ### **Motivation**

   Insurance is one of the largest financial sectors globally, yet it continues to operate on legacy systems. Key pain points that motivated this project include:

   * **Slow Claim Settlement:** Conventional claims can take weeks due to manual verification.
   * **Lack of Transparency:** Policyholders have no visibility into how their premiums are used or how decisions are made.
   * **Fraud Vulnerability:** Centralised databases are susceptible to manipulation and fraudulent claims.
   * **High Operational Cost:** Intermediaries and administrative overhead add significant cost to premiums.

   Blockchain technology presents a compelling solution: immutable records, automated execution of agreements via smart contracts, and transparent, auditable transaction history. SwiftClaim demonstrates how a **decentralized, transparent, and tamper-proof** insurance platform can eliminate these pain points and deliver a superior user experience.

---

2. # **REQUIREMENT SPECIFICATION**

   1. ### **Functional Requirements:**

      * **Wallet Integration** — Users and admins connect their Web3 wallets (MetaMask) to authenticate and sign transactions. Session persistence is maintained via `localStorage`.

      * **Policy Marketplace** — Admins create policy templates (type, premium in ETH, coverage amount, duration, description). Users browse active templates and purchase them by sending exact ETH.

      * **Policy Management** — Users can view all their purchased policies, including policy type, coverage amount, start and expiry times, and active status.

      * **Claim Submission** — Users submit claims against active, non-expired policies, providing claim type, incident date, description, and an IPFS metadata URI for supporting documents. A fraud-prevention cooldown of 24 hours is enforced between claims from the same address.

      * **Multi-Stage Claim Lifecycle** — Claims progress through five distinct statuses managed by admins: `PendingVerification → Verified → PayoutPending → Paid` (or `Rejected` at any stage before payment).

      * **Automated Payout** — Upon admin approval, the smart contract automatically transfers the coverage amount in ETH directly to the claimant's wallet.

      * **Admin Controls** — The owner can grant or revoke admin roles. Admins manage policy templates and the full claim lifecycle.

      * **Role-Based Access** — The dApp detects whether the connected address holds admin privileges and dynamically renders either the user interface or the admin panel.

   2. ### **Non-Functional Requirements:**

      * **Transparency** — All policy purchases, claim submissions, status changes, and payouts are recorded as immutable events on the blockchain, publicly verifiable.
      * **Security** — Smart contract uses `onlyOwner` and `onlyAdmin` modifiers to restrict privileged actions. Fraud detection limits claim frequency per address.
      * **Scalability** — The contract's mapping-based storage and event architecture is designed for efficient on-chain reads. The React frontend is modular and easily extensible.
      * **Availability** — Being a blockchain-based application, the core contract logic is available 24/7 as long as the Ethereum network is operational.
      * **Usability** — Intuitive dark-themed React UI with role-based navigation, loading states, transaction feedback, and responsive design.

   3. ### **Hardware Requirements:**

      * **Minimum Hardware (per developer/user):**
        * Processor: Intel i5 or equivalent (AMD Ryzen 5 or above recommended)
        * RAM: 8 GB or higher
        * Storage: 256 GB SSD
        * Internet: Stable broadband connection (required for testnet transactions)

   4. ### **Software Requirements:**

      * **Frontend:**
        * React.js 18 (via Vite 5 build tool)
        * Ethers.js v6 (blockchain interaction)
        * React Router DOM v7 (client-side routing)
        * Recharts (analytics charts on admin dashboard)
        * Lucide React (icon library)

      * **Backend / Blockchain:**
        * Solidity ^0.8.28 (Smart Contract language)
        * Hardhat (Ethereum development framework — compile, test, deploy)
        * `@nomicfoundation/hardhat-toolbox` (Hardhat plugins)

      * **Wallet Integration:**
        * MetaMask browser extension
        * Ethereum Sepolia Testnet (Chain ID: 11155111)

      * **Storage:**
        * IPFS (for off-chain metadata/document URIs linked in claims)

---

3. # **DESIGN**

   1. ### **Flow of Control**

      The system follows a three-tier architecture:

      * **User Interface (UI):** A React.js SPA (Single Page Application) built with Vite. Users interact through a browser with MetaMask installed. The UI detects the connected account, checks admin status by querying the smart contract, and renders the appropriate role-based view.

      * **Smart Contract:** A single Solidity contract (`SwiftClaim.sol`) deployed on the Ethereum Sepolia testnet. It manages all state — policy templates, user policies, claims, payouts, and admin roles. All business logic (purchasing policies, submitting claims, releasing payouts) executes autonomously on-chain.

      * **IPFS Layer:** Claim supporting documents (photos, reports, receipts) are uploaded to IPFS by the user, and the resulting URI (`metadataURI`) is stored in the claim struct on-chain, ensuring tamper-proof evidence linking.

      * **Blockchain Node Access:** The frontend connects to the Sepolia network via MetaMask's injected `window.ethereum` provider, wrapped by Ethers.js `BrowserProvider`.

   2. #### **Module Design**

      * **Wallet & Authentication Module (`Web3Context`):**
        * Provides a React Context that wraps the entire application.
        * Handles `connectWallet()`, account change detection, network validation, session restoration, and contract instantiation.
        * Exposes `account`, `isAdmin`, `contract`, `isConnecting`, and `networkError` state to all child components.

      * **Smart Contract Module (`SwiftClaim.sol`):**
        * **Role Management:** `owner` and `isAdmin` mapping. `setAdmin()` function allows owner to grant/revoke admin rights.
        * **Policy Template Management:** `addPolicyTemplate()` and `updatePolicyTemplate()` create and modify available policy types.
        * **User Policy Module:** `buyPolicy()` allows users to purchase a policy by sending ETH equal to the template premium. Policies are stored in `userPolicies` mapping.
        * **Claims Module:** `submitClaim()` records a new claim with a 24-hour cooldown fraud gate. Status is managed through `verifyClaim()`, `approvePayout()`, `rejectClaim()`, and `releasePayout()`.

      * **User Interface Module:**
        * `PolicyMarketplace.jsx` — Fetches and displays active policy templates; triggers `buyPolicy()` on purchase.
        * `MyPolicies.jsx` — Lists all policies owned by the connected address.
        * `SubmitClaim.jsx` — Form to submit a claim tied to a specific user policy.
        * `UserDashboard.jsx` — Overview of user stats (active policies, claims count, coverage).

      * **Admin Interface Module:**
        * `AdminDashboard.jsx` — High-level contract statistics (total policies, claims, payouts).
        * `ClaimsPanel.jsx` — Full claims management with status filter tabs and action buttons.
        * `PolicyEditor.jsx` — Create and edit policy templates.

   3. #### **Security Design**

      * **Access Control Modifiers:** `onlyOwner` restricts administrative role assignment; `onlyAdmin` restricts policy and claim management actions.
      * **Fraud Detection:** A `lastClaimTime` mapping enforces a `CLAIM_COOLDOWN` of 1 day between successive claims from any single address, mitigating claim spam.
      * **Input Validation:** All public functions validate input IDs, amounts (exact premium match), policy expiry, and claim status transitions on-chain.
      * **Policyholder Verification:** `submitClaim()` verifies `policy.policyholder == msg.sender` to prevent unauthorized claim filing.
      * **Reentrancy Mitigation:** State is updated (`claim.status = ClaimStatus.Paid` and `policy.isActive = false`) before the ETH transfer in `releasePayout()`, following the checks-effects-interactions pattern.
      * **Network Validation:** The frontend checks the connected chain ID and alerts the user if they are not on the expected network.

---

4. # **IMPLEMENTATION**

   * **Development Environment Setup**
     * Install Node.js (v18+), npm, and Hardhat globally.
     * Configure MetaMask for the Ethereum Sepolia testnet (RPC: `https://rpc.sepolia.org`, Chain ID: `11155111`).
     * Use VS Code with Solidity and ESLint extensions for development.

   * **Smart Contract Development**
     * Write `SwiftClaim.sol` in Solidity ^0.8.28, implementing:
       * `PolicyTemplate` and `UserPolicy` structs for policy data.
       * `Claim` struct with `ClaimStatus` enum (`PendingVerification, Verified, Rejected, PayoutPending, Paid`).
       * Role-based access control with `onlyOwner` and `onlyAdmin` modifiers.
       * Fraud detection via `lastClaimTime` mapping and `CLAIM_COOLDOWN` constant.
       * `receive()` function allowing admins to fund the contract for payouts.

   * **Deployment**
     * Configure `hardhat.config.js` with the Sepolia network using environment variables (`SEPOLIA_RPC`, `PRIVATE_KEY`) loaded from `.env`.
     * Compile the contract: `npx hardhat compile`.
     * Deploy to Sepolia: `npx hardhat run scripts/deploy.js --network sepolia`.
     * Copy the deployed contract address and ABI into the frontend `utils/` directory.

   * **Frontend Development**
     * Scaffold with Vite + React: `npm create vite@latest frontend -- --template react`.
     * Implement `Web3Context` using Ethers.js `BrowserProvider` and `Contract` to interface with the deployed `SwiftClaim` contract.
     * Build role-based routing in `App.jsx` using React Router DOM: admin routes (`/admin-dashboard`, `/claims`, `/policies`) and user routes (`/user-dashboard`, `/marketplace`, `/my-policies`, `/submit-claim`).
     * Implement all UI pages as described in the Module Design section.
     * Style the application using a custom CSS design system in `index.css` featuring a dark background (`#0d0d12`), purple accent colors (`#7c3aed`), glassmorphism card effects, and smooth CSS transitions.

   * **Testing**
     * Deploy to Sepolia and test with multiple MetaMask accounts (one as owner/admin, one as regular user).
     * Purchase a policy from the user account, submit a claim, then switch to the admin account to verify, approve payout, and release funds.
     * Verify on [Sepolia Etherscan](https://sepolia.etherscan.io/) that all transactions are recorded with correct parameters.

---

4. # **RESULTS**

   SwiftClaim was successfully developed and deployed as a full-stack decentralized insurance application on the Ethereum Sepolia testnet. The following key outcomes were achieved:

   **Smart Contract Deployment:** The `SwiftClaim.sol` contract was compiled and deployed to the Sepolia testnet using Hardhat. The contract correctly enforces all role-based access controls, policy lifecycle management, and claim status transitions.

   **Wallet Integration:** MetaMask wallet connection functions flawlessly, with session persistence across page refreshes via `localStorage`. The frontend correctly identifies admin addresses and renders role-specific UIs.

   **Policy Marketplace:** Admins successfully created multiple policy templates (e.g., Health, Vehicle, Property insurance) with different premiums and coverage amounts. Users could browse the marketplace and purchase policies by sending the exact premium in ETH.

   **Claim Submission & Lifecycle:** Users submitted claims against active policies. The smart contract's fraud detection (24-hour cooldown) correctly blocked duplicate claims. Admins successfully moved claims through all five status stages: `PendingVerification → Verified → PayoutPending → Paid`.

   **Automated Payouts:** Upon admin triggering `releasePayout()`, the smart contract transferred the coverage amount in ETH directly to the claimant's MetaMask wallet within the block confirmation time (~15 seconds on Sepolia).

   **UI/UX:** The React frontend delivered a responsive, modern dark-themed interface with real-time feedback for transaction states (loading spinners, success messages, error alerts). The admin dashboard displayed aggregate contract statistics using Recharts.

   **Security:** All unauthorized access attempts (e.g., a non-admin calling `verifyClaim()`) were correctly reverted by the smart contract with appropriate error messages.

   > **Note on Limitations:** The current implementation runs on the Sepolia testnet. Gas fees and transaction confirmation times would differ on Ethereum mainnet. IPFS integration for document upload is currently handled client-side (URI input); a dedicated upload gateway could improve UX in future iterations.

   **Fig 5.1 — Landing Page / Connect Wallet**

   *(Screenshot: The landing page features the SwiftClaim logo, a "Connect Wallet to Start" button, and feature pills: Trustless, Transparent, Instant Payout, IPFS Proofs.)*

   **Fig 5.2 — User Dashboard**

   *(Screenshot: Shows summary cards for Active Policies, Total Claims Filed, and Total Coverage in ETH.)*

   **Fig 5.3 — Policy Marketplace**

   *(Screenshot: Grid of available policy template cards showing policy type, premium, coverage amount, and a "Buy Policy" button.)*

   **Fig 5.4 — My Policies**

   *(Screenshot: Table/cards listing user's purchased policies with policy ID, type, start date, expiry date, and active status badge.)*

   **Fig 5.5 — Submit Claim**

   *(Screenshot: Form with dropdowns for policy selection, claim type input, incident date picker, description textarea, and IPFS metadata URI field.)*

   **Fig 5.6 — Admin Dashboard**

   *(Screenshot: Statistics cards for total policy templates, user policies sold, total claims, and total ETH paid out, with a Recharts bar chart.)*

   **Fig 5.7 — Claims Panel (Admin)**

   *(Screenshot: Tabbed claims table filtered by status (All, Pending, Verified, Rejected, Paid) with action buttons for Verify, Approve Payout, Reject, and Release Payout.)*

---

5. # **CONCLUSION**

   SwiftClaim successfully demonstrates the viability of a **blockchain-based, decentralized insurance management system** built on Ethereum. By replacing centralised intermediaries with a transparent, self-executing smart contract, the project addresses the core inefficiencies of traditional insurance — slow claim processing, opaque operations, and high administrative overhead.

   All functional requirements were met: MetaMask wallet integration, role-based access for users and admins, a policy marketplace with on-chain purchases, a multi-stage claim lifecycle, fraud detection through cooldown enforcement, and automated ETH payouts directly to claimants. The React.js frontend provides an intuitive, modern interface that lowers the barrier to entry for non-technical users interacting with blockchain technology.

   The project was developed and tested on the Ethereum Sepolia testnet, validating the core smart contract logic and frontend integration. The system architecture is modular and extensible, providing a strong foundation for production deployment.

   **Future Enhancements:**
   * **Mainnet Deployment / Layer-2 Scaling:** Deploying to an Ethereum Layer-2 network (e.g., Polygon, Arbitrum, or Base) would drastically reduce gas fees and improve transaction throughput, making the platform economically viable for real-world use.
   * **Decentralised Oracle Integration:** Integrating **Chainlink oracles** would enable automatic claim verification against real-world data sources (hospital APIs, police report databases, weather data) — enabling truly zero-touch, instant payouts.
   * **IPFS Upload Integration:** Embedding a dedicated IPFS upload gateway (e.g., Pinata, Web3.Storage) directly in the claim submission form would simplify document management for users.
   * **NFT-Based Policy Certificates:** Issuing ERC-721 NFT certificates for each purchased policy would give policyholders verifiable, transferable proof of insurance.
   * **Mobile Application:** A dedicated mobile app would extend accessibility and improve UX for a broader audience.
   * **DAO Governance:** Transitioning admin governance to a DAO (Decentralized Autonomous Organisation) model would fully decentralize claim dispute resolution.

---

6. # **REFERENCES**

1. Wood, G. (2014). *Ethereum: A secure decentralised generalised transaction ledger*. Ethereum Project Yellow Paper. Retrieved from [https://ethereum.github.io/yellowpaper/paper.pdf](https://ethereum.github.io/yellowpaper/paper.pdf)

2. Buterin, V. (2013). *Ethereum White Paper: A Next-Generation Smart Contract and Decentralized Application Platform*. Retrieved from [https://ethereum.org/en/whitepaper/](https://ethereum.org/en/whitepaper/)

3. OpenZeppelin. (2024). *Solidity Smart Contract Security Best Practices*. Retrieved from [https://docs.openzeppelin.com/contracts/](https://docs.openzeppelin.com/contracts/)

4. Nomic Foundation. (2024). *Hardhat Documentation — Ethereum Development Environment*. Retrieved from [https://hardhat.org/docs](https://hardhat.org/docs)

5. Ethers.js Team. (2024). *Ethers.js v6 Documentation*. Retrieved from [https://docs.ethers.org/v6/](https://docs.ethers.org/v6/)

6. Ethereum Foundation. (2024). *Solidity Documentation*. Retrieved from [https://docs.soliditylang.org/en/latest/](https://docs.soliditylang.org/en/latest/)

7. Dannen, C. (2017). *Introducing Ethereum and Solidity: Foundations of Cryptocurrency and Blockchain Programming for Beginners*. Apress.

8. Wood, A. (2021). *Mastering Ethereum: Building Smart Contracts and DApps*. O'Reilly Media.

9. Sepolia Testnet Explorer. (2024). Retrieved from [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)

10. IPFS Documentation. (2024). *InterPlanetary File System*. Retrieved from [https://docs.ipfs.tech/](https://docs.ipfs.tech/)
