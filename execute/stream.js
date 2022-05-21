const structkit = require("structkit");
const EventEndStream = require("../stream/eventendstream");

const _call_stream_module =function (eventEmitter, stream, name, callback) {

    if (structkit.has(stream, name)) {
        let cnt = 0;

        eventEmitter.on("finish", function () {

            cnt+=1;
            if (cnt===2) {

                console.log("\x1b[32m Stream name `"+name+"` completed !\x1b[0m");

                callback();


            }

        });
        eventEmitter.on("grasseum_started", function () {

            if (cnt ===0) {

                console.log("\x1b[32m", "Stream name `"+name+"` starting !", "\x1b[0m");

            }

        });

        try {

            stream[name].load().pipe(new EventEndStream())

                .on("grasseum_completed", function () {

                    cnt+=1;
                    if (cnt===2) {

                        console.log("\x1b[32m Stream name `"+name+"` completed ! \x1b[0m");
                        callback();

                    }

                });

        } catch (exception) {

            console.log("\x1b[31m", "Stream name `"+name+"` has invalid stream function", "\x1b[0m");
            console.log("\x1b[31m", " "+exception+"", "\x1b[0m");
            callback();

        }

    } else {

        console.log("\x1b[31m", "Stream name `"+name+"` does not exist", "\x1b[0m");
        callback();

    }

};

exports.prep_method = function (final_glb, load_action) {

    return {

        parallel: {
            prep (...args) {

                const listArg = [];

                for (const inc in args) {

                    if (structkit.has(args, inc)) {

                        listArg.push(args[inc]);

                    }

                }
                final_glb.execute_key_module = structkit.arrayConcat(final_glb.execute_key_module, listArg);
                final_glb.execute.push({
                    "module": listArg,
                    "type": "parallel"

                });

                return this;

            },
            run (eventEmitter, clbk, types, name) {

                const len_exec = name.length;
                let cntr_exec = 0;

                name.forEach((element) => {

                    _call_stream_module(eventEmitter, final_glb.stream, element, function () {

                        cntr_exec+=1;
                        if (cntr_exec>=len_exec) {

                            load_action.shift();
                            clbk(load_action, final_glb, eventEmitter);

                        }

                    });

                });

            }
        },
        series: {
            prep (name) {

                final_glb.execute_key_module = structkit.arrayConcat(final_glb.execute_key_module, name);
                final_glb.execute.push({
                    "module": name,
                    "type": "series"
                });

                return this;

            },
            run (eventEmitter, clbk, types, name) {

                _call_stream_module(eventEmitter, final_glb.stream, name, function () {

                    load_action.shift();
                    clbk(load_action, final_glb, eventEmitter);

                });

            }
        }
    };

};
exports.allocate = function (final_glb) {

    const prepValue = exports.prep_method(final_glb);
    const glb_method = {};

    for (const value in prepValue) {

        if (structkit.has(prepValue, value)) {

            glb_method[value] = prepValue[value].prep;

        }

    }

    return glb_method;

};


exports.prepare_execute = function (load_action, final_glb, eventEmitter, clbk, types, name) {

    const cls_list = { };

    const prepValue = exports.prep_method(final_glb, load_action);
    
    for (const value in prepValue) {

        if (structkit.has(prepValue, value)) {

            cls_list[value] = prepValue[value].run;

        }

    }
 
    cls_list[types](eventEmitter, clbk, types, name);

};

exports.prepare_init_execute = function (load_action, list_load, eventEmitter) {

    if (load_action.length > 0) {

        const arg_exe = load_action[0];

        exports.prepare_execute(load_action, list_load, eventEmitter, exports.prepare_init_execute, arg_exe.type, arg_exe.module);

    } else {

        console.log("Complete executing the whole project");

    }

};
