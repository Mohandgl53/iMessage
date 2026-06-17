import dns from "node:dns";
import path from "node:path";
import fs from "fs";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from '@clerk/express'
import job from "./lib/cron.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public");

app.use(express.json());
app.use(cors({
  origin: FRONTEND_URL || true,
  credentials: true
}));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server started on port", PORT);

  if(process.env.NODE_ENV === "production") job.start();
});