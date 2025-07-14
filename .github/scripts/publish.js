try {
  // // Publishing starts
  // log(`PUBLISHING ${folder.toUpperCase()}`);

  // // Bump version in package.json
  // updatedVersion = updateVersion();

  // // Generate changelog
  // updateChangeLogFile();

  // Commit package.json and CHANGELOG.md files
  // Tag
  // const package = commitAndCreateTag(folder, updatedVersion);

  return 'v0.0.5';
} catch (e) {
  log(e.message, 'error');
  log('Publishing to git failed', 'error');
  process.exit(1);
}
