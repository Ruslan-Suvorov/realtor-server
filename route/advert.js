import express from "express";
const router = express.Router();

import {
  createAdvert,
  // createComment,
  deleteAdvert,
  // deleteComment,
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
router.get("/advert/:id", getAdvert);
router.patch("/like/:id", auth, likeAdvert);

router.get("/adverts", getAdverts);
router.get("/dashboard/:id", auth, getAdvertsByUser);

export default router;
