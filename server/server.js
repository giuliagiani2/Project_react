const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

// API per restituire il JSON di tutti i video leggendo dal file data/video.json
app.get('/videos', (req, res) => {
  const dataFilePath = path.join(__dirname, 'data', 'video.json');

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read data file:', err);
      return res.status(500).json({ error: 'Failed to read data file' });
    }

    try {
      const videos = JSON.parse(data);
      res.json(videos);
    } catch (parseError) {
      console.error('Failed to parse data file:', parseError);
      res.status(500).json({ error: 'Failed to parse data file' });
    }
  });
});

// API per servire la cartella immagini dal server e visualizzare le immagini contenute nel JSON di sopra
app.use('/images', express.static(path.join(__dirname, 'images')));

// Rotta per servire il video in streaming
app.get('/video-stream/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  const videoPath = path.join(__dirname, 'videos', `video${videoId}.mp4`); // Assumendo che i file siano nominati come video1.mp4, video2.mp4, ecc.

  fs.stat(videoPath, (err, stat) => {
    if (err) {
      console.error('Failed to read video file:', err);
      return res.status(404).json({ error: 'Video not found' });
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
