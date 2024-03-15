const moment = require('moment');


module.exports.config = {
	name: "info",
	version: "1.0.0",
	hasPermssion: 0,
  credits: "Eugene Aguilar",
	description: "User",
	commandCategory: "owner",
	cooldowns: 5,
}

module.exports.run = ({ api, event }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  var callback = () => api.sendMessage(
    { body: `———»ADMIN BOT«——— 
❯ Bot Name: ${global.config.BOTNAME}
❯ Bot Owner: ${global.config.OWNER}
❯ Age: ${global.config.AGE} 
❯ Gender: ${global.config.GENDER}
❯ Facebook: ${global.config.FACEBOOK}
❯ Total Group: ${global.data.allThreadID.length}
❯ Total Users: ${global.data.allUserID.length}
❯ Bot Prefix: ${global.config.PREFIX}
❯ Today is: ${moment.tz("Asia/Manila").format(`dddd,LL h:mm A`)}
❯ Thanks for using ${global.config.BOTNAME} BOT`, attachment: fs.createReadStream(__dirname + "/cache/eurix.jpg") }, event.threadID, () => 
    fs.unlinkSync(__dirname + "/cache/eurix.jpg"), event.messageID);  
      
  return request(encodeURI(`https://graph.facebook.com/${global.config.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(
    fs.createWriteStream(__dirname+'/cache/eurix.jpg')).on('close',() => callback());
};