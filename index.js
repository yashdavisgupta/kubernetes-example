const express = require("express");
const mongoose = require("mongoose");

const app = express();
const mongo = process.env.MONGO_URL || 'mongodb://localhost:27017/dev'

mongoose.connect(
  mongo,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("App connected to MongoDB instance at: " + mongo)
);

const login = require("./routes/login");
const register = require("./routes/register");
const token = require("./middleware/token");
const checkUser = require("./routes/userVerify");

app.use(express.json());
app.use("/api/user", login);
app.use("/api/user", register);
app.use("/api/dashboard", token, checkUser);

app.listen(3000, () => console.log("server is running..."));
