const LocalStragety = require("passport-local").Strategy;
const User = require("../models/users.model");
const initialize = (passport) => {
  const authentication = async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: "No user with this email" });
    }
    try {
      if (await user.comparePassword(password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Wrong password" });
      }
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new LocalStragety({ usernameField: "email" }, authentication));
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    return done(null, user);
  });
};
module.exports = initialize;
