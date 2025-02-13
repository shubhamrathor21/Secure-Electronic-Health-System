// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHR {
    struct Record {
        string dataHash;          // Hash of the medical record data
        address owner;            // Owner of the record (usually the patient)
        address[] authorizedDoctors; // List of authorized doctors
    }

    mapping(address => Record[]) private records; // Mapping from patient address to their records

    // Function to add a new record
    function addRecord(string memory dataHash) public {
        // Create a new empty array for authorized doctors
        address[] memory emptyDoctors = new address[](0);
        
        // Add a new record for the sender (patient)
        records[msg.sender].push(Record({
            dataHash: dataHash,
            owner: msg.sender,
            authorizedDoctors: emptyDoctors
        }));
    }

    // Function to authorize a doctor for a specific record
    function authorizeDoctor(uint index, address doctor) public {
        require(index < records[msg.sender].length, "Invalid record index");
        require(msg.sender == records[msg.sender][index].owner, "Not authorized");
        
        // Check if doctor is not already authorized
        for(uint i = 0; i < records[msg.sender][index].authorizedDoctors.length; i++) {
            require(records[msg.sender][index].authorizedDoctors[i] != doctor, "Doctor already authorized");
        }
        
        records[msg.sender][index].authorizedDoctors.push(doctor);
    }

    // Function to check if a doctor is authorized for a specific record
    function isDoctorAuthorized(address patient, uint index, address doctor) public view returns (bool) {
        require(index < records[patient].length, "Invalid record index");
        
        for(uint i = 0; i < records[patient][index].authorizedDoctors.length; i++) {
            if(records[patient][index].authorizedDoctors[i] == doctor) {
                return true;
            }
        }
        return false;
    }

    // Function to get the number of records for a patient
    function getRecordCount(address patient) public view returns (uint) {
        return records[patient].length;
    }

    // Function to get details of a specific record
    function getRecord(address patient, uint index)
        public
        view
        returns (string memory, address, address[] memory)
    {
        require(index < records[patient].length, "Invalid record index");
        
        // Check if caller is owner or authorized doctor
        require(
            msg.sender == records[patient][index].owner || 
            isDoctorAuthorized(patient, index, msg.sender),
            "Not authorized to view record"
        );
        
        Record storage record = records[patient][index];
        return (record.dataHash, record.owner, record.authorizedDoctors);
    }

    // Function to revoke doctor's access
    function revokeAccess(uint index, address doctor) public {
        require(index < records[msg.sender].length, "Invalid record index");
        require(msg.sender == records[msg.sender][index].owner, "Not authorized");
        
        address[] storage doctors = records[msg.sender][index].authorizedDoctors;
        for(uint i = 0; i < doctors.length; i++) {
            if(doctors[i] == doctor) {
                // Replace the doctor to remove with the last doctor in the array
                doctors[i] = doctors[doctors.length - 1];
                doctors.pop();
                break;
            }
        }
    }
}