import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { env } from './env';
import { query } from './database';
import { authRepository } from '../modules/auth/repository/auth.repository';
import { sendEmail } from './email';
import { welcomeEmail } from '../modules/auth/service/email.templates';

function toPassportUser(row: any): Express.User {
  return { ...row, userId: row.id };
}

export function configurePassport() {
  if (env.google.clientId && env.google.clientSecret) {
    passport.use(new GoogleStrategy(
      {
        clientID: env.google.clientId,
        clientSecret: env.google.clientSecret,
        callbackURL: env.google.callbackUrl,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Google'));

          let user = await authRepository.findByOAuth('google', profile.id);
          if (!user) {
            // Check if user with this email already exists
            user = await authRepository.findByEmail(email);
            if (user) {
              // Link existing account
              await query(
                'UPDATE users SET oauth_provider = $1, oauth_id = $2 WHERE id = $3',
                ['google', profile.id, user.id]
              );
            } else {
              user = await authRepository.createOAuth(
                email,
                profile.displayName || email.split('@')[0],
                'google',
                profile.id
              );
              // Send welcome email for new OAuth users (non-blocking)
              const welcome = welcomeEmail(user.display_name);
              sendEmail(email, welcome.subject, welcome.html).catch(() => {});
            }
          }
          done(null, toPassportUser(user));
        } catch (err) {
          done(err as Error);
        }
      }
    ));
  }

  if (env.github.clientId && env.github.clientSecret) {
    passport.use(new GitHubStrategy(
      {
        clientID: env.github.clientId,
        clientSecret: env.github.clientSecret,
        callbackURL: env.github.callbackUrl,
        scope: ['user:email'],
      },
      async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

          let user = await authRepository.findByOAuth('github', profile.id);
          if (!user) {
            user = await authRepository.findByEmail(email);
            if (user) {
              await query(
                'UPDATE users SET oauth_provider = $1, oauth_id = $2 WHERE id = $3',
                ['github', profile.id, user.id]
              );
            } else {
              user = await authRepository.createOAuth(
                email,
                profile.displayName || profile.username || 'User',
                'github',
                profile.id
              );
              // Send welcome email for new OAuth users (non-blocking)
              const welcome = welcomeEmail(user.display_name);
              sendEmail(email, welcome.subject, welcome.html).catch(() => {});
            }
          }
          done(null, toPassportUser(user));
        } catch (err) {
          done(err as Error);
        }
      }
    ));
  }
}
