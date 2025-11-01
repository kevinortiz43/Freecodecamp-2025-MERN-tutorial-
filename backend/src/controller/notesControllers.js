import Note from "../models/Note.js";

// export async function getAllNotes(req, res) { 
// could be placeholder here since para not used
export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sorted({createdAt: -1}); // -1 newest first, 1 oldest first
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
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



///////////////
// Vanilla Node.js version
const http = require('http');

// In-memory storage (replaces database)
let notes = [];
let currentId = 1;

// parseBody helper does this (below in express): 
 const { title, content } = req.body;

// Helper function to parse req.body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Helper function to extract ID from URL
function extractIdFromPath(pathname) {
  const parts = pathname.split('/');
  return parseInt(parts[parts.length - 1]);
}

// Controller functions
async function getAllNotes(req, res) {
  try {
    // Sort by createdAt descending (newest first)
    const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.writeHead(200);
    res.end(JSON.stringify(sortedNotes));
  } catch (error) {
    console.error("Error in getAllNotes controller ", error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function getNoteById(req, res, pathname) {
  try {
// httplocalhost:5001/api/notes/123345567
    const id = extractIdFromPath(pathname);
    const specNote = notes.find(note => note.id === id);
    
    if (!specNote) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: "Note not found!" }));
    }
    
    res.writeHead(200);
    res.end(JSON.stringify(specNote));
  } catch (error) {
    console.error("Error in getNoteById controller ", error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

// POST
async function createNote(req, res) {
  try {
    const body = await parseBody(req);
    const { title, content } = body;
    
    if (!title || !content) {
      res.writeHead(400);
      return res.end(JSON.stringify({ message: "Title and content are required" }));
    }

    const newNote = {
      id: currentId++,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.push(newNote);

    res.writeHead(201);
    res.end(JSON.stringify({ savedNote: newNote }));
  } catch (error) {
    console.error("Error in createNote controller ", error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

// PUT
async function updateNote(req, res, pathname) {
  try {
    const id = extractIdFromPath(pathname);
    const body = await parseBody(req);
    const { title, content } = body;

    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: "Note not found" }));
    }

    const updatedNote = {
      ...notes[noteIndex],
      title: title || notes[noteIndex].title,
      content: content || notes[noteIndex].content,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;

    res.writeHead(200);
    res.end(JSON.stringify({ updatedNote }));
  } catch (error) {
    console.error("Error in updateNote controller ", error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

// DELETE
async function deleteNote(req, res, pathname) {
  try {
    const id = extractIdFromPath(pathname);
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: "Note not found" }));
    }
    
    const deletedNote = notes.splice(noteIndex, 1)[0];
    
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: "Note deleted successfully",
      deletedNote 
    }));
  } catch (error) {
    console.error("Error in deleteNote controller ", error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

// Main request handler
async function handleRequest(req, res) {
  const { method, url } = req;
  
  // Simple URL parsing (since we don't have Express)
  const [pathname, queryString] = url.split('?');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Set content type for all responses
  res.setHeader('Content-Type', 'application/json');

  try {
    // Route handling
    if (pathname === '/api/notes' && method === 'GET') {
      await getAllNotes(req, res);
    } else if (pathname.match(/^\/api\/notes\/\d+$/) && method === 'GET') {
      await getNoteById(req, res, pathname);
    } else if (pathname === '/api/notes' && method === 'POST') {
      await createNote(req, res);
    } else if (pathname.match(/^\/api\/notes\/\d+$/) && method === 'PUT') {
      await updateNote(req, res, pathname);
    } else if (pathname.match(/^\/api\/notes\/\d+$/) && method === 'DELETE') {
      await deleteNote(req, res, pathname);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
}

// Create and start the server
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

// Add some sample data
notes = [
  {
    id: currentId++,
    title: "First Note",
    content: "This is my first note",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: currentId++,
    title: "Second Note", 
    content: "This is my second note",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/notes');
  console.log('  GET    /api/notes/:id');
  console.log('  POST   /api/notes');
  console.log('  PUT    /api/notes/:id');
  console.log('  DELETE /api/notes/:id');
});






