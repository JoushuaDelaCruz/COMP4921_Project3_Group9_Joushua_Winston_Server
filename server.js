import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./configs/dotenvConfig.js";
import { corsConfig } from "./configs/corsConfig.js";

import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import profileRouter from "./routers/profileRouter.js";

const app = express();

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.send("Welcome to our server!");
});

app.get("*", (req, res) => {
  res.status(404).send("404 Page Not Found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
