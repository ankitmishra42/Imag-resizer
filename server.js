import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), async (req, res) => {
  const { width, height, format, watermark } = req.body;
  try {
    const imageId = `${uuidv4()}.${format || 'png'}`;
    const image = sharp(req.file.buffer);

    if (width && height) {
      image.resize(parseInt(width), parseInt(height));
    } else if (width) {
      image.resize(parseInt(width));
    } else if (height) {
      image.resize(null, parseInt(height));
    }

    // if (watermark) {
    //   const watermarkBuffer = await sharp('path/to/watermark.png').resize(100).toBuffer();
    //   image.composite([{ input: watermarkBuffer, gravity: 'southeast' }]);
    // }

    await image.toFile(path.join(__dirname, 'uploads', imageId));
    res.json({ imageId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image');
  }
});

app.get('/api/download/:imageId', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.imageId);
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('File not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});






// /your-project-folder
//   ├── /images
//   ├── /src
//   │   ├── /api
//   │   │   └── apiConfig.jsx
//   │   └── /components
//   │   │   └── UploadForm.jsx
//   │   └── App.jsx
//   ├──nude_modules
//   │   └── server.js 
//   └── package.json