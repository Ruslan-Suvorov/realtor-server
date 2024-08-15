import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  userImage: String,
});

export default mongoose.model("User", userSchema);
