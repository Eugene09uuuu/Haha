const path = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports.config = {
  name: "avtb",
  version: "2",
  hasPermssion: 0,
  credits: "Eugene Aguilar",
  description: "avtb",
  commandCategory: "canvas-img",
  usages: "/avtb username <username> id <id> name <name> signature <signature>",
  cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const idIndex = args.indexOf('id');
    const nameIndex = args.indexOf('name');
    const signatureIndex = args.indexOf('signature');

    const id = args.slice(idIndex + 1, nameIndex).join(" ").trim();
    const name = args.slice(nameIndex + 1, signatureIndex).join(" ").trim();
    const signature = args.slice(signatureIndex + 1).join(" ").trim();

    if (!id || !name || !signature) {
      api.sendMessage("Please enter a valid ID, name, and signature.", event.threadID, event.messageID);
      return; // Move the return statement here
    }

    api.sendMessage(`⏳ | Please wait a moment...`, event.threadID, event.messageID);

    const response = await axios.get(`https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(signature)}`, {
      responseType: 'arraybuffer',
    });

    const image = Buffer.from(response.data, 'binary');
    const imagePath = path.join(__dirname, 'cache', 'avtb.png');

    fs.writeFileSync(imagePath, image);

    api.sendMessage({ body: "Here's your avatar", attachment: fs.createReadStream(imagePath) }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`${error}`, event.threadID, event.messageID);
    console.log(error);
  }
};