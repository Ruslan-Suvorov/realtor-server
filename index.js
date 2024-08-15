import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./route/user.js";
import advertRouter from "./route/advert.js";
import commentRouter from "./route/comment.js";

const app = express();

dotenv.config();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/auth", userRouter);
app.use("/advert", advertRouter);
app.use("/comment", commentRouter);
app.get("/", (req, res) => {
  res.send("You are connected to API");
});

const mongodbUrl = process.env.MONGODB_URL;

const port = process.env.PORT || 4000;

mongoose
  .connect(mongodbUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is started on port :${port}`);
    });
  })
  .catch((error) => console.log(error));
