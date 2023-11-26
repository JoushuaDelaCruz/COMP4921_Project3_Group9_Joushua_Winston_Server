import { Router } from "express";
import * as db_profile from "../databases/db_profile.js";

const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to profile router!");
});

router.get("/friends", (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error getting friends");
      return;
    }
    if (session === null) {
      res.status(400).send("No session found");
      return;
    }
    const user_id = session.user_id;
    const result = await db_profile.getFriends(user_id);
    res.status(200).send(result);
  });
});

router.get("/randomUsers", async (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error getting random users");
      return;
    }
    if (session === null) {
      res.status(400).send("No session found");
      return;
    }
    const user_id = session.user_id;
    const result = await db_profile.getRandomUsers(user_id);
    res.status(200).send(result);
  });
});

router.get("/searchFriends", async (req, res) => {
  const session = req.cookies.session;
  const name = req.query.name;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error searching users");
      return;
    }
    if (session === null) {
      res.status(400).send("No session found");
      return;
    }
    const user_id = session.user_id;
    const result = await db_profile.searchFriends(user_id, name);
    res.status(200).send(result);
  });
});

router.post("/addFriend", async (req, res) => {
  const session = req.cookies.session;
  const friend_id = req.body.friend_id;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding friend");
      return;
    }
    if (session === null) {
      res.status(400).send("No session found");
      return;
    }
    const user_id = session.user_id;
    const result = await db_profile.addFriend(user_id, friend_id);
    if (result.success) {
      res.status(200).send(true);
      return;
    }
    res.status(result.status).send(result);
  });
});

export default router;
