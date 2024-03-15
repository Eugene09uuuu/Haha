    const cooldowns = {};

    module.exports.config = {
      name: 'removebg',
      version: '1.1.1',
      hasPermssion: 0,
      credits: '𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓/fixed by Eugene Aguilar',
      description: 'Edit photo',
      commandCategory: 'Tools',
      usages: 'Reply images or url images',
      cooldowns: 2,
      dependencies: {
         'form-data': '',
         'image-downloader': ''
       }
    };

    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs-extra');
    const path = require('path');
    const {image} = require('image-downloader');
    module.exports.handleEvent = async function({
       api, event
    }){
      if (!(event.body.indexOf("removebg") === 0 || event.body.indexOf("Removebg") === 0)) return;

      const userId = event.senderID;
      if (cooldowns[userId] && Date.now() - cooldowns[userId] < module.exports.config.cooldowns * 1000) {
        const eugene = Math.ceil((cooldowns[userId] + module.exports.config.cooldowns * 1000 - Date.now()) / 1000);
        api.sendMessage(`🕦 Please wait ${eugene} seconds and try again`, event.threadID, event.messageID);
        return;
      }



        const args = event.body.split(/\s+/);
      args.shift();

      cooldowns[userId] = Date.now();

      try {
          if (event.type !== "message_reply") return api.sendMessage("🖼️ | You must to reply the photo you want to removed bg", event.threadID, event.messageID);
        api.sendMessage("🖼 | Removing Background Picture your provide. Please Wait....", event.threadID, event.messageID);
          if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("✅ | Removed Background Has Been Successfully ", event.threadID, event.messageID);
          if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("❌ | This Media is not available", event.threadID, event.messageID);

          const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
          const MtxApi = ["KW4FmGpWUC6a75gRp8C6n9pB"]
          const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
          await image({
          url: content, dest: inputPath
       });
          const formData = new FormData();
          formData.append('size', 'auto');
          formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
          axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
               ...formData.getHeaders(),
               'X-Api-Key': MtxApi[Math.floor(Math.random() * MtxApi.length)],
            },
            encoding: null
          })
            .then((response) => {
               if (response.status != 200) return console.error('Error:', response.status, response.statusText);
               fs.writeFileSync(inputPath, response.data);
               return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
            })
            .catch((error) => {
               return console.error('Failed Removedbg commands api', error);
            });
        } catch (e) {
          console.log(e)
          return api.sendMessage(`Error Api Removed Background Command`, event.threadID, event.messageID);
      }
          }
    module.exports.run = async function ({ api, event }) {
       api.sendMessage(`This command doesn't need a prefix`, event.threadID, event.messageID);

    };