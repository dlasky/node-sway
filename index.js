"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var net_1 = require("net");
var events_1 = require("events");
var message_1 = require("./message");
var SwayIPC = /** @class */ (function (_super) {
    __extends(SwayIPC, _super);
    function SwayIPC() {
        var _this = this;
        var _a;
        _this = _super.call(this) || this;
        _this.types = message_1.Types;
        _this.handleData = function (data) {
            var str = data.slice(14, data.length).toString();
            try {
                _this.emit("data", JSON.parse(str));
            }
            catch (e) {
                _this.emit("error", e);
            }
        };
        _this.send = function (type, value) {
            var msg = (0, message_1.message)(type, value);
            _this.socket.write(msg);
        };
        var sway = (_a = process.env.SWAYSOCK) !== null && _a !== void 0 ? _a : '';
        _this.socket = net_1["default"].createConnection(sway);
        _this.socket.on('data', _this.handleData);
        return _this;
    }
    return SwayIPC;
}(events_1.EventEmitter));
exports["default"] = SwayIPC;
