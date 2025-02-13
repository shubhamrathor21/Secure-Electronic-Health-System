// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHR {
    struct Patient {
        string name;
        string dob;
        string walletAddress;
    }

    struct Doctor {
        string name;
        string specialty;
        string license;
    }

    struct Diagnostic {
        string centerName;
        string license;
    }

    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => Diagnostic) public diagnostics;

    // Events to track registrations
    event PatientRegistered(address indexed patientAddress, string name);
    event DoctorRegistered(address indexed doctorAddress, string name);
    event DiagnosticRegistered(address indexed diagnosticAddress, string centerName);

    // Function to register a patient
    function registerPatient(string memory _walletAddress, string memory _name, string memory _dob) public {
        // Check if patient is not already registered
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered");
        
        // Create new patient
        patients[msg.sender] = Patient(_name, _dob, _walletAddress);
        
        // Emit event
        emit PatientRegistered(msg.sender, _name);
    }

    // Function to register a doctor
    function registerDoctor(string memory _name, string memory _specialty, string memory _license) public {
        // Check if doctor is not already registered
        require(bytes(doctors[msg.sender].name).length == 0, "Doctor already registered");
        
        // Create new doctor
        doctors[msg.sender] = Doctor(_name, _specialty, _license);
        
        // Emit event
        emit DoctorRegistered(msg.sender, _name);
    }

    // Function to register a diagnostic center
    function registerDiagnostic(string memory _centerName, string memory _license) public {
        // Check if diagnostic center is not already registered
        require(bytes(diagnostics[msg.sender].centerName).length == 0, "Diagnostic center already registered");
        
        // Create new diagnostic center
        diagnostics[msg.sender] = Diagnostic(_centerName, _license);
        
        // Emit event
        emit DiagnosticRegistered(msg.sender, _centerName);
    }

    // Function to get patient details
    function getPatient(address _patientAddress) public view returns (Patient memory) {
        return patients[_patientAddress];
    }

    // Function to get doctor details
    function getDoctor(address _doctorAddress) public view returns (Doctor memory) {
        return doctors[_doctorAddress];
    }

    // Function to get diagnostic center details
    function getDiagnostic(address _diagnosticAddress) public view returns (Diagnostic memory) {
        return diagnostics[_diagnosticAddress];
    }
}