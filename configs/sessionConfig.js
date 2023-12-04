import { mongoStore } from "../classes/mongoStore.js";

const node_session_secret = process.env.SESSION_SECRET;
const expireTime = 60 * 60 * 1000;

export const sessionConfig = {
  secret: node_session_secret,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    maxAge: expireTime,
  },
};
