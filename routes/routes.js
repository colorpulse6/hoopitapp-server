const express = require("express");
const router = express.Router();

let GamesModel = require("../models/Games.model");
let UserModel = require("../models/User.model");
let TeamsModel = require("../models/Teams.model");
let Message = require("../models/Message.Model");

const { isLoggedIn } = require("../helpers/auth-helper"); // to check if user is loggedIn

router.get("/team-messages/:teamId", (req, res) => {
  let id = req.params.teamId;
  Message.find({ team: id })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) return console.error(err);
      res.status(200).json(messages);
      // Send the last messages to the user.
      //   socket.emit('init', messages);
    });
});

//GET GAMES MAIN
router.get("/main", (req, res) => {
  GamesModel.find()
    .then((games) => {
      res.status(200).json(games);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong main",
        message: err,
      });
    });
});

//GET GAMES USER-MAIN
router.get("/user-main", (req, res) => {
  GamesModel.find()
    .then((games) => {
      res.status(200).json(games);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong user main",
        message: err,
      });
    });
});

//SEND USERS
router.get("/users", (req, res) => {
  UserModel.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong users",
        message: err,
      });
    });
});

//GET USER
router.get("/user", (req, res) => {
  let userId = req.session.loggedInUser._id;

  UserModel.findById(userId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong users",
        message: err,
      });
    });
});

//Create Game
router.post("/create-game", isLoggedIn, (req, res) => {
  let user = req.session.loggedInUser;
  const {
    date,
    time,
    location,
    city,
    lat,
    lng,
    maxPlayers,
    players,
    imageUrl,
  } = req.body;
  console.log(req.body);
  GamesModel.create({
    createdBy: user.username,
    date: date,
    time: time,
    location: location,
    city: city,
    lat: lat,
    lng: lng,
    maxPlayers: maxPlayers,
    players: players,
    completed: false,
    savedAsTeam: undefined,
    imageUrl: imageUrl,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong create ",
        message: err,
      });
    });
});

//GET GAME DETAIL
router.get("/game-detail/:id", isLoggedIn, (req, res) => {
  let id = req.params.id;
  GamesModel.findById(id)
    .populate("User")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong game detail",
        message: err,
      });
    });
});

//JOIN GAME
router.get("/join-game/:id", isLoggedIn, (req, res) => {
  let id = req.params.id;
  let user = req.session.loggedInUser._id;
  GamesModel.findById(id).then((game) => {
    //TEST IF GAME ALREADY INCLUDES PLAYER
    if (!game.players.includes(user)) {
      GamesModel.update({ _id: id }, { $push: { players: user } })
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "Something went wrong join game",
            message: err,
          });
        });
    }
  });
});

//CREATE TEAM
router.post("/:id/save-team", isLoggedIn, (req, res) => {
  let gameId = req.params.id;
  let user = req.session.loggedInUser;
  const { teamName } = req.body;

  GamesModel.findByIdAndUpdate(gameId, {
    $set: {
      savedAsTeam: teamName,
    },
  }).then((game) => {
    TeamsModel.create({
      owner: user.username,
      teamName: teamName,
      homeTown: user.location,
      players: game.players,
    })

      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Something went wrong create team",
          message: err,
        });
      });
  });
});

//FIND TEAM
router.get("/teams", isLoggedIn, (req, res) => {
  TeamsModel.find()
    .then((teams) => {
      res.status(200).json(teams);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong getting Teams",
        message: err,
      });
    });
});

//QUIT TEAM
router.post("/quit-team/:id", isLoggedIn, (req, res) => {
  let id = req.params.id;
  let userId = req.session.loggedInUser._id;
  TeamsModel.update({ _id: id }, { $pull: { players: userId } })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong Deleting User from Team",
        message: err,
      });
    });
});

//DISBAND TEAM
router.delete("/disband-team/:id", isLoggedIn, (req, res) => {
  let id = req.params.id;
  TeamsModel.findByIdAndDelete(id)
    .then((response) => {
      console.log(response + "  Team deleted!!!!");
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong Deleting User from Team",
        message: err,
      });
    });
});

//GET EACH TEAM
router.get("/each-team/:teamId", isLoggedIn, (req, res) => {
  let teamId = req.params.teamId;
  console.log(teamId);
  TeamsModel.findById(teamId)
    .populate("players")
    .then((response) => {
      console.log(response + "  Team Got!!!!");
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong getting each Team",
        message: err,
      });
    });
});

//CANCEL GAME
router.delete("/:id/admin/cancel-game", isLoggedIn, (req, res) => {
  let id = req.params.id;
  GamesModel.findByIdAndDelete(id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong Deleting  Game",
        message: err,
      });
    });
});

//QUIT GAME
router.get("/quit-game/:id", isLoggedIn, (req, res) => {
  let id = req.params.id;
  let userId = req.session.loggedInUser._id;
  GamesModel.update(
    { _id: id },
    { $pull: { players: userId } },
    { $unset: { savedAsTeam: undefined } }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong Deleting User from Game",
        message: err,
      });
      console.log(err + "Backend error");
    });
});

//EDIT PROFILE
router.post("/edit-profile/:id", isLoggedIn, (req, res) => {
  let id = req.params.id;
  let userId = req.session.loggedInUser._id;
  const { username, location, lat, lng } = req.body;
  UserModel.update(
    { _id: userId },
    {
      $set: {
        username: username,
        location: location,
        lat: lat,
        lng: lng,
      },
    }
  )
    .then((response) => {
      console.log(response + "  EDIted profile");
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong Editing profile",
        message: err,
      });
    });
});

//EDIT PROFILE PIC
router.patch("/edit-profile-pic", isLoggedIn, (req, res) => {
  const { profileImg } = req.body;
  let userId = req.session.loggedInUser._id;

  UserModel.findByIdAndUpdate(userId, { imageUrl: profileImg })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;
