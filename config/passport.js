const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");

module.exports = function(passport) {
  //local strategy
  passport.use(
    new LocalStrategy(function(username, password, done) {
      //match username
      let query = { username: username };
      User.findOne(query, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        //Match password - podudara se, dovde se username vec podudario
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "wrong password" });
          }
        });
      });
    })
  );

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
    // ovaj ide id u seseiju i salje se metodi deserializeUser
  });

  // used to deserialize the user i na kraju vraca tog usera.
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
