const Chunk = require('../models/Chunk');
const { Ollama } = require('ollama');
const ollama = new Ollama({ host: 'http://localhost:11434' });
const similarity = require('compute-cosine-similarity');  // <-- add this

exports.askQuestion = async (req, res) => {
  try {
    const { question, history = [] } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided' });

    // 1. Embed the question using Ollama
    const embeddingResponse = await ollama.embeddings({
      model: 'nomic-embed-text',
      prompt: question,
    });
    const questionEmbedding = embeddingResponse.embedding;

    // 2. Fetch all chunks from the database (brute‑force search)
    const allChunks = await Chunk.find().lean();
    if (allChunks.length === 0) {
      return res.json({ answer: "No documents have been uploaded yet. Please upload a file first." });
    }

    // 3. Compute cosine similarity for each chunk
    const scored = allChunks.map(chunk => ({
      ...chunk,
      score: similarity(questionEmbedding, chunk.embedding)
    }));

    // 4. Sort by score (highest first) and take top 5
    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, 5);

    // 5. Build context from the best matching chunks
    const context = results.map(r => r.text).join('\n\n');

    // 6. Generate answer using Ollama (llama3.2)
    const prompt = `You are a helpful assistant that answers questions based ONLY on the provided context. If the answer is not in the context, say "I don't have enough information to answer that." Keep answers concise.

Context:
${context}

Question: ${question}`;

    const answerResponse = await ollama.chat({
      model: 'llama3.2:3b',
      messages: [{ role: 'user', content: prompt }],
      options: { temperature: 0.3 },
    });

    const answer = answerResponse.message.content;
    res.json({ answer, sources: results.map(r => ({ filename: r.filename, score: r.score })) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};