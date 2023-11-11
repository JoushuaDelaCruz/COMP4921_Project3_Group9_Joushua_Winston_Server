import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// const session = require("express-session");
// const mongoStore = require("connect-mongo");
import dotenv from "dotenv";
import { corsConfig } from "./configs/corsConfig.js";

import userRouter from "./routers/userRouter.js";

const app = express();
dotenv.config();

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRouter);

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
