
    Readable = require('stream').Readable,
    util = require('util');


var fs = require("fs")
 var grasseum_directory =require("grasseum_directory");

 var grasseum_core =require("grasseum_core")
var ReadStream = function( files) {
  //Readable.call(this, {objectMode: true});
  Readable.call(this, {objectMode: true});
  this.files = files;
this.list_file = [];

};

util.inherits(ReadStream, Readable);

ReadStream.prototype._read = function(chunk, encoding) {
     var main = this;
	 this.on("resume",function(){
        //var data = chunk//.toString();
        console.log("resume . . .");
        // this.destroy()    
     // }
    });

			
		  grasseum_directory.readFileInDir( this.files, function(val){
      			//	main.pause();
 if( main.list_file.indexOf(val.path) ==-1  ){
		      //  console.log(val,":val",main.list_file.indexOf(val.path));
				var data_readstream = fs.createReadStream(val.path);
				var list_content = [];
				data_readstream.on('data', function (chunk) {
					list_content.push(chunk);
				});
				data_readstream.on("end",function(){
					main.push(grasseum_core.readStream({
						contents:list_content.join(),
						path:val.path,
						filename:val.filename
					}));//{"filesrc":val,"content":list_content.join(""),"is_valid":false});
				});

			  
			  
		      }
			 // main.destroy();
			 //main.emit("finish");
		      if( main.list_file.indexOf(val.path)>=0  ){
				
		//	console.log("exist");					
	//		main.push({"list_raw_file":list_raw_file});
		      //  main.destroy();
		      }
		      main.list_file.push(val.path);

		  });
 
    
};


//
module.exports= ReadStream;
//exports.read = ReadStream;
//exports.tranform = TransformFilterStream;



