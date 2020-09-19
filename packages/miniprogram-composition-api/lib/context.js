"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var mitt_1 = require("./mitt");
var utils_1 = require("./utils");
var router_1 = require("./router");
function createContext(target) {
    function setData(binding) {
        var _this = this;
        if (!binding)
            return function () { };
        var stopHandels = Object.keys(binding).map(function (key) {
            var _a;
            var value = binding[key];
            if (utils_1.isFunction(value)) {
                _this[key] = value;
                return;
            }
            _this.setData((_a = {},
                _a[key] = shared_1.deepToRaw(value),
                _a));
            return shared_1.deepWatch(_this, key, value);
        });
        return function () {
            stopHandels.forEach(function (stopHandle) {
                stopHandle && stopHandle();
            });
        };
    }
    return {
        setData: setData.bind(target),
        event: mitt_1.mitt(),
        router: router_1.router,
    };
}
exports.createContext = createContext;
