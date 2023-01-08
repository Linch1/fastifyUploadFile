require('dotenv/config');

const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('fastify-multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
var conn = mongoose.connection;
var imageFieldName = 'file';

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  });
  }
});

const upload = multer({ 
    storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
            return callback( new Error('Only images are allowed') )
        }
        callback(null, true);
    },
    limits:{ fileSize: 1024 * 1024 } 
}).single(imageFieldName);

function uploadImage(req, res, next) {
  upload(req, res, (err) => {

    if (err instanceof multer.MulterError) {
        let fileToLargeError = 'File too large, it should be less than 1MB';
        if(err.message == fileToLargeError) return res.status(400).send({ error : { msg: fileToLargeError } } )
        else return res.status(418).send({error: { msg: err.message } })
    } else if (err) {
      return res.status(418).send({ error: { msg: err.message } })
    }
    
    let id;
    if(req.file && req.file.id) id = req.file.id;
    else id = "";
    if( !req.file ) return res.status(400).send({ error : { msg: "file not present" }} );

    req.body.fileName = req.file.filename;
    next();
  });
}

async function deleteFileById( fileId ){
  gfs.remove({ _id: fileId, root: 'uploads' }, (err, gridStore) => { });
}
async function deleteFileByName( fileName, res ){
  gfs.remove({ filename: fileName, root: 'uploads' }, (err, gridStore) => {
    if (err) res.status(404).json({ error: { msg: err } });
    res.status(200).json({ success: { msg: " successfully deleted" } });
  });
}

async function readFile(req, res){
    try {
      gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
          if (!file || file.length === 0) return res.status(404).json({ error: { msg: 'No file exists' } });
          if (file.contentType === 'image/jpeg' || 
              file.contentType === 'image/png'  || 
              file.contentType === 'image/jpg'  ||
              file.contentType === 'image/gif') {
            // res.status(304).send();
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
          } else {
            return res.status(404).json({ error: { msg: 'Not an image' } });
          }
      });
    } catch (error) {
      console.log('[ERROR READING FILE]', error);
      return res.status(500).json({ error: { msg: 'Unknown From Image' } });
    }
}


module.exports = {
    uploadImage,
    deleteFileById,
    deleteFileByName,
    readFile,

    multer,
    storage, 
    upload
};
