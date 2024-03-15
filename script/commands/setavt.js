const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "setavt",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Eugene Aguilar",
  description: "Set bot's avatar",
  commandCategory: "system",
  usages: "[reply/url/image]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const attachment = event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0];

    if (!attachment) {
      return api.sendMessage("Please provide a valid image URL or reply to an image.", event.threadID, event.messageID);
    }

    const avatarPath = path.join(__dirname, "cache", "avatar.png");

    const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
    fs.writeFileSync(avatarPath, Buffer.from(response.data, 'binary'));

    await api.changeAvatar(fs.createReadStream(avatarPath), (err) => {
      if (err) {
        console.error("Error changing avatar:", err);
        return api.sendMessage("An error occurred while changing the avatar.", event.threadID, event.messageID);
      }
      fs.unlinkSync(avatarPath); 
      return api.sendMessage("Bot's avatar has been updated successfully!", event.threadID, event.messageID);
    });
  } catch (error) {
    console.error("Error changing avatar:", error);
    return api.sendMessage("An error occurred while changing the avatar.", event.threadID, event.messageID);
  }
};