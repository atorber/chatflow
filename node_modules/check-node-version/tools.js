const { execSync } = require("child_process");

module.exports = {
  node: {
    getVersion: "node --version",
    getInstallInstructions(v) {
      if (hasNvm()) {
        return `To install node, run \`nvm install ${v}\``;
      }

      return `To install node, see https://nodejs.org/download/release/v${v}/`;
    }
  },
  npm: {
    getVersion: "npm --version",
    getInstallInstructions(v) {
     return `To install npm, run \`npm install -g npm@${v}\``;
    }
  },
  npx: {
    getVersion: "npx --version",
    getInstallInstructions(v) {
     return `To install npx, run \`npm install -g npx@${v}\``;
    }
  },
  yarn: {
    getVersion: "yarn --version",
    getInstallInstructions(v) {
     return `To install yarn, see https://github.com/yarnpkg/yarn/releases/tag/v${v}`;
    }
  },
  pnpm: {
    getVersion: "pnpm --version",
    getInstallInstructions(v) {
     return `To install pnpm, run \`npm install -g pnpm@${v}\``;
    }
  },
};

function hasNvm() {
  try {
   // check for existance of nvm
   execSync(
     'nvm',
     { stdio:[] } // don't care about output
   );
  } catch (e) {
   // no nvm,
   return false;
  }

  return true;
}
