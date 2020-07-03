var grasseum_util =require("grasseum_util")  
var trasform_stream = grasseum_util.stream().trasform;



var TransformFilterStream = function() {
  

};


TransformFilterStream.prototype.destroy = function (chunk, enc, cb) {

 
  
 
};



TransformFilterStream.prototype.transform = function(action) {
   
  
  action.callback(null,action.data);

  if(action.data.isLastPath){
    action.emit("grasseum_completed");
  }
  return
};


 ;
module.exports = function(){
  var src_cls = new TransformFilterStream(); 
  return trasform_stream(src_cls)
}

 



