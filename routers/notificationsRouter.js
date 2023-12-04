import { Router } from "express";
import * as db_notifications from "../databases/db_notifications.js";

const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to notifications router!");
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
    const result = await db_notifications.getFriendRequests(user_id);
    res.status(200).send(result);
  });
});

router.get("/invites", (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error getting invites");
      return;
    }
    if (session === null) {
      res.status(400).send("No session found");
      return;
    }
    const user_id = session.user_id;
    const result = await db_notifications.getEventInvites(user_id);
    res.status(200).send(result);
  });
});

router.patch("/friend/accept", (req, res) => {
  const session = req.cookies.session;
  const friend_id = req.query.friend;
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
    const result = await db_notifications.acceptFriendRequest(
      user_id,
      friend_id
    );
    if (result) {
      res.status(200).send({ success: result });
      return;
    }
    res.status(404).send("Error adding friend");
  });
});

router.delete("/friend/decline", (req, res) => {
  const session = req.cookies.session;
  const friend_id = req.query.friend;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error declining friend");
      return;
    }
    if (session === null) {
      res.status(400).send("No session found");
      return;
    }
    const user_id = session.user_id;
    const result = await db_notifications.declineFriendRequest(
      user_id,
      friend_id
    );
    if (result) {
      res.status(200).send();
      return;
    }
    res.status(404).send("Error adding friend");
  });
});

export default router;
