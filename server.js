import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";

import "./configs/dotenvConfig.js";

import { corsConfig } from "./configs/corsConfig.js";
import { sessionConfig } from "./configs/sessionConfig.js";

import userRouter from "./routers/userRouter.js";

const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionConfig));

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
