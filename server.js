require("dotenv").config();

const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const http = require("http");
const https = require("https");
const path = require("path");

const app = express();

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
};

app.use(helmet());

//Restictions

function isLoggedIn(req, res, next) {
	const isLoggedIn = true;
	if (!isLoggedIn) {
		return res.status(401).json({
			error: "You must be logged in",
		});
	}
	next();
}

//Authentication endpoints
app.get("/auth/google", (res, req) => {});

app.get("/auth/google/callback", (res, req) => {});

app.get("/auth/logout", (res, req) => {});

app.get("/secret", isLoggedIn, (req, res) => {
	return res.send("Your Secret is found");
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
	.createServer(
		{
			key: fs.readFileSync("key.pem"),
			cert: fs.readFileSync("cert.pem"),
		},
		app
	)
	.listen(3000, () => {
		console.log("Your server is secured");
	});

app.listen(8000, () => {
	console.log("Your server is running on port 3000");
});
