import express from "express";
// const express = require("express");
import notesRoutes from "./routes/notesRoutes.js"
const app = express();

app.use("/api/notes", notesRoutes)


// app.put
// app.post
// app.patch
// app.delete
// app.

app.listen(5001, () => {
  console.log("server started on port 5001 ");
});


