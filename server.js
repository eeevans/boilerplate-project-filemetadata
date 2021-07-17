const express = require('express');
const cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const mime = require('mime');

const app = express();

app.use(cors());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json);
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  console.log("sending index.html")
  res.sendFile(process.cwd() + '/views/index.html');
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})


var fs = require("fs"); // Load the filesystem module

var upload = multer({ storage: storage })
app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  var stats = fs.statSync(__dirname + "/public/uploads/" + file.filename)
  var fileSizeInBytes = stats.size;
  res.json({ name: file.originalname, type: mime.lookup(file.originalname), size: fileSizeInBytes });
  next();
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
