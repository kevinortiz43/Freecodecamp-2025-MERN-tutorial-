import mongoose from "mongoose";

// 1. create a schema (template for database entry)
// 2. model based off of that schema

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
},
{timestamps: true} // createdAt, updatedAt
);

// to create a new Note based on the noteSchema
const Note = mongoose.model("Note", noteSchema)

export default Note