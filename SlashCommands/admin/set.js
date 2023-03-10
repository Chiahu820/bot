const {
  Client,
  CommandInteraction,
  Appl,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  BaseGuildTextChannel,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const iso = require("iso-3166-1");
const autoTranslateSchema = require("../../schema/autoTranslate");
const settingsSchema = require("../../schema/settings");
const ISO6391 = require("iso-639-1");

module.exports = {
  name: "set",
  description: "設置機器人",
  type: ApplicationCommandType.CHAT_INPUT,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "自動翻譯語言",
      description: "設置自動翻譯的語言",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "翻譯語言1",
          description: "要設置的翻譯語言 (ISO639-1)",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "翻譯語言2",
          description: "要設置的翻譯語言 (ISO3166-1)",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Channel,
          channelTypes: ChannelType.GuildText,
          name: "從頻道",
          description: "要設置的頻道",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Channel,
          channelTypes: ChannelType.GuildText,
          name: "至頻道",
          description: "要設置的頻道",
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "旗幟",
      description: "設置是否啟用旗幟",
      options: [
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "是否啟用",
          description: "是否啟用旗幟",
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "自動翻譯",
      description: "是否啟用自動翻譯",
      options: [
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "是否啟用",
          description: "是否啟用翻譯",
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const option = args[0];
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return interaction.editReply({
        content: "❌ 你沒有權限使用此指令",
        ephemeral: true,
      });
    if (option === "自動翻譯語言") {
      const fromChannel = interaction.options.getChannel("從頻道");
      const toChannel = interaction.options.getChannel("至頻道");
      const toLanage = interaction.options.getString("翻譯語言1").toUpperCase();
      const language = interaction.options.getString("翻譯語言2").toUpperCase();
      const languageData = await iso.whereAlpha2(language);
      if (!languageData) {
        return interaction.editReply({
          content: "請輸入正確的語言代碼 (ISO3166-1)",
          ephemeral: true,
        });
      } else if (ISO6391.validate(toLanage)) {
        return interaction.editReply({
          content: "請輸入正確的語言代碼 (ISO639-1)",
          ephemeral: true,
        });
      } else {
        const webhook = await toChannel.createWebhook({
          name: `自動翻譯-${languageData.alpha2}`,
        });
        autoTranslateSchema.findOne(
          { numeric: languageData.numeric, fromChannel: fromChannel.id },
          async (err, data) => {
            if (data) data.delete();
            await new autoTranslateSchema({
              guild: interaction.guild.id,
              country: languageData.country,
              alpha2: languageData.alpha2,
              numeric: languageData.numeric,
              toLanage: toLanage,
              fromChannel: fromChannel.id,
              toChannel: toChannel.id,
              webHook: webhook.url,
            }).save();
          }
        );

        interaction.editReply({
          content: `已成功設置自動翻譯語言為 ${
            languageData.country
          } (:flag_${languageData.alpha2.toLowerCase()}:)`,
          ephemeral: true,
        });
      }
    } else if (option === "旗幟") {
      settingsSchema.findOne(
        { guild: interaction.guild.id },
        async (err, data) => {
          if (data) {
            await settingsSchema.findOneAndUpdate(
              { guild: interaction.guild.id },
              { flag: interaction.options.getBoolean("是否啟用") },
              { upsert: true }
            );
          } else {
            await new settingsSchema({
              guild: interaction.guild.id,
              flag: interaction.options.getBoolean("是否啟用"),
            }).save();
          }
        }
      );
      interaction.editReply({
        content: `已成功設置旗幟為 \`${interaction.options.getBoolean(
          "是否啟用"
        )}\``,
        ephemeral: true,
      });
    } else if (option === "自動翻譯") {
      settingsSchema.findOne(
        { guild: interaction.guild.id },
        async (err, data) => {
          if (data) {
            await settingsSchema.findOneAndUpdate(
              { guild: interaction.guild.id },
              { autoTranslate: interaction.options.getBoolean("是否啟用") },
              { upsert: true }
            );
          } else {
            await new settingsSchema({
              guild: interaction.guild.id,
              autoTranslate: interaction.options.getBoolean("是否啟用"),
            }).save();
          }
          interaction.editReply({
            content: `已成功設置自動翻譯為 \`${interaction.options.getBoolean(
              "是否啟用"
            )}\``,
            ephemeral: true,
          });
        }
      );
    }
  },
};
