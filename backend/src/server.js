import express from "express";
// const express = require("express");
import notesRoutes from "./routes/notesRoutes.js"
import { connectDb } from "./config/db.js";
import dotenv from "dotenv"; // need to import to get access MONGO_URI

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

connectDb();

// middleware needed to have access / parse to req.body values {title, content}
app.use(express.json())

// here is where we'd add other services, separating them into different files
app.use("/api/notes", notesRoutes);
// Example other service: app.use("/api/product", productRoutes);

// random custom middleware function ex, what runs BEFORE you get response back
// app.use(req,res,next)=>{
//   console.log(`req method is ${req.method} & Req URL is ${req.url}`); // Req method is GET & Req URL is /api/notes
//   next(); // will go to next middleware (there isn't any middleware after this one)
// }

app.listen(5001, () => {
  console.log("server started on PORT: ", PORT)
});


