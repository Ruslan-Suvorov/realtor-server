import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  name: String,
  advertId: String,
  creatorId: String,
  userImage: String,
  text: String,
  date: {
    type: Date,
    default: new Date(),
  },
  replys: [
    {
      name: String,
      commentId: String,
      creatorId: String,
      userImage: String,
      text: String,
      date: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;
