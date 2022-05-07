"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const aborterror_1 = require("../aborterror");
function sleep(dueTime, signal) {
    return new Promise((resolve, reject) => {
        if (signal && signal.aborted) {
            reject(new aborterror_1.AbortError());
        }
        const id = setTimeout(() => {
            if (signal) {
                signal.removeEventListener('abort', onAbort);
                if (signal.aborted) {
                    onAbort();
                    return;
                }
            }
            resolve();
        }, dueTime);
        if (signal) {
            signal.addEventListener('abort', onAbort, { once: true });
        }
        function onAbort() {
            clearTimeout(id);
            reject(new aborterror_1.AbortError());
        }
    });
}
exports.sleep = sleep;

//# sourceMappingURL=_sleep.js.map
