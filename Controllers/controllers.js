import userModel from "../models/db.js";
import bcrypt from "bcrypt";

class Controller {
	static home_controller = (req, res) => {
		res.render("dashboard");
	};

	static login_controller = (req, res) => {
		res.render("login");
	};

	static login_form_controller = async (req, res) => {
		const formData = req.body;

		const user_matched = await userModel.findOne({ username: formData.username });
		if (!user_matched) {
			req.session.message = "Invalid username or password!";
			res.redirect("/login");
			return;
		} else {
			const pwd_matched = await bcrypt.compare(formData.password, user_matched.password);
			if (pwd_matched) {
				req.session.message = "Logged in!";
				req.session.authenticated = true;
				req.session.userType = user_matched.userType;
				req.session.username = user_matched.username;
				res.redirect("/");
			} else {
				req.session.message = "Invalid username or password!";
				res.redirect("/login");
			}
		}
	};

	static signup_controller = (req, res) => {
		res.render("signup");
	};

	static signup_form_controller = async (req, res) => {
		const formData = req.body;

		// check existing user
		const existingUser = await userModel.findOne({ username: formData.username });
		if (existingUser) {
			req.session.message = "User already exists!";
			res.redirect("/login");
			return;
		}

		// Check password
		if (formData.password !== formData.password2) {
			res.render("signup", { error: "Passwords must match!" });
		} else {
			// save the user
			const newUser = new userModel({
				username: formData.username,
				password: bcrypt.hashSync(formData.password, 10),
				userType: formData.userType,
			});

			try {
				const newUserSaved = await newUser.save();
				req.session.message = "Registered! Login to continue!";
				res.redirect("/login");
			} catch (error) {
				console.log({ error });
				res.send(error);
			}
		}
	};

	static logout_controller = (req, res) => {
		delete req.session.authenticated;
		delete req.session.userType;
		delete req.session.username;

		req.session.message = "Logged out!";
		res.redirect("/");
	};

	static g_controller = async (req, res) => {
		// Only drivers can access this page
		if (!req.session.authenticated || req.session.userType !== "driver") {
			res.redirect("/");
		}

		const user = await userModel.findOne({ username: req.session.username });
		res.render("g", { user });
	};

	static g_form_controller = async (req, res) => {
		// Only drivers can access this page!
		if (!req.session.authenticated || req.session.userType !== "driver") {
			res.redirect("/");
		}

		const formData = req.body;

		if (formData.make !== undefined && formData.make !== null && formData.make !== "") {
			// User has submitted the form to update the data
			const dbResponse = await userModel
				.findByIdAndUpdate(formData._id, {
					carDetails: { make: formData.make, model: formData.model, year: formData.year, platNumber: formData.platNumber },
				})
				.exec();
			res.redirect("success");
		} else {
			// User has submitted the form to view the data

			try {
				const user = await userModel.findOne({ licenseNumber: formData.licenseNumber });
				if (user) {
					res.render("g", { user });
				} else {
					res.render("g", { error: "User not found!" });
				}
			} catch (error) {
				res.render("g", { error: "Something went wrong!" });
			}
		}
	};

	static g2_controller = async (req, res) => {
		const message = req.session.message;
		delete req.session.message;

		if (!req.session.authenticated || req.session.userType !== "driver") {
			res.redirect("/");
		}

		const user = await userModel.findOne({ username: req.session.username });
		let displayForm;
		if (user.firstName === "default") {
			displayForm = true;
		} else {
			displayForm = false;
		}

		res.render("g2", { message, displayForm, ...user._doc });
	};

	static g2_form_controller = async (req, res) => {
		if (!req.session.authenticated || req.session.userType !== "driver") {
			res.redirect("/");
			return;
		}

		const formData = req.body;

		const user = await userModel.findOneAndUpdate(
			{ username: req.session.username },
			{
				firstName: formData.firstName,
				lastName: formData.lastName,
				licenseNumber: formData.licenseNumber,
				age: formData.age,
				carDetails: {
					make: formData.make,
					model: formData.make,
					year: formData.year,
					platNumber: formData.platNumber,
				},
			},
		);

		res.redirect("/success");
		return;
	};

	static success_controller = (req, res) => {
		res.render("success");
	};

	static appointment_controller = (req, res) => {
		// Only admin can view this page!
		if (!req.session.authenticated || req.session.userType !== "admin") {
			res.redirect("/");
			return;
		}

		res.render("appointment");
	};
}

export default Controller;
