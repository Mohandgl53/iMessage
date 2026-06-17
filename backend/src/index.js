import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";

import "dotenv/config";

import fs from "fs";
import path from "node:path";

import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from '@clerk/express'

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(),"public");

app.use(express.json);
app.use(cors({origin:FRONTEND_URL,credentials:true}));
app.use(clerkMiddleware())

app.get("/health",(req,res)=>{
    res.status(200).json({ok:true});
});

if(fs.existsSync(publicDir)){
  app.use(express.static(publicDir));

  app.get("/{*any",(req,res,next)=>{
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  })
}

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });
}

app.listen( PORT, ()=>{ 
    connectDB();
    console.log("Server is started and running on port", PORT)
});