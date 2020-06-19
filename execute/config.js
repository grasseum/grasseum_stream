var compt = require("compts");
let stream_execute = require("./stream");
exports.stream_details = function(){
    let list_load = {};
    list_load['stream']={};
    list_load['execute']=[];
    list_load['thread']=[];
    list_load['execute_key_module']=[];
    list_load['require']={};

    return list_load;
}

exports.thread_config = function(attr,callback){
    let list_attr = {};   
    list_attr['delay'] =1000;
   
    var local_attr = null;
    var local_callback = null;
    var local_stream_details = exports.stream_details();

   if(compt._.has(attr) && compt._.has(callback)){
    local_attr = attr;
    local_callback = callback;
   }
   if(compt._.has(attr) && compt._.has(callback) == false){
    local_attr = {};
    local_callback = attr;
   }
   else{
    local_attr = {};
    local_callback = function(glb){

    }
   }
   var prep_list = stream_execute.allocate(local_stream_details,null);
   if(compt._.getTypeof(local_callback) == "string"){
    prep_list['series'](local_callback);
   }
   else if(compt._.getTypeof(local_callback) == "array"){
        compt._.each(local_callback,function(k,v){
            prep_list['series'](v);    
        });
   }else{
    local_callback(prep_list);
   }
   
   return {
        "attr":compt._.varExtend(list_attr,local_attr),
        "local_details":local_stream_details
   }
}

