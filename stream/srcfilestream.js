const glob =require("grasseum_glob");
const files =require("grasseum_files");
const read_file = files.read();
const grasseum_util =require("grasseum_util");
const structkit = require("structkit");

const read_stream = grasseum_util.stream().read;
const SrcStream = function (filesStream, action) {

    this.files = filesStream;
    this.list_file = [];
    this.fileCountReference = 0;
    this.action = action;

};

SrcStream.prototype.read = function (action) {

    const that = this;

    glob(this.files, function (val,fileConfig) {

            read_file.readStream(val.path, function (data) {

                if (structkit.has(data, "complete_data")) {

                    const cl = grasseum_util.readStream({
                        base: that.action.argv.cwd,
                        contents: Buffer.from(data.complete_data),
                        cwd: that.action.argv.cwd,
                        filename: val.filename,
                        isFirstPath: fileConfig.isFirstPath,
                        isLastPath: fileConfig.isLastPath,
                        path: val.path,
                        pathStat: val.stat

                    });

                    action.push(cl);
                    if (fileConfig.isLastPath) {
                        action.destroy();

                    }

                }

            });

    });

};

module.exports=function (filesStream, action, event) {

    const srcClass = new SrcStream(filesStream, action);

    return read_stream(event, srcClass);

};
