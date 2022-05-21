const grasseum_util =require("grasseum_util");
const trasform_stream = grasseum_util.stream().trasform;


const TransformFilterStream = function () {

// Dead code
};


TransformFilterStream.prototype.destroy = function ([, cb]) {
    // Dead code
    cb();

};


TransformFilterStream.prototype.transform = function (action) {

    if (action.data.isLastPath) {

        action.emit("grasseum_completed");

    }
    action.callback(null, action.data);

};


module.exports = function () {

    const src_cls = new TransformFilterStream();


    return trasform_stream(src_cls);

};

