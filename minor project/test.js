const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Web3 = require("web3");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ganache Blockchain Setup
const web3 = new Web3("http://127.0.0.1:7545"); // Ganache RPC URL

// Health Records Smart Contract Address aur ABI
const contractAddress = "DEPLOYED_CONTRACT_ADDRESS"; // Replace after deployment
const contractABI = []; // Paste your contract's ABI here

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Login Endpoint
app.post("/login", async (req, res) => {
  const { hhNumber, password } = req.body;

  try {
    // Blockchain se verify karein (dummy logic for now)
    const accounts = await web3.eth.getAccounts(); // Local accounts from Ganache
    const userExists = accounts.includes(hhNumber);

    if (userExists && password === "test123") { // Replace with secure logic
      res.status(200).send({ message: "Login successful", address: hhNumber });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ error: "Something went wrong", details: error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend is running at http://localhost:${PORT}`);
});
