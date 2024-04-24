const express = require("express");
const fs = require("fs");
const helmet = require("helmet");
const http = require("http");
const https = require("https");
const path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

const dotEnv = require("dotenv");

dotEnv.config().parsed;

const app = express();

/**
 * Authentication and Authorization
 *
 * 1 Setup the credentials
 * 2 Set up  the Strategy
 * 3 Initialize the passport package
 */

//OAUTH creadentials
const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
};

//Setting up the passport strategy
//hooking the callback to the google callback endpoint

const AUTH_OPTIONS = {
	callbackURL: "/auth/google/callback",
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log("google Profile", profile);

	done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//Sets up the headers
app.use(helmet());

//Sets up passport session
app.use(passport.initialize());

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
app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["email"],
	})
);

app.get(
	"/auth/google/callback",
	passport.authenticate(
		"google",
		{
			failureRedirect: "/failure",
			successRedirect: "/",
			session: false,
		},
		(req, res) => {
			console.log("Google did their thing!");
		}
	)
);

app.get("/auth/logout", (res, req) => {});

app.get("/secret", isLoggedIn, (req, res) => {
	return res.send("Your Secret is found");
});

app.get("/failure", (req, res) => {
	res.send("Failed to log in!");
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
