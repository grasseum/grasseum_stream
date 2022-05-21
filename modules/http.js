const Srcfilestream = require("../stream/srcfilestream");
const Downloadfile = require("../stream/downloadfile");
const Destfilestream = require("../stream/destfilestream");
const PipeStreamInlineFunction = require("../stream/pipeStreamInlineFunction");

module.exports = function (final_glb, action, event) {

    return {

        appGet (name, func) {

            final_glb.stream[name]={};
            final_glb.stream[name].load = func;
            final_glb.stream[name].types = "get";

        },

        appPost (name, func) {

            final_glb.stream[name]={};
            final_glb.stream[name].load = func;
            final_glb.stream[name].types = "post";

        },

        dest (file) {

            return new Destfilestream(file, action, event);

        },
        download (file, config) {

            return new Downloadfile(file, config, action, event);

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

        streamPipe (func, actionPipe) {

            return new PipeStreamInlineFunction(func, actionPipe);

        }

    };

};
