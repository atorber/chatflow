"use strict";

const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
const minimist = require("minimist");
const semver = require('semver');

const check = require(".");
const tools = require("./tools");


const argv = minimist(process.argv.slice(2), {
  alias: {
    "print": "p",
    "help": "h",
  },
  boolean: [
    "print",
    "help",
    "volta",
    "package",
  ],
  string: [
    "node",
    "npm",
    "npx",
    "yarn",
    "pnpm",
  ],
  unknown: function (arg) {
    console.error(`Unknown option: ${arg}`);
    process.exit(1);
  }
});

if (argv.help) {
  const usage = fs.readFileSync(path.join(__dirname, "usage.txt"), {
    encoding: "utf8",
  });

  process.stdout.write(usage);
  process.exit(0);
}

let options;
if (argv.package) {
  options = optionsFromPackage();
} else if (argv.volta) {
  options = optionsFromVolta();
} else {
  options = optionsFromCommandLine();
}

check(options, (err, result) => {
  if (err) {
    throw err;
  }

  printVersions(result, argv.print);
  process.exit(result.isSatisfied ? 0 : 1);
});


//


function optionsFromCommandLine() {
  return Object.keys(tools).reduce((memo, name) => ({
    ...memo,
    [name]: argv[name],
  }), {});
}

function optionsFromPackage() {
  let packageJson;

  try {
    packageJson = require(path.join(process.cwd(), 'package.json'));
  } catch (e) {
    console.log('Error: When running with --package, a package.json file is expected in the current working directory');
    console.log('Current working directory is: ' + process.cwd());

    process.exit(1);
  }

  if (!packageJson.engines) {
    console.log('Error: When running with --package, your package.json is expected to contain the "engines" key');
    console.log('See https://docs.npmjs.com/files/package.json#engines for the supported syntax');

    process.exit(1);
  }

  return Object.keys(tools).reduce((memo, name) => ({
    ...memo,
    [name]: packageJson.engines[name],
  }), {});
}

function optionsFromVolta() {
  let packageJson;

  try {
    packageJson = require(path.join(process.cwd(), 'package.json'));
  } catch (e) {
    console.log('Error: When running with --volta, a package.json file is expected in the current working directory');
    console.log('Current working directory is: ' + process.cwd());

    process.exit(1);
  }

  if (!packageJson.volta) {
    console.log('Error: When running with --volta, your package.json is expected to contain the "volta" key');
    console.log('See https://docs.volta.sh/guide/understanding#pinning-node-engines');

    process.exit(1);
  }
  console.log(packageJson.volta);

  return Object.keys(tools).reduce((memo, name) => ({
    ...memo,
    [name]: packageJson.volta[name],
  }), {});
}

//


function printVersions(result, print) {
  Object.keys(result.versions).forEach(name => {
    const info = result.versions[name];
    const isSatisfied = info.isSatisfied;

    // print installed version
    if (print || !isSatisfied) {
      printInstalledVersion(name, info);
    }

    if (isSatisfied) return;

    // report any non-compliant versions
    const { raw, range } = info.wanted;

    console.error(chalk.red(`Wanted ${name} version ` + chalk.bold(`${raw} (${range})`)));

    console.log(chalk.yellow.bold(
      tools[name]
      .getInstallInstructions(
        semver.minVersion(info.wanted)
      )
    ));
  });
}

function printInstalledVersion(name, { version, isSatisfied, invalid, notfound }) {
  let versionNote = "";

  if (version) {
    versionNote = name + ": " + chalk.bold(version);
  }

  if (invalid) {
    versionNote = name + ": " + chalk.bold("given version not semver-compliant");
  }

  if (notfound) {
    versionNote = name + ": not found";
  }

  if (isSatisfied) {
    if (version) console.log(versionNote);
    else console.log(chalk.gray(versionNote));
  } else {
    console.log(chalk.red(versionNote));
  }
}
