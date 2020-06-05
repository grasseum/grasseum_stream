Duplex = require('stream').Duplex,
util = require('util');


var fs = require("fs");
var path = require("path");

var duplexStreamReadonly = function( location ) {
//Readable.call(this, {objectMode: true});


this.data = "";
this.curIndex = 0;
this.boll1 = true;
this.count = 0;
this.refchunk = null;
this.location = location;
//this.flags = flags;


Duplex.call(this, {readableObjectMode: true,writableObjectMode: true,objectMode: true});
 
};

util.inherits(duplexStreamReadonly, Duplex);


//duplexStreamReadonly.prototype._final = function(callback) {
//  console.log("final")
//  callback();
//}
duplexStreamReadonly.prototype._write = function(chunk, encoding, callback) {
  //
  var main = this;

 // if(chunk["is_valid"]){
    var to_data_string =  chunk//.toString()
    //console.log(chunk,":wto_data_string+1")
  //this.push(chunk)
  //main.emit("finish");
    
  //main.emit("resume");
   
    var data = fs.createWriteStream( path.join(this.location,chunk['filename']) );
    data.write( chunk.contents);
    //data.on("finish",function(){
    //  console.log("finish . . .");
    this.push(chunk);
    this.refchunk = chunk;
      callback(null,chunk);
   // return  
    //});
    
   
  //}
  
    
  };
  duplexStreamReadonly.prototype._read = function(chunk, encoding) {
    var main = this;
    var data = chunk//.toString();
      var to_data_string =  chunk 
      if( this.refchunk != null){
        //console.log(this.refchunk,":rto_data_string",encoding)
       // this.push(this.refchunk);
        
      }
      
    
      
    //  return this.push(null);
  };

module.exports = function(glb){ return new duplexStreamReadonly(glb); }
