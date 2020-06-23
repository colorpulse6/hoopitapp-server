const express = require('express')
const router = express.Router()

let GamesModel = require('../models/Games.model')
let UserModel = require('../models/User.model')

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
                   error: 'Something went wrong',
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
    GamesModel.create({createdBy: user.username, date: date, location: location, maxPlayers: maxPlayers, players: [user.username], completed: false})
          .then((response) => {
            // console.log(response.players.length)
               res.status(200).json(response)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })  
})

//GET GAME DETAIL
router.get('/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    GamesModel.findById(id)
     .then((response) => {
          res.status(200).json(response)
     })
     .catch((err) => {
         console.log(id)
          res.status(500).json({
               error: 'Something went wrong',
               message: err
          })
     }) 
})


// router.post('/join-game', (req, res) => {
//     GamesModel.findOneAndUpdate()
// })

module.exports = router;