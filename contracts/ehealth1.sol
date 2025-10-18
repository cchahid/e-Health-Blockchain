// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EHealth
 * @dev Ce contrat intelligent gère les dossiers médicaux des patients de manière sécurisée et décentralisée.
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
    // C'est la base de données principale de notre système.
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
        require(msg.sender == owner, unicode"Accès refusé : Seul le propriétaire peut exécuter cette action.");
        _;
    }

    // Restreint l'accès d'une fonction uniquement à un médecin autorisé
    modifier onlyDoctor() {
        require(isDoctor[msg.sender], unicode"Accès refusé : Seul un médecin autorisé peut exécuter cette action.");        _;
    }

    // --- Fonctions ---

    /**
     * @dev Le constructeur initialise le propriétaire du contrat lors du déploiement.
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
        require(_doctorAddress != address(0), "Adresse invalide.");
        require(!isDoctor[_doctorAddress], unicode"Ce médecin est déjà enregistré.");
        isDoctor[_doctorAddress] = true;
        emit DoctorAdded(_doctorAddress);
    }

    /**
     * @notice Révoque les droits d'une adresse de médecin.
     * @dev Seul le propriétaire du contrat peut appeler cette fonction.
     * @param _doctorAddress L'adresse Ethereum du médecin à révoquer.
     */
    function removeDoctor(address _doctorAddress) external onlyOwner {
        require(isDoctor[_doctorAddress], unicode"Ce médecin n'est pas enregistré.");
        isDoctor[_doctorAddress] = false;
        emit DoctorRemoved(_doctorAddress);
    }

    /**
     * @notice Ajoute un nouveau dossier médical pour un patient.
     * @dev Gère à la fois les nouveaux patients et les patients existants.
     * Si le patient n'existe pas, son historique est créé.
     * S'il existe, le dossier est ajouté à son historique.
     * Seul un médecin autorisé peut appeler cette fonction.
     * @param _patientAddress L'adresse du patient concerné.
     * @param _diagnosis Le diagnostic de la visite.
     * @param _prescription La prescription médicale.
     */
    function addMedicalRecord(address _patientAddress, string memory _diagnosis, string memory _prescription) external onlyDoctor {
        require(_patientAddress != address(0), "Adresse de patient invalide.");
        
        records[_patientAddress].push(MedicalRecord({
            timestamp: block.timestamp,
            diagnosis: _diagnosis,
            prescription: _prescription,
            doctor: msg.sender
        }));

        emit RecordAdded(_patientAddress, msg.sender, block.timestamp);
    }

    /**
     * @notice Récupère l'historique médical complet d'un patient.
     * @dev L'accès est conditionnel :
     * - Un médecin peut voir l'historique de n'importe quel patient.
     * - Un patient peut voir uniquement son propre historique.
     * @param _patientAddress L'adresse du patient dont on veut consulter l'historique.
     * @return MedicalRecord[] La liste des dossiers médicaux du patient.
     */
    function getPatientRecords(address _patientAddress) external view returns (MedicalRecord[] memory) {
        require(isDoctor[msg.sender] || msg.sender == _patientAddress, unicode"Accès refusé : Action réservée au médecin ou au patient concerné.");
        return records[_patientAddress];
    }
    
    /**
     * @notice Récupère le nombre de dossiers pour un patient donné.
     * @dev Utile pour savoir rapidement combien de visites un patient a eues.
     * @param _patientAddress L'adresse du patient.
     * @return uint Le nombre total de dossiers médicaux.
     */
    function getRecordsCount(address _patientAddress) external view returns (uint) {
        require(isDoctor[msg.sender] || msg.sender == _patientAddress, unicode"Accès refusé.");
        return records[_patientAddress].length;
    }

    /**
     * @notice (NOUVEAU) Vérifie si un patient a déjà un historique médical.
     * @dev C'est une fonction utilitaire pour les interfaces utilisateur.
     * @param _patientAddress L'adresse du patient à vérifier.
     * @return bool Vrai si le patient a au moins un dossier, sinon faux.
     */
    function hasMedicalHistory(address _patientAddress) external view returns (bool) {
        require(isDoctor[msg.sender] || msg.sender == _patientAddress, unicode"Accès refusé.");
        return records[_patientAddress].length > 0;
    }
}