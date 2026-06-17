import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FileText, Upload, CheckCircle2 } from 'lucide-react';

const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ingest', formData);
      setSuccess(true);
      setMessage(res.data.message || 'File uploaded successfully!');
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setSuccess(false);
      setMessage(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-wrapper">
      <input
        type="file"
        accept=".txt,.pdf,.docx"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <button 
        className="btn btn-blue" 
        onClick={() => fileInputRef.current?.click()}
      >
        <FileText size={18} /> {file ? file.name : 'Choose File'}
      </button>
      
      {!file && <div className="upload-text">Select a PDF, DOCX, or TXT file</div>}
      
      {file && (
        <button className="btn btn-green" onClick={handleUpload} disabled={uploading}>
          <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )}

      {message && (
        <div className={success ? 'success-message' : 'error-message'} style={!success ? { color: 'red', fontSize: '0.875rem', textAlign: 'center'} : {}}>
          {success && <CheckCircle2 size={16} />} {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;