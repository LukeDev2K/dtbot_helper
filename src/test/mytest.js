const checker = require('../utils/checker');
const comutil = require('../utils/comutil');
const networkutil = require('../utils/networkutil');
const config = require('../config');

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


// networkutil.getFullMask(async (ret, msg, data) => {
//     if (ret == 0) {
//         console.log("\n\n----------------------" + data.title)
//     }
// })

var lastTime = new Date().getTime();
var random = comutil.random(config.intervals.GET_FULL_MASK[0], config.intervals.GET_FULL_MASK[1]);
setInterval(function () {
    var currentTime = new Date().getTime();
    var offset = currentTime - lastTime;
    if (offset > random) {
        lastTime = currentTime;
        console.log("offset: " + offset + "  lastTime: " + lastTime + "  random: " + random);
        random = comutil.random(1000, 10000);
    }
}, 1000);