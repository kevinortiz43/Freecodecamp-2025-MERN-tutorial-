import express from "express";
// const express = require("express");
import notesRoutes from "./routes/notesRoutes.js"
import { connectDb } from "./config/db.js";
import dotenv from "dotenv"; // need to import to get access MONGO_URI

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

connectDb();

app.use(express.json())

// here is where we'd add other services, separating them into different files
app.use("/api/notes", notesRoutes);
// Example other service: app.use("/api/product", productRoutes);

app.listen(5001, () => {
  console.log("server started on PORT: ", PORT)
});


