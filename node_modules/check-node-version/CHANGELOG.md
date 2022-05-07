## Releases

### 4.0.3

* Fix crash due to non-semver valid version strings

### 4.0.2

* Make notfound-catch locale-independent on Windows

### 4.0.1

* Fix CLI by restoring shebang to new bin file

### 4.0.0

* **Breaking:** Drop support for node versions before 8.3.0
* **Breaking:** Remove `options.getVersion` option from api (no
  cli change)
* Improve test suite
* Make CLI treat versions arguments as strings
* Fix message for missing binary of Windows
* Check global versions only
* Make instructions valid for version ranges
* Only suggest using nvm if nvm is installed

### 3.3.0

* Add NPX support

### 3.2.0

* Add `index.ts` TypeScript typings file

### 3.1.1

* Fix bug with npm warnings causing errors.

### 3.1.0

* Add colors to terminal output.

### 3.0.0

This release changes the default output behavior to only print
*unsatisfied* versions. If all checked versions pass, there is no
output. A `--print` option has been added to get the old behavior of
always printing versions.

* **Breaking**: Remove `--quiet` option, add `--print` option.
* **Breaking**: Move versions under versions key in result object.
* Fix bug when version command outputs more than one line.
