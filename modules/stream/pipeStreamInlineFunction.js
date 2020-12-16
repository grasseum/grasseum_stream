var grasseum_directory =require("grasseum_directory");
var glob =require("grasseum_glob");
var files =require("grasseum_files");
var read_file = files.read();
//var directory_cmd = grasseum_directory.directory();
var grasseum_util =require("grasseum_util")
var compt = require("compts");

var trasform_stream = grasseum_util.stream().trasform;

var pipeStreamInline  = function( func ,config) {
	
	
	 
	this.func = func;
	var localAction = config|{};
	 
	this.config = compt._.varExtend({
		 
	  },localAction);
	
};


pipeStreamInline.prototype.complete = function(clean_lines,data,done,self){
	clean_lines.push(data);
	clean_lines.forEach(self.push.bind(self))
	done()
  }


pipeStreamInline.prototype.transform = function(action) {
	var self = this;
	var refData = action.data['contents'].toString();
	var clean_lines = [];
	if(action.data.isGrasseumPlatform()){
		 
		self.func({
			"readData":function(){
				return refData;
			},
			"filename":action.data.filename,
			"path":action.data.path,
			"writeData": function(data){
				action.data['contents'] =  Buffer.from(data);
			},
			"done":function(){
				 
				self.complete(clean_lines,action.data,action.callback,action.self)
			}
		});
		
		 
	}
}

module.exports=function(func ,config){
	var src_cls = new pipeStreamInline(func ,config);
	return trasform_stream(src_cls)
} 