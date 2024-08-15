import mongoose from "mongoose";

const advertSchema = mongoose.Schema({
  title: String,
  description: String,
  price: {
    type: Number,
    default: 0,
  },
  imageFile: String,
  creatorId: String,
  creatorFirstName: String,
  creatorLastName: String,
  createdAt: {
    type: Date,
    default: new Date().getTime(),
  },
  likes: {
    type: [{ id: String, name: String }],
    default: [],
  },
  tags: [String],
});

const AdvertModel = mongoose.model("Advert", advertSchema);

export default AdvertModel;
