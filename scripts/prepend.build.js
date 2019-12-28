const fs = require('fs');
const pjson = require('../package.json');

var files = [
  "./dist/amd-app/angular-material.css",
  "./dist/amd-app/angular-material-datatransfer.css",
  "./dist/amd-app/angular-material-datatransfer-es5.js",
  "./dist/amd-app/angular-material-datatransfer-es2015.js",
]

// var buildVersion = process.argv[2];

files.forEach(file => {
  const data = fs.readFileSync(file)
  const fd = fs.openSync(file, 'w+')
  const insert = Buffer.from("/*! " + pjson.name + " - " + pjson.version + " */ \n")
  fs.writeSync(fd, insert, 0, insert.length, 0)
  fs.writeSync(fd, data, 0, data.length, insert.length)
  fs.close(fd, (err) => {
    if (err) throw err;
  });
});