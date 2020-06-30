var compt = require("compts");

//const readStream = require("grasseum_stream/stream/readStream");
var fs = require("fs");
const eventendstream = require("../modules/stream/eventendstream");
 

exports.prep_method = function(final_glb,load_action){


   return {

      series:{
         prep:function(name){
            final_glb["execute_key_module"] = compt._.arrayConcat(final_glb["execute_key_module"] ,name )
            final_glb['execute'].push({
               "type":"series",
               "module":name
            })
            return this;
          },//load_action,list_load , eventEmitter
          run:function(eventEmitter,clbk, types,name){
           
            _call_stream_module(eventEmitter,final_glb['stream'],name,function(){
               load_action.shift();
                        clbk(load_action,final_glb,eventEmitter);
                     
                     
            });
            
          },
      },
      parallel:{
         prep:function(){

            var listArg = [];
            for(var i in arguments){
   
               listArg.push(arguments[i])
            }
            final_glb["execute_key_module"] = compt._.arrayConcat(final_glb["execute_key_module"] ,listArg )
            final_glb['execute'].push({
               "type":"parallel",
               "module":listArg
            })
             return this;
         },
         run:function(eventEmitter,clbk, types,name){
            var len_exec = name.length;
            var cntr_exec = 0;
            name.forEach(element => {
              
           _call_stream_module(eventEmitter,final_glb['stream'],element,function(){
                
                  cntr_exec++;
                  if(cntr_exec>=len_exec){
                     load_action.shift();
                     clbk(load_action,final_glb,eventEmitter);
                  }
            });
         
      });
      }
      }
   }

}
exports.allocate = function(final_glb,action){

   var prep_value = exports.prep_method(final_glb)
   var glb_method = {};
   for(var v in prep_value){
      glb_method[v] = prep_value[v]['prep'];
   }
   return glb_method;
}
 
 
_call_stream_module = function(eventEmitter,stream , name,callback){
   if(typeof(stream[name]) !="undefined"){
      var cnt = 0;
       
      eventEmitter.on("finish",function(){
              //console.log("\x1b[32m","Stream name `"+name+"` completed1 !",cnt,"\x1b[0m");
              cnt++;
              if( cnt==2){
               console.log("\x1b[32m Stream name `"+name+"` completed !"+cnt+"\x1b[0m");
               callback();
            }
          //  callback();
     })
     eventEmitter.on("grasseum_started",function(){
      //console.log("\x1b[32m","Stream name `"+name+"` completed2 !",cnt,"\x1b[0m");
         if(cnt ==0  )
         console.log("\x1b[32m","Stream name `"+name+"` starting !","\x1b[0m");
          
      
   })

       try{
         stream[name]["load"]().pipe(new eventendstream())
         
         .on("grasseum_completed",function(){
            //console.log("\x1b[32m","Stream name `"+name+"` completed2 !",cnt,"\x1b[0m");
            cnt++;
            if( cnt==2){
               console.log("\x1b[32m Stream name `"+name+"` completed2 ! \x1b[0m");
               callback();
            }
            
         });
       } catch(e){
            console.log("\x1b[31m","Stream name `"+name+"` has invalid stream function","\x1b[0m");
           callback();
       }  
         
     
      
   }else{
      console.log("\x1b[31m","Stream name `"+name+"` does not exist","\x1b[0m");
      callback();
   }
}

exports.prepare_execute = function(load_action,final_glb,eventEmitter,clbk, types,name){
   var cls_list = {  };
   
   var prep_value = exports.prep_method(final_glb,load_action)
   for(var v in prep_value){
      cls_list[v] = prep_value[v]['run'];
   }
   cls_list[types](eventEmitter,clbk, types,name);
}

exports.prepare_init_execute = function(load_action,list_load , eventEmitter){
   if(load_action.length > 0){   
         
       var arg_exe = load_action[0];
       exports.prepare_execute(load_action,list_load ,eventEmitter,exports.prepare_init_execute, arg_exe['type'], arg_exe['module'])
   }else{
       console.log("complete executing the whole project");
   }
 
}