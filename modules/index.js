var compt = require("compts");

const srcfilestream = require("./stream/srcfilestream");
const downloadfile = require("./stream/downloadfile");
const destfilestream = require("./stream/destfilestream");
var fs = require("fs");

module.exports = function(final_glb){
   return {

                     
       load:function(name,func){
          
      // execute_stream.loadModule(name,func)
      final_glb['stream'][name]={}
      final_glb['stream'][name]["load"] = func;
       },

       src:function(file){
          
           var read_stream =  new srcfilestream(file);
           return   read_stream//.pipe(new readStream1())

           },
        download:function(file){
              return  new downloadfile(file);
            //   return  new duplexStream();
               },     
       dest:function(file){
          return  new destfilestream(file);
        //   return  new duplexStream();
           },    
        watch:function(name){ 
           //testropt.watchModule(name)
       }
       
       
   }
}