
    Readable = require('stream').Readable,
    util = require('util');


var http = require("http");
var https = require("https");
var url = require('url');


var fs = require("fs")
 var grasseum_directory =require("grasseum_directory")

 var grasseum_core =require("grasseum_core")
var ReadStream = function( files) {
  //Readable.call(this, {objectMode: true});
  Readable.call(this, {objectMode: true,highWaterMark:128});
  this.files = files;
this.list_file = [];
  this.is_bool = false;
};

util.inherits(ReadStream, Readable);

ReadStream.prototype._read = function(chunk, encoding) {
     var main = this;
	
 var list_raw_file = [];
			// main.emit("resume");

			this.files.forEach(element => {
					//console.log(element,":element");
					
    
					if(main.list_file.indexOf(element)  == -1){
						var options = url.parse(element, true);
						//console.log(options,":options")
					if(options.protocol == "https:"){
						var local_http = https;
						options.port=443
						options.method='GET'
					}else{
						var local_http = http;
						options.port=80
						options.method='GET'
					}    

					local_http.get(options, function(res) {
					//	console.log("Got response: " + res.statusCode);
						//console.log(res);
						var list_chunk_data = [];
						res.on('data', function (chunk_data) {
							list_chunk_data.push(chunk_data.toString());
						 });
						 res.on('end', function (chunk_data) {
								  // console.log('BODY: ' + chunk);
							//	  console.log("Data pulling completed")
							var split_element = element.split("/")
							//   main.complete([],chunk,done)
								//	main.push({"filesrc":{
								//		"filename":split_element[split_element.length-1]
								//	},"content":chunk_data.toString(),"is_valid":false});
								var val = split_element[split_element.length-1];
								main.push(grasseum_core.readStream({
									contents:list_chunk_data.join(""),
									path:val,//.path,
									filename:val//.filename
								}))	
						 });
					  }).on('error', function(e) {
					
					//	console.log("Got error: " + e.message);
					//	main.complete([],"",done)
					  });
					}  
					main.list_file.push(element);
			});  	
 
    
};


//
module.exports= ReadStream;
//exports.read = ReadStream;
//exports.tranform = TransformFilterStream;



