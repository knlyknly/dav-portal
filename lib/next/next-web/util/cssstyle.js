(function(nx) {
    var browser = nx.env.browser;
    var prefix = browser.cssPrefix;

    var EXPORT = nx.define("nx.util.cssstyle", {
        static: true,
        methods: {
            has: function(dom, key) {
                var css = dom.style.cssText;
                return css.indexOf(key) === 0 || css.indexOf(prefix + key) === 0;
            },
            get: function(dom, key) {
                return dom.style[EXPORT.camelize(key)];
            },
            getBound: function(dom) {
                var b = dom.getBoundingClientRect();
                return {
                    left: b.left,
                    top: b.top,
                    width: b.width,
                    height: b.height,
                    right: b.right,
                    bottom: b.bottom
                };
            },
            set: function(dom, key, value) {
                if (typeof key !== "string") {
                    var str = "";
                    nx.each(key, function(value, key) {
                        var kv = EXPORT.stylize(key, value);
                        str += kv.text;
                    });
                    str = dom.style.cssText + str;
                    dom.style.cssText = str;
                    return str;
                } else {
                    var kv = EXPORT.stylize(key, value);
                    dom.style.cssText += kv.text;
                    return kv.value;
                }
            },
            remove: function(dom, key) {
                return dom.style.removeProperty(EXPORT.camelize(key));
            },
            camelize: function(key) {
                var result;
                switch (key) {
                    case "float":
                        result = "cssFloat";
                        break;
                    default:
                        if (key.indexOf(prefix) === 0) {
                            key = browser.prefix + key.substring(prefix.length - 1);
                        }
                        result = nx.string.camelize(key);
                        break;
                }
                return result;
            },
            stylize: function(key, value) {
                key = nx.string.uncamelize(key);
                var prefixKey, prefixValue, text = "";
                // TODO more special rules
                // TODO add "px" for measurable keys
                // TODO pre-process for cross browser: prefix of -webkit-, -moz-, -o-, etc.
                switch (key) {
                    case "left":
                    case "right":
                    case "top":
                    case "bottom":
                    case "width":
                    case "height":
                        if (typeof value === "number") {
                            // default unit: pixel
                            value = value + "px";
                        }
                        break;
                    case "display":
                        if (typeof value !== "string") {
                            value = (!!value) ? "" : "none";
                        } else if (value === "flex") {
                            prefixValue = prefix + value;
                        }
                        break;
                    case "user-select": // user-select
                    case "transform-origin":
                    case "transform-style":
                    case "animation": // animation
                    case "animation-name":
                    case "animation-duration":
                    case "animation-delay":
                    case "animation-iteration-count":
                    case "animation-timing-function":
                    case "animation-fill-mode":
                    case "flex-direction": // flex box parent
                    case "flex-flow":
                    case "flex-wrap":
                    case "justify-content":
                    case "align-content":
                    case "align-items":
                    case "flex": // flex box child
                    case "order":
                    case "flex-grow":
                    case "flex-shrink":
                    case "flex-basis":
                    case "align-self":
                        prefixKey = prefix + key;
                        break;
                    case "content":
                        value = "\"" + value + "\"";
                        break;
                    case "background-image":
                        prefixValue = value.replace(/\S*gradient\(/gi, function(match) {
                            return prefix + match;
                        });
                        break;
                    case "transform": // transform
                        prefixKey = prefix + key;
                        if (nx.is(value, Array)) {
                            if (value.length == 3) {
                                value = EXPORT.toCssTransformMatrix(value);
                            } else if (value.length === 4) {
                                value = EXPORT.toCssTransformMatrix3d(value);
                            }
                        }
                }
                // create text
                if (prefixKey) {
                    text += prefixKey + ":" + (prefixValue || value) + ";";
                } else if (prefixValue) {
                    text += key + ":" + prefixValue + ";";
                }
                text += key + ":" + value + ";";
                return {
                    key: key,
                    prefixKey: prefixKey,
                    value: value,
                    prefixValue: prefixValue,
                    text: text
                };
            },
            toCssTransformMatrix: function(matrix) {
                if (!matrix) {
                    return "none";
                }
                // FIXME too big digit
                var css = [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]].join(",").replace(/-?\d+e[+-]?\d+/g, "0");
                return "matrix(" + css + ")";
            },
            toCssTransformMatrix3d: function(matrix) {
                if (!matrix) {
                    return "none";
                }
                // FIXME too big digit
                var css = matrix.map(function(row) {
                    return row.join(",");
                }).join(",").replace(/-?\d+e[+-]?\d+/g, "0");
                return "matrix3d(" + css + ")";
            },
            toCssDisplayVisible: function(display) {
                return display ? "" : "none";
            }
        }
    });
})(nx);
