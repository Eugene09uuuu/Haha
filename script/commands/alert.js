const uid = ["61554201747411"];
const moment = require("moment-timezone");
  const eugene = moment.tz('Asia/Manila').format('h:mm A');

 const eurix = moment.tz('Asia/Manila').format('D/MM/YYYY');
module.exports.config = {
  name: "alert",
  version: "8",
  hasPermission: 0,
  credits: "Eugene Aguilar",
  description: "send notifications for admin",
  commandCategory: "system",
  usages: "message",
  cooldowns: 0,
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const includesArray = ["https://pastebin.com/raw"];


    const { threadName } = await api.getThreadInfo(event.threadID);

    if (includesArray.some(keyword => event.body.includes(keyword))) {
      await api.sendMessage(`⚠️ | message detect: ${event.body}\nLink: https://facebook.com/${event.senderID}\nGroupname: ${threadName}\nDate: ${eurix}\nTime: ${eugene}`, uid);
api.sendMessage(`⚠️ | message detect: ${event.body}\nLink: https://facebook.com/${event.senderID}\nTime: ⏰ ${eugene}`, event.threadID);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.run = ({ api, event }) => {
};