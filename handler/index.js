const { Client, messageLink } = require("discord.js");
const mongoose = require("mongoose");
const { glob } = require("glob");
const path = require("path");
const { promisify } = require("util");
const globPromise = promisify(glob);
module.exports = async (client) => {
  // events
  const eventFiles = await globPromise(
    path.join(__dirname, `..`, `events/`, `*.js`)
  );
  eventFiles.map((value) => {
    require(value);
    console.log(`[EVENT] Loaded ${value}`);
  });

  // modules
  const moduleFile = await globPromise(
    path.join(__dirname, `..`, `modules/`, `*.js`)
  );
  moduleFile.map((value) => {
    require(value);
    console.log(`[MODULE] Loaded ${value}`);
  });

  // Slash Commands
  const slashCommands = await globPromise(
    path.join(__dirname, `..`, `SlashCommands/`, `**`, `*.js`)
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);
    if ([3, 2].includes(file.type)) delete file.description;
    console.log("[LOG] Loaded (/)", file.name);
    arrayOfSlashCommands.push(file);
  });

  client.on("ready", async () => {
    await client.application.commands.set(arrayOfSlashCommands);
  })
  mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to mongodb'));

};
