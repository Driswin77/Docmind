const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    filename: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
});

const Chunk = mongoose.model('Chunk', chunkSchema);

module.exports = Chunk;    