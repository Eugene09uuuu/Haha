const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports.config = {
  name: "girledit",
  version: "1.0.0",
  credits: "Eugene Aguilar",
  description: "Generate random TikTok girl edit videos",
  hasPermssion: 0,
  commandCategory: "other",
  usages: "[girledit]",
  cooldowns: 5,
  dependencies: [],
  usePrefix: true,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("girledit") === 0 || event.body.indexOf("Girledit") === 0)) return;

  try {
    api.setMessageReaction("🔄", event.messageID, (err) => {}, true);

    const dl = await axios.post(`https://eurix-api.replit.app/link`);
    const tite = dl.data.link;
    const link = tite[Math.floor(Math.random() * tite.length)];

    const response = await axios.get(`https://eurix-api.replit.app/api/tiktokdl/tools?link=${link}`);
    const filePath = path.join(__dirname, "/cache/girl.mp4");

    const username = response.data.username || "Anonymous";
    const nickname = response.data.nickname || "Anonymous";
    const title = response.data.title || "N/A";

    const stream = await axios.get(response.data.url, { responseType: "arraybuffer" });

  fs.writeFileSync(filePath, Buffer.from(stream.data, 'binary'));
  
      api.setMessageReaction("🟢", event.messageID, (err) => {}, true);

      await api.sendMessage(
        {
          body: `Username: @${username}\nNickname: ${nickname}\nDescription: ${title}`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID, event.messageID
      );
  } catch (error) {
    api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("This command doesn't need a prefix", event.threadID, event.messageID);
};