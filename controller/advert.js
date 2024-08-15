import mongoose from "mongoose";
import AdvertModel from "../model/advert.js";
import UserModel from "../model/user.js";

export const createAdvert = async (req, res) => {
  const advert = req.body;
  const newAdvert = new AdvertModel({
    ...advert,
    createdAt: new Date().getTime(),
  });

  try {
    await newAdvert.save();
    res.status(201).json(newAdvert);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getAdverts = async (req, res) => {
  let page = Number(req.query.page);
  if (isNaN(page)) {
    page = 1;
  }
  let { search, tag } = req.query;
  try {
    const limit = 3;
    const startIndex = (page - 1) * limit;
    let total = await AdvertModel.countDocuments({});
    const searchReg = new RegExp(search, "i");

    let adverts = [];
    if (!search && !tag) {
      adverts = await AdvertModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);
    }
    if (tag) {
      const tagReg = new RegExp(tag, "i");
      adverts = await AdvertModel.find({ tags: { $in: tagReg } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);

      const totalTag = await AdvertModel.find({ tags: { $in: tagReg } });
      total = totalTag.length;
    }
    if (search) {
      adverts = await AdvertModel.find({
        $or: [{ description: searchReg }, { title: searchReg }],
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);
      const totalSearch = await AdvertModel.find({
        $or: [{ description: searchReg }, { title: searchReg }],
      });
      total = totalSearch.length;
    }

    res.status(200).json({
      data: adverts,
      page,
      total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getAdvert = async (req, res) => {
  const { id } = req.params;
  try {
    const advert = await AdvertModel.findById(id);
    res.status(200).json(advert);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getAdvertsByUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "User doesn`t exist" });
    }
    const adverts = await AdvertModel.find({ creatorId: id });
    res.status(200).json(adverts);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const deleteAdvert = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Advert doesn`t exist" });
    }
    await AdvertModel.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Advert deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const editAdvert = async (req, res) => {
  const { id } = req.params;
  const advert = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Advert doesn`t exist" });
    }
    await AdvertModel.findByIdAndUpdate(id, advert, { new: true });
    res.status(200).json(advert);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const likeAdvert = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.status(404).json({ message: "User isn`t authentificated" });
  }
  const userId = req.userId;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Advert doesn`t exist" });
    }
    let advert = await AdvertModel.findOne({ _id: id });

    const user = await UserModel.findOne({ _id: userId });

    const isLiked = advert.likes.findIndex((like) => like.id == String(userId));

    if (isLiked === -1) {
      advert.likes = advert.likes.push({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
      });
    } else {
      advert.likes = advert.likes.filter((like) => like.id !== String(userId));
    }

    const updatedAdvert = await AdvertModel.findByIdAndUpdate(
      advert._id,
      advert,
      {
        new: "true",
      }
    );
    res.status(200).json(updatedAdvert);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
