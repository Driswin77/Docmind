const fs = require('fs');
const path = require('path'); // to check file extension
const pdfParse = require('pdf-parse');  
const Chunk = require('../models/Chunk');
const { Ollama } = require('ollama');
const ollama = new Ollama({ host: 'http://localhost:11434' });

function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + chunkSize;
    if (end > text.length) end = text.length;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }
  return chunks;
}

exports.ingestFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let text;
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (fileExtension === '.txt') {
      text = fs.readFileSync(file.path, 'utf8');
    } else if (fileExtension === '.pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else {
      // Unsupported file type
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Only .txt and .pdf files are supported' });
    }

    fs.unlinkSync(file.path);

    const chunks = chunkText(text);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      // Ollama embeddings
      const embeddingResponse = await ollama.embeddings({
        model: 'nomic-embed-text',
        prompt: chunk,
      });
      const embedding = embeddingResponse.embedding;

      await Chunk.create({
        text: chunk,
        embedding: embedding,
        filename: file.originalname,
        chunkIndex: i,
      });
    }

    res.json({ message: `Ingested ${chunks.length} chunks from ${file.originalname}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};