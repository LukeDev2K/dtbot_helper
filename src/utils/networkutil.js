const request = require('request');
const qs = require('querystring');
const config = require('../config');

function get(path, data, callback) {
    var content = qs.stringify(data);
    console.log("start http get: " + content);
    var url = config.basic.HOST + path;
    if(content != null && content != ""){
        url += "?" + content;
    }
    request(url, function (error, response, ret) {
        console.log("response: " + response+ " ret: " + ret);
        console.log("error: " + error);
        if (response.statusCode == 200) {
            callback(response.statusCode, JSON.parse(ret));
        } else {
            callback(response.statusCode, error);
        }
    });
}

//京东转链
function transJd(jdlink, callback) {
    get('/tbk/get_jd_url', {
        'jdlink': jdlink
    }, function (statusCode, ret) {
        console.log(ret);
        if (statusCode == 200) {
            if (ret.code == 0) {
                var shortUrl = ret.data.shortURL;
                callback(0, shortUrl);
                return;
            }
        }
        callback(-1, null);
    })
} 

function getFullMask(callback){
    get('/tbk/get_full_mask', {}, function(statusCode, ret){
        if(statusCode == 200){
            if(ret.code == 0){
                callback(0, ret.msg, ret.data)
            }
        }
        callback(-1, null, null)
    })
}

function getSmzdmMask(callback){
    get('/tbk/get_smzdm_mask', {}, function(statusCode, ret){
        if(statusCode == 200){
            if(ret.code == 0){
                callback(0, ret.msg, ret.data)
            }
        }
        callback(-1, null, null)
    })
}

module.exports = {
    transJd,
    getSmzdmMask,
    getFullMask,
}