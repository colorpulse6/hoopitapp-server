const express = require('express')
const app = express()
//ensure database is connected
var path = require('path');
require('./config/database.config')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
let MessageModel = require('./models/Message.Model')

require("dotenv").config();


//CONFIGURE WEBSOCKETS
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3030 });

wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(data) {
    
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {

        client.send(data);

      }
    });
  });
});


//CORS

const cors = require('cors')
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoopitapp'
app.use(
  session({
    secret: 'my-secret-weapon',
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000, //60 sec * 60 min * 24hrs = 1 day (in milliseconds)
    },
    store: new MongoStore({
      url: MONGODB_URI,
      // mongooseConnection: mongoose.connection
      //time to live (in seconds)
      ttl: 60 * 60 * 24,
      autoRemove: 'disabled',
    }),
  })
);



//A library that helps us log the requests in the console
const logger = require('morgan');
app.use(logger('dev'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Use body parser. To be able parse post request information
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()) //crucial for post requests from client


app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

//Register routes
const routes = require('./routes/routes');
app.use('/', routes);

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes);


//FOR IMAGE UPLOADS
// const fileUploads = require('./routes/file-upload.routes')
// app.use('/', fileUploads)

// app.use((req, res, next) => {
//   // If no routes match, send them the React HTML.
//   res.sendFile(__dirname + "/public/index.html");
// });

//Start the server to begin listening on a port
// make sure you don't run it on port 3000 because 
// your react app uses port 3000. 
app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log('Server is running')
})