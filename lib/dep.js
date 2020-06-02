"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dep = /** @class */ (function () {
    function Dep() {
        this.deps = [];
    }
    /* 收集监听 */
    Dep.prototype.depend = function (callback) {
        var _this = this;
        this.deps.push(callback);
        return function () {
            var findIndex = _this.deps.indexOf(callback);
            if (~findIndex) {
                _this.deps.splice(findIndex, 1);
            }
        };
    };
    /* 执行监听 */
    Dep.prototype.notify = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        this.deps.forEach(function (dep) {
            dep.apply(void 0, arg);
        });
    };
    /** 清空监听 */
    Dep.prototype.clear = function () {
        this.deps = [];
    };
    return Dep;
}());
exports.Dep = Dep;
