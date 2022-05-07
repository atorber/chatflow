/**
 * Which versions of which packages are required.
 */
interface WantedVersions {
    /**
     * Required version of Node.js.
     */
    node?: string;

    /**
     * Required version of npm.
     */
    npm?: string;

    /**
     * Required version of yarn.
     */
    yarn?: string;

    /**
     * Required version of pnpm.
     */
    pnpm?: string;
}

type OnGetVersion = (error: Error | null, info: VersionInfo) => void;

/**
 * Gets the version of a package.
 *
 * @param packageName   Name of the package.
 * @param onComplete   Handler for the package name.
 */
type GetVersion = (packageName: string, onComplete: OnGetVersion) => void;

/**
 * Requested version range of a package.
 */
interface Wanted {
    /**
     * Resolved semver equivalent of the raw version.
     */
    range: string;

    /**
     * Raw semver requirement for the version.
     */
    raw: string;
}

/**
 * Positive result of checking a program version.
 */
interface SatisfiedVersionInfo {
    /**
     * Whether the version was known to satisfy its requirements (true).
     */
    isSatisfied: true;

    /**
     * Retrieved version.
     */
    version: string;

    /**
     * Requested version range of the package, if any.
     */
    wanted?: Wanted;
}

/**
 * Negative result of checking a program version.
 */
interface UnsatisfiedVersionInfo {
    /**
     * Whether the version was known to satisfy its requirements (false).
     */
    isSatisfied: false;

    /**
     * Whether the program version was unable to be found.
     */
    notfound?: boolean;

    /**
     * Whether the program version string is non-compliant with semver.
     */
    invalid?: boolean;

    /**
     * Retrieved version, if available.
     */
    version?: string;

    /**
     * Requested version range of the package, if any.
     */
    wanted?: Wanted;
}

/**
 * Result of checking a program version.
 */
type VersionInfo = SatisfiedVersionInfo | UnsatisfiedVersionInfo;

/**
 * Versions for each package, keyed by package name.
 */
interface VersionInfos {
    [i: string]: VersionInfo;
}

/**
 * Results from checking versions.
 */
interface Results {
    /**
     * Versions for each package, keyed by package name.
     */
    versions: VersionInfos;

    /**
     * Whether all versions were satisfied.
     */
    isSatisfied: boolean;
}

/**
 * Handles results from checking versions.
 *
 * @param error   Error from version checking, if any.
 * @param results   Results from checking versions.
 */
type OnComplete = (error: Error | null, results: Results) => void;

/**
 * Checks package versions.
 *
 * @param [wanted]   Which versions of programs are required.
 * @param onComplete   Handles results from checking versions.
 */
declare function check(onComplete: OnComplete): void;
declare function check(wanted: WantedVersions, onComplete: OnComplete): void;

export = check;
