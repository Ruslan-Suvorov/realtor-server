import mongoose from "mongoose";
import CommentModel from "../model/comment.js";
import { text } from "express";

export const createComment = async (req, res) => {
  const comment = req.body;
  const advertId = comment.advertId;

  if (!mongoose.Types.ObjectId.isValid(advertId)) {
    console.log("Advert doesn`t exist");
    return res.status(404).json({ message: "Advert doesn`t exist" });
  }

  if (comment.commentId) {
    const id = comment.commentId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Comment doesn`t exist");
      return res.status(404).json({ message: "Comment doesn`t exist" });
    }

    try {
      const oldComment = await CommentModel.findOne({ _id: id });

      oldComment.replys.unshift({ ...comment, date: new Date().getTime() });

      const updatedComment = await CommentModel.findByIdAndUpdate(
        id,
        oldComment,
        {
          new: "true",
        }
      );
      res.status(201).json(updatedComment);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    const newComment = new CommentModel({
      ...comment,
      date: new Date().getTime(),
    });

    try {
      await newComment.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const getComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await CommentModel.find({ advertId: id }).sort({
      date: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const { id } = req.params;
  const comment = req.body;
  if (!comment.commentId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Advert doesn`t exist" });
      }

      const oldComment = await CommentModel.findOne({ _id: id });

      oldComment.text = comment.text;

      const uppatedComment = await CommentModel.findByIdAndUpdate(
        id,
        oldComment,
        { new: true }
      );
      res.status(200).json(uppatedComment);
    } catch (error) {
      res.status(404).json({ message: "Something went wrong" });
    }
  } else {
    const { commentId } = comment;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Advert doesn`t exist" });
      }
      const oldComment = await CommentModel.findOne({ _id: commentId });

      const replys = oldComment.replys;
      const reply = replys.find((reply) => reply._id == id);
      reply.text = comment.text;
      const updatedComment = await CommentModel.findByIdAndUpdate(
        commentId,
        oldComment,
        { new: true }
      );
      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(404).json({ message: "Something went wrong" });
    }
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Advert doesn`t exist" });
    }
    await CommentModel.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Advert deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const deleteReply = async (req, res) => {
  const { id } = req.params;
  const commentId = req.body.id;

  console.log(commentId);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Reply doesn`t exist" });
    }

    await CommentModel.updateOne(
      { _id: commentId },
      { $pull: { replys: { _id: id } } }
    );

    const updatedComment = await CommentModel.findOne({ _id: commentId });

    console.log(updatedComment);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
