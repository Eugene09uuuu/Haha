const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "tik",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Eugene Aguilar",
  description: "tiktok downloader from tikvm",
  commandCategory: "tools",
  usages: "tik video <link>\n tik audio <link>",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args[0] === "video") {
      const link = args[1];
      if (!link) {
        api.sendMessage("Please provide a link from TikTok", event.threadID, event.messageID);
        return;
      }

      api.sendMessage(`downloading tiktok video please wait...`, event.threadID, event.messageID);

      const response = await axios.get(`https://eurix-api.replit.app/api/tiktokdl/tools?link=${link}`);
      const video = response.data.url;
      const title = response.data.title;
      const username = response.data.username;
      const nickname = response.data.nickname;

      let videoPath = __dirname + `/cache/tiktok.mp4`;
      const writer = fs.createWriteStream(videoPath);

      axios.get(video, { responseType: 'stream' }).then(response => {
        response.data.pipe(writer);
        writer.on('finish', () => {
          api.sendMessage({
            body: `here's your tiktok video\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}`,
            attachment: fs.createReadStream(videoPath)
          }, event.threadID, event.messageID);
        });
      });
    } else if (args[0] === "audio") {
      const link = args[1];
      if (!link) {
        api.sendMessage("Please provide a link from TikTok", event.threadID, event.messageID);
        return;
      }

      api.sendMessage("downloading tiktok audio please wait...", event.threadID, event.messageID);

      const response = await axios.get(`https://eurix-api.replit.app/api/tiktokdl/tools?link=${link}`);
      const audio = response.data.url;
      const title = response.data.title;
      const username = response.data.username;
      const nickname = response.data.nickname;

      let audioPath = __dirname + `/cache/tiktok.mp3`;
      const writer = fs.createWriteStream(audioPath);

      axios.get(audio, { responseType: 'stream' }).then(response => {
        response.data.pipe(writer);
        writer.on('finish', () => {
          api.sendMessage({
            body: `here's your tiktok audio\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}`,
            attachment: fs.createReadStream(audioPath)
          }, event.threadID, event.messageID);
        });
      });
    } else {
      api.sendMessage("Invalid command. Please use 'tik video <link>' or 'tik audio <link>'", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
  }
};