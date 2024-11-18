import React, { useState } from 'react';
import './styles/FileUp.css'

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage('Por favor selecciona un archivo.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // Paso 1: Solicitar URL firmada al backend
      const response = await fetch('https://subir-s3-back.vercel.app/generate-presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });
      const { url } = await response.json();

      // Paso 2: Subir archivo a S3 usando la URL firmada
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (uploadResponse.ok) {
        setMessage('Archivo subido con éxito.');
      } else {
        setMessage('Error al subir el archivo.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    
        <div className="app-container">
        <div className="upload-container">
      <h2>Subir Archivo a S3</h2>
      <input type="file" 
      onChange={handleFileChange} 
      className="file-input"
      />
      
      <button onClick={uploadFile} disabled={uploading}
       className="upload-button">
        {uploading ? 'Subiendo...' : 'Subir'}
        
      </button>
      
      {message && <p>{message}</p>}
      </div>
      </div>
  );
};

export default FileUpload;
