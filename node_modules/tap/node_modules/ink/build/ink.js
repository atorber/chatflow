"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lodash_1 = require("lodash");
const log_update_1 = __importDefault(require("./log-update"));
const ansi_escapes_1 = __importDefault(require("ansi-escapes"));
const is_ci_1 = __importDefault(require("is-ci"));
const auto_bind_1 = __importDefault(require("auto-bind"));
const reconciler_1 = __importDefault(require("./reconciler"));
const renderer_1 = __importDefault(require("./renderer"));
const signal_exit_1 = __importDefault(require("signal-exit"));
const patch_console_1 = __importDefault(require("patch-console"));
const dom = __importStar(require("./dom"));
const instances_1 = __importDefault(require("./instances"));
const App_1 = __importDefault(require("./components/App"));
const isCI = process.env.CI === 'false' ? false : is_ci_1.default;
const noop = () => { };
class Ink {
    constructor(options) {
        this.resolveExitPromise = () => { };
        this.rejectExitPromise = () => { };
        this.unsubscribeExit = () => { };
        this.onRender = () => {
            if (this.isUnmounted) {
                return;
            }
            const { output, outputHeight, staticOutput } = renderer_1.default(this.rootNode, 
            // The 'columns' property can be undefined or 0 when not using a TTY.
            // In that case we fall back to 80.
            this.options.stdout.columns || 80);
            // If <Static> output isn't empty, it means new children have been added to it
            const hasStaticOutput = staticOutput && staticOutput !== '\n';
            if (this.options.debug) {
                if (hasStaticOutput) {
                    this.fullStaticOutput += staticOutput;
                }
                this.options.stdout.write(this.fullStaticOutput + output);
                return;
            }
            if (isCI) {
                if (hasStaticOutput) {
                    this.options.stdout.write(staticOutput);
                }
                this.lastOutput = output;
                return;
            }
            if (hasStaticOutput) {
                this.fullStaticOutput += staticOutput;
            }
            if (outputHeight >= this.options.stdout.rows) {
                this.options.stdout.write(ansi_escapes_1.default.clearTerminal + this.fullStaticOutput + output);
                this.lastOutput = output;
                return;
            }
            // To ensure static output is cleanly rendered before main output, clear main output first
            if (hasStaticOutput) {
                this.log.clear();
                this.options.stdout.write(staticOutput);
                this.log(output);
            }
            if (!hasStaticOutput && output !== this.lastOutput) {
                this.throttledLog(output);
            }
            this.lastOutput = output;
        };
        auto_bind_1.default(this);
        this.options = options;
        this.rootNode = dom.createNode('ink-root');
        this.rootNode.onRender = options.debug
            ? this.onRender
            : lodash_1.throttle(this.onRender, 32, {
                leading: true,
                trailing: true
            });
        this.rootNode.onImmediateRender = this.onRender;
        this.log = log_update_1.default.create(options.stdout);
        this.throttledLog = options.debug
            ? this.log
            : lodash_1.throttle(this.log, undefined, {
                leading: true,
                trailing: true
            });
        // Ignore last render after unmounting a tree to prevent empty output before exit
        this.isUnmounted = false;
        // Store last output to only rerender when needed
        this.lastOutput = '';
        // This variable is used only in debug mode to store full static output
        // so that it's rerendered every time, not just new static parts, like in non-debug mode
        this.fullStaticOutput = '';
        this.container = reconciler_1.default.createContainer(this.rootNode, 
        // Legacy mode
        0, false, null);
        // Unmount when process exits
        this.unsubscribeExit = signal_exit_1.default(this.unmount, { alwaysLast: false });
        if (process.env.DEV === 'true') {
            reconciler_1.default.injectIntoDevTools({
                bundleType: 0,
                // Reporting React DOM's version, not Ink's
                // See https://github.com/facebook/react/issues/16666#issuecomment-532639905
                version: '16.13.1',
                rendererPackageName: 'ink'
            });
        }
        if (options.patchConsole) {
            this.patchConsole();
        }
        if (!isCI) {
            options.stdout.on('resize', this.onRender);
            this.unsubscribeResize = () => {
                options.stdout.off('resize', this.onRender);
            };
        }
    }
    render(node) {
        const tree = (react_1.default.createElement(App_1.default, { stdin: this.options.stdin, stdout: this.options.stdout, stderr: this.options.stderr, writeToStdout: this.writeToStdout, writeToStderr: this.writeToStderr, exitOnCtrlC: this.options.exitOnCtrlC, onExit: this.unmount }, node));
        reconciler_1.default.updateContainer(tree, this.container, null, noop);
    }
    writeToStdout(data) {
        if (this.isUnmounted) {
            return;
        }
        if (this.options.debug) {
            this.options.stdout.write(data + this.fullStaticOutput + this.lastOutput);
            return;
        }
        if (isCI) {
            this.options.stdout.write(data);
            return;
        }
        this.log.clear();
        this.options.stdout.write(data);
        this.log(this.lastOutput);
    }
    writeToStderr(data) {
        if (this.isUnmounted) {
            return;
        }
        if (this.options.debug) {
            this.options.stderr.write(data);
            this.options.stdout.write(this.fullStaticOutput + this.lastOutput);
            return;
        }
        if (isCI) {
            this.options.stderr.write(data);
            return;
        }
        this.log.clear();
        this.options.stderr.write(data);
        this.log(this.lastOutput);
    }
    unmount(error) {
        if (this.isUnmounted) {
            return;
        }
        this.onRender();
        this.unsubscribeExit();
        if (typeof this.restoreConsole === 'function') {
            this.restoreConsole();
        }
        if (typeof this.unsubscribeResize === 'function') {
            this.unsubscribeResize();
        }
        // CIs don't handle erasing ansi escapes well, so it's better to
        // only render last frame of non-static output
        if (isCI) {
            this.options.stdout.write(this.lastOutput + '\n');
        }
        else if (!this.options.debug) {
            this.log.done();
        }
        this.isUnmounted = true;
        reconciler_1.default.updateContainer(null, this.container, null, noop);
        instances_1.default.delete(this.options.stdout);
        if (error instanceof Error) {
            this.rejectExitPromise(error);
        }
        else {
            this.resolveExitPromise();
        }
    }
    waitUntilExit() {
        if (!this.exitPromise) {
            this.exitPromise = new Promise((resolve, reject) => {
                this.resolveExitPromise = resolve;
                this.rejectExitPromise = reject;
            });
        }
        return this.exitPromise;
    }
    clear() {
        if (!isCI && !this.options.debug) {
            this.log.clear();
        }
    }
    patchConsole() {
        if (this.options.debug) {
            return;
        }
        this.restoreConsole = patch_console_1.default((stream, data) => {
            if (stream === 'stdout') {
                this.writeToStdout(data);
            }
            if (stream === 'stderr') {
                const isReactMessage = data.startsWith('The above error occurred');
                if (!isReactMessage) {
                    this.writeToStderr(data);
                }
            }
        });
    }
}
exports.default = Ink;
//# sourceMappingURL=ink.js.map