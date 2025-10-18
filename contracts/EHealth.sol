// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EHealth
 * @dev Ce contrat intelligent gère les dossiers médicaux des patients.
 * Il permet à des médecins autorisés d'ajouter des dossiers pour les patients.
 * Les médecins peuvent consulter l'historique de n'importe quel patient.
 * Les patients peuvent uniquement consulter leur propre historique médical.
 * Le propriétaire du contrat est responsable de l'ajout et de la révocation des médecins.
 */
contract EHealth {

    // --- Structures de Données ---

    // Représente un seul dossier médical pour une visite
    struct MedicalRecord {
        uint256 timestamp;      // Date et heure de la création du dossier
        string diagnosis;       // Diagnostique du médecin
        string prescription;    // Prescription associée
        address doctor;         // Adresse du médecin qui a créé le dossier
    }

    // --- Variables d'État ---

    address public owner; // L'adresse qui a déployé le contrat

    // Mapping pour stocker les adresses des médecins autorisés
    mapping(address => bool) public isDoctor;

    // Mapping principal qui lie l'adresse d'un patient à son tableau de dossiers médicaux
    mapping(address => MedicalRecord[]) public records;

    // --- Événements ---

    // Émis lorsqu'un nouveau médecin est ajouté
    event DoctorAdded(address indexed doctorAddress);
    
    // Émis lorsqu'un médecin est révoqué
    event DoctorRemoved(address indexed doctorAddress);

    // Émis lorsqu'un nouveau dossier médical est ajouté pour un patient
    event RecordAdded(address indexed patientAddress, address indexed doctorAddress, uint256 timestamp);

    // --- Modificateurs ---

    // Restreint l'accès d'une fonction uniquement au propriétaire du contrat
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Restreint l'accès d'une fonction uniquement à un médecin autorisé
    modifier onlyDoctor() {
        require(isDoctor[msg.sender], "Caller is not an authorized doctor");
        _;
    }

    // --- Fonctions ---

    /**
     * @dev Le constructeur initialise le propriétaire du contrat.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Ajoute une nouvelle adresse de médecin.
     * @dev Seul le propriétaire du contrat peut appeler cette fonction.
     * @param _doctorAddress L'adresse Ethereum du médecin à ajouter.
     */
    function addDoctor(address _doctorAddress) external onlyOwner {
        require(_doctorAddress != address(0), "Invalid address");
        require(!isDoctor[_doctorAddress], "Address is already a doctor");
        isDoctor[_doctorAddress] = true;
        emit DoctorAdded(_doctorAddress);
    }

    /**
     * @notice Révoque les droits d'une adresse de médecin.
     * @dev Seul le propriétaire du contrat peut appeler cette fonction.
     * @param _doctorAddress L'adresse Ethereum du médecin à révoquer.
     */
    function removeDoctor(address _doctorAddress) external onlyOwner {
        require(isDoctor[_doctorAddress], "Address is not a doctor");
        isDoctor[_doctorAddress] = false;
        emit DoctorRemoved(_doctorAddress);
    }

    /**
     * @notice Ajoute un nouveau dossier médical pour un patient.
     * @dev Seul un médecin autorisé peut appeler cette fonction.
     * @param _patientAddress L'adresse du patient concerné.
     * @param _diagnosis Le diagnostique de la visite.
     * @param _prescription La prescription médicale.
     */
    function addMedicalRecord(address _patientAddress, string memory _diagnosis, string memory _prescription) external onlyDoctor {
        require(_patientAddress != address(0), "Invalid patient address");
        
        records[_patientAddress].push(MedicalRecord({
            timestamp: block.timestamp,
            diagnosis: _diagnosis,
            prescription: _prescription,
            doctor: msg.sender
        }));

        emit RecordAdded(_patientAddress, msg.sender, block.timestamp);
    }

    /**
     * @notice Récupère l'historique médical d'un patient.
     * @dev L'accès est conditionnel :
     * - Un médecin peut voir l'historique de n'importe quel patient.
     * - Un patient peut voir uniquement son propre historique.
     * - Personne d'autre ne peut voir les dossiers.
     * @param _patientAddress L'adresse du patient dont on veut consulter l'historique.
     * @return MedicalRecord[] La liste des dossiers médicaux du patient.
     */
    function getPatientRecords(address _patientAddress) external view returns (MedicalRecord[] memory) {
        // Vérifie si l'appelant est un médecin OU si l'appelant est le patient lui-même.
        require(isDoctor[msg.sender] || msg.sender == _patientAddress, "Access denied: Caller is not an authorized doctor or the patient himself.");
        return records[_patientAddress];
    }
    
    /**
     * @notice Récupère le nombre de dossiers pour un patient donné.
     * @param _patientAddress L'adresse du patient.
     * @return uint Le nombre total de dossiers médicaux.
     */
    function getRecordsCount(address _patientAddress) external view returns (uint) {
        require(isDoctor[msg.sender] || msg.sender == _patientAddress, "Access denied.");
        return records[_patientAddress].length;
    }
}
