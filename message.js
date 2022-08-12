"use strict";
exports.__esModule = true;
exports.message = exports.Types = void 0;
var os_1 = require("os");
exports.Types = {
    RUN_COMMAND: 0,
    GET_WORKSPACES: 1,
    SUBSCRIBE: 2,
    GET_OUTPUTS: 3,
    GET_TREE: 4,
    GET_MARKS: 5,
    GET_BAR_CONFIG: 6,
    GET_VERSION: 7,
    GET_BINDING_MODES: 8,
    GET_CONFIG: 9,
    SEND_TICK: 10,
    SYNC: 11,
    GET_BINDING_STATE: 12,
    GET_INPUTS: 100,
    GET_SEATS: 101
};
var magic = Buffer.from('i3-ipc');
var end = os_1["default"].endianness();
var writeInt32 = function (buf, value, offset) {
    if (end === "BE") {
        return buf.writeInt32BE(value, offset);
    }
    return buf.writeInt32LE(value, offset);
};
var message = function (type, value) {
    var msg = Buffer.from(value !== null && value !== void 0 ? value : '');
    var len = msg.length;
    var buf = Buffer.alloc(8);
    writeInt32(buf, len);
    writeInt32(buf, type, 4);
    return Buffer.concat([magic, buf, msg]);
};
exports.message = message;
