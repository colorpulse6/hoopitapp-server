const mongoose = require('mongoose');

let MessageSchema = new mongoose.Schema(
    {
    message: {
        type: String
    },
    sender: {
        type: String
        }
    },
        {
            timestamps: true
    
});

let MessageModel = mongoose.model('Message', MessageSchema)

module.exports = MessageModel;