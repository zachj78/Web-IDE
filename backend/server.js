const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

//body parser middleware
app.use(express.json);

//routes
app.get('/filesys/view', (req, res) => {
    const dirPath = path.join(__dirname, )
});