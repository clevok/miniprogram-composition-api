"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var mitt_1 = require("./mitt");
function createContext(target) {
    return Object.assign({
        setData: shared_1.setData.bind(target),
    }, mitt_1.mitt());
}
exports.createContext = createContext;
