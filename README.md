# DocMind

<div align="center">

## Local AI-Powered Document Question Answering System

An intelligent Retrieval-Augmented Generation (RAG) application that enables users to upload PDF and text documents, generate vector embeddings locally using Ollama, and ask natural language questions with context-aware AI responses.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-black)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

# Table of Contents

- Overview
- Features
- Technology Stack
- System Workflow
- Project Structure
- Installation
- Configuration
- Running the Application
- API Endpoints
- Future Enhancements
- Author
- License

---

# Overview

DocMind is a full-stack Retrieval-Augmented Generation (RAG) application that allows users to interact with their own documents using natural language.

The system extracts text from uploaded PDF or TXT files, divides the content into chunks, generates embeddings locally using **Ollama's nomic-embed-text model**, stores them in MongoDB, and retrieves the most relevant information through cosine similarity search before generating AI-powered responses.

Since the application runs on **local AI models**, user data remains private and no document content is sent to external cloud services.

---

# Features

## Document Upload

- Upload PDF documents
- Upload TXT documents
- Automatic text extraction
- Document chunking
- Local embedding generation

## Intelligent Retrieval

- Vector embeddings
- Cosine similarity search
- Top-k context retrieval
- Fast document search
- Semantic matching

## AI Chat

- Ask questions in natural language
- Context-aware answers
- Multi-turn conversations
- Local LLM responses
- Source-grounded answers

## Data Management

- MongoDB storage
- Embedding persistence
- File management
- Document indexing

---

# Technology Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React 19, Vite, Axios, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Ollama, nomic-embed-text |
| Document Processing | pdf-parse, Multer |
| Search | Cosine Similarity |

---

# System Workflow

```
User Uploads PDF/TXT
          │
          ▼
Text Extraction
          │
          ▼
Text Chunking
          │
          ▼
Embedding Generation (Ollama)
          │
          ▼
MongoDB Storage
          │
          ▼
User Question
          │
          ▼
Question Embedding
          │
          ▼
Cosine Similarity Search
          │
          ▼
Top Matching Chunks
          │
          ▼
LLM Response
```

---

# Project Structure

```
DocMind/

├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/DocMind.git

cd DocMind
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Install Backend Dependencies

```bash
cd backend

npm install
```

---

# Configuration

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

---

# Install Ollama

Download and install Ollama from:

https://ollama.com

Pull the required models:

```bash
ollama pull llama3

ollama pull nomic-embed-text
```

Start the Ollama server.

```bash
ollama serve
```

---

# Running the Application

Start the backend server.

```bash
cd backend

node server.js
```

Start the frontend.

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

# API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/ingest` | Upload and process document |
| POST | `/ask` | Ask questions about uploaded documents |

---

# Screenshots

Create a `screenshots/` folder and add images such as:

```
screenshots/

home.png

upload.png

chat.png

response.png
```

---

# Future Enhancements

- Support DOCX documents
- Multiple document collections
- Streaming AI responses
- Hybrid vector search
- Citation highlighting
- User authentication
- Chat history
- FAISS/ChromaDB integration
- Drag-and-drop uploads
- Cloud deployment

---

# Author

**Driswin Kumar K**

Full Stack Developer

---

# License

This project is licensed under the MIT License.

---

<div align="center">

Built to enable private, secure, and intelligent document-based conversations using Local AI and Retrieval-Augmented Generation (RAG).

</div>
