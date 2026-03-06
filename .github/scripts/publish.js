/**
 * 1. Check uncommited changes
 * 2. Bump version in package.json
 * 3. Create CHANGELOG.md using conventional commit
 * 4. Create commit changes and tag
 */

// TODO: This File is inprogress, need initial PR merged to activate action trigger
const fs = require('fs');
const path = require('path');
const semver = require('semver');
let updatedVersion;

const args = process.argv.slice(2);
const [version] = args;

function getPackageJson() {
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  return packageJson;
}

function updateVersion() {
  const packageJson = getPackageJson();
  const nextVersion = semver.inc(packageJson.version, version);

  log(`[${version}] Bump version to ${nextVersion}`);

  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(
      {
        ...packageJson,
        version: nextVersion,
      },
      null,
      2
    )
  );

  return nextVersion;
}

function log(message, type = 'log') {
  const COLORS = {
    log: '\x1b[46m\x1b[30m',
    error: '\x1b[41m\x1b[30m',
    warning: '\x1b[43m\x1b[30m',
    success: '\x1b[42m\x1b[30m',
    reset: '\x1b[0m',
  };
  console.log(`${COLORS[type] || COLORS.log} ${type.toUpperCase()} ${COLORS.reset}: %s`, message);
}

try {
  // Publishing starts
  log(`PUBLISHING starts`);

  // Bump version in package.json
  updatedVersion = updateVersion();
  
  // Output for GitHub Actions
  console.log(`version=${updatedVersion}`);
  
  // Also set as GitHub Actions output
  if (process.env.GITHUB_OUTPUT) {
    require('fs').appendFileSync(process.env.GITHUB_OUTPUT, `version=${updatedVersion}\n`);
  }

  // publish();
} catch (e) {
  log(e.message, 'error');
  log('Publishing to git failed', 'error');
  process.exit(1);
}
