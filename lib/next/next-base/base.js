/**
 * @module next-base
 */
var nx = {
    /*
     * @property VERSION
     * @type String
     * @static
     * @final
     */
    VERSION: '0.9.0',
    /*
     * @property global
     * @type Object
     * @static
     * @final
     */
    global: (function() {
        return this;
    }).call(null),
    OPTIMIZED: false,
    TEXTUAL: true && (function() {
        try {
            return eval("(function A(){})").toString() === "function A(){}";
        } catch (e) {
            return false;
        }
    })()
};

var global = nx.global;
