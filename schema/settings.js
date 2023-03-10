const mongoose = require("mongoose");
const Data = new mongoose.Schema({
    guild: { type: String, required: true },
    flag: { type: Boolean, required: false, default: false },
    autoTranslate: { type: Boolean, required: false, default: false },
});

module.exports = mongoose.model("settings", Data);
