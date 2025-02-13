const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Web3 = require("web3");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Smart Contract Configuration
const contractABI = [/* Paste your smart contract ABI here */];
const contractAddress = "DEPLOYED_CONTRACT_ADDRESS"; // Replace after deployment
const ehrContract = new web3.eth.Contract(contractABI, contractAddress);

// Registration Endpoint
app.post("/register", async (req, res) => {
  const { role, data } = req.body;

  try {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[Math.floor(Math.random() * accounts.length)]; // Use a random account for testing

    if (role === "patient") {
      await ehrContract.methods
        .registerPatient(data.walletAddress, data.name, data.dob)
        .send({ from: account });
      res.status(200).send({ message: "Patient registered on blockchain!" });
    } else if (role === "doctor") {
      await ehrContract.methods
        .registerDoctor(data.name, data.specialty, data.license)
        .send({ from: account });
      res.status(200).send({ message: "Doctor registered on blockchain!" });
    } else if (role === "diagnostic") {
      await ehrContract.methods
        .registerDiagnostic(data.centerName, data.license)
        .send({ from: account });
      res.status(200).send({ message: "Diagnostic center registered on blockchain!" });
    } else {
      res.status(400).send({ error: "Invalid role" });
    }
  } catch (error) {
    res.status(500).send({ error: "Registration failed", details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
