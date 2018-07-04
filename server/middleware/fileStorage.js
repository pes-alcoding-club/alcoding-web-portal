// middleware for multer storage
var multer = require('multer');
const User = require('../models/User');
const File = require('../models/Files');
var fs = require("fs");

// Adds the directory
var addDirectory = function(dir){
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

var diskStorage = function (dir) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
        //TODO: Make better cryptic naming convention for files
    });
    return multer({ storage: storage });
}

module.exports = { diskStorage, addDirectory };