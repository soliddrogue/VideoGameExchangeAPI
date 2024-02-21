// Import required modules and libraries
const express = require("express"); // Express.js framework for building web applications
const http = require('http');
const fs = require('fs');
const app = express(); // Create an instance of the Express application
const bodyParser = require("body-parser"); // Parse incoming request bodies
const mongoose = require('mongoose'); // MongoDB object modeling tool for Node.js
const session = require('express-session'); // Middleware for managing sessions

app.use(session({
    secret: '00000', 
    resave: false,
    saveUninitialized: false,
    cookie: {path : '/',secure: true} 
  }));

const routes = require("./routes/pages"); // Import the routes defined in the pages module
routeValidator = require('express-route-validator')



// Set the view engine to EJS (Embedded JavaScript templates)
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON in the request body
app.use(bodyParser.json());

// Parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: true }));

// Use the routes defined in the pages module for handling different paths
app.use("/", routes);



// Connect to the MongoDB database named 'FocusFlow' running locally on port 2717
mongoose.connect('mongodb://localhost:2717/Games', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Get the database connection instance
var db = mongoose.connection;

// Handle database connection errors
db.on('error', () => console.log("Error in Connecting to Database"));

// Execute code once the database connection is open
db.once('open', () => console.log("Connected to Database"));

// Set the port for the server to listen on, use the environment variable PORT if available, otherwise default to 3000
const PORT = process.env.PORT || 3001;

const sslOptions = {
    key: fs.readFileSync('path/to/your/key.pem'),
    cert: fs.readFileSync('path/to/your/cert.pem')
  };
  
  // Create an HTTPS server
  https.createServer(sslOptions, app).listen(3001, () => {
    console.log(`HTTPS Server is running on port 3001`);
  });