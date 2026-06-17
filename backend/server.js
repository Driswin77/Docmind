require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ingestRoutes = require('./routes/ingest');
const askRoutes = require('./routes/ask');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/ingest', ingestRoutes);
app.use('/api/ask', askRoutes);

// Delete all chunks for a specific filename
app.delete('/api/documents/:filename', async (req, res) => {
  try {
    const Chunk = require('./models/Chunk');
    const filename = decodeURIComponent(req.params.filename);
    const result = await Chunk.deleteMany({ filename: filename });
    res.json({ message: `Deleted ${result.deletedCount} chunks from ${filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all distinct filenames (uploaded documents)
app.get('/api/documents', async (req, res) => {
  try {
    const Chunk = require('./models/Chunk');
    const filenames = await Chunk.distinct('filename');
    res.json({ filenames });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));