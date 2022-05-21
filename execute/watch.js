const structkit = require("structkit");
const grasseum_directory =require("grasseum_directory");
const directory_cmd = grasseum_directory.directory();
const config = require("./config");
const stream = require("./stream");

exports.prep_thread_module = function (finalVariable) {

    return {

        watch: {
            prep (name, attr, callback) {

                const value_thread_config = config.thread_config(attr, callback);

                finalVariable.thread.push({

                    "attr": value_thread_config.attr,
                    "local_details": value_thread_config.local_details,
                    name,
                    "types": "watch"

                });

                return this;

            },
            run (attr, finalVariables, eventEmitter) {

                const local_attr = attr.attr;
                let is_valid_update = false;

                setInterval(function () {


                    const current_time_ms = new Date().getTime();

                    directory_cmd.readFileInDir(structkit.toArray(attr.name), function (val) {

                        const stats_mtime = val.stat.mtimeMs;

                        if (current_time_ms-local_attr.delay<=stats_mtime) {

                            is_valid_update = true;

                        }

                    });
                    if (is_valid_update) {

                        stream.prepare_init_execute(structkit.clone(attr.local_details.execute), finalVariables, eventEmitter);
                        is_valid_update = false;

                    }

                }, local_attr.delay);

            }
        }
    };

};

exports.allocate_thread = function (finalVariable) {

    const prepValue = exports.prep_thread_module(finalVariable);
    const glb_method = {};

    for (const value in prepValue) {

        if (structkit.has(prepValue, value)) {

            glb_method[value] = prepValue[value].prep;

        }


    }

    return glb_method;

};

exports.prepare_thread_execute = function (finalVariable, eventEmitter) {

    const cls_list = { };

    const prepValue = exports.prep_thread_module(finalVariable);

    for (const value in prepValue) {

        if (structkit.has(prepValue, value)) {

            cls_list[value] = prepValue[value].run;

        }

    }

    for (const key in finalVariable.thread) {

        if (structkit.has(finalVariable.thread, key)) {

            const val_thread = finalVariable.thread[key];

            cls_list.watch(val_thread, finalVariable, eventEmitter);

        }

    }

};
