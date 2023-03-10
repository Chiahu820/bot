const client = require("../");
const { WebhookClient, AttachmentBuilder } = require("discord.js");
const autoTranslateSchema = require("../schema/autoTranslate");
const settingsSchema = require("../schema/settings");
const { google, microsoft, youdao, baidu } = require("translate-platforms");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  const settingsData = await settingsSchema.findOne({
    guild: message.guild.id,
  });
  let enableTranslate = true;
  let enableFlag = false;
  if (settingsData) {
    enableFlag = settingsData?.flag;
    enableTranslate = settingsData?.autoTranslate;
  }
  if (!enableTranslate) return;
  const data = await autoTranslateSchema.find({
    fromChannel: message.channel.id,
  });
  let files = [];

  if (message.attachments.size > 0) {
    message.attachments.every(attachIsImage);
  }

  function attachIsImage(msgAttach) {
    return files.push(msgAttach.proxyURL || null);
  }
  if (data) {
    const text = message.content;
    var counter = 0;
    data.map(async (obj) => {
      let translatedMessage = "";
      const webhook = new WebhookClient({ url: obj.webHook });
      if (text) {
        translation(text, obj.toLanage).then((result) => {
          if (enableFlag)
            translatedMessage += `:flag_${obj.alpha2.toLowerCase()}: `;
          translatedMessage += `${result} \n`;

          if (text)
            webhook
              .send({
                content: translatedMessage,
                username: `${message.member.displayName} (${message.author.tag})`,
                avatarURL: message.author.displayAvatarURL({ dynamic: true }),
                allowedMentions: {
                  users: false,
                  roles: false,
                },
              })
              .catch((err) => {
                autoTranslateSchema.findOne(
                  { webHook: obj.webHook },
                  async (err, data) => {
                    if (data) data.delete();
                  }
                );
              });
        });
        if (files.length > 0) {
          files.map((file) => {
            webhook
              .send({
                content: file,
                username: `${message.member.displayName} (${message.author.tag})`,
                avatarURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .catch((err) => {
                autoTranslateSchema.findOne(
                  { webHook: obj.webHook },
                  async (err, data) => {
                    if (data) data.delete();
                  }
                );
              });
          });
        }
      } else if (files && !text) {
        if (files.length > 0) {
          files.map((file) => {
            webhook
              .send({
                content: file,
                username: `${message.member.displayName} (${message.author.tag})`,
                avatarURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .catch((err) => {
                autoTranslateSchema.findOne(
                  { webHook: obj.webHook },
                  async (err, data) => {
                    if (data) data.delete();
                  }
                );
              });
          });
        }
      }
    });
  }
});

function translation(text, lang) {
  return new Promise(async (resolve, reject) => {
    const result = await microsoft(text, { to: lang });
    resolve(result.text);
  });
}
