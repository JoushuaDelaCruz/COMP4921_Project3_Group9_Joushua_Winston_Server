import MongoStore from "connect-mongo";

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

export const mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@database.dqrkyqg.mongodb.net/?retryWrites=true&w=majority`,
  crypto: {
    secret: mongodb_session_secret,
  },
});
