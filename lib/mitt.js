"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all) {
    all = all || new Map();
    return {
        /**
         * Register an event handler for the given type.
         * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
         * @param {Function} handler Function to call in response to given event
         * @memberOf mitt
         */
        on: function (type, handler) {
            var _this_1 = this;
            var handlers = all.get(type);
            var added = handlers && handlers.unshift(handler);
            if (!added) {
                all.set(type, [handler]);
            }
            return function () {
                _this_1.off(type, handler);
            };
        },
        once: function (type, handler) {
            var _this = this;
            var mergeHandle = function () {
                handler.apply(null, arguments);
                _this.off(type, mergeHandle);
            };
            return this.on(type, mergeHandle);
        },
        /**
         * Remove an event handler for the given type.
         *
         * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
         * @param {Function} handler Handler function to remove
         * @memberOf mitt
         */
        off: function (type, handler) {
            var handlers = all.get(type);
            if (handlers) {
                handlers.splice(handlers.indexOf(handler) >>> 0, 1);
            }
        },
        clear: function () {
            all.clear();
        },
        /**
         * Invoke all handlers for the given type.
         * If present, `"*"` handlers are invoked after type-matched handlers.
         *
         * Note: Manually firing "*" handlers is not supported.
         *
         * @param {string|symbol} type The event type to invoke
         * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
         * @memberOf mitt
         */
        emit: function (type, evt) {
            (all.get(type) || []).slice().map(function (handler) { handler(evt); });
            (all.get('*') || []).slice().map(function (handler) { handler(type, evt); });
        }
    };
}
exports.mitt = mitt;
