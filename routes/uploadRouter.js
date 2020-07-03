const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(cors.cors, authenticate.veryUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /dishes');
})
.post(cors.corsWithOptions,authenticate.veryUser, authenticate.verifyAdminInLine,upload.single('imageFile'),(req,res)=>{
    console.log(req.file);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.veryUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.veryUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /dishes');
})

module.exports = uploadRouter;