const mongoose = require('mongoose');

let configOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoopitapp'

mongoose.connect(MONGODB_URI, configOptions)
    .then(() => {
        
        console.log('Database is connected, happy hooping!');
    })
    .catch(() => {
        console.log('Something went wrong in database connection!');
    })