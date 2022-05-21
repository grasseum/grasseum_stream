const path = require("path");
const grasseum_util =require("grasseum_util");
const duplex_stream = grasseum_util.stream().duplex;

const grasseum_directory =require("grasseum_directory");
const files =require("grasseum_files");

const {varExtend} = require("structkit");


const write_file = files.write();
const directory_cmd = grasseum_directory.directory();
const DuplexStreamReadonly = function (location,config, action) {


    this.data = "";
    this.curIndex = 0;
    this.boll1 = true;
    this.count = 0;
    this.refchunk = null;
    this.location = location;
    this.config = varExtend({
        "lsFileType":"basename",
        "isAutoGenerateFolder":true,
        "streamOption":{
            flags:"w"
        }
    }, config);

    this.action = action;

};


DuplexStreamReadonly.prototype.write = function (action) {

    const that = this;
    let filePathName = path.join(that.location, action.data.basename);


    if (this.config["lsFileType"]  === "path"){
        filePathName = path.join(that.location, action.data.path) 
    }


   directory_cmd.createFolderRecursivelyIfNotExist( filePathName, this.config["isAutoGenerateFolder"],
    function(){
        write_file.writeStream(
        
            filePathName,
            action.data.contents,
            that.config["streamOption"]
        );
        action.push(action.data);
        that.refchunk = action.data;
        action.callback(null, action.data);
    }, 
   function () {
        console.log("Error file destination")
    });




};
DuplexStreamReadonly.prototype.read = function () {
    // Dead code
};

module.exports = function (glb, config,action, event) {

    const src_cls = new DuplexStreamReadonly(glb, config,action);

    return duplex_stream(event, src_cls);

};
