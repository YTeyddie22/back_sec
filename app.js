const cookieSession = require("cookie-session");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const { passport, config } = require("./passport");
const app = express();

//Sets up the headers
app.use(helmet());

//Setting Cookie session
app.use(
	cookieSession({
		name: "session",
		maxAge: 24 * 60 * 60 * 1000,
		keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
	})
);

//Setting passport middlewar e session
app.use(passport.initialize());

//Authenticate the session
app.use(passport.session());

//Authentication endpoints
app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["email"],
	})
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/failure",
		successRedirect: "/",
	}),
	(req, res) => {
		console.log("We are in the home page!");
	}
);

//Restictions

function isLoggedIn(req, res, next) {
	const isLoggedIn = req.isAuthenticated() && req.user;
	if (!isLoggedIn) {
		return res.status(401).json({
			error: "You must be logged in",
		});
	}
	next();
}

app.get("/secret", isLoggedIn, (req, res) => {
	return res.send("Your Secret is found");
});

app.get("/auth/logout", (req, res) => {
	//Removes the req.user and terminates any logged in session
	req.logout();

	return res.redirect("/");
});

app.get("/failure", (req, res) => {
	res.send("Failed to log in!");
});
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(8000, () => {
	console.log("Your server is running on port 3000");
});

module.exports = app;
