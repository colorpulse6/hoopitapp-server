const mongoose = require('mongoose');

let TeamSchema = new mongoose.Schema({
    owner: {

        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    teamName: String,
    homeTown: String,
    gamesPlayed: Number,
    players: [String]
})

let TodoModel = mongoose.model('Game', GameSchema)

module.exports = TodoModel;