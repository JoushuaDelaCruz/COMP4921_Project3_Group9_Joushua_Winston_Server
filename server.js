import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

import "./configs/dotenvConfig.js";
import { corsConfig } from "./configs/corsConfig.js";
import { sessionConfig } from "./configs/sessionConfig.js";

import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import calendarRouter from "./routers/calendarRouter.js";
// import profileRouter from "./routers/profileRouter.js";
import profileRouter from "./routers/profileRouter.js";
import notificationRouter from "./routers/notificationsRouter.js";
import recycleRouter from "./routers/recycleRouter.js";

const app = express();

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession(sessionConfig));

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/calendar", calendarRouter)
// app.use("/profile", profileRouter);
app.use("/profile", profileRouter);
app.use("/notifications", notificationRouter);
app.use("/recycle", recycleRouter);

app.get("/", (req, res) => {
  res.send("Welcome to our server!");
});

app.get("/verify", async (req, res) => {
  const session = req.cookies.session;
  if (session === undefined) {
    res.send(false);
    return;
  }
  req.sessionStore.get(session, (err, session) => {
    if (err) {
      console.log(err);
      res.send(false);
      return;
    }
    if (session === null) {
      res.status(400).send(false);
      return;
    }
    const user = { username: session.username, image: session.image };
    res.send({ authenticated: session.authenticated, user });
  });
});

app.get("*", (req, res) => {
  res.status(404).send("404 Page Not Found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
