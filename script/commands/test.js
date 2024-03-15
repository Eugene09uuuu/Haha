const path = require('path');
const fs = require('fs');
const axios = require('axios');
const writer = require('fs');

module.exports.config = {
 name: "test",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Eugene Aguilar",
 description: "codm generate random from tikvm",
 commandCategory: "fun",
 usages: "test",
 cooldowns: 0,
};

module.exports.run = async function ({api, event}) {
  try {
    api.sendMessage(`Video is sending, please wait...`, event.threadID, event.messageID);

    const response = await axios.post(`https://codm-api.onrender.com/codm`);
    const video = response.data.url;
    const username = response.data.username;

    const filePath = path.join(__dirname, `/cache/codm.mp4`);
    const fileStream = fs.createWriteStream(filePath);

    const axiosResponse = await axios.get(video, { responseType: 'stream' });
    axiosResponse.data.pipe(fileStream);

    fileStream.on('finish', () => {
      api.sendMessage({ body: `Call Of Duty Mobile\n\nUsername: ${username}`, attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);
    });
  } catch (error) {
    api.sendMessage(`Error generating CODM video!! ${error}`, event.threadID, event.messageID);
    console.log(error);
  }
};