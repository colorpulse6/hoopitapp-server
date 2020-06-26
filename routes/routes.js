const express = require('express')
const router = express.Router()

let GamesModel = require('../models/Games.model')
let UserModel = require('../models/User.model')
let TeamsModel = require('../models/Teams.model')

const { isLoggedIn } = require('../helpers/auth-helper'); // to check if user is loggedIn


//Main User Page
router.get('/user-main', (req, res) => {
    GamesModel.find()
         .then((games) => {
            //  console.log('games: ' + games)
              res.status(200).json(games)
         })
         .catch((err) => {
              res.status(500).json({
                   error: 'Something went wrong user main',
                   message: err
              })
    })         
})

 //SEND USERS

 router.get('/users', (req, res) => {
    UserModel.find()
    .then((users) => {
        res.status(200).json(users)
    })
    .catch((err) => {
        res.status(500).json({
             error: 'Something went wrong users',
             message: err
        })
})
})

//Question: How will this get the data from the route on client side?



//Create Game
router.post('/create-game', isLoggedIn, (req, res) => {  
    let user = req.session.loggedInUser
    const {date, location, maxPlayers} = req.body;
    // console.log(req.session.loggedInUser)
    GamesModel.create({createdBy: user.username, date: date, location: location, maxPlayers: maxPlayers, players: [user._id], completed: false})
          .then((response) => {
            // console.log(response.players.length)
               res.status(200).json(response)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong create ',
                    message: err
               })
          })  
})

//GET GAME DETAIL
router.get('/game-detail/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    GamesModel.findById(id)
    .populate('User')
     .then((response) => {
         console.log('Game response:  ' + response)
          res.status(200).json(response)
     })
     .catch((err) => {
        //  console.log(id)
          res.status(500).json({
               error: 'Something went wrong game detail',
               message: err
          })
     }) 
})

//JOIN GAME
router.get('/join-game/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    let user = req.session.loggedInUser._id
    GamesModel.findById(id)
    .then((game)=> {
        //TEST IF GAME ALREADY INCLUDES PLAYER
        // console.log('GAME:::::' + game) 
        if(!game.players.includes(user)){
            GamesModel.update({_id: id}, {$push: {players: user}})
            .then((response) => {
                res.status(200).json(response)
            })
            .catch((err) => {
            console.log(err)
                res.status(500).json({
                error: 'Something went wrong join game',
                message: err
                })
            })
        }
    })
     
 })

 //CREATE TEAM
 router.post('/:id/save-team', isLoggedIn, (req, res) => {
    //  console.log(res + 'router RESSS!')
     let gameId = req.params.id
     let user = req.session.loggedInUser
     const {teamName} = req.body;
     GamesModel.findById(gameId)
      .then((game) => {
        TeamsModel.create(
            {
                owner: user.username,
                teamName: teamName, 
                homeTown: user.location,
                players: game.players
            })
            // .populate('User')
        .then((response) => {
            console.log('TEAMS MODEL' + response)
            // console.log(response.players.length)
               res.status(200).json(response)
               
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong create team',
                    message: err
                    
               })
          })
      })
 })

//FIND TEAM

router.get('/teams', isLoggedIn, (req, res) => {
    TeamsModel.find()
    .then((teams) => {
        //  console.log('games: ' + games)
          res.status(200).json(teams)
     })
     .catch((err) => {
          res.status(500).json({
               error: 'Something went wrong getting Teams',
               message: err
          })
})         

})
 //QUIT TEAM
router.post('/quit-team/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    let userId = req.session.loggedInUser._id
    // console.log(id, user)
    TeamsModel.update({_id: id}, {$pull: {players : userId}})
        .then((response)=> {
            // console.log(newTeam + '  NewTEAM!!!!')
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(500).json({
                 error: 'Something went wrong Deleting User from Team',
                 message: err
            })
        })
})

//QUIT GAME
router.get('/quit-game/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    let userId = req.session.loggedInUser._id
    // console.log(id, user)
    GamesModel.update({_id: id}, {$pull: {players : userId}})
        .then((response)=> {
             console.log(newGame + '  New Game!!!!')
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(500).json({
                 error: 'Something went wrong Deleting User from Game',
                 message: err
            })
            console.log(err + 'Backend error')
        })
})

module.exports = router;