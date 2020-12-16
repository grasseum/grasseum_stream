var grasseum_directory =require("grasseum_directory");
var glob =require("grasseum_glob");
var files =require("grasseum_files");
var read_file = files.read();
//var directory_cmd = grasseum_directory.directory();
var grasseum_util =require("grasseum_util")
var compt = require("compts");
var read_stream = grasseum_util.stream().read; 
var SrcStream = function( files ,action) {
	
	
	this.files = compt._.to_array(files);
	this.list_file = [];
	this.fileCountReference = 0;
	this.action = action; 
	this.CheckFileCount();
	
	
};


SrcStream.prototype.CheckFileCount = function() {
	var main = this;
	glob( this.files, function(val){
		main.fileCountReference++;
	});
	
}


SrcStream.prototype.read = function(action) {
	var main = this;
	
	
	
	glob( this.files, function(val){
		
		if( main.list_file.indexOf(val.path) ==-1  ){
			
			
			read_file.readStream(val.path,function( data ){		
				
				if(compt._.has(data,"complete_data")){
					var isFirstRaw = main.list_file.length == 0;
					var isLastRaw = main.list_file.length>=(main.fileCountReference-1);
					main.list_file.push(val.path);
					var cl = grasseum_util.readStream({
						contents: Buffer.from(data["complete_data"]),
						path:val.path,
						filename:val.filename,
						
						isFirstPath:isFirstRaw,
						isLastPath:isLastRaw,
						cwd:main.action.argv.cwd,
						base:main.action.argv.cwd
					})
					
					
					action.push(cl);
					
					if(main.list_file.length >= main.fileCountReference){
						action.destroy();
					}
				}
				
				
				
				
				
				
			});
			
			
			
		}
		
		
		
	});
	
};



module.exports=function(files ,action,event){
	var src_cls = new SrcStream(files ,action);
	return read_stream(event,src_cls)
} 




