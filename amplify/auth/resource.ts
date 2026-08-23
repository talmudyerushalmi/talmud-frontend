import { defineAuth } from '@aws-amplify/backend';

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
 *   - Editor: users with permission to edit halachot in the admin UI
 *
 * Google OAuth (Identity Provider) is intentionally omitted for now — will be
 * added once we retrieve the Google Cloud Console OAuth Client credentials.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: { required: true, mutable: true },
    familyName: { required: true, mutable: true },
    givenName: { required: true, mutable: true },
    fullname: { required: true, mutable: true },
  },
  groups: ['Editor'],
});
