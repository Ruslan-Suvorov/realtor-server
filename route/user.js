import express from "express";
import {
  getProfile,
  googleSignIn,
  signin,
  signup,
  updateUser,
} from "../controller/user.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google-signin", googleSignIn);
router.get("/profile/:id", getProfile);
router.patch("/update-user/:id", updateUser);

export default router;
