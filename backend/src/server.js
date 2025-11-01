import express from "express";
// const express = require("express");
import notesRoutes from "./routes/notesRoutes.js";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv"; // need to import to get access MONGO_URI
// import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware needed to have access / parse to req.body values {title, content}
app.use(express.json());
// app.use(rateLimiter); // this won't work since we haven't set up our .env with ratelimiter

// random custom middleware function ex, what runs BEFORE you get response back
// app.use(req,res,next)=>{
//   console.log(`req method is ${req.method} & Req URL is ${req.url}`); // Req method is GET & Req URL is /api/notes
//   next(); // will go to next middleware (there isn't any middleware after this one)
// }

// here is where we'd add other services, separating them into different files
app.use("/api/notes", notesRoutes);
// Example other service: app.use("/api/product", productRoutes);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("server started on PORT: ", PORT);
  });
});
