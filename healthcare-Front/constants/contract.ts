export const CONTRACT_ADDRESS = "0x15c3cb8148659fe364e6b87bb7ba30d4e9c4cef1"

export const CONTRACT_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "doctorAddress", type: "address" }],
    name: "DoctorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "doctorAddress", type: "address" }],
    name: "DoctorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "patientAddress", type: "address" },
      { indexed: true, internalType: "address", name: "doctorAddress", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "RecordAdded",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_doctorAddress", type: "address" }],
    name: "addDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_patientAddress", type: "address" },
      { internalType: "string", name: "_diagnosis", type: "string" },
      { internalType: "string", name: "_prescription", type: "string" },
    ],
    name: "addMedicalRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_patientAddress", type: "address" }],
    name: "getPatientRecords",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "diagnosis", type: "string" },
          { internalType: "string", name: "prescription", type: "string" },
          { internalType: "address", name: "doctor", type: "address" },
        ],
        internalType: "struct EHealth.MedicalRecord[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_patientAddress", type: "address" }],
    name: "getRecordsCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_patientAddress", type: "address" }],
    name: "hasMedicalHistory",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isDoctor",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "records",
    outputs: [
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "string", name: "diagnosis", type: "string" },
      { internalType: "string", name: "prescription", type: "string" },
      { internalType: "address", name: "doctor", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_doctorAddress", type: "address" }],
    name: "removeDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export const SUPPORTED_NETWORKS = {
  ETHEREUM_MAINNET: 1,
  ETHEREUM_SEPOLIA: 11155111,
  POLYGON_MAINNET: 137,
  POLYGON_MUMBAI: 80001,
} as const

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.ETHEREUM_SEPOLIA
