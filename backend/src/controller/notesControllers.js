import Note from "../models/Note.js";

// export async function getAllNotes(req, res) { 
// could be placeholder here since para not used
export async function getAllNotes(_, res) {
  try {
    const notes = (await Note.find()).sorted({createdAt: -1}); // -1 newest first, 1 oldest first
    //If want specific Note, then put that specific Note in  { }
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const specNote = await Note.findById(req.params.id);
    
    if(!specNote) return res.status(404).json({message:"Note not found!"}) 
    res.status(200).json(specNote);
  } catch (error) {
    console.error("Error in getNoteById controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    const savedNote = await note.save();

    res.status(201).json({ savedNote });
  } catch (error) {
    console.error("Error in createNote controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ updatedNote });
  } catch (error) {
    console.error("Error in updateNote controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    // const { title, content } = req.body;
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: `Deleted ${deletedNote}` });
  } catch (error) {
    console.error("Error in deleteNote controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
