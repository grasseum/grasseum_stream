var compt = require("compts");

//const readStream = require("grasseum_stream/stream/readStream");
var fs = require("fs");
const eventendstream = require("../modules/stream/eventendstream");

exports.allocate = function(final_glb){
   return {

                     
      series:function(name){
 
         final_glb['execute'].push({
            "type":"series",
            "module":name
         })
         return this;
       },
       parallel:function(){

          var listArg = [];
         for(var i in arguments){

            listArg.push(arguments[i])
         }

         final_glb['execute'].push({
            "type":"parallel",
            "module":listArg
         })
          return this;
      }

      
       
       
   }
}
//https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
_call_stream_module = function(stream , name,callback){
   if(typeof(stream[name]) !="undefined"){
      stream[name]["load"]().pipe(new eventendstream())
         .on("finish",function(){
            console.log("\x1b[32m","Stream name `"+name+"` completed !","\x1b[0m");
            //console.log("\x1b[47m","");
            callback();
         });
   }else{
      console.log("\x1b[31m","Stream name `"+name+"` does not exist","\x1b[0m");
      callback();
   }
}

exports.prepare_execute = function(final_glb,clbk, types,name){
   var cls_list = {

                     
      series:function(){
      
         _call_stream_module(final_glb['stream'],name,function(){
                  final_glb['execute'].shift();
                  //console.log("Stream name `"+name+"` completed");
                  clbk();
         });
       },
       parallel:function(){
            var len_exec = name.length;
            var cntr_exec = 0;
            name.forEach(element => {
              
           _call_stream_module(final_glb['stream'],element,function(){
                 // console.log("Stream name `"+element+"` completed");
                  cntr_exec++;
                  if(cntr_exec>=len_exec){
                     final_glb['execute'].shift();
                     clbk();
                  }
            });
         
      });
      }
   };

   cls_list[types]();
}