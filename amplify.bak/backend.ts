import { defineBackend } from '@aws-amplify/backend';

const backend = defineBackend({});

// Environment detection based on Git branch / Amplify deployment context
const branchName = process.env.AWS_BRANCH || process.env.AMPLIFY_ENV || 'dev';
const isProduction = branchName === 'main' || branchName === 'production' || branchName === 'master';

const authConfig = isProduction
  ? {
      userPoolId: 'eu-west-1_Qss9iNOtn',
      userPoolClientId: '5nm446md44ee3eo3281g3hscmb',
      domain: 'zgs4kf1ybguf-production.auth.eu-west-1.amazoncognito.com',
      redirectUri: 'https://www.talmudyerushalmi.com/',
    }
  : {
      userPoolId: 'eu-west-1_sqdpY4qBB',
      userPoolClientId: '6rk3pbbh4hria8oci90u0gmo5p',
      domain: 'zgs4kf1ybguf-dev.auth.eu-west-1.amazoncognito.com',
      redirectUri: 'http://localhost:3001/',
    };

backend.addOutput({
  auth: {
    aws_region: 'eu-west-1',
    user_pool_id: authConfig.userPoolId,
    user_pool_client_id: authConfig.userPoolClientId,
    signup_attributes: ['email'],
    password_policy: {
      min_length: 8,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false,
      require_uppercase: true,
    },
    oauth: {
      domain: authConfig.domain,
      scopes: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
      redirect_sign_in_uri: [authConfig.redirectUri],
      redirect_sign_out_uri: [authConfig.redirectUri],
      response_type: 'code',
    },
  },
});