const mongoose = require('mongoose');

let MessageSchema = new mongoose.Schema({
    messages: [String]
})

let MessageModel = mongoose.model('Message', MessageSchema)

module.exports = MessageModel;