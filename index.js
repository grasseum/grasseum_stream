var compt = require("compts");

 
var fs = require("fs");


let modules = require("./modules");
let execute = require("./execute/stream");
let config = require("./execute/config");
let execute_watch = require("./execute/watch");


let list_load = config.stream_details();
var events = require('events');
var eventEmitter = new events.EventEmitter(); 
eventEmitter.setMaxListeners(1000);


exports.module_stream = function(action){
    return modules(list_load,action ,eventEmitter);
}

exports.module_execute = function(action){
    return execute.allocate(list_load,action);
}

exports.module_execute_thread = function(action){
    return execute_watch.allocate_thread(list_load,action);
}
exports.execute_pipe_name_only = function( name,action ){
    var name_split = compt._.to_array(name.split(","));
    var exists_cls = [];
   
   
    list_load['execute']=[];
   
    var prep_list = execute.allocate(list_load,action);
   
    compt._.each(name_split,function(k,v){
        if( compt._.indexOf(exists_cls,v)==-1 ){
           
        
         prep_list['series'](v);
        }
        

    });

  
}
exports.prepare_thread_execution = function(){
 

    execute_watch.prepare_thread_execute(list_load ,eventEmitter);
}
exports.prepare_execute = function(load_action){

   execute.prepare_init_execute( load_action,list_load ,eventEmitter);
}

exports.getListLoad = function(){
    return list_load;

}