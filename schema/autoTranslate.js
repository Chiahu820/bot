const mongoose = require("mongoose");
const Data = new mongoose.Schema({
    guild: { type: String, required: true },
    alpha2: { type: String, required: true },
    numeric: { type: String, required: true },
    country: { type: String, required: true },
    toLanage: { type: String, required: true },
    fromChannel: { type: String, required: true },
    toChannel: { type: String, required: true },
    webHook: { type: String, required: true },
});

module.exports = mongoose.model("autoTranslate", Data);
