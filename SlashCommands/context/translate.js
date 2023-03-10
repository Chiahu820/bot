const { Client, CommandInteraction, MessageEmbed, ContextMenuCommandInteraction } = require("discord.js");
const { google, microsoft, youdao, baidu } = require('translate-platforms');
module.exports = {
  name: "翻譯訊息",
  type: 3,
  description: "翻譯訊息到你的語言",
  Ephemeral: true,
  /**
   *
   * @param {Client} client
   * @param {ContextMenuCommandInteraction} interaction
   * @param {String[]} args
   */

  run: async (client, interaction, args) => {
    const msg = await interaction.channel.messages.fetch(
      interaction.targetId
    );
    try {
      let result = await microsoft(msg.content, { to: interaction.locale.slice(0, 2).toUpperCase() });
      interaction.editReply({
        content: result.text,
        ephemeral: true
      })
    } catch {
      try {
        let result = await microsoft(msg.content, { to: interaction.locale.toLowerCase() });
        interaction.editReply({
          content: result.text,
          ephemeral: true
        })
      } catch {
        interaction.editReply({
          content: "翻譯失敗",
          ephemeral: true
        })
      }
    }


    

  },
};
