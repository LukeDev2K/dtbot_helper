const config = require('../config');

//是否口罩信息群
function isMaskRoom(topic) {
    if (topic.indexOf("口罩") != -1) {
        return true
    }
    return false
}

//检查来自口罩群信息的关键词
function isKeyWordFromMask(msg) {
    var words = config.keyword.KOUZHAO_KEYWORD;
    for (i = 0; i < words.length; i++) {
        if (msg.indexOf(words[i])) {
            return true
        }
    }
    return false
}

//是否羊毛群
function isYangmaoRoom(topic) {
    var rooms = config.groups.LISTEN_YANGMAO_ROOMS;
    for (i = 0; i < rooms.length; i++) {
        if (rooms[i] == topic) {
            return true
        }
    }
    return false
}

function isKeywordFromYangmao(msg) {
    var words = config.keyword.YANGMAO_KEYWORD;
    for (i = 0; i < words.length; i++) {
        if (msg.indexOf(words[i]) != -1) {
            return true
        }
    }
    return false
}

//是否合适的口罩信息
function isValueMaskInfo(msg){
    var words = config.keyword.KOUZHAO_REMOVE_INFO_KEYWORD;
    for (i = 0; i < words.length; i++) {
        if (msg.indexOf(words[i]) != -1) {
            //符合条件，不合适
            return false
        }
    }
    return true
}

module.exports = {
    isMaskRoom,
    isKeyWordFromMask,
    isKeywordFromYangmao,
    isYangmaoRoom,
    isValueMaskInfo,
}