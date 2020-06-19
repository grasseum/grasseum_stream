const http_inter = require("./http");
const http = require('http');
class Api{
    constuctor(){
        this.log_data_src = null;
        this.require_action_api = [];
        this.require_config =  {};
    }

    set_log_data(data){
        this.log_data_src = data;
    }
    set_require_action_api(data){
        this.require_action_api = data;
    }
    set_require_config(data){
        this.require_config = data;
    }
    run_http(){

    }
}




module.exports = function(){
    return new Api()
}