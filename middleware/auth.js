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


module.exports = {isLoggedIn};
