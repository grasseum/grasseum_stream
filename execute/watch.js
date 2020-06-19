var compt = require("compts");


var fs = require("fs");

var grasseum_directory =require("grasseum_directory");
var directory_cmd = grasseum_directory.directory();

let config = require("./config");
let stream = require("./stream");
exports.prep_thread_module = function(final_glb){


   return {

      
      watch:{
         prep:function(name,attr,callback){

            var value_thread_config = config.thread_config(attr,callback);
            final_glb['thread'].push({
               "types":"watch",
               "name":name,
               "attr":value_thread_config['attr'],
               "local_details":value_thread_config['local_details']
            });
            return this;
            
         },
         run:function(attr,final_glb,eventEmitter){
          
            
            var local_attr  = attr['attr'];
            var is_valid_update = false;
            var set_interval = setInterval(function(){
               
             
               var current_time_ms = new Date().getTime();
               directory_cmd.readFileInDir( compt._.to_array(attr['name']) , function(val){
                  var stats_mtime = val.stat.mtimeMs;   
                if(current_time_ms-local_attr['delay']<=stats_mtime){
                 
                   is_valid_update = true;
                  
                   }
                  
               });
               if(is_valid_update){
                 
                  stream.prepare_init_execute( compt._.clone(attr['local_details']['execute']),final_glb ,eventEmitter);
                   is_valid_update = false;
               }
            },local_attr['delay']);
         }
      }
   }

}
 
exports.allocate_thread = function(final_glb,action){

   var prep_value = exports.prep_thread_module(final_glb)
   var glb_method = {};
   for(var v in prep_value){
      glb_method[v] = prep_value[v]['prep'];
   }
   return glb_method;
}
  
exports.prepare_thread_execute = function(final_glb,eventEmitter ){
   var cls_list = {  };
   
   var prep_value = exports.prep_thread_module(final_glb)
   for(var v in prep_value){
      cls_list[v] = prep_value[v]['run'];
   }

  for(var k in final_glb['thread']){
     var val_thread = final_glb['thread'][k];
     cls_list["watch"](val_thread ,final_glb,eventEmitter );
     
  }
 
}