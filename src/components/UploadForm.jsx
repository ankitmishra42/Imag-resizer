import  { useState } from 'react';
import { api } from '../api/apiConfig';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [format, setFormat] = useState('png');
  const [watermark, setWatermark] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('format', format);
    formData.append('watermark', watermark);

    try {
      const response = await api.post('/upload', formData);
      print({response});
      setDownloadUrl("${api.defaults.baseURL}/download/${response.data.imageId}");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error uploading or resizing image');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Upload and Resize Image</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="number"
        placeholder="Width"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      <input
        type="number"
        placeholder="Height"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={watermark}
          onChange={(e) => setWatermark(e.target.checked)}
        />
        Add Watermark
      </label>
      <button onClick={handleUpload}>Upload & Resize</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {downloadUrl && <a href={downloadUrl} download>Download Resized Image</a>}
    </div>
  );
}

export default UploadForm;