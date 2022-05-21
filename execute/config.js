const structkit = require("structkit");
const stream_execute = require("./stream");

exports.stream_details = function () {

    const list_load = {};

    list_load.stream={};
    list_load.execute=[];
    list_load.thread=[];
    list_load.execute_key_module=[];
    list_load.require={};

    return list_load;

};

exports.thread_config = function (attr, callback) {

    const list_attr = {};

    list_attr.delay =1000;

    let local_attr = null;
    let local_callback = null;
    const local_stream_details = exports.stream_details();

    if (structkit.has(attr) && structkit.has(callback)) {

        local_attr = attr;
        local_callback = callback;

    }
    if (structkit.getTypeof(attr) !== "string" && structkit.has(attr) && structkit.has(callback) === false) {

        local_attr = {};
        local_callback = attr;

    } else {

        local_attr = {};
        local_callback = function () {
            // Do nothing.
        };

    }
    const prep_list = stream_execute.allocate(local_stream_details, null);
    
    if (structkit.getTypeof(local_callback) === "string") {

        prep_list.series(local_callback);

    } else if (structkit.getTypeof(local_callback) === "array") {

        structkit.each(local_callback, function (key, value) {

            prep_list.series(value);

        });

    } else {

        local_callback(prep_list);

    }

    return {
        "attr": structkit.varExtend(list_attr, local_attr),
        "local_details": local_stream_details
    };

};

