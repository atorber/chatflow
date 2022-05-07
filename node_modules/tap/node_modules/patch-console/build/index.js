"use strict";
const stream_1 = require("stream");
const CONSOLE_METHODS = [
    'assert',
    'count',
    'countReset',
    'debug',
    'dir',
    'dirxml',
    'error',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'table',
    'time',
    'timeEnd',
    'timeLog',
    'trace',
    'warn'
];
let originalMethods = {};
const patchConsole = (callback) => {
    const stdout = new stream_1.PassThrough();
    const stderr = new stream_1.PassThrough();
    stdout.write = (data) => callback('stdout', data);
    stderr.write = (data) => callback('stderr', data);
    const internalConsole = new console.Console(stdout, stderr);
    for (const method of CONSOLE_METHODS) {
        originalMethods[method] = console[method];
        console[method] = internalConsole[method];
    }
    return () => {
        for (const method of CONSOLE_METHODS) {
            console[method] = originalMethods[method];
        }
        originalMethods = {};
    };
};
module.exports = patchConsole;
//# sourceMappingURL=index.js.map