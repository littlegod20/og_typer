import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { User } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "dotenv";
import { AppDataSource } from "./database.config";
import { appConfig } from "./app.config";

config();

function userRepository() {
  return AppDataSource.getRepository(User);
}

// local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userRepository().findOne({ where: { email } });
        if (!user) return done(null, false, { message: "Incorrect email." });

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
          return done(null, false, { message: "Incorrect password." });

        return done(null, user); // signature for done() method : done(error, user, info)
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Jwt strategy

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? "defaultSecret",
    },
    async (jwtPayload, done) => {
      console.log("jwtPayload:", jwtPayload);
      try {
        const id =
          (jwtPayload as { userId?: string; id?: string }).userId ??
          (jwtPayload as { id?: string }).id;
        const user = await userRepository().findOne({
          where: { id },
        });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// google strategy (only if OAuth credentials are configured)
if (appConfig.googleCred.clientId && appConfig.googleCred.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: appConfig.googleCred.clientId,
        clientSecret: appConfig.googleCred.clientSecret,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0].value;
          const domain = email?.split("@")[1];

          if (domain !== "gmail.com") {
            return done(null, false, {
              message: "Access restricted to @gmail.com accounts only",
            });
          }

          const repo = userRepository();
          let user = await repo.findOne({
            where: { email: email },
          });

          if (!user) {
            user = repo.create({
              email: email,
              username: profile.displayName,
            });

            await repo.save(user);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
