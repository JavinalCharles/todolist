const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require("ejs");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

app.use("/", require(__dirname + "/routes/routes"));

app.listen(PORT, console.log("Server is a GO! Listening at port: " + PORT));
