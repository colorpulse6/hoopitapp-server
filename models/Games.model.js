const mongoose = require('mongoose');

let GameSchema = new mongoose.Schema({
    createdBy: String,
    date: String,
    location: String,
    city: String,
    completed: Boolean,
    players: [String],
    maxPlayers: Number
})

let GamesModel = mongoose.model('Game', GameSchema)

module.exports = GamesModel;