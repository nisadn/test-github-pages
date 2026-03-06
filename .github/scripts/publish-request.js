/**
 * 1. Check uncommited changes
 * 2. Bump version in package.json
 * 3. Create CHANGELOG.md using conventional commit
 * 4. Create commit changes and tag
 */

// TODO: This File is inprogress, need initial PR merged to activate action trigger
const exec = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const semver = require('semver');
let updatedVersion;

const token = process.env.NODE_AUTH_TOKEN;
if (!token) {
  throw new Error('Missing GitHub token env in `NODE_AUTH_TOKEN`');
}

const args = process.argv.slice(2);
if (args.length <= 1) {
  log('USAGE publish <package-name> <version>', 'error');
  process.exit(1);
}

const [folder, version] = args;
const packageLoc = path.join('packages', folder);

if (!fs.existsSync(packageLoc)) {
  log(`Path '${packageLoc}' does not exist`, 'error');
  process.exit(1);
}

function getPackageJson() {
  const packageJson = require(path.join(process.cwd(), packageLoc, 'package.json'));
  return packageJson;
}

function updateVersion() {
  const packageJson = getPackageJson();
  const nextVersion = semver.inc(packageJson.version, version);

  log(`[${version}] Bump version to ${nextVersion}`);

  fs.writeFileSync(
    path.join(process.cwd(), packageLoc, 'package.json'),
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

function getChangeLogCommand(filePath = null) {
  let command = `./node_modules/.bin/conventional-changelog -p angular --commit-path ./${packageLoc} -k ./${packageLoc}/package.json -r 1 -l ${folder}`;
  if (filePath) {
    command = `${command} -i ${filePath} -s`;
  }
  return command;
}

function updateChangeLogFile() {
  log('Generating changelog');
  const clpath = `${packageLoc}/CHANGELOG.md`;
  const command = getChangeLogCommand(clpath);
  log(`Changelog has been generated on ${clpath}`);
  exec(command);
}

function commitAndCreatePR(name, version) {
  const tag = `${name}@${version}`;

  const message = `[PUBLISH] ${tag}`;
  log(`Add commit with message "${message}"`);
  exec(`git add ${packageLoc}`);
  exec(`git commit -m "${message}"`);

  log('Push commit & create PR');
  exec('git status');
  // exec(`git checkout -b publish/${tag} && git push origin publish/${tag}`);

  // create PR using API
  

  return {
    name,
    version,
    tag,
  };
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
  // Bump version in package.json
  updatedVersion = updateVersion();

  // Generate changelog
  updateChangeLogFile();

  // Commit package.json and CHANGELOG.md files
  // Tag
  const package = commitAndCreatePR(folder, updatedVersion);
} catch (e) {
  log(e.message, 'error');
  log('Publish request failed', 'error');
  process.exit(1);
}
