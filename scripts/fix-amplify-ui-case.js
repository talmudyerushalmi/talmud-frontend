/*
 * Fix @aws-amplify/ui-react packaging bug (v6.x): the tarball ships the
 * directory `.../Authenticator/SetupTOTP/` but every import inside the
 * package references `.../Authenticator/SetupTotp/SetupTotp.mjs`.
 *
 * On case-sensitive filesystems (Linux CI, Docker builds) this makes the
 * app fail to compile; on macOS APFS it is caught by webpack's
 * CaseSensitivePathsPlugin with:
 *
 *   Module not found: Error: Cannot find file: 'SetupTotp.mjs' does not
 *   match the corresponding name on disk: '.../Authenticator/SetupTotp/SetupTOTP'.
 *
 * We rename the on-disk directory back to what the code imports.
 * The rename is a two-step (via a temp name) so it works on
 * case-insensitive filesystems too.
 *
 * The script is idempotent and fail-safe: if the directory is already
 * correctly cased, or the package isn't installed, it's a no-op.
 *
 * Historical note: an earlier version of this fix targeted the v5.x
 * variant of the same bug, which had the OPPOSITE direction (dir
 * shipped as `SetupTotp/`, imports referenced `SetupTOTP/`). If you
 * downgrade back to v5.x you'll need to flip WRONG_NAME and RIGHT_NAME.
 */

const fs = require('fs');
const path = require('path');

const AUTHENTICATOR_DIR = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '@aws-amplify',
  'ui-react',
  'dist',
  'esm',
  'components',
  'Authenticator'
);

const WRONG_NAME = 'SetupTOTP';
const RIGHT_NAME = 'SetupTotp';
const TMP_NAME = '__SetupTOTP_case_fix_tmp__';

function main() {
  if (!fs.existsSync(AUTHENTICATOR_DIR)) return;

  const entries = fs.readdirSync(AUTHENTICATOR_DIR);
  if (entries.includes(RIGHT_NAME) && !entries.includes(WRONG_NAME)) return;
  if (!entries.includes(WRONG_NAME)) return;

  const wrongPath = path.join(AUTHENTICATOR_DIR, WRONG_NAME);
  const tmpPath = path.join(AUTHENTICATOR_DIR, TMP_NAME);
  const rightPath = path.join(AUTHENTICATOR_DIR, RIGHT_NAME);

  fs.renameSync(wrongPath, tmpPath);
  fs.renameSync(tmpPath, rightPath);
  console.log(`[fix-amplify-ui-case] Renamed ${WRONG_NAME} → ${RIGHT_NAME} in @aws-amplify/ui-react`);
}

try {
  main();
} catch (err) {
  console.warn(`[fix-amplify-ui-case] Skipped @aws-amplify/ui-react rename: ${err.message}`);
}
