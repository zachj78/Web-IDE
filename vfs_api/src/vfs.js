const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const app = express();

//postgre model import
const { vfs } = require('./vfs_model');

//cors middleware to avoid annoying ass port mismatch error
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyparser.json());
app.use(express.json());

//file upload endpoints
app.post('/upldFiles', async (req, res) => {
  const { files } = req.body;

  try{
    const result = await vfs.bulkCreate(files);
    res.status(201).json(result);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// // app.put('/updtFiles', async(req, res) => {
// //   const {parentHandleName, fileHandleName} = req.body;

// //   try {
// //     const parentDirectory = await vfs.findOne({ where: { name: parentHandleName, type: 'directory' }});

// //     if(!parentDirectory) {
// //       return res.status(404).json({ error: 'Parent Directory not found' });
// //     }

// //     const file = await vfs.create({ name: fileHandleName, path: '${parentDirectory.path}/${fileHandleName}', type: 'file' });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // app.get('/ftchFiles', async(req, res) => {
// //   try {
// //     const files = await vfs.findAll();
// //     res.status(200).json(files);
// //   } catch(error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // //vfs file renaming operations

// // app.post('/rename', (req, res) => {
// //   const { originalFilePath, newFilePath } = req.body;
// //   console.log('Received rename request:', { originalFilePath, newFilePath });

// //   fs.rename(originalFilePath, newFilePath, (err) => {
// //     if (err) {
// //       console.error('Error renaming file:', err);
// //       return res.status(500).json({ error: 'Failed to rename file', details: err.message });
// //     }

// //     res.json({ message: 'File renamed successfully' });
// //   });
// // });

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
