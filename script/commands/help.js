const path = require('path');
const axios = require('axios');
const fs = require('fs');
const request = require('request'); 

module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "PetterSever/John Lester",
  description: "Beginner's Guide",
  commandCategory: "system",
  usages: "[Tên module]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300
  }
};

module.exports.languages = {
  //"vi": {
  //	"moduleInfo": "「 %1 」\n%2\n\n❯ Cách sử dụng: %3\n❯ Thuộc nhóm: %4\n❯ Thời gian chờ: %5 giây(s)\n❯ Quyền hạn: %6\n\n» Module code by %7 «",
  //	"helpList": '[ Hiện tại đang có %1 lệnh có thể sử dụng trên bot này, Sử dụng: "%2help nameCommand" để xem chi tiết cách sử dụng! ]"',
  //	"user": "Người dùng",
  //      "adminGroup": "Quản trị viên nhóm",
  //      "adminBot": "Quản trị viên bot"
//	},
  "en": {
    "moduleInfo": "『 %1 』\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\nModule code by %7",
    "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
    "user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  if (args.join().indexOf('all') == 0) {
    const commandList = commands.values();
    const group = [];
    let msg = "";

    for (const commandConfig of commandList) {
      if (!group.some(item => item.group.toLowerCase() === commandConfig.config.commandCategory.toLowerCase())) {
        group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
      } else {
        group.find(item => item.group.toLowerCase() === commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
      }
    }

    group.forEach(commandGroup => msg += `『 ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} 』\n${commandGroup.cmds.join(', ')}\n\n`);

    const moduleName = this.config.name;
    const info = await api.sendMessage(msg, event.threadID);

    setTimeout(() => {
      api.unsendMessage(info.messageID);
    }, 120000);

    return;
  }

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 10;
    let i = 0;
    let msg = "";

    for (const [name] of commands) {
      arrayInfo.push(name);
    }

    arrayInfo.sort((a, b) => a.data - b.data);

    const startSlice = numberOfOnePage * page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    for (const item of returnArray) {
      msg += `『 ${i++} 』${prefix}${item} ❯ ${commands.get(item).config.usages}\n`;
    }

    const siu = `✨ Commands List`;
    const text = `\nPage (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\n\nYou can use ${global.config.PREFIX}help all to see all commands`;

    const link = [`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`];

    const callback = () => {
      api.sendMessage({ body: siu + "\n\n" + msg + text, attachment: fs.createReadStream(path.join(__dirname, "/cache/help.jpg")) }, event.threadID, () => fs.unlinkSync(path.join(__dirname, "/cache/help.jpg")), event.messageID);
    };

    request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(path.join(__dirname, "/cache/help.jpg")))
      .on("close", () => {
        callback();
      });

    return;
  }

  if (autoUnsend) {
    await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
    return api.unsendMessage(messageID);
  } else {
    return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion === 0) ? getText("user") : (command.config.hasPermssion === 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
  }
};