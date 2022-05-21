const Srcfilestream = require("../stream/srcfilestream");
const Downloadfile = require("../stream/downloadfile");
const Destfilestream = require("../stream/destfilestream");
const PipeStreamInlineFunction = require("../stream/pipeStreamInlineFunction");

module.exports = function (final_glb, action, event) {

    return {
        dest (file,config) {

            return new Destfilestream(file,config, action, event);

        },
        download (file, config) {

            return new Downloadfile(file, config, action, event);

        },

        load (name, func) {

            final_glb.stream[name]={};
            final_glb.stream[name].load = func;

        },

        require (name) {

            if (typeof final_glb.require[name] === "undefined") {

                final_glb.require[name] = require(name);

            }

            return final_glb.require[name];

        },
        src (file) {

            const read_stream = new Srcfilestream(file, action, event);


            return read_stream;

        },

        event(){
            return event;
        },

        streamPipe (func, actionPipe) {

            return new PipeStreamInlineFunction(func, actionPipe);

        }

    };

};
