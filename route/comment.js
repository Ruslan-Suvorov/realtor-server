import express from "express";
import {
  createComment,
  deleteComment,
  deleteReply,
  editComment,
  getComments,
} from "../controller/comment.js";
const router = express.Router();
import auth from "../middleware/auth.js";

router.post("/create-comment", auth, createComment);
router.patch("/edit-comment/:id", auth, editComment);
router.delete("/delete-comment/:id", auth, deleteComment);
router.patch("/delete-reply/:id", auth, deleteReply);

router.get("/comments/:id", getComments);

export default router;
