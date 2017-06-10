'use strict'

const fs = require('fs')

module.exports.upload = function (req, res) {
  console.log(req.file);
  fs.readFile(req.file.path, (err, data) => {
    console.log(err);
    var newPath = 'uploads/' + req.file.originalname;
    console.log(newPath);
    fs.writeFile(newPath, data, (err) => {
      fs.unlink(req.file.path)
      res.json({name: req.file.originalname})
    });
  });

}
