// middleware/auth.js
module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ statusMessage: "You must be logged in to access this feature" });
    }
  },
  checkRole: (roles) => (req, res, next) => {
    if (req.session.user && roles.includes(req.session.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  },
};
