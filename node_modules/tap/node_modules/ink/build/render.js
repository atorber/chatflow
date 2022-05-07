"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ink_1 = __importDefault(require("./ink"));
const instances_1 = __importDefault(require("./instances"));
const stream_1 = require("stream");
/**
 * Mount a component and render the output.
 */
const render = (node, options) => {
    const inkOptions = Object.assign({ stdout: process.stdout, stdin: process.stdin, stderr: process.stderr, debug: false, exitOnCtrlC: true, patchConsole: true }, getOptions(options));
    const instance = getInstance(inkOptions.stdout, () => new ink_1.default(inkOptions));
    instance.render(node);
    return {
        rerender: instance.render,
        unmount: () => instance.unmount(),
        waitUntilExit: instance.waitUntilExit,
        cleanup: () => instances_1.default.delete(inkOptions.stdout),
        clear: instance.clear
    };
};
exports.default = render;
const getOptions = (stdout = {}) => {
    if (stdout instanceof stream_1.Stream) {
        return {
            stdout,
            stdin: process.stdin
        };
    }
    return stdout;
};
const getInstance = (stdout, createInstance) => {
    let instance;
    if (instances_1.default.has(stdout)) {
        instance = instances_1.default.get(stdout);
    }
    else {
        instance = createInstance();
        instances_1.default.set(stdout, instance);
    }
    return instance;
};
//# sourceMappingURL=render.js.map