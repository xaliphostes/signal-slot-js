"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectAll = exports.disconnect = exports.connect = exports.create = exports.emit = exports.dump = exports.isLocked = exports.unlock = exports.lock = void 0;
var signal_slot_1 = require("./signal-slot");
Object.defineProperty(exports, "lock", { enumerable: true, get: function () { return signal_slot_1.lock; } });
Object.defineProperty(exports, "unlock", { enumerable: true, get: function () { return signal_slot_1.unlock; } });
Object.defineProperty(exports, "isLocked", { enumerable: true, get: function () { return signal_slot_1.isLocked; } });
Object.defineProperty(exports, "dump", { enumerable: true, get: function () { return signal_slot_1.dump; } });
Object.defineProperty(exports, "emit", { enumerable: true, get: function () { return signal_slot_1.emit; } });
Object.defineProperty(exports, "create", { enumerable: true, get: function () { return signal_slot_1.create; } });
Object.defineProperty(exports, "connect", { enumerable: true, get: function () { return signal_slot_1.connect; } });
Object.defineProperty(exports, "disconnect", { enumerable: true, get: function () { return signal_slot_1.disconnect; } });
Object.defineProperty(exports, "disconnectAll", { enumerable: true, get: function () { return signal_slot_1.disconnectAll; } });
