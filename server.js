const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config");
const User = require("./model");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Connect to the database
connectDB();
app.use(
  cors({
    origin: "https://data-registration-form-2.onrender.com",
  })
);
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.validate();
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    const errorMessages = {};
    if (error.errors) {
      for (const key in error.errors) {
        errorMessages[key] = error.errors[key].message;
      }
    } else {
      errorMessages.general = error.message;
    }
    res
      .status(400)
      .send({ message: "Error saving user", errors: errorMessages });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error fetching users", error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});