module.exports.config = {
   name: "sim",
   version: "4.3.7",
   hasPermssion: 0,
   credits: "Eugene Aguilar", 
   description: "Chat with the best sim Chat",
   commandCategory: "sim",
   usages: "on/off",
   cooldowns: 2
}
async function simsimi(a, b, c) {
   const d = global.nodemodule.axios, g = (a) => encodeURIComponent(a);
   try {
      var { data: j } = await d({ url: `https://eurix-api.replit.app/api/sim/tools?ask=${g(a)}`, method: "GET" });
      return { error: !1, data: j }
   } catch (p) {
      return { error: !0, data: {} }
   }
}
module.exports.onLoad = async function () {
   "undefined" == typeof global && (global = {}), "undefined" == typeof global.simsimi && (global.simsimi = new Map);
};
module.exports.handleEvent = async function ({ api: b, event: a }) {
   const { threadID: c, messageID: d, senderID: e, body: f } = a, g = (e) => b.sendMessage(e, c, d);
   if (global.simsimi.has(c)) {
      if (e == b.getCurrentUserID() || "" == f || d == global.simsimi.get(c)) return;
      var { data: h, error: i } = await simsimi(f, b, a);
      return !0 == i ? void 0 : !1 == h.respond ? g(h.error) : g(h.respond)
   }
}
module.exports.run = async function ({ api: b, event: a, args: c }) {
   const { threadID: d, messageID: e } = a, f = (c) => b.sendMessage(c, d, e);
   if (0 == c.length) return f("You have not entered the message");
   switch (c[0]) {
      case "on":
        return global.simsimi.has(d) ? f("You have not turned off the sim.") : (global.simsimi.set(d, e), f("🟢 | sim has been successfully enable."));
      case "off":
        return global.simsimi.has(d) ? (global.simsimi.delete(d), f("🔴 | sim has been successfully disable.")) : f("You have not turned on the sim.");
      default:
        var { data: g, error: h } = await simsimi(c.join(" "), b, a);
        return !0 == h ? void 0 : !1 == g.respond ? f(g.error) : f(g.respond);
   }
};