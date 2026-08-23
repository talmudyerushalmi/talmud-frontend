import { referenceAuth } from '@aws-amplify/backend';

/**
 * Environment-branched reference to the pre-existing Cognito resources.
 *
 * `referenceAuth()` does NOT create resources — it references pools/roles that
 * already exist (originally provisioned by Amplify Gen 1 CLI). We keep two
 * separate stacks (prod + dev) and pick between them based on the branch the
 * Amplify Hosting build is running on.
 *
 * The branching key comes from `AWS_BRANCH`, which Amplify Hosting sets to the
 * Git branch name during CI builds. Locally (e.g. `ampx sandbox` or IDE
 * type-checks), the env var is absent, so we fall back to the dev stack.
 */
const branchName =
  process.env.AWS_BRANCH ?? process.env.AMPLIFY_ENV ?? 'dev';
const isProduction = ['main', 'production', 'master'].includes(branchName);

const config = isProduction
  ? {
      userPoolId: 'eu-west-1_Qss9iNOtn',
      userPoolClientId: '5nm446md44ee3eo3281g3hscmb',
      identityPoolId: 'eu-west-1:dc4369e1-a173-4a4f-880e-767592f2e36a',
      authRoleArn:
        'arn:aws:iam::424334533647:role/amplify-talmudfrontend-production-153151-authRole',
      unauthRoleArn:
        'arn:aws:iam::424334533647:role/amplify-talmudfrontend-production-153151-unauthRole',
    }
  : {
      userPoolId: 'eu-west-1_sqdpY4qBB',
      userPoolClientId: '6rk3pbbh4hria8oci90u0gmo5p',
      identityPoolId: 'eu-west-1:4bae553e-7fde-492e-a863-64bb41da4545',
      authRoleArn:
        'arn:aws:iam::424334533647:role/amplify-talmudfrontend-dev-114551-authRole',
      unauthRoleArn:
        'arn:aws:iam::424334533647:role/amplify-talmudfrontend-dev-114551-unauthRole',
    };

export const auth = referenceAuth(config);
