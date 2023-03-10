const { Client, GatewayIntentBits, Collection, Guild } = require("discord.js");
require("dotenv").config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
    ],
    allowedMentions: false,
 })
module.exports = client;

// Gobal ariables
client.slashCommands = new Collection();
client.config = require('./config.json');


//Initializing the project
require("./handler")(client);

client.once("ready", (client) => {
    console.log("Logged into bot!" + client.user.tag);
});


client.login(process.env.TOKEN);



/*           ANTI CRASHING            ¦¦           ANTI CRASHING           */
process.on("unhandledRejection", (reason, p) => {
    console.log(
        "\n\n\n\n\n[🚩 Anti-Crash] unhandled Rejection:".toUpperCase()
    );
    console.log(
        reason.stack
            ? String(reason.stack)
            : String(reason)
    );
    console.log("=== unhandled Rejection ===\n\n\n\n\n".toUpperCase());
});
process.on("uncaughtException", (err, origin) => {
    console.log(
        "\n\n\n\n\n\n[🚩 Anti-Crash] uncaught Exception".toUpperCase()
    );
    console.log(err.stack ? err.stack : err);
    console.log("=== uncaught Exception ===\n\n\n\n\n".toUpperCase());
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(
        "[🚩 Anti-Crash] uncaught Exception Monitor".toUpperCase()
    );
});
process.on("beforeExit", (code) => {
    console.log("\n\n\n\n\n[🚩 Anti-Crash] before Exit".toUpperCase());
    console.log(code);
    console.log("=== before Exit ===\n\n\n\n\n".toUpperCase());
});
process.on("exit", (code) => {
    console.log("\n\n\n\n\n[🚩 Anti-Crash] exit".toUpperCase());
    console.log(code);
    console.log("=== exit ===\n\n\n\n\n".toUpperCase());
});
// process.on("multipleResolves", (type, promise, reason) => {
//     console.log(
//         "\n\n\n\n\n[🚩 Anti-Crash] multiple Resolves".toUpperCase()
//     );
//     console.log(type, promise, reason);
//     console.log("=== multiple Resolves ===\n\n\n\n\n".toUpperCase());
// });