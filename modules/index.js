var compt = require("compts");

const srcfilestream = require("./stream/srcfilestream");
const downloadfile = require("./stream/downloadfile");
const destfilestream = require("./stream/destfilestream");
var fs = require("fs");

module.exports = function(final_glb,action,event){
   return {

                     
       load:function(name,func){
          
      // execute_stream.loadModule(name,func)
      final_glb['stream'][name]={}
      final_glb['stream'][name]["load"] = func;
       },

       require:function(name){
        
         if( typeof(final_glb['require'][name]) == "undefined" ){
            final_glb['require'][name] = require(name);
         } 
         return final_glb['require'][name];
       },
       src:function(file){
          
           var read_stream =  new srcfilestream(file,action,event);
           return   read_stream;

           },
        download:function(file,config){
              return  new downloadfile(file,config,action,event);
      
               },     
       dest:function(file){
          return  new destfilestream(file,action,event);
      
           },    
        watch:function(name){ 
           //testropt.watchModule(name)
       }
       
       
   }
}