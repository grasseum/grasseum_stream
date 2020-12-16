var path = require("path");
var grasseum_util =require("grasseum_util");
var duplex_stream = grasseum_util.stream().duplex; 

var grasseum_directory =require("grasseum_directory");
var files =require("grasseum_files");
var write_file = files.write();
var directory_cmd = grasseum_directory.directory();
var duplexStreamReadonly = function( location ,action) {
  
  
  
  this.data = "";
  this.curIndex = 0;
  this.boll1 = true;
  this.count = 0;
  this.refchunk = null;
  this.location = location;
  this.action = action;
  
};


duplexStreamReadonly.prototype.write = function(action) {
  
  var main = this;
  
  
  
  
  directory_cmd.createFolderRecursivelyIfNotExist(path.join(this.location, action.data.basename))
  
  
  write_file.writeStream(path.join(this.location, action.data.basename),
  action.data.contents
  );
  action.push(action.data);
  this.refchunk = action.data;
  action.callback(null,action.data);
  
  
  
};
duplexStreamReadonly.prototype.read = function(action) {
  var main = this;
  var data =  action.data
  var to_data_string =  action.data; 
  if( this.refchunk != null){
    
    
  }
  
  
  
  
};

module.exports = function(glb,action,event){ 
  
  var src_cls = new duplexStreamReadonly(glb,action); 
  return duplex_stream(event,src_cls)
  
}
