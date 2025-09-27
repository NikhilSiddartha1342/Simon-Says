const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'No user found' });

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) return done(null, user);
          else return done(null, false, { message: 'Wrong password' });
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
