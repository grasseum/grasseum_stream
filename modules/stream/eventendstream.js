 

var fs = require("fs")
  


var Transform = require('stream').Transform,
    util = require('util');

var TransformFilterStream = function() {
  Transform.call(this, {objectMode: true});
};

util.inherits(TransformFilterStream, Transform);

TransformFilterStream.prototype._destroy = function (chunk, enc, cb) {
  // this.cork();
 
  
 
};



TransformFilterStream.prototype._transform = function(chunk, encoding, callback) {
   
  this.emit("finish");
  callback(null,chunk);
};


 ;
module.exports = TransformFilterStream;



