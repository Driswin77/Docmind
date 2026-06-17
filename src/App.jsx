import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';
import FileList from './components/FileList';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUploadComplete = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">DocMind</h1>
      <div className="main-content">
        <aside className="panel left-panel">
          <FileUpload onUploadComplete={handleUploadComplete} />
          <FileList refresh={refresh} />
        </aside>
        <Chat />
      </div>
    </div>
  );
}

export default App;