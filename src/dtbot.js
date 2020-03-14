const {
  Wechaty
} = require('wechaty');
const {
  PuppetPadplus
} = require('wechaty-puppet-padplus');
const QrcodeTerminal = require('qrcode-terminal');
const comutil = require('./utils/comutil');
const checker = require('./utils/checker');
const networkutil = require('./utils/networkutil');
const config = require('./config');

const token = config.basic.TOKEN;

const puppet = new PuppetPadplus({
  token,
});

const name = config.basic.NAME;

const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

bot
  .on('scan', (qrcode, status) => {
    console.log("onScan");
    QrcodeTerminal.generate(qrcode, {
      small: true
    })
  })
  .on('message', async msg => {
    // console.log(`msg : ${msg}`)
    const contact = msg.from()
    const text = msg.text()
    const room = msg.room()
    if (room) {
      const topic = await room.topic()
      // console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
      //是否口罩的群
      if (checker.isMaskRoom(topic)) {
        //是否关键词
        if (checker.isKeyWordFromMask(text)) {
          const urls = comutil.getHttpString(text);
          if (urls != null && urls.length > 0) {
            var url = urls[0];
            console.log("url: " + url);
            if (url.indexOf('jd.com') != -1) {
              console.log('开始转链');
              networkutil.transJd(url, async function (code, shortUrl) {
                if (code == 0) {
                  //await room.say("转换连接成功：" + shortUrl);
                }
              });
            } else {
              console.log("连接不符合");
            }
          }
        }
      }
      //是否属于监听的羊毛群，监听信息转发到自己的群
      else if (checker.isYangmaoRoom(topic)) {
        const urls = comutil.getHttpString(text);
        //监听到有连接或者关键词，转发
        if (urls != null && urls.length > 0 || text.indexOf("&&") != -1) {
          const targetRooms = config.groups.TARGET_YANGMAO_ROOMS;
          for (i = 0; i < targetRooms.length; i++) {
            const tRoom = await bot.Room.find({
              topic: targetRooms[i]
            });
            if (tRoom && targetRooms[i]) {
              //随机时间转发出去
              console.log(contact.name() + " 尝试转发消息目标群: " + targetRooms[i] + "    contact id: " + contact.id + "  群主： " + tRoom.owner().id)
              if (contact.id == 'karlon2011') {
                setTimeout(function () {
                  tRoom.say(text)
                }, comutil.random(1000, 5000))
              }else{
                console.log("不是+龙发短消息");
              }
            }
          }
        }
      } else {
        console.log("NOTHING")
      }
    } else {
      // console.log(`Contact: ${contact.name()} Text: ${text}`)
    }
  })
  .on('login', onLogin)
  .on('logout', onLogout)
  .on('error', onError)
  .start()
  .catch(console.error);

async function onLogin(user) {
  console.log(`${user} 登录成功`);

  const checkRooms = config.groups.LEAVE_JOIN_ROOMS;
  for (i = 0; i < checkRooms.length; i++) {
    const room = await bot.Room.find({
      topic: checkRooms[i]
    }) // change `event-room` to any room topic in your wechat
    if (room) {

      const contactList = await room.payload.memberIdList;
      for(i=0;i<contactList.length;i++){
        console.log(contactList[i]);
        const cnt = await room.member(contactList[i]);
        console.log(cnt);
      }
      room.on('leave', async (leaverList) => {
        const nameList = leaverList.map(c => c.name()).join(',');
        console.log(`Room lost member ${leaverList}`);
        await room.say(`${nameList}终于受不了你转身离去，但他走路的样子依然很帅`);
      });
      room.on('join', async (inviteeList, inviter) => {
        const nameList = inviteeList.map(c => c.name()).join(',');
        console.log(`Room got new member ${nameList}, invited by ${inviter}`);
        await room.say(`欢迎 ${nameList}加入`);
      });
      // console.log("length: " + contactList.length);
    } else {
      console.log("没有找到群： " + checkRooms[i]);
    }
  }

  var shortUrlInfo = []; //保存链接，避免重复
  var lastFullTime = new Date().getTime();
  var lastSmzdmTime = new Date().getTime();
  var fullRandom = comutil.random(config.intervals.GET_FULL_MASK[0], config.intervals.GET_FULL_MASK[1]);
  var smzdmRandom = comutil.random(config.intervals.GET_SMZDM_MASK[0], config.intervals.GET_SMZDM_MASK[1]);
  //定时
  setInterval(() => {
    var currentTime = new Date().getTime();
    var fullOffset = currentTime - lastFullTime;

    if (fullOffset > fullRandom) {
      console.log(fullOffset + '----开始请求FULL MASK信息：' + fullRandom);
      lastFullTime = currentTime;
      fullRandom = comutil.random(config.intervals.GET_FULL_MASK[0], config.intervals.GET_FULL_MASK[1]);;
      networkutil.getFullMask(async (ret, msg, data) => {
        dealRet(ret, msg, data)
      });
    };

    var smzdmOffset = currentTime - lastSmzdmTime;
    if (smzdmOffset > smzdmRandom) {
      console.log(smzdmOffset + '----开始请求SMZDM MASK信息：' + smzdmRandom);
      lastSmzdmTime = currentTime;
      smzdmRandom = comutil.random(config.intervals.GET_SMZDM_MASK[0], config.intervals.GET_SMZDM_MASK[1]);
      networkutil.getSmzdmMask(async (ret, msg, data) => {
        dealRet(ret, msg, data)
      });
    };

  }, 10000);

  //处理返回的结果
  async function dealRet(ret, msg, data) {
    if (ret == 0) {
      if (!checker.isValueMaskInfo(data.title)) {
        console.log("此信息不推荐： " + data.title);
        return;
      }
      for (i = 0; i < shortUrlInfo.length; i++) {
        if (data.shorturl == shortUrlInfo[i]) {
          console.log("已经更新过： " + data.shorturl);
          return;
        }
      }
      if (shortUrlInfo.length >= 20) {
        console.log('超过了最大数: ' + shortUrlInfo.length);
        shortUrlInfo.length = 0
      }
      shortUrlInfo.push(data.shorturl);
      const checkRooms = config.groups.TARGET_MASK_ROOMS;

      for (i = 0; i < checkRooms.length; i++) {
        const room = await bot.Room.find({
          topic: checkRooms[i]
        }) // change `event-room` to any room topic in your wechat
        if (room) {
          console.log('发送消息到群: ' + checkRooms[i]);
          setTimeout(function () {
            room.say(msg)
          }, comutil.random(1000, 6000))
        }
      }
    }
  }
}

function onLogout(user) {
  console.log(`${user} logout`)
}

function onError(e) {
  console.error(e)
}