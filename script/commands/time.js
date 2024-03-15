module.exports.config = {
  name: "time",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Secret",
  description: "( 𝙀𝙭𝙖𝙘𝙩 𝙩𝙞𝙢𝙚 & 𝙙𝙖𝙩𝙚 )",
  commandCategory: "Time and Date",
  usages: "( Exact time )",
  cooldowns: 0,
  dependencies: []
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {

  const moment = require("moment-timezone");
  const supremo = moment.tz('Asia/Manila').format('h:mm A');
  const draven = moment.tz('Asia/Manila').format('D/MM/YYYY');
  const eugene = moment.tz('Asia/Manila').format('dddd');
  const name = await Users.getNameUser(event.senderID);


  return api.sendMessage(`〘───── •『 𝙏𝙞𝙢𝙚 』• ─────〙\n𝙃𝙚𝙡𝙡𝙤「﹝${name}﹞」\n𝙏𝙝𝙚 𝙥𝙧𝙚𝙨𝙚𝙣𝙩 𝙩𝙞𝙢𝙚 : ${supremo} \n𝘿𝙖𝙮 : ${draven} (${eugene})\n〘───── •『 𝙏𝙞𝙢𝙚 』• ─────`, event.threadID, event.messageID);
};