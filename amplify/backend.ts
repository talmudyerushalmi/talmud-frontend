import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

const backend = defineBackend({ auth });

/**
 * `referenceAuth()` doesn't know about the Cognito hosted-UI OAuth setup
 * (domain, redirect URIs, scopes, federated IdPs) — those live on the pool
 * itself, not in the Gen 2 backend graph. So we inject the OAuth section of
 * `amplify_outputs.json` manually here.
 *
 * The frontend SDK uses this block to build the sign-in redirect URL; the
 * actual URI must also be whitelisted on the corresponding Cognito app client.
 */
const branchName =
  process.env.AWS_BRANCH ?? process.env.AMPLIFY_ENV ?? 'dev';
const isProduction = ['main', 'production', 'master'].includes(branchName);

const oauthDomain = isProduction
  ? 'zgs4kf1ybguf-production.auth.eu-west-1.amazoncognito.com'
  : 'zgs4kf1ybguf-dev.auth.eu-west-1.amazoncognito.com';

backend.addOutput({
  auth: {
    oauth: {
      domain: oauthDomain,
      scopes: [
        'phone',
        'email',
        'openid',
        'profile',
        'aws.cognito.signin.user.admin',
      ],
      redirect_sign_in_uri: [
        'http://localhost:3001/',
        'https://staging.talmudyerushalmi.com/',
        'https://www.talmudyerushalmi.com/',
      ],
      redirect_sign_out_uri: [
        'http://localhost:3001/',
        'https://staging.talmudyerushalmi.com/',
        'https://www.talmudyerushalmi.com/',
      ],
      response_type: 'code',
      identity_providers: ['GOOGLE'],
    },
  },
});
