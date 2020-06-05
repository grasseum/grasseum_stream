var compt = require("compts");

//const readStream = require("grasseum_stream/stream/readStream");
var fs = require("fs");

let list_load = {};
list_load['stream']={};
list_load['execute']=[];
let modules = require("./modules");
let execute = require("./execute");

exports.module_stream = function(){
    return modules(list_load);
}

exports.module_execute = function(){
    return execute.allocate(list_load)
}

exports.prepare_execute = function(){
    if(list_load['execute'].length > 0){
        var arg_exe = list_load['execute'][0];

        execute.prepare_execute(list_load ,exports.prepare_execute, arg_exe['type'], arg_exe['module'])
    }else{
        console.log("complete executing the whole project");
    }
  
}