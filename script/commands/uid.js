    module.exports.config = {
      name: "uid",
      version: "1.0.0",
      hasPermission: 0,
      credits: "Mirai Team",
      description: "Get the user's Facebook UID.",
      commandCategory: "other",
      cooldowns: 5
    };

    module.exports.run = async function ({ api, event }) {
      try {
        if (Object.keys(event.mentions).length === 0) {
          if (event.messageReply) {
            const senderID = event.messageReply.senderID;
            return api.sendMessage(senderID, event.threadID);
          } else {
            return api.sendMessage(`${event.senderID}`, event.threadID);
          }
        } else {
          for (const mentionID in event.mentions) {
            const mentionName = event.mentions[mentionID];
            api.sendMessage(`${mentionName.replace('@', '')}: ${mentionID}`, event.threadID);
          }
        }
      } catch (error) {
        console.error("Error in uid command:", error);
      }
    };