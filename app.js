// Importing modules
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import router from "./routes/web.js";
import bodyParser from "body-parser";

// Creating and configuring the app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://shubhamFSP:FSPcluster@fspcluster.fbfnf4h.mongodb.net/";
const session_store = MongoStore.create({
	mongoUrl: uri,
	dbName: "test",
	collectionName: "users",
});

app.use(
	session({
		secret: "sldnvoiwnvii",
		resave: false,
		saveUninitialized: false,
		store: session_store,
	}),
);

app.use(function (req, res, next) {
	res.locals.authenticated = req.session.authenticated || false;
	res.locals.username = req.session.username || false;
	res.locals.userType = req.session.userType || false;

	res.locals.message = req.session.message || false;
	delete req.session.message;

	next();
});

// Listening on port 3000
app.listen(3000, () => {
	console.log("App is listening on port 3000.");
});

app.use("/", router);
