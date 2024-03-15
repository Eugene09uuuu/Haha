const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Eugene Aguilar",
  description: "Generate Tempmail From docs site",
  commandCategory: "gen",
  usages: "tempmail gen inbox",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
    let { threadID, messageID } = event;


    if (!args[0]) {
        api.sendMessage(`usage: ${global.config.PREFIX}tempmail gen\n\nTo get the messages:\n\nuse ${global.config.PREFIX}tempmail inbox [email]\nexample: ${global.config.PREFIX}tempmail inbox culyqdbm78o3@kzccv.com`, threadID, messageID);
    }
    else if (args[0] == "gen") {
        const url1 = await axios.get(`https://tempmail-api-1ry2.onrender.com/api/gen`);
        const email = url1.data.email;
  return api.sendMessage(`here's your temporary email :\n${email}`, threadID, messageID);
    }
    else if (args[0] == "inbox") {
    const text = args[1];
      const url2 = await axios.get(`https://tempmail-api-1ry2.onrender.com/api/getmessage/:email?email=${text}`);
        const mess = url2.data.messages[0].message;
      const sub = url2.data.messages[0].subject;
      const sender = url2.data.messages[0].sender;

           return api.sendMessage(`here's the inbox of ${text}\n\nsender : ${sender}\nsubject : ${sub}\nmessage : ${mess}`, threadID, messageID);
    }

};