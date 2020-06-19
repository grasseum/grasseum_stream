var grasseum_resources = require("grasseum_resources");

 var grasseum_util =require("grasseum_util")
var compt = require("compts")
 var read_stream = grasseum_util.stream().read; 
var ReadStream = function( files ,config,action) {

  this.files = compt._.to_array(files);
   
  this.list_file = [];
  this.is_bool = false;
  this.action = action;
   
  
  this.httpRequestMultipleURL = new grasseum_resources.httpRequestMultipleURL(config);
};



 
ReadStream.prototype.read = function(action) {
    var main = this;

		
	this.httpRequestMultipleURL.fetch(this.files,
		function(urlpath,res){
					
			var list_chunk_data = [];
			res.on('data', function (chunk_data) {
				list_chunk_data.push(chunk_data.toString());
			});
			res.on('end', function (chunk_data) {

						console.log("Accessing the URL path: " + urlpath);
						console.log("* * * * * * * * * " );
						console.log("Got response: " + res.statusCode);
						var split_element = urlpath.split("/")
						var raw_order =(main.list_file.length == 0?"first":(main.list_file.length>=(main.files.length-1)?"last":""));
							var val = split_element[split_element.length-1];
						
							var isFirstRaw = main.list_file.length == 0;
							var isLastRaw = main.list_file.length>=(main.files.length-1);
							main.list_file.push(urlpath);
					
						action.push(grasseum_util.readStream({
								contents:new Buffer(list_chunk_data.join().toString()),
								path:val,//.path,
								filename:val,//.filename,
								cwd:main.action.argv.cwd,
								base:main.action.argv.cwd,
								isFirstPath:isFirstRaw,
								isLastPath:isLastRaw
								//fileOrder:raw_order
							}))	
							

						if(main.list_file.length >= main.files.length){
							action.destroy();
						}
							
						 
					});
					
				},function(urlpath,e){
					console.log("Accessing the URL path: " + urlpath);
					console.log("* * * * * * * * * " );
					console.log("Got error: " + e.message);
				}
	)
				
 
    
};



module.exports=  function( files ,config,action,event){
	//ReadStream = function( files ,action,event)
	var src_cls = new ReadStream(files,config ,action)
	return read_stream(event,src_cls)
};




