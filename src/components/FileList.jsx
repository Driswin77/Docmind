import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, File as FileIcon } from 'lucide-react';

const FileList = ({ refresh, onDelete }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/documents');
      setFiles(res.data.filenames);
    } catch (err) {
      setErrorMsg(`Failed to load files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Delete "${filename}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/documents/${encodeURIComponent(filename)}`);
      fetchFiles();
      if (onDelete) onDelete(filename);
    } catch (err) {
      setErrorMsg(`Error deleting: ${err.response?.data?.error || err.message}`);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refresh]);

  const getExt = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'txt';
  };

  return (
    <>
      <div className="doc-section-title">Uploaded Documents</div>
      <div className="doc-count">Total Documents: {files.length}</div>
      
      {loading ? (
        <div className="upload-text">Loading...</div>
      ) : files.length === 0 ? (
        <div className="upload-text">No documents uploaded yet.</div>
      ) : (
        <div className="doc-list">
          {files.map((file, idx) => {
            const ext = getExt(file);
            return (
              <div key={idx} className="doc-item">
                <div className={`doc-icon ${ext}`}>
                  {ext === 'pdf' ? 'PDF' : ext === 'docx' ? 'DOC' : <FileIcon size={20} />}
                </div>
                <div className="doc-info">
                  <div className="doc-name">{file}</div>
                  <div className="doc-size">Uploaded</div>
                </div>
                <button className="btn-delete" title="Delete file" onClick={() => deleteFile(file)}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      {errorMsg && (
        <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}
      <div className="upload-hint">You can upload PDF, DOCX or TXT files.</div>
    </>
  );
};

export default FileList;