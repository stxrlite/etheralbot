const { model, Schema } = require('mongoose');

let logSchema = new Schema ({
    GuildID: String,
    UserID: String
})

module.exports = model('logSchema', logSchema);