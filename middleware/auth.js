// Middleware function to check if a user is logged in
exports.isLoggedIn = function (req, res, next) {
  // Check if there is a user object in the request, indicating that the user is logged in
  if (req.user) {
    // If a user is present, proceed to the next middleware or route handler
    next();
  } else {
    // If no user is present, return a 401 Unauthorized status and send an 'Access Denied' message
    return res.status(401).send('Access Denied');
  }
};


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

module.exports = { isOfferedUser };