var fs = require('fs');
var pkg = require('./package.json');
var qs = require('qs');

var file = fs.readFile('package.json','utf8', function(err, data){
  console.log(data);
});
