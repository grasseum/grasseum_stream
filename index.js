const structkit = require("structkit");
const modulesStrean = require("./modules/stream");
const modulesHttp = require("./modules/http");
const execute = require("./execute/stream");
const config = require("./execute/config");
const execute_watch = require("./execute/watch");


const list_load = config.stream_details();
const events = require('events');
const eventEmitter = new events.EventEmitter();

eventEmitter.setMaxListeners(100);


exports.module_stream = function (action) {

    return modulesStrean(list_load, action, eventEmitter);

};

exports.module_http = function (action) {

    return modulesHttp(list_load, action, eventEmitter);

};

exports.module_execute = function (action) {

    return execute.allocate(list_load, action);

};

exports.module_execute_thread = function (action) {

    return execute_watch.allocate_thread(list_load, action);

};
exports.execute_pipe_name_only = function (name, action) {

    const name_split = structkit.toArray(name.split(","));
    const exists_cls = [];


    list_load.execute=[];

    const prep_list = execute.allocate(list_load, action);

    structkit.each(name_split, function (key, val) {

        if (structkit.indexOf(exists_cls, val)===-1) {

            prep_list.series(val);

        }

    });


};
exports.prepare_thread_execution = function () {


    execute_watch.prepare_thread_execute(list_load, eventEmitter);

};
exports.prepare_execute = function (load_action) {

    execute.prepare_init_execute(load_action, list_load, eventEmitter);

};

exports.getListLoad = function () {

    return list_load;

};
