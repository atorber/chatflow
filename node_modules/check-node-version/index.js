"use strict";

const { exec } = require("child_process");
const path = require("path");

const filterObject = require("object-filter");
const mapValues = require("map-values");
const parallel = require("run-parallel");
const semver = require("semver");

const tools = require("./tools");

const runningOnWindows = (process.platform === "win32");

const originalPath = process.env.PATH;

const pathSeparator = runningOnWindows ? ";" : ":";
const localBinPath = path.resolve("node_modules/.bin")
// ignore locally installed packages
const globalPath = originalPath
  .split(pathSeparator)
  .filter(p => path.resolve(p)!==localBinPath)
  .join(pathSeparator)
;

module.exports = function check(wanted, callback) {
  // Normalize arguments
  if (typeof wanted === "function") {
    callback = wanted;
    wanted = null;
  }

  const options = { callback };

  options.wanted = normalizeWanted(wanted);

  options.commands = mapValues(
    (
      Object.keys(options.wanted).length
      ? filterObject(tools, (_, key) => options.wanted[key])
      : tools
    ),
    ({ getVersion }) => ( runVersionCommand.bind(null, getVersion) )
  );

  if (runningOnWindows) {
    runForWindows(options);
  } else {
    run(options);
  }
}

function runForWindows(options) {
  // See and understand https://github.com/parshap/check-node-version/issues/35
  // before trying to optimize this function
  //
  // `chcp` is used instead of `where` on account of its more extensive availablity
  // chcp: MS-DOS 6.22+, Windows 95+; where: Windows 7+
  //
  // Plus, in order to be absolutely certain, the error message of `where` would still need evaluation.

  exec("chcp", (error, stdout) => {
    const finalCallback = options.callback;

    if (error) {
      finalCallback(chcpError(error, 1));
      return;
    }

    const codepage = stdout.match(/\d+/)[0];

    if (codepage === "65001" || codepage === "437") {
      // need not switch codepage
      return run(options);
    }

    // reset codepage before exiting
    options.callback = (...args) => exec(`chcp ${codepage}`, (error) => {
      if (error) {
        finalCallback(chcpError(error, 3));
        return;
      }

      finalCallback(...args);
    });

    // switch to Unicode
    exec("chcp 65001", (error) => {
      if (error) {
        finalCallback(chcpError(error, 2));
        return;
      }

      run(options);
    });

    function chcpError(error, step) {
      switch (step) {
        case 1:
          error.message = `[CHCP] error while getting current codepage:\n${error.message}`;
        break;

        case 2:
          error.message = `[CHCP] error while switching to Unicode codepage:\n${error.message}`;
        break;

        case 3:
          error.message = `
            [CHCP] error while resetting current codepage:
            ${error.message}

            Please note that your terminal is now using the Unicode codepage.
            Therefore, codepage-dependent actions may work in an unusual manner.
            You can run \`chcp ${codepage}\` yourself in order to reset your codepage,
            or just close this terminal and work in another.
          `.trim().replace(/^ +/gm,'') // strip indentation
        break;

        // no default
      }

      return error
    }
  });
}

function run({ commands, callback, wanted }) {
  parallel(commands, (err, versionsResult) => {
    if (err) {
      callback(err);
      return;
    }

    const versions = mapValues(versionsResult, ({ version, notfound, invalid }, name) => {
      const programInfo = {
        isSatisfied: true,
      };

      if (version) {
        programInfo.version = semver(version);
      }

      if (invalid) {
        programInfo.invalid = invalid;
      }

      if (notfound) {
        programInfo.notfound = notfound;
      }

      if (wanted[name]) {
        programInfo.wanted = new semver.Range(wanted[name]);
        programInfo.isSatisfied = Boolean(
          programInfo.version
          &&
          semver.satisfies(programInfo.version, programInfo.wanted)
        );
      }

      return programInfo;
    });

    callback(null, {
      versions: versions,
      isSatisfied: Object.keys(wanted).every(name => versions[name].isSatisfied),
    });
  });
};


// Return object containing only keys that a program exists for and
// something valid was given.
function normalizeWanted(wanted) {
  if (!wanted) {
    return {};
  }

  // Validate keys
  wanted = filterObject(wanted, Boolean);

  // Normalize to strings
  wanted = mapValues(wanted, String);

  // Filter existing programs
  wanted = filterObject(wanted, (_, key) => tools[key]);

  return wanted;
}


function runVersionCommand(command, callback) {
  process.env.PATH = globalPath;

  exec(command, (execError, stdout, stderr) => {
    const commandDescription = JSON.stringify(command);

    if (!execError) {
      const version = stdout.trim();

      if (semver.valid(version)) {
        return callback(null, {
          version,
        });
      } else {
        return callback(null, {
          invalid: true,
        })
      }
    }

    if (toolNotFound(execError)) {
      return callback(null, {
        notfound: true,
      });
    }

    // something went very wrong during execution
    let errorMessage = `Command failed: ${commandDescription}`

    if (stderr) {
      errorMessage += `\n\nstderr:\n${stderr.toString().trim()}\n`;
    }

    errorMessage += `\n\noriginal error message:\n${execError.message}\n`;

    return callback(new Error(errorMessage));
  });

  process.env.PATH = originalPath;
}


function toolNotFound(execError) {
  if (runningOnWindows) {
    return execError.message.includes("is not recognized");
  }

  return execError.code === 127;
}
