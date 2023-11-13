import dotenv from "dotenv";

dotenv.config();

export const corsConfig = {
  origin: process.env.CLIENT_LOCAL_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};
