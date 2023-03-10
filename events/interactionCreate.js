const client = require("..");

client.on("interactionCreate", async (interaction) => {
  const cmd = client.slashCommands.get(interaction.commandName);
  if (!cmd) {
    console.log("Something went wrong!");
  }
  if (cmd.Ephemeral === true) {
      await interaction.deferReply({ ephemeral: true }).catch(() => {});
  } else {
      await interaction.deferReply({ ephemeral: false }).catch(() => {});
  }
  const args = [];
  for (let option of interaction.options.data) {
    if (option.type === 1) {
      if (option.name) args.push(option.name);
      option.options.forEach((x) => {
        if (x.value) args.push(x.value);
      });
    } else if (option.value) {
      args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );
    cmd.run(client, interaction, args);
  }
  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});
