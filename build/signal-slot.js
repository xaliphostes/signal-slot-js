"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emit = exports.disconnectAll = exports.disconnect = exports.isLocked = exports.unlock = exports.lock = exports.connect = exports.create = exports.dump = void 0;
/**
 * Dump all the signals and the associated [[Connection]]s attached to the object
 * @param sender
 */
function dump(sender) {
    if (!sender._mapSignals) {
        console.warn("Emitter is not configured to support any signal. Consider creating a signal first.");
        return;
    }
    console.log('----------------------------------------');
    console.log('Dumping Signal/slot for object', sender.constructor.name);
    sender._mapSignals.forEach(function (signal, name) {
        console.log("  - signal '" + name + "'");
        signal.forEach(function (connection) {
            if (connection.slot === undefined) {
                console.log("    - slot " + connection.receiver.constructor.name);
            }
            else {
                console.log("    - slot " + connection.receiver.constructor.name + "." + connection.slot);
            }
        });
    });
    console.log('----------------------------------------');
}
exports.dump = dump;
/**
 * Create a new signal
 * @param {Object}  sender The sender which will hold the signal
 * @param {string}  signal The name of the signal
 * @returns {boolean} True if success
 */
function create(sender, signal) {
    if (sender._mapSignals === undefined) {
        sender._mapSignals = new Map();
    }
    if (sender._mapSignals.has(signal)) {
        console.warn("Signal named " + signal + " already defined.");
        return false;
    }
    sender._mapSignals.set(signal, []);
    return true;
}
exports.create = create;
/** @internal */
var InnerConnection = /** @class */ (function () {
    function InnerConnection(sender, receiver, slot, desc) {
        this.sender = sender;
        this.receiver = receiver;
        this.slot = slot;
        this.desc = desc;
        this.locked = false;
    }
    return InnerConnection;
}());
/**
 * Connect a sender to a receiver using either the signal/slot or the signal/function by mean
 * of a [[Connection]]
 * @param {Connection} c The connection
 * @returns {boolean} True if sucess
 */
function connect(c) {
    if (!c.sender._mapSignals) {
        console.warn("Emitter is not configured to support any signal. Consider creating a signal first.");
        return false;
    }
    if (!c.sender._mapSignals.has(c.signal)) {
        console.warn("Emitter does not have a signal named \"" + c.signal + "\"");
        return false;
    }
    if (typeof c.receiver === 'function') {
        c.sender._mapSignals.get(c.signal).push(new InnerConnection(c.sender, c.receiver));
        return true;
    }
    if (c.slot === undefined) {
        console.warn('Require to define the slot');
        return false;
    }
    var desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(c.receiver), c.slot);
    if (desc) {
        if (!desc.get && !desc.value) {
            console.warn("Receiver does not have a slot named \"" + c.slot + "\"");
            return false;
        }
        c.sender._mapSignals.get(c.signal).push(new InnerConnection(c.sender, c.receiver, c.slot, desc));
    }
    else {
        if (c.receiver[c.slot]) {
            c.sender._mapSignals.get(c.signal).push(new InnerConnection(c.sender, c.receiver, c.slot, c.slot));
        }
        else {
            console.warn("Receiver does not have a slot named \"" + c.slot + "\"");
            return false;
        }
    }
    return true;
}
exports.connect = connect;
/** @internal */
function getConnection(c) {
    function _get(signals, receiver, slot) {
        for (var i = 0; i < signals.length; ++i) {
            var s = signals[i];
            if (s.receiver === receiver && s.slot === slot) {
                return s;
            }
        }
        return undefined;
    }
    if (!c.sender._mapSignals)
        return undefined;
    if (!c.sender._mapSignals.has(c.signal))
        return undefined;
    var signals = c.sender._mapSignals.get(c.signal);
    if (typeof c.receiver === 'function') {
        return _get(signals, c.receiver, c.slot);
    }
    if (c.slot === undefined) {
        return undefined;
    }
    var desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(c.receiver), c.slot);
    if (desc) {
        if (!desc.get && !desc.value)
            return undefined;
        return _get(signals, c.receiver, c.slot);
    }
    else {
        if (c.receiver[c.slot]) {
            return _get(signals, c.receiver, c.slot);
        }
        return undefined;
    }
}
/**
 * Lock a specific [[Connection]] from being called
 * @param {Connection} c The connection
 * @see Connection
 */
function lock(c) {
    var conn = getConnection(c);
    if (conn === undefined)
        return false;
    conn.locked = true;
    return true;
}
exports.lock = lock;
/**
 * Unlock a specific [[Connection]] so that it can be called again
 * @param {Connection} c The connection
 * @see Connection
 */
function unlock(c) {
    var conn = getConnection(c);
    if (conn === undefined)
        return false;
    conn.locked = false;
    return true;
}
exports.unlock = unlock;
/**
 * Check if a [[Connection]] is locked or not
 * @param {Connection} c The connection
 * @see Connection
 */
function isLocked(c) {
    var conn = getConnection(c);
    if (conn === undefined)
        return false;
    return conn.locked;
}
exports.isLocked = isLocked;
/**
 * Disconnect an existing [[Connection]]
 * @param c The connection
 */
function disconnect(c) {
    function removeFromArray(signals, receiver, slot) {
        for (var i = 0; i < signals.length; ++i) {
            var s = signals[i];
            if (s.receiver === receiver && s.slot === slot) {
                signals.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    if (!c.sender._mapSignals) {
        return false;
    }
    if (!c.sender._mapSignals.has(c.signal)) {
        return false;
    }
    var signals = c.sender._mapSignals.get(c.signal);
    if (typeof c.receiver === 'function') {
        return removeFromArray(signals, c.receiver);
    }
    if (c.slot === undefined) {
        return false;
    }
    var desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(c.receiver), c.slot);
    if (desc) {
        if (!desc.get && !desc.value) {
            return false;
        }
        return removeFromArray(signals, c.receiver, c.slot);
    }
    else {
        if (c.receiver[c.slot]) {
            return removeFromArray(signals, c.receiver, c.slot);
        }
        else {
            return false;
        }
    }
}
exports.disconnect = disconnect;
/**
 * Diconnect all [[Connection]]s from the sender
 * @param sender
 * @param signal
 */
function disconnectAll(sender, signal) {
    if (!sender._mapSignals) {
        return false;
    }
    if (!sender._mapSignals.has(signal)) {
        return false;
    }
    var signals = sender._mapSignals.get(signal);
    signals.splice(0, signals.length);
    return true;
}
exports.disconnectAll = disconnectAll;
/**
 * Emit a signal with arguments or not
 * @param sender The object that will emit the signal
 * @param signal The signal name
 * @param args optional argument(s)
 * @example
 * ```ts
 * import {create, connect, emit} from '../src'
 *
 * class T {
 *      constructor(private name: string) {
 *          create(this, 'finished')
 *          connect({sender: this, signal: 'finished', receiver: this, slot: 'done'})
 *      }
 *      start() {
 *          console.log(this.name, 'is starting')
 *          setTimeout( () => emit(this, 'finished'), 500) // <-----
 *      }
 *      done()  {
 *          console.log(this.name, 'is done')
 *      }
 * }
 *
 * const a = new T('A')
 * const b = new T('B')
 * connect({sender: a, signal: 'finished', receiver: b, slot: 'start'})
 * a.start()
 * ```
 * will display
 * ```console
 * A is starting
 * A is done
 * B is starting
 * B is done
 * ```
 */
function emit(sender, signal) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!sender._mapSignals) {
        console.warn('Source does not support Signal/Slot.');
        return false;
    }
    if (sender._mapSignals.has(signal)) {
        _trigger(sender, signal, args);
    }
    else {
        console.warn("Source does not have the signal named " + signal + ".");
        return false;
    }
    return true;
}
exports.emit = emit;
/** @internal */
function _trigger(sender, signal, args) {
    sender._mapSignals.get(signal).forEach(function (pair) {
        var _a, _b, _c;
        if (pair.locked === true)
            return;
        if (pair.desc === undefined) {
            pair.receiver.apply(pair, args); // function
        }
        else {
            if (pair.desc.value) {
                (_a = pair.desc.value).call.apply(_a, __spreadArrays([pair.receiver], args)); // method
            }
            else if (pair.desc.set) {
                (_b = pair.desc.set).call.apply(_b, __spreadArrays([pair.receiver], args)); // setter
            }
            else {
                (_c = pair.receiver[pair.desc]).call.apply(_c, __spreadArrays([pair.receiver], args)); // arrow method
            }
        }
    });
}
