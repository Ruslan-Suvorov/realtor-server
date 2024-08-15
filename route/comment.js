import express from "express";
import {
  createComment,
  deleteComment,
  deleteReply,
  editComment,
  getComments,
} from "../controller/comment.js";
const router = express.Router();

router.post("/create-comment", createComment);
router.get("/comments/:id", getComments);
router.patch("/edit-comment/:id", editComment);
router.delete("/delete-comment/:id", deleteComment);
router.patch("/delete-reply/:id", deleteReply);

export default router;
