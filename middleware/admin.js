// Middleware Function
function admin(req, res, next) {
  // checks if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).send("Access Denied");
    //401 - Unauthorised - No valid token
    //403 - Forbidden - Valid token with insufficient privileges
  }
  next();
}

module.exports = admin;
