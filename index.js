const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./Schema");
const { resolve } = require("path");
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.static("static"));
app.use(express.json());

// MONGODB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connection established"))
  .catch((err) => console.error("MongoDB Connection failed: ", err));

app.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedpassword });
    await newUser.save();
     return res
      .status(201)
      .json({ success: true, message: "User registered successfully."  , newUser});
  } catch (err) {
    console.error("Error in registering the user: ", err);
   return  res.status(500).json({ message: "Error registering user" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.listen(port, () => {
  console.log(`Server running  at http://localhost:${port}`);
});
