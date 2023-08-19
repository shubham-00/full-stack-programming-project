import express from "express";
import Controller from "../Controllers/controllers.js";

const router = express.Router();

router.get("/", Controller.home_controller);

router.get("/login", Controller.login_controller);
router.post("/login", Controller.login_form_controller);

router.get("/signup", Controller.signup_controller);
router.post("/signup", Controller.signup_form_controller);

router.get("/logout", Controller.logout_controller);

router.get("/G", Controller.g_controller);
router.post("/G", Controller.g_form_controller);

router.get("/G2", Controller.g2_controller);
router.post("/G2", Controller.g2_form_controller);
router.post("/appointment-booking", Controller.appointment_booking_controller);

router.get("/success", Controller.success_controller);

router.get("/appointment", Controller.appointment_controller);
router.post("/appointment", Controller.appointment_form_controller);

router.get("/examiner", Controller.examiner_controller);
router.post("/examiner", Controller.examiner_form_controller);

export default router;
