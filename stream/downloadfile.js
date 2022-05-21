const grasseum_resources = require("grasseum_resources");
const grasseum_util =require("grasseum_util");
const structkit = require("structkit");
const read_stream = grasseum_util.stream().read;

const HttpDownloadStream = function (files, config, action) {

    this.files = structkit.toArray(files);

    this.list_file = [];
    this.is_bool = false;
    this.action = action;


    this.httpRequestMultipleURL = grasseum_resources.httpRequestMultipleURL(config);

};


HttpDownloadStream.prototype.read = function (action) {

    const that = this;


    this.httpRequestMultipleURL.fetch(
        this.files,
        function (urlpath, res) {

            const list_chunk_data = [];

            res.on('data', function (chunk_data) {

                list_chunk_data.push(chunk_data.toString());

            });
            res.on('end', function () {

                console.log("Accessing the URL path: " + urlpath);
                console.log("* * * * * * * * * ");
                console.log("Got response: " + res.statusCode);
                const split_element = urlpath.split("/");

                const val = split_element[split_element.length-1];

                const isFirstRaw = that.list_file.length === 0;
                const isLastRaw = that.list_file.length>=that.files.length-1;

                that.list_file.push(urlpath);

                action.push(grasseum_util.readStream({
                    base: that.action.argv.cwd,
                    contents: Buffer.from(list_chunk_data.join().toString()),
                    cwd: that.action.argv.cwd,

                    filename: val,
                    isFirstPath: isFirstRaw,
                    isLastPath: isLastRaw,

                    path: val


                }));


                if (that.list_file.length >= that.files.length) {

                    action.destroy();

                }


            });

        }, function (urlpath, error) {

            console.log("Accessing the URL path: " + urlpath);
            console.log("* * * * * * * * * ");
            console.log("Got error: " + error.message);

        }
    );


};


module.exports= function (files, config, action, event) {

    // ReadStream = function( files ,action,event)
    const src_cls = new HttpDownloadStream(files, config, action);


    return read_stream(event, src_cls);

};


