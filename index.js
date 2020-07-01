//Add a try catch to all routes
require("express-async-errors");

//Required Modules
//const error = require("./middleware/error");
const config = require("config");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const events = require("./routes/events");
const customers = require("./routes/customers");
const equipments = require("./routes/equipments");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: eventHandy_jwtPrivateKey is not defined.");
  //terminates the app by exiting the process
  process.exit(1);
}

//Connect to MongoDB
mongoose
  .connect("mongodb://localhost:37017/koala", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB Connected..");
  })
  .catch((err) => console.error("connection failed", err));

//Middleware
app.use(express.json());
app.use("/api/events", events);
app.use("/api/customers", customers);
app.use("/api/equipments", equipments);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

//Error Middleware
//app.use(error);

//Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
