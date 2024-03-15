const axios = require("axios");
const request = require("request");
const fs = require("fs");

module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  credits: "Eugene Aguilar",
  description: "Generate random tiktok girl videos",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[shoti]",
  cooldowns: 5,
  dependencies: [],
  usePrefix: true,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("shoti") === 0 || event.body.indexOf("Shoti") === 0)) return;

  try {
    api.setMessageReaction("🔄", event.messageID, (err) => {}, true);

    const response = await axios.post(`https://eurix-api.replit.app/shoti`, { apikey: 'eugeneaguilar89' });

    const file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
    const username = response.data.username;
    const nickname = response.data.nickname;

    const rqs = request(encodeURI(response.data.url));
    rqs.pipe(file);

    file.on("finish", async () => {
      api.setMessageReaction("🟢", event.messageID, (err) => {}, true);

      await api.sendMessage(
        {
          body: `Username: @${username}\nNickname: ${nickname}`,
          attachment: fs.createReadStream(__dirname + "/cache/shoti.mp4"),
        },
        event.threadID,
        event.messageID
      );
    });
  } catch (error) {
    api.setMessageReaction("🔴", event.messageID, (err) => {}, true);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage(`This command doesn't need a prefix`, event.threadID, event.messageID);
};