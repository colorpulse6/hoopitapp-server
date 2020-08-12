const express = require("express");
let Message = require("./models/Message.Model");
const app = express();
const http = require("http").Server(app);


// SOCKET.IO
const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on ',process.env.PORT || 5000)
  })
  var socket = require('socket.io')

  // const port = process.env.REACT_APP_SOCKET_URL || 5001;
  const io = socket(server);
  io.on("connection", (socket) => {
    socket.on("room", function (room) {
      socket.join(room);
    });
  
    // Listen to connected users for a new message.
    socket.on("message", (msg) => {
      // Create a message with the content and the name of the user.
      const message = new Message({
        content: msg.content,
        name: msg.name,
        team: msg.team,
        imageUrl: msg.imageUrl,
      });
  
      // Save the message to the database.
      message.save((err) => {
        if (err) return console.error(err);
      });
  
      // Notify all other users about a new message.
      socket.in(msg.team).emit("push", msg);
      console.log(msg.team);
    });
  });
  
  // http.listen(port, () => {
  //   console.log('listening on *:' + port);
  // });