const dotEnv = require("dotenv");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
dotEnv.config().parsed;

/**
 * Authentication and Authorization
 *
 * 1 Setup the credentials
 * 2 Set up  the Strategy
 * 3 Initialize the passport package
 */

//OAUTH and Cookies creadentials
const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
	COOKIE_KEY_1: process.env.COOKIE_KEY_1,
	COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

//Setting up the passport strategy

const AUTH_OPTIONS = {
	callbackURL: "/auth/google/callback",
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
	done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//Serializing data(Saving session to cookie)

passport.serializeUser((user, done) => {
	done(null, user.id);
});

//Deserialize data (Read session from the cookie)

passport.deserializeUser((id, done) => {
	done(null, id);
});

module.exports = { passport, config };
