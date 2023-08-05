import mongoose from "mongoose";

const uri = "mongodb+srv://shubhamFSP:FSPcluster@fspcluster.fbfnf4h.mongodb.net/";

// Connecting to the mongoDB
mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("!!!!!!!!!!!!!!!!!! Mongodb Connected Successfully !!!!!!!!!!!!");
	})
	.catch((error) => {
		console.log(`Mongo Connection Failed due to the error below \n ${error}`);
	});

// Database Schema
const userSchema = new mongoose.Schema({
	appointment: { type: String, required: false },
	firstName: { type: String, required: true, default: "default" },
	lastName: { type: String, required: true, default: "default" },
	username: { type: String, required: true, default: "demo" },
	password: { type: String, required: true, default: "demo" },
	licenseNumber: { type: String, required: true, default: "default" },
	userType: { type: String, required: true, default: "driver" },
	age: { type: Number, required: true, default: 0 },
	carDetails: {
		make: { type: String, required: true, default: "default" },
		model: { type: String, required: true, default: "default" },
		year: { type: Number, required: true, default: 0 },
		platNumber: { type: String, required: true, default: "default" },
	},
});

export const userModel = mongoose.model("user", userSchema);

// Database Schema
const timeSchema = new mongoose.Schema({
	date: { type: String, required: true },
	time: { type: String, required: true },
	isAvailable: { type: Boolean, required: true, default: true },
});

export const timeModel = mongoose.model("time", timeSchema);
