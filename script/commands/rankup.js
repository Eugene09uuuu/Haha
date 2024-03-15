module.exports.config = {
  name: "rankup",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "Eugene Aguilar",
  description: "Automatically notifies users when they rank up.",
  commandCategory: "system",
  dependencies: {
    "fs-extra": ""
  },
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    unsendMessageAfter: 5
  }
};

module.exports.handleEvent = async function ({ api, event, Currencies, Users, getText }) {
  var { threadID, senderID } = event;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];

  threadID = String(threadID);
  senderID = String(senderID);

  const thread = global.data.threadData.get(threadID) || {};

  let exp = (await Currencies.getData(senderID)).exp;
  exp += 1;

  if (isNaN(exp)) return;

  const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3)) - 1) / 2);
  const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3)) - 1) / 2);

  if (level > curLevel && level !== 1) {
    const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
    const message = (typeof thread.customRankup === "undefined") ? getText("levelup") : thread.customRankup;
    const arrayContent = { body: message.replace(/\{name}/g, name).replace(/\{level}/g, level), mentions: [{ tag: name, id: senderID }] };
    const moduleName = this.config.name;
    api.sendMessage(arrayContent, threadID, async function (error, info) {
      if (global.configModule[moduleName].autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, global.configModule[moduleName].unsendMessageAfter * 1000));
        return api.unsendMessage(info.messageID);
      } else return;
    });
  }

  await Currencies.setData(senderID, { exp });
  return;
}

module.exports.languages = {
  "vi": {
    "successText": "thành công thông báo rankup!",
    "levelup": "Trình độ chém gió của {name} đã đạt tới level {level}"
  },
  "en": {
    "successText": "success notification rankup!",
    "levelup": "{name}, your keyboard hero level has reached level {level}",
  }
}

module.exports.run = async function ({ api, event, Threads, Currencies, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(getText("successText"), threadID, messageID);
}