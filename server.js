const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const path = require("path");

// cert pointers
const options = {
  key: fs.readFileSync("./certs/localhost-key.pem"),
  cert: fs.readFileSync("./certs/localhost.pem")
};

const server = https.createServer(options, app);

// public folder for static assets
app.use(express.static(path.join(__dirname, "public")));

server.listen(3000, () => {
  console.log("Server running...");
});

// file pointers
app.use("/blog", express.static(path.join(__dirname, "blog")));
app.use("/projects", express.static(path.join(__dirname, "projects")));
app.use("/whoami", express.static(path.join(__dirname, "whoami")));

// on refresh
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
