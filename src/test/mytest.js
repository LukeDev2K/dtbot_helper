const checker = require('../utils/checker');
const comutil = require('../utils/comutil');
const networkutil = require('../utils/networkutil');

// const targetRooms = checker.config['TARGET_YANGMAO_ROOMS']
// for (i = 0; i < targetRooms.length; i++) {
//     console.log("找到目标群: " + targetRooms[i])
// }

// // console.log(checker.isKeywordFromYangmao("口xx罩xxxx"))
// console.log(comutil.random(5,10))




// networkutil.transJd('https://u.jd.com/jawKeJ', function (code, url) {
//     console.log(url)
// })

// console.log('https://u.jd.com/jawKeJ'.indexOf('jd.com') != -1)


// const checkRooms = checker.config['LEAVE_JOIN_ROOMS'];
// for (i = 0; i < checkRooms.length; i++) {
//     console.log(checkRooms[i])
// }



var shortUrlInfo = []; //保存链接，避免重复
var showFull = true;
//定时
setInterval(() => {
    showFull = !showFull;
    if (showFull) {
        networkutil.getFullMask(async (ret, msg, data) => {
            dealRet(ret, msg, data)
        })
    } else {
        networkutil.getSmzdmMask(async (ret, msg, data) => {
            dealRet(ret, msg, data)
        })
    }

    function dealRet(ret, msg, data) {
        if (ret == 0) {
            for (i = 0; i < shortUrlInfo.length; i++) {
                if (data.shorturl == shortUrlInfo[i]) {
                    console.log("已经更新过： " + data.shorturl);
                    // return;
                }
            }
            if (shortUrlInfo.length >= 2) {
                console.log('超过了最大数: ' + shortUrlInfo.length);
                shortUrlInfo.length = 0
            }
            shortUrlInfo.push(data.shorturl);
            const checkRooms = checker.config['TARGET_MASK_ROOMS'];
            for (i = 0; i < checkRooms.length; i++) {
                // console.log('msg: ' + msg + " shorturl: " + data.shorturl);
            }
        }
    }
}, 15000)