// Import required modules
const express = require('express');
const router = express.Router();
const bcrypt= require('bcrypt');
const app = express()
const User = require('../models/userModel');
const Games = require('../models/gamesModel');
const Offer = require('../models/offerModel');

const {isLoggedIn, isOfferedUser} = require('../middleware/auth');
app.use(express.static('public'))

// Route to handle signup
router.post('/signup', async (req, res) => {
    try {
        // Extract email and password from request body
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        // Validate input
        if (email === "" || password === "") {
            return res.json({
                status: "FAILED",
                message: "Empty input fields!"
            });
        } else if (!/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email)) {
            return res.json({
                status: "FAILED",
                message: "Invalid email entered"
            });
        } else if (password.length < 7) {
            return res.json({
                status: "FAILED",
                message: "Password entered is too short"
            });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: "User already exists"
            });
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance
        const newUser = new User({
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

       
        console.log('User saved to database:', savedUser);
    } catch (error) {
        console.error(error);
        res.json({
            status: "FAILED",
            message: "An error occurred"
        });
    }
});

// Route to handle login
router.post('/login', /*isLoggedIn,*/ (req, res) => {
    // Extract email and password from request body
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    // Validate input
    if (email === "" || password === "") {
        res.json({
            status: "FAILED",
            message: "Empty Credentials"
        });
    } else {
        // Check if the user exists in the database
        User.findOne({ email })
            .then(data => {
                if (data) {
                    const hashedPassword = data.password;
                    // Compare hashed password with the provided password
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if (result) {
                            req.session.user = {
                                //id: data._id,
                                email: data.email,
                                password:data.password,   
                            };
                            console.log("user successfully logged in");
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password"
                            });
                        }
                    })
                    

                }
            })
    }
});


router.put('/login', (req, res)=>{



    
});


// Route to handle logout
router.get('/logout', (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) {
            return res.json({
                status: 'FAILED',
                message: 'Logout failed',
            });
        }
    });
});



// Route to save games data to the database
router.post('/games' ,async (req, res) => {
    try {
        // Create a new games instance
        const games = new Games(req.body);
        // Save the new games to the database
        await games.save();
        // Respond with a success message and the saved games data
        res.status(201).send(games);
    } catch (error) {
        // Respond with an error message if saving fails
        res.status(400).send(error);
    }
});



// Create an offer
router.post('/offers', async (req, res) => {
    try {
        // Extract offer data from request body
        const { description, offeredUserId } = req.body;

        // Create a new offer instance
        const newOffer = new Offer({
            description,
            offeredUserId,
            offeringUserId: req.session.user.id, // Set the offering user as the logged-in user
            state: 'pending' // Set the initial state as pending
        });

        // Save the new offer to the database
        const savedOffer = await newOffer.save();

        res.status(201).json(savedOffer);
    } catch (error) {
        console.error('Error in creating offer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get offers (filtered by made vs received and offer state)
router.get('/offers', async (req, res) => {
    try {
        const filter = {};
        if (req.query.type === 'made') {
            filter.offeringUserId = req.session.user.id;
        } else if (req.query.type === 'received') {
            filter.offeredUserId = req.session.user.id;
        }

        if (req.query.state) {
            filter.state = req.query.state;
        }

        const offers = await Offer.find(filter);
        res.json(offers);
    } catch (error) {
        console.error('Error in fetching offers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Accept or reject an offer
router.patch('/offers/:id', isOfferedUser, async (req, res) => {
    try {
        const { state } = req.body;

        // Validate the state
        if (state !== 'accepted' && state !== 'rejected') {
            return res.status(400).json({ error: 'Invalid state' });
        }

        // Update the offer state
        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            { $set: { state } },
            { new: true }
        );

        res.json(updatedOffer);
    } catch (error) {
        console.error('Error in accepting/rejecting offer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete an offer
router.delete('/offers/:id', /*isOfferedUser*/ async (req, res) => {
    try {
        // Delete the offer
        await Offer.findByIdAndDelete(req.params.id);

        res.status(204).send();
    } catch (error) {
        console.error('Error in deleting offer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/offers/:id', /*isOfferedUser*/ async (req, res) => {
    try {
        // Delete the offer
        await Offer.findByIdAndUpdate(req.params.id);

        res.status(204).send();
    } catch (error) {
        console.error('Error in updating offer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router to use in other parts of the application

  module.exports = router;


    
