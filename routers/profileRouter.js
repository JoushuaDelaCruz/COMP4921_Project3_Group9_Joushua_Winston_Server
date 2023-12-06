import { Router } from "express";
import * as db_profile from "../databases/db_profile.js";

const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to profile router!");
});

router.post("/createGroup", async (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error creating group" });
      return;
    }
    if (session === null) {
      res.status(400).json({ message: "Invalid session" });
      return;
    }
    const group_name = req.body.group_name;
    const group_members = req.body.members;
    const user_id = session.user_id;
    const group_id = await db_profile.createGroup(group_name, user_id);
    if (group_id === null) {
      res.status(500).json({ message: "Error creating group" });
      return;
    }
    const result = await db_profile.addGroupMembers(group_id, group_members);
    if (result) {
      res.status(200).send(true);
      return;
    }
    res.status(500).send(false);
  });
});

router.get("/searchAcceptedFriends", async (req, res) => {
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
    const result = await db_profile.searchAcceptedFriends(user_id, name);
    res.status(200).send(result);
  });
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
