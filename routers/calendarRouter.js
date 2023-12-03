import { Router } from "express";
import * as db_calendar from "../databases/db_calendar.js";
import * as db_profile from "../databases/db_profile.js";
const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to calendar router!");
});

router.get("/userEvents", async (req, res) => {
  if(req.session.authenticated) {
    let results = await db_calendar.getEventsById(req.session.user_id, req.session.username);
    results.forEach((row) => {
      row.is_original = row.username === req.session.username
    })
    res.send({ events: results, success: true });
    return;
  }
  res.status(401).json({ message: "Invalid session" });
  return;
});

router.post("/createEvent", async (req, res) => {
  if(req.session.authenticated) {
    const created_datetime = new Date();
    const eventData = {
      user_id: req.session.user_id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      start_datetime: req.body.start_datetime,
      end_datetime: req.body.end_datetime,
      is_all_day: req.body.is_all_day,
      start_timezone: req.body.start_timezone,
      end_timezone: req.body.end_timezone,
      recurrence_rule: req.body.recurrence_rule,
      created_datetime: created_datetime,
      event_colour: req.body.event_colour || "WIP",
      uuid: req.body.uuid
    }


    const isSuccessful = await db_calendar.createEvent(eventData);
    if (isSuccessful) {
      if (req.body.added_friends) {
        res.redirect(307, '/calendar/sendEventRequest');
        return;
      } else {
        res.json({ success: true });
        return;
      }
    }
    res.status(500).json({ message: "Error creating event" });
    return;
  }
})


router.post("/updateEvent", async (req, res) => {
  if(req.session.authenticated) {
    const created_datetime = new Date();
    const eventData = {
      user_id: req.session.user_id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      start_datetime: req.body.start_datetime,
      end_datetime: req.body.end_datetime,
      is_all_day: req.body.is_all_day,
      start_timezone: req.body.start_timezone,
      end_timezone: req.body.end_timezone,
      recurrence_rule: req.body.recurrence_rule,
      created_datetime: created_datetime,
      event_colour: req.body.event_colour || "WIP",
      uuid: req.body.uuid
    }

    const isSuccessful = await db_calendar.updateEvent(eventData);
    if (isSuccessful) {
      const deleteFriends = req.body.original_friends.filter(value => !req.body.new_friends.includes(value));
      const addFriends = req.body.new_friends.filter(value => !req.body.original_friends.includes(value));
      if(addFriends) {
        const success = db_calendar.sendEventRequest(req.body.uuid, addFriends);
        if (!success) {
          res.status(500).json({ message: "Error adding event requests" });
          return;
        }
      }
      if(deleteFriends) {
        const success = db_calendar.removeEventRequest(req.body.uuid, deleteFriends);
        if (!success) {
          res.status(500).json({ message: "Error removing event requests" });
          return;
        }
      }
      res.json({ success: true });
      return;
    }
    res.status(500).json({ message: "Error updating event" });
    return;
  }
})

router.post("/deleteEvent", async (req, res) => {
  if(req.session.authenticated) {
    let results = await db_calendar.deleteEvent(req.body.uuid, req.session.user_id);
    if (results) {
      res.send({ success: true });
      return;
    }
    res.status(500).json({ message: "Error deleting event" });
    return;
  }
  res.status(401).json({ message: "Invalid session" });
  return;
})

router.post("/sendEventRequest", async (req, res) => {
  const success = db_calendar.sendEventRequest(req.body.uuid, req.body.added_friends);
  if (success) {
    res.json({ success: true });
    return;
  }

  res.status(500).json({ message: "Error sending event requests" });
  return;
})


export default router;
