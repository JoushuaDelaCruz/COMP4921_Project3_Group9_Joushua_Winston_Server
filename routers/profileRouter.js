import { Router } from "express";
import * as jwt from "./classes/jwt.js";
import * as db_profile from "../databases/db_profile.js";

const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to profile router!");
});

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  let result;
  if (req.cookies.token === undefined) {
    result = await db_profile.getProfileByName(username, null);
  } else {
    const verification = await jwt.verify(req.cookies.token);
    const id = verification.user.id;
    result = await db_profile.getProfileByName(username, id);
  }
  if (result === undefined) {
    res.status(404).send(null);
    return;
  } else {
    res.status(200).send(result);
    return;
  }
});

router.post("/addFriend/:username", async (req, res) => {
  const token = req.body.cookie.token;
  if (token === undefined) {
    res.status(401).json({ success: false, message: "No token found" });
    return;
  }
  const verification = await jwt.verify(token);
  if (!verification.is_valid) {
    res
      .status(401)
      .json({ success: false, message: `Token is ${verification.status}` });
    return;
  }
  const current_user = verification.user.id;
  const username_to_add = req.params.username;
  const result = await db_profile.addFriend(current_user, username_to_add);
  return res.status(result.status).json(result);
});

export default router;
