const mongoose = require("mongoose");

let TeamSchema = new mongoose.Schema({
  owner: String,
  teamName: String,
  homeTown: String,
  gamesPlayed: Number,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

let TeamsModel = mongoose.model("Team", TeamSchema);

module.exports = TeamsModel;
