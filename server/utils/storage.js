var fs = require('fs')
const User = require('../models/User')
const File = require('../models/Files')

var uploadText = function (filename, user_id, text) {
  fs.writeFile(process.cwd() + '\\temp\\' + filename, text, function (err) {
    if (err) {
      throw new Error('Error Creating a file');
    }
  })
  var size = fs.statSync(process.cwd() + '\\temp\\' + filename)['size'];
  File.find(
    {
      user_id: user_id,
      originalname: filename
    },
    function (err) {
      if (err) {
        throw new Error('Error: Server error')
      } else {
        var uploadFile = new File();

        uploadFile.originalname = filename;
        uploadFile.encoding = 'UTF-8';
        uploadFile.mimetype = 'text/plain';
        uploadFile.destination = process.cwd() + '\\temp\\' + filename;
        uploadFile.size = size;
        uploadFile.filename = filename;
        uploadFile.user_id = user_id;

        uploadFile.save(function (err, file) {
          if (err) {
            throw new Error('Error: Server error');
          }
          console.log(file._id + ' Added to DB.');
          User.findOneAndUpdate(
            {
              _id: user_id
            },
            {
              $push: { files: file._id }
            },
            { new: true },
            function (err, user) {
              if (err) {
                throw new Error('Error: Server error');
              } else {
                console.log('File added to user ' + user._id);
                return file._id;
              }
            }
          )
        })
      }
    }
  )
}

var uploadFile = function (file, user_id) {
  File.find(
    {
      user_id: user_id,
      originalname: file.originalname
    },
    function (err) {
      if (err) {
        throw new Error('Error: Server error')
      } else {
        var uploadFile = new File();

        uploadFile.originalname = file.originalname;
        uploadFile.encoding = file.encoding;
        uploadFile.mimetype = file.mimetype;
        uploadFile.destination = file.destination;
        uploadFile.filename = file.filename;
        uploadFile.size = file.size;
        uploadFile.user_id = user_id;

        uploadFile.save(function (err, file) {
          if (err) {
            throw new Error('Error: Server error');
          }
          console.log(file._id + ' Added to DB.');
          User.findOneAndUpdate(
            {
              _id: user_id
            },
            {
              $push: { files: file._id }
            },
            { new: true },
            function (err, user) {
              if (err) {
                throw new Error('Error: Server error');
              } else {
                console.log('File added to user ' + user._id);
                return file._id;
              }
            }
          )
        })
      }
    }
  )
}

module.exports = { uploadText, uploadFile }
