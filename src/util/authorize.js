const authorize = (req, res, next) => {
  if (!req.session.user_id) {
    return res.status(401).send("Unauthorized");
  }
  return next();
};

module.exports = {
  authorize,
};
