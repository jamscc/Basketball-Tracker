const authReq = (req, res, next) => {
  
    switch (true) {
      case (req.session.loggedIn):
          return next();
      default:
          res.redirect('/login');
    }
  };
  
  module.exports = authReq;