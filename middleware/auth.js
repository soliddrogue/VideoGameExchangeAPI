const User = require('../models/userModel');

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user; // Return the user object if found
  } catch (error) {
    console.error('Error fetching user from the database:', error);
    throw error; // Propagate the error to the calling function
  }
};

const isLoggedIn = async function (req, res, next) {
  // Check if there is a user object in the request, indicating that the user is logged in
 
  console.log(req.session);
  if (req.session.user) {
    
    // If a user is present, check if the user details in the session are up-to-date
    try {
      const updatedUser = await getUserById(req.session.user.id);

      if (updatedUser) {
        // Update the session with the latest user information
        req.session.user = {
          id: updatedUser.id,
          email: updatedUser.email,
        };
      }

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error('Error updating user information:', error);
      return res.status(500).json({
        status: 'FAILED',
        message: 'Internal Server Error'
      });
    }
  } else {
    // If no user is present, return false and send a 401 Unauthorized status with an 'Access Denied' message
    return res.status(401).json({
      status: 'FAILED',
      message: 'Access Denied'
    });
  }
};

/*
// Middleware to check if the user is the offered user
const isOfferedUser = async (req, res, next) => {
    try {
        // Assuming that the offeredUserId is in the request parameters
        const offeredUserId = req.params.offeredUserId;

        // Check if the logged-in user matches the offered user
        if (req.session.user.id === offeredUserId) {
            // User is the offered user, proceed to the next middleware or route handler
            next();
        } else {
            // User is not the offered user, send an unauthorized response
            res.status(401).send('Unauthorized User');
        }
    } catch (error) {
        console.error('Error in isOfferedUser middleware:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
*/
module.exports = {isLoggedIn};
