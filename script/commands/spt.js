  const path = require("path");
  const fs = require('fs');
  const axios = require('axios');

  module.exports.config = {
    name: "spt",
    version: "1.0.0",
    description: "spotify scrapper search",
    hasPermssion: 0,
    credits: "Eugene Aguilar",
    commandCategory: "other",
    usages: "/spt [song name]",
    cooldowns: 5,
  };

  module.exports.run = async function ({ api, event, args }) {
    try {
      const q = args.join(" ");
      if (!q) {
        return api.sendMessage(`Please enter a song name.`, event.threadID, event.messageID);
      }

      api.sendMessage(`Searching music for ${q}`, event.threadID, event.messageID);

      const response = await axios.get(`https://ai-tools.replit.app/spotify?q=${q}`);
      const n = response.data.result;

      let filePath = __dirname + `/cache/spotify.mp3`;

      let data = await axios.get(n, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, Buffer.from(data.data, 'binary'));

      api.sendMessage({ body: `Here's your music, enjoy!`, attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(`An error occurred while processing your request.`, event.threadID, event.messageID);
    }
  };