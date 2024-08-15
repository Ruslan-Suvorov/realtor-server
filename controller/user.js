import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserModel from "../model/user.js";
import AdvertModel from "../model/advert.js";

export const secret = "test";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn`t exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "12h",
    });

    return res
      .status(200)
      .json({ result: user, message: "Signin is done", token });
  } catch (error) {
    res.status(500).json({ message: error });

    console.log(error);
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, userImage } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "This email is already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userImage,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "12h",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error });

    console.log(error);
  }
};

export const googleSignIn = async (req, res) => {
  const { email, firstName, lastName, googleId, userImage } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      const result = {
        _id: user._id.toString(),
        email,
        firstName,
        lastName,
        userImage,
      };
      const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "12h",
      });
      return res.status(200).json({ result, token });
    }

    const result = await UserModel.create({
      email,
      firstName,
      lastName,
      googleId,
      userImage,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "12h",
    });
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: "ID is not defined" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "User doesn`t exist" });
    }

    const user = await UserModel.findOne({ _id: id }, "-password -googleId");
    const adverts = await AdvertModel.find(
      { creatorId: id },
      "-description -price -imageFile -creatorId -creatorFirstName -creatorLastName -createdAt -likes -tags"
    );
    const profile = {
      ...user._doc,
      adverts,
    };
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ message: error });
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "User doesn`t exist" });
    }

    let result = await UserModel.findOne({ _id: id });

    for (let key in userData) {
      result[key] = userData[key];
    }
    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "12h",
    });

    await UserModel.findOneAndUpdate({ _id: id }, { $set: userData });
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
