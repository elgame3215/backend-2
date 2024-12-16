import { comparePassword } from "./hash.js";
import { Strategy } from "passport-local";
import { UserController } from "../dao/controllers/user.controller.js";

export function initializePassport(passport) {
  passport.use(
    "login",
    new Strategy(
      {
        usernameField: "email",
      },
      async function (email, password, done) {
				const user = await UserController.findUserByEmail(email);
        if (!user) {
					return done(null, false);
        }
        if (!(await comparePassword(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      },
    ),
  );
	passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserController.findById(id);
    done(null, user);
  });
}

