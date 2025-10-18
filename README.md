# E-Health Blockchain: Decentralized Healthcare Record Management

This project implements a decentralized application (DApp) for managing electronic health records (EHR) using blockchain technology. Developed using Remix IDE, it leverages Ganache for a local blockchain environment and MetaMask for wallet interactions, aiming to provide a secure, transparent, and patient-centric way to store and share medical data.

## Features

* **Secure Record Storage:** Patient health records are managed via smart contracts deployed on a Ganache blockchain instance.
* **Role-Based Access Control:** Differentiates between roles like contract owner, doctors, and patients, ensuring appropriate data access permissions managed through the smart contract.
* **Patient Control:** Patients have control over granting and revoking access to their records for specific doctors via the frontend interface.
* **Doctor Management:** The contract owner can add and remove authorized doctors through the application.
* **Web Interface:** A modern web interface built with Next.js allows users (owner, doctors, patients) to interact with the deployed smart contracts via MetaMask.

## Technology Stack

* **Blockchain:** Ganache (Local EVM-compatible blockchain)
* **Smart Contract Development:**
    * Solidity
    * Remix IDE (Development, Compilation, Deployment)
* **Frontend:**
    * Next.js
    * React
    * TypeScript
    * Tailwind CSS
    * shadcn/ui (UI components)
* **Blockchain Interaction (Frontend):**
    * Ethers.js / Web3.js (Likely used by the frontend for interactions)
    * MetaMask (Browser wallet and gateway)
* **Package Manager:** pnpm
* **(Optional) Deployment Scripts:** TypeScript scripts using Ethers.js/Web3.js are available for alternative deployment methods.

## Project Structure
e-Health-Blockchain/ ├── artifacts/ # Compiled smart contract artifacts (from Remix or scripts) ├── contracts/ # Solidity smart contract source files │ ├── EHealth.sol # Main smart contract logic │ └── ... ├── healthcare-Front/ # Next.js frontend application source code │ ├── app/ │ ├── components/ │ ├── constants/ # Contract ABI/Address, UI constants │ ├── hooks/ │ ├── lib/ │ ├── public/ │ ├── package.json │ └── ... ├── scripts/ # (Alternative) Deployment and interaction scripts ├── tests/ # Test files ├── .gitignore ├── .prettierrc.json ├── compiler_config.json # Solidity compiler configuration (if used locally) └── README.md # This file

## Getting Started

### Prerequisites

* **Node.js:** v18.x or later ([Download Node.js](https://nodejs.org/))
* **pnpm:** Install via `npm install -g pnpm`
* **Git:** ([Download Git](https://git-scm.com/))
* **Ganache:** GUI for local blockchain ([Download Ganache](https://trufflesuite.com/ganache/))
* **MetaMask:** Browser extension wallet ([MetaMask](https://metamask.io/))
* **Web Browser:** Chrome, Firefox, Brave, or Edge (with MetaMask extension installed).

### Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd e-Health-Blockchain
    ```

2.  **Start Ganache:**
    * Launch the Ganache application. Use the default "Quickstart" Ethereum workspace or configure a new one.
    * Note the RPC Server address (e.g., `HTTP://127.0.0.1:7545` or `8545`).
    * Note the Network ID.

3.  **Configure MetaMask:**
    * Open MetaMask in your browser.
    * Add a new network:
        * Network Name: `Ganache Local` (or any name)
        * New RPC URL: Enter the RPC Server address from Ganache (e.g., `http://127.0.0.1:7545`)
        * Chain ID: Enter the Network ID from Ganache.
        * Currency Symbol: `ETH`
    * Import accounts from Ganache into MetaMask using their private keys. Ensure you have accounts for the Owner, potential Doctors, and Patients.

4.  **Compile & Deploy Smart Contract using Remix:**
    * Open [Remix IDE](https://remix.ethereum.org/) in your browser.
    * Load the `contracts/EHealth.sol` file (and any dependencies) into the Remix workspace (you can clone your repo or copy-paste).
    * Go to the "Solidity compiler" tab, select the correct compiler version matching the `pragma` in your contract, and click "Compile".
    * Go to the "Deploy & run transactions" tab:
        * Environment: Select `Injected Provider - MetaMask`. MetaMask should prompt you to connect the account you want to deploy *from* (usually the Owner account).
        * Contract: Select `EHealth` (or your main contract).
        * Click "Deploy". MetaMask will prompt for confirmation.
    * **Important:** Once deployed, copy the **Deployed Contract Address** from Remix.
    * Copy the **Contract ABI** from the "Solidity compiler" tab (Compilation Details -> ABI).

5.  **Configure Frontend:**
    * Open `healthcare-Front/constants/contract.ts`.
    * Paste the **Deployed Contract Address** into the `EHEALTH_CONTRACT_ADDRESS` variable.
    * Paste the **Contract ABI** into the `EHEALTH_CONTRACT_ABI` variable.
    * Save the file.

6.  **Install Frontend Dependencies:**
    ```bash
    cd healthcare-Front
    pnpm install
    ```

## Running the Project

1.  **Ensure Ganache is Running.**
2.  **Ensure MetaMask is Connected** to your Ganache network and the desired account is selected.
3.  **Start the Frontend Application:**
    ```bash
    # Navigate back if you're not in the frontend directory
    cd healthcare-Front
    pnpm dev
    ```
4.  **Access the DApp:**
    * Open your browser and navigate to `http://localhost:3000` (or the port specified).
    * The application should load. Connect your MetaMask wallet if prompted again.
    * Interact with the features based on the connected account's role (Owner, Doctor, Patient).

## (Alternative) Deployment using Scripts

If you prefer to deploy using the provided scripts instead of Remix:

1.  **(Optional) Install Script Dependencies:** You might need a root `package.json` and install `ethers` or `web3`, `dotenv`, `typescript`, `ts-node`.
2.  **Configure Environment:** Set up a `.env` file in the root directory if the scripts use it (e.g., for private keys, RPC URLs).
3.  **Run Deployment Script:**
    ```bash
    # Example using Ethers
    npx ts-node scripts/deploy_with_ethers.ts
    ```
4.  **Update Frontend:** Copy the deployed address and ABI to `healthcare-Front/constants/contract.ts` as described in Step 5 of the Setup section.

---

This revised README should give a much clearer picture of how the project was built and how to run it using Ganache, MetaMask, and Remix. Let me know if you want any further adjustments!