const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Web3 = require("web3");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use session for managing login sessions
app.use(
  session({
    secret: "secureEHR",
    resave: false,
    saveUninitialized: false,
  })
);

// Blockchain Setup
const web3 = new Web3("http://127.0.0.1:7545");
const contractABI = [/* Paste your smart contract ABI here */];
const contractAddress = "DEPLOYED_CONTRACT_ADDRESS"; // Replace with actual deployed address
const ehrContract = new web3.eth.Contract(contractABI, contractAddress);

// In-memory storage for simplicity (use a database for production)
const users = {};

// Routes

// Registration Endpoint
app.post("/register", async (req, res) => {
  const { role, data } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Save user data in memory (or database)
    users[data.username] = { ...data, password: hashedPassword, role };

    // Blockchain Registration
    const accounts = await web3.eth.getAccounts();
    const account = accounts[Math.floor(Math.random() * accounts.length)]; // Random account for testing

    if (role === "patient") {
      await ehrContract.methods
        .registerPatient(data.walletAddress, data.name, data.dob)
        .send({ from: account });
    } else if (role === "doctor") {
      await ehrContract.methods
        .registerDoctor(data.name, data.specialty, data.license)
        .send({ from: account });
    } else if (role === "diagnostic") {
      await ehrContract.methods
        .registerDiagnostic(data.centerName, data.license)
        .send({ from: account });
    }

    res.status(200).send({ message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Registration failed", details: error.message });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users[username];
  if (!user) {
    return res.status(401).send({ error: "User not found" });
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send({ error: "Invalid password" });
  }

  // Save session
  req.session.user = { username, role: user.role };

  // Redirect based on role
  if (user.role === "patient") {
    res.status(200).send({ redirect: "/patientdash.html" });
  } else if (user.role === "doctor") {
    res.status(200).send({ redirect: "/doctordash.html" });
  } else if (user.role === "diagnostic") {
    res.status(200).send({ redirect: "/diagnosticdash.html" });
  }
});

// Logout Endpoint
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send({ message: "Logged out successfully" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
