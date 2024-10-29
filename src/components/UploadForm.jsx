import { useState } from 'react';
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
      setDownloadUrl(`${api.defaults.baseURL}/download/${response.data.imageId}`);

      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error uploading or resizing image');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload and Resize Image</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 border border-gray-300 p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Width"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        className="mb-4 border border-gray-300 p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Height"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="mb-4 border border-gray-300 p-2 rounded w-full"
      />
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="mb-4 border border-gray-300 p-2 rounded w-full"
      >
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
      </select>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={watermark}
          onChange={(e) => setWatermark(e.target.checked)}
          className="mr-2"
        />
        Add Watermark
      </label>
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload & Resize
      </button>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      {downloadUrl && (
        <a href={downloadUrl} download className="text-blue-500 mt-4 block">
          Download Resized Image
        </a>
      )}
    </div>
  );
}

export default UploadForm;
