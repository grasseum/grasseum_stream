const grasseum_util =require("grasseum_util");
const structkit = require("structkit");

const trasform_stream = grasseum_util.stream().trasform;

const PipeStreamInline = function (func, config) {


    this.func = func;
    const localAction = config||{};

    this.config = structkit.varExtend({

    }, localAction);

};


PipeStreamInline.prototype.complete = function (clean_lines, data, done, self) {

    clean_lines.push(data);
    clean_lines.forEach(self.push.bind(self));
    done();

};


PipeStreamInline.prototype.transform = function (action) {

    const that = this;
    const refData = action.data.contents.toString();
    let writeData = null;
    const clean_lines = [];

    if (action.data.isGrasseumPlatform()) {

        that.func({
            "done" () {

                if (writeData !==null) {

                    action.data.contents = Buffer.from(writeData);

                }

                that.complete(clean_lines, action.data, action.callback, action.self);

            },
            "filename": action.data.filename,
            "path": action.data.path,
            "pathStat": action.data.pathStat,
            "readData" () {

                return refData;

            },
            "writeData" (data) {

                writeData = data;

            }

        });


    }

};

module.exports=function (func, config) {

    const src_cls = new PipeStreamInline(func, config);


    return trasform_stream(src_cls);

};
