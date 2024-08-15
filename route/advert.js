import express from "express";
const router = express.Router();

import {
  createAdvert,
  deleteAdvert,
  editAdvert,
  getAdvert,
  getAdverts,
  getAdvertsByUser,
  likeAdvert,
} from "../controller/advert.js";
import auth from "../middleware/auth.js";

router.post("/create-advert", auth, createAdvert);
router.patch("/edit-advert/:id", auth, editAdvert);
router.delete("/delete-advert/:id", auth, deleteAdvert);
router.patch("/like/:id", auth, likeAdvert);

router.get("/:id", getAdvert);
router.get("/", getAdverts);
router.get("/dashboard/:id", auth, getAdvertsByUser);

export default router;
