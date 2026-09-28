import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Amplify Gen 2-managed Cognito user pool.
 *
 * Unlike `referenceAuth()`, `defineAuth()` creates and owns the pool as
 * infrastructure-as-code — one pool per Amplify Hosting branch, provisioned
 * automatically by `ampx pipeline-deploy` on each build. No env-branching in
 * code: `production` branch gets its own pool, `staging` gets its own, PRs
 * get sandbox pools, etc.
 *
 * User attributes match the pre-migration pool (`talmud_users`):
 *   - email (username)
 *   - family_name, given_name, name (required at sign-up)
 *
 * Groups match the pre-migration pool:
 *   - editor: users with permission to edit halachot in the admin UI
 *
 * Google Sign-In (external identity provider) is wired via `secret()` refs
 * (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`) that must be set in the
 * Amplify Console Secrets Manager (App → Hosting → Secrets → All branches).
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['profile', 'email', 'openid'],
        attributeMapping: {
          email: 'email',
          familyName: 'family_name',
          givenName: 'given_name',
          fullname: 'name',
        },
      },
      callbackUrls: [
        'http://localhost:3000/',
        'https://staging.dbqgq8bviptn7.amplifyapp.com/',
        'https://production.dbqgq8bviptn7.amplifyapp.com/',
        'https://staging.talmudyerushalmi.com/',
        'https://www.talmudyerushalmi.com/',
        'https://talmudyerushalmi.com/',
      ],
      logoutUrls: [
        'http://localhost:3000/',
        'https://staging.dbqgq8bviptn7.amplifyapp.com/',
        'https://production.dbqgq8bviptn7.amplifyapp.com/',
        'https://staging.talmudyerushalmi.com/',
        'https://www.talmudyerushalmi.com/',
        'https://talmudyerushalmi.com/',
      ],
    },
  },
  userAttributes: {
    email: { required: true, mutable: true },
    familyName: { required: true, mutable: true },
    givenName: { required: true, mutable: true },
    fullname: { required: true, mutable: true },
  },
  groups: ['editor'],
});