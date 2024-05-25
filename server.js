const fs = require("fs");
const https = require("https");
const app = require("./app");

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
