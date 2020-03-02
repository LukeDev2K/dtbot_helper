var config = {
    //要监听的羊毛群
    'LISTEN_YANGMAO_ROOMS': [
        // '白菜价游全球3群',
        '刚需福利好物分享发布',
        '羊毛监听测试',
    ],
    //监听到羊毛消息，转发到这个群
    'TARGET_YANGMAO_ROOMS': [
        '优惠线报发布中心',
        // '全网口罩互助监控群01',
    ],
    //监听到口罩信息，转发到这个群
    'TARGET_MASK_ROOMS': [
        // '抖兔',
        '全网口罩互助监控群01',
    ],
    //监听退出进入的群
    'LEAVE_JOIN_ROOMS': [
        '羊毛监听测试',
        '全网口罩互助监控群01',
    ]
}

//是否口罩信息群
function isMaskRoom(topic) {
    if (topic.indexOf("口罩") != -1) {
        return true
    }
    return false
}

//检查来自口罩群信息的关键词
function isKeyWordFromMask(msg) {
    var words = [
        '口罩',
        '库存情况',
        '额温枪',
    ]
    for (i = 0; i < words.length; i++) {
        if (msg.indexOf(words[i])) {
            return true
        }
    }
    return false
}

//是否羊毛群
function isYangmaoRoom(topic) {
    var rooms = config['LISTEN_YANGMAO_ROOMS'];
    for (i = 0; i < rooms.length; i++) {
        if (rooms[i] == topic) {
            return true
        }
    }
    return false
}

function isKeywordFromYangmao(msg) {
    var words = [
        '口罩',
        '京东',
        '额温枪',
        '耳温枪',
        'jd.com',
        '淘口令',
    ]
    for (i = 0; i < words.length; i++) {
        if (msg.indexOf(words[i]) != -1) {
            return true
        }
    }
    return false
}

module.exports = {
    isMaskRoom,
    isKeyWordFromMask,
    isKeywordFromYangmao,
    isYangmaoRoom,
    config,
}