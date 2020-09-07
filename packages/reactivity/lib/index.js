"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ref_1 = require("./ref");
exports.useRef = ref_1.useRef;
exports.isRef = ref_1.isRef;
var dep_1 = require("./dep");
exports.Dep = dep_1.Dep;
var inject_1 = require("./inject");
exports.useProvide = inject_1.useProvide;
exports.useUnProvide = inject_1.useUnProvide;
exports.useInject = inject_1.useInject;
var watch_1 = require("./watch");
exports.isObserve = watch_1.isObserve;
exports.useEffect = watch_1.useEffect;