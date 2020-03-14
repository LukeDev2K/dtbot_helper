const groups = {
    //要监听的羊毛群
    LISTEN_YANGMAO_ROOMS: [
        // '白菜价游全球3群',
        '刚需福利好物分享发布',
        // '羊毛监听测试',
    ],
    //监听到羊毛消息，转发到这个群
    TARGET_YANGMAO_ROOMS: [
        '优惠线报发布中心',
        '全网口罩监控分享(刚需福利群）01',
        // '全网口罩互助监控群01',
    ],
    //监听到口罩信息，转发到这个群
    TARGET_MASK_ROOMS: [
        // '抖兔',
        // '全网口罩互助监控群01',
        // '全网KZ互助监控群01',
        // '『禁言』全平台口罩等物资放货监控',
        // '全网口罩监控分享(刚需福利群）01',
        // '[禁言]全平台口罩等物资放货监控'
    ],
    //监听退出进入的群
    LEAVE_JOIN_ROOMS: [
        '羊毛监听测试',
        '全网口罩互助监控群01',
        '全网口罩监控分享(刚需福利群）01',
        '全网口罩互助监控群【停更】',
    ],
}

const keyword = {
    //监听羊毛群的关键词
    YANGMAO_KEYWORD: [
        '口罩',
        '京东',
        '额温枪',
        '耳温枪',
        'jd.com',
        '淘口令',
    ],
    //监听到口罩群的关键词
    KOUZHAO_KEYWORD: [
        '口罩',
        '库存情况',
        '额温枪',
    ],
    //过滤掉的口罩信息
    KOUZHAO_REMOVE_INFO_KEYWORD:[
        '电动',
        '伊藤良品',
        '车间',
        '面罩',
        '面具',
        '防毒',
    ]
}

const basic = {
    // HOST: 'http://192.168.246.1:8000',
    HOST: 'your api',
    TOKEN: 'your token',
    NAME: 'youbotname',
}

const intervals = {
    GET_FULL_MASK:[30000, 120000],//
    GET_SMZDM_MASK:[60000, 200000],//
}

module.exports = {
    groups,
    keyword,
    basic,
    intervals,
}