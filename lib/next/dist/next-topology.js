(function (nx) {

    var global = nx.global;
    var document = global.document;
    var ua = navigator.userAgent.toLowerCase();
    var os = (function () {
        var os, patterns = {
            "windows": /windows|win32/,
            "macintosh": /macintosh|mac_powerpc/,
            "linux": /linux/
        };
        for (os in patterns) {
            if (patterns[os].test(ua)) {
                return os;
            }
        }
        return "other";
    })();

    var browser = (function () {
        var getVersionByPrefix = function (prefix) {
            var match = new RegExp(prefix + '(\\d+\\.\\d+)').exec(ua);
            return match ? parseFloat(match[1]) : 0;
        };
        var browser, browsers = [{
            tests: [/msie/, /^(?!.*opera)/],
            name: "ie",
            version: getVersionByPrefix("msie "),
            prefix: "ms", // not checked
            cssPrefix: "-ms-",
            engine: {
                name: "trident",
                version: getVersionByPrefix("trident\\/") || 4
            }
        }, {
            tests: [/gecko/, /^(?!.*webkit)/],
            name: "firefox",
            version: getVersionByPrefix("\\bfirefox\/"),
            prefix: "Moz",
            cssPrefix: "-moz-",
            engine: {
                name: "gecko",
                version: getVersionByPrefix("rv:") || 4
            }
        }, {
            tests: [/\bchrome\b/],
            name: "chrome",
            version: getVersionByPrefix('\\bchrome\/'),
            prefix: "webkit",
            cssPrefix: "-webkit-",
            engine: {
                name: 'webkit',
                version: getVersionByPrefix('webkit\\/')
            }
        }, {
            tests: [/safari/, /^(?!.*\bchrome\b)/],
            name: "safari",
            version: getVersionByPrefix('version\/'),
            prefix: "webkit",
            cssPrefix: "-webkit-",
            engine: {
                name: 'webkit',
                version: getVersionByPrefix('webkit\\/')
            }
        }, {
            tests: [/opera/],
            name: "opera",
            version: getVersionByPrefix('version\/'),
            prefix: "O",
            cssPrefix: "-o-",
            engine: {
                name: getVersionByPrefix("presto\\/") ? "presto" : "webkit",
                version: getVersionByPrefix("presto\\/") || getVersionByPrefix("webkit\\/")
            }
        }];
        // do browser determination one by one
        while (browsers.length) {
            browser = browsers.shift();
            while (browser.tests.length) {
                if (!browser.tests[0].test(ua)) {
                    break;
                }
                browser.tests.shift();
            }
            if (browser.tests.length) {
                continue;
            }
            delete browser.tests;
            return browser;
        }
        return {
            name: "other",
            version: 0,
            engine: {
                name: "unknown",
                version: 0
            }
        };
    })();

    var ie = browser.name === "ie" && browser.version;
    var tempElement = document.createElement('div');
    var tempStyle = tempElement.style;

    /**
     * 
     * @class env
     * @namespace nx
     */
    nx.define("nx.env", {
        statics: {
            /**
             * The document mode.
             *
             * @static
             * @property documentMode
             */
            documentMode: document.documentMode || 0,
            /**
             * In compat mode or not.
             *
             * @static
             * @property compatMode
             */
            compatMode: document.compatMode,
            /**
             * In strict mode or not.
             *
             * @static
             * @property strict
             */
            strict: document.compatMode === "CSS1Compat",
            /**
             * Using secure connection or not.
             *
             * @static
             * @property secure
             */
            secure: location.protocol.toLowerCase() === "https:",
            /**
             * Same as navigator.userAgent.
             *
             * @static
             * @property userAgent
             */
            userAgent: ua,
            /**
             * Operating system: windows, macintosh, linux or other.
             *
             * @static
             * @property os
             */
            os: os,
            /**
             * The browser's name, version, prefix/cssPrefix, and engine.
             * The engine contains its name and version.
             *
             * @static
             * @property browser
             */
            browser: browser,
            /**
             * The support status to some special features of current browser.
             *
             * @static
             * @property SUPPORT_MAP
             */
            SUPPORT_MAP: {
                addEventListener: !!document.addEventListener,
                dispatchEvent: !!document.dispatchEvent,
                getBoundingClientRect: !!document.documentElement.getBoundingClientRect,
                onmousewheel: 'onmousewheel' in document,
                XDomainRequest: !!window.XDomainRequest,
                crossDomain: !!(window.XDomainRequest || window.XMLHttpRequest),
                getComputedStyle: 'getComputedStyle' in window,
                iePropertyChange: !!(ie && ie < 9),
                w3cChange: !ie || ie > 8,
                w3cFocus: !ie || ie > 8,
                w3cInput: !ie || ie > 9,
                innerText: 'innerText' in tempElement,
                firstElementChild: 'firstElementChild' in tempElement,
                cssFloat: 'cssFloat' in tempStyle,
                opacity: (/^0.55$/).test(tempStyle.opacity),
                filter: 'filter' in tempStyle,
                classList: !!tempElement.classList,
                removeProperty: 'removeProperty' in tempStyle,
                touch: 'ontouchstart' in document.documentElement
            },
            /**
             * Some key code of known keys.
             *
             * @static
             * @property KEY_MAP
             */
            KEY_MAP: {
                BACKSPACE: 8,
                TAB: 9,
                CLEAR: 12,
                ENTER: 13,
                SHIFT: 16,
                CTRL: 17,
                ALT: 18,
                META: (browser.name === "chrome" || browser.name === "webkit" || browser.name === "safari") ? 91 : 224, // the apple key on macs
                PAUSE: 19,
                CAPS_LOCK: 20,
                ESCAPE: 27,
                SPACE: 32,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT_ARROW: 37,
                UP_ARROW: 38,
                RIGHT_ARROW: 39,
                DOWN_ARROW: 40,
                INSERT: 45,
                DELETE: 46,
                HELP: 47,
                LEFT_WINDOW: 91,
                RIGHT_WINDOW: 92,
                SELECT: 93,
                NUMPAD_0: 96,
                NUMPAD_1: 97,
                NUMPAD_2: 98,
                NUMPAD_3: 99,
                NUMPAD_4: 100,
                NUMPAD_5: 101,
                NUMPAD_6: 102,
                NUMPAD_7: 103,
                NUMPAD_8: 104,
                NUMPAD_9: 105,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_PLUS: 107,
                NUMPAD_ENTER: 108,
                NUMPAD_MINUS: 109,
                NUMPAD_PERIOD: 110,
                NUMPAD_DIVIDE: 111,
                F1: 112,
                F2: 113,
                F3: 114,
                F4: 115,
                F5: 116,
                F6: 117,
                F7: 118,
                F8: 119,
                F9: 120,
                F10: 121,
                F11: 122,
                F12: 123,
                F13: 124,
                F14: 125,
                F15: 126,
                NUM_LOCK: 144,
                SCROLL_LOCK: 145
            }
        }
    });
})(nx);
nx.ready = function (fn) {
    var callback, called, resources = new nx.Object();
    callback = function () {
        resources.release("recursive");
        // initialize to make sure we got a class or function
        if (typeof fn === "string") {
            fn = nx.path(global, fn);
        }
        // attach the class or call a function
        var instance, node;
        if (typeof fn === "function") {
            if (!fn.__nx__) {
                resources.retain("recursive", fn(resources));
                return;
            }
            instance = new fn();
        } else {
            instance = fn;
        }
        // check if the instance has 'dom' property
        node = nx.path(instance, "dom");
        if (node instanceof Node) {
            document.body.appendChild(node);
            resources.retain("recursive", {
                release: function () {
                    document.body.removeChild(node);
                    instance.release();
                }
            });
        } else {
            resources = instance;
        }
    };
    // make sure to call the callback, even if loaded.
    if (document.readyState === "interactive" || document.readyState === "complete") {
        callback();
    } else {
        window.addEventListener("load", callback);
        resources.retain("recursive", {
            release: function () {
                window.removeEventListener("load", callback);
            }
        });
    }
    return resources;
};
(function(nx) {
    var EXPORT = nx.path(nx.global, "nx.util.url", function() {
        var href = window.location.href;
        var hash = window.location.hash;
        var search = href.indexOf("?") >= 0 && href.substring(href.indexOf("?") + 1);
        if (search && search.indexOf("#") >= 0) {
            search = search.substring(0, search.indexOf("#"));
        }
        var protocol = window.location.protocol;
        var host = window.location.host;
        var hostname = window.location.hostname;
        var port = window.location.port;
        var pathname = window.location.pathname;
        if (search) {
            search = search.split("&").reduce(function(data, arg) {
                var key, value, idx = arg.indexOf("=");
                if (idx >= 0) {
                    key = arg.substring(0, idx);
                    value = arg.substring(idx + 1);
                } else {
                    key = arg;
                    value = true;
                }
                data[key] = value;
                return data;
            }, {});
        }
        if (hash) {
            hash = hash.split("&").reduce(function(data, arg) {
                var key, value, idx = arg.indexOf("=");
                if (idx >= 0) {
                    key = arg.substring(0, idx);
                    value = arg.substring(idx + 1);
                } else {
                    key = arg;
                    value = null;
                }
                data[key] = value;
                return data;
            }, {});
        }
        return {
            href: href,
            protocol: protocol,
            host: host,
            hostport: host,
            hostname: hostname,
            port: port,
            pathname: pathname,
            search: search,
            hash: hash
        };
    }());
})(nx);
(function (nx) {
    var EXPORT = nx.define("nx.util.fullscreen", {
        statics: {
            status: function () {
                return !document.fullscreenElement && // alternative standard method
                    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement;
            },
            toggle: function (fullscreen) {
                var isFullScreen = EXPORT.status();
                EXPORT.set(!isFullScreen);
            },
            set: function (fullscreen) {
                if (fullscreen) { // current working methods
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                        document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            }
        }
    });
})(nx);
(function (nx) {
    var browser = nx.env.browser;
    var prefix = browser.cssPrefix;

    // XXX dom.className is object in PhantomJS ?!

    var EXPORT = nx.define("nx.util.cssclass", {
        static: true,
        methods: {
            has: function (dom, name) {
                if (dom.classList) {
                    return dom.classList.contains(name);
                }
                return (" " + dom.className + " ").indexOf(" " + name + " ") >= 0;
            },
            add: function (dom, name) {
                if (dom.classList) {
                    dom.classList.add(name);
                    return String(dom.className);
                }
                if (!this.has(dom, name)) {
                    dom.className = (dom.className || "") + " " + name;
                }
                return String(dom.className);
            },
            remove: function (dom, name) {
                if (dom.classList) {
                    return dom.classList.remove(name);
                }
                // TODO optimizable?
                return dom.className = String(dom.className || "")
                    .split(" ")
                    .filter(function (cname) {
                        return cname && cname !== name;
                    })
                    .join(" ");
            },
            toggle: function (dom, name, existance) {
                if (arguments.length > 2) {
                    return existance ? this.add(dom, name) : this.remove(dom, name);
                } else {
                    if (dom.classList) {
                        return dom.classList.toggle(name);
                    } else {
                        if (this.has(dom, name)) {
                            this.remove(dom, name);
                        } else {
                            this.add(dom, name);
                        }
                    }
                }
            }
        }
    });
})(nx);
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
(function(nx) {

    var PREFIX = nx.env.browser.cssPrefix;
    var stylize = nx.util.cssstyle.stylize;
    var uncamelize = nx.string.uncamelize;
    var camelize = nx.string.camelize;

    var KeyFrames = (function() {
        var KeyFrames = function(options) {
            if (!options.definition) {
                this.definition = options.definition;
            } else {
                this.definition = options.definition;
                var i, KEYS = KeyFrames.KEYS,
                    key;
                this.name = options.name || ("keyframes-" + nx.uuid());
                for (i = 1; i < KEYS.length; i++) {
                    key = KEYS[i];
                    this[key] = options[key] || options[camelize(key)];
                }
            }
        };
        KeyFrames.KEYS = ["name", "duration", "timing-function", "delay", "iteration-count", "direction", "fill-mode", "play-state"];
        KeyFrames.DEFAULTS = {
            "duration": "0s",
            "timing-function": "ease",
            "delay": "0s",
            "iteration-count": "infinite",
            "direction": "normal",
            "fill-mode": "none",
            "play-state": "running"
        };
        return KeyFrames;
    })();

    var EXCEPTIONS = {
        selector: {
            "::placeholder": {
                regexp: /::placeholder/g,
                handler: function() {
                    // TODO actually worse in Firefox and MS
                    return "::" + PREFIX + "input-placeholder";
                }
            },
            "::scrollbar": {
                regexp: /::scrollbar/g,
                handler: function() {
                    // TODO actually worse in Firefox and MS
                    return "::" + PREFIX + "scrollbar";
                }
            },
            "::scrollbar-track": {
                regexp: /::scrollbar-track/g,
                handler: function() {
                    // TODO actually worse in Firefox and MS
                    return "::" + PREFIX + "scrollbar-track";
                }
            },
            "::scrollbar-thumb": {
                regexp: /::scrollbar-thumb/g,
                handler: function() {
                    // TODO actually worse in Firefox and MS
                    return "::" + PREFIX + "scrollbar-thumb";
                }
            }
        }
    };

    var EXPORT = nx.define("nx.util.csssheet", {
        static: true,
        methods: {
            create: function create(identity, map, oncreate) {
                // optionalize arguments
                if (typeof identity !== "string") {
                    oncreate = map;
                    map = identity;
                    identity = "jss-" + nx.serial();
                }
                // make sure the creation will be called
                return nx.ready(function() {
                    // TODO for ie
                    // create the style node
                    var cssText = EXPORT._css(map);
                    var resource, style_node, head = document.getElementsByTagName("head")[0];
                    style_node = document.createElement("style");
                    style_node.setAttribute("id", identity);
                    style_node.setAttribute("type", "text/css");
                    style_node.setAttribute("media", "screen");
                    style_node.setAttribute("rel", "stylesheet");
                    style_node.appendChild(document.createTextNode(cssText));
                    // clear previous and append new
                    head.appendChild(style_node);
                    // callback when finally created
                    resource = oncreate && oncreate(style_node, identity);
                    return {
                        release: function() {
                            resource && resource.release();
                            resource = null;
                            style_node && head.removeChild(style_node);
                            style_node = null;
                        }
                    };
                });
            },
            keyframes: function(options) {
                return new KeyFrames(options);
            },
            _pair: function(texts, key, value) {
                if (key === "animation" && value instanceof KeyFrames) {
                    if (!value.name) {
                        value.name = "keyframes-" + nx.uuid();
                    }
                    // create the KeyFrames in CSS text
                    texts.push("@" + PREFIX + "keyframes " + value.name + " {" + EXPORT._css(value.definition) + "}");
                    if (navigator.userAgent.indexOf("Safari/6") >= 0) {
                        // fix bug of animation on Safari 6
                        return (function(kf) {
                            // return the value setting
                            var i, key, value, kv;
                            var KEYS = KeyFrames.KEYS;
                            var DEFAULTS = KeyFrames.DEFAULTS;
                            var animation = [];
                            for (i = 0; i < KEYS.length; i++) {
                                key = KEYS[i];
                                if (kf[key] || typeof kf[key] === "number") {
                                    value = kf[key];
                                } else {
                                    value = DEFAULTS[key];
                                }
                                kv = stylize("animation-" + key, value);
                                animation.push(kv.text);
                            }
                            return animation.join("");
                        })(value);
                    }
                    value = (function(kf) {
                        // return the value setting
                        var i, key;
                        var KEYS = KeyFrames.KEYS;
                        var DEFAULTS = KeyFrames.DEFAULTS;
                        var animation = [];
                        for (i = 0; i < KEYS.length; i++) {
                            key = KEYS[i];
                            if (kf[key] || typeof kf[key] === "number") {
                                animation.push(kf[key]);
                            } else {
                                animation.push(DEFAULTS[key]);
                            }
                        }
                        return animation.join(" ");
                    })(value);
                }
                var kv = stylize(key, value);
                return kv.text;
            },
            _rule: function(texts, selector, rules) {
                var grouped = "",
                    key, value;
                if (rules instanceof KeyFrames) {
                    // create the KeyFrames in CSS text
                    texts.push("@" + PREFIX + "keyframes " + (selector) + " {" + EXPORT._css(rules.definition) + "}");
                    // other properties are ignored
                    return "";
                } else {
                    for (key in rules) {
                        value = rules[key];
                        grouped += EXPORT._pair(texts, key, value);
                    }
                    // fixup selector
                    nx.each(EXCEPTIONS.selector, function(value, key) {
                        if (selector.indexOf(key) >= 0) {
                            selector = selector.replace(value.regexp, value.handler);
                        }
                    });
                    return selector + "{" + grouped + "}";
                }
            },
            _css: function(css) {
                var selector, rules, texts = [""];
                for (selector in css) {
                    texts[0] += EXPORT._rule(texts, selector, css[selector]);
                }
                return texts.join("");
            }
        }
    });
})(nx);
(function(nx) {
    var browser = nx.env.browser;
    var prefix = browser.cssPrefix;

    var EXPORT = nx.define("nx.util.event", {
        statics: {
            supported: function(dom) {
                if (dom === window) {
                    return EXPORT.EVENTS_WINDOW.slice();
                }
                return EXPORT.EVENTS_BASIC.concat(EXPORT.EVENTS_TAG[dom.tagName.toLowerCase()]);
            },
            EVENTS_WINDOW: [
                "load",
                "unload",
                "resize"
            ],
            EVENTS_BASIC: [
                "click",
                "dblclick",
                "contextmenu",
                "mousedown",
                "mouseup",
                "mousemove",
                "mouseenter",
                "mouseleave",
                "mouseover",
                "mouseout",
                "keydown",
                "keyup",
                "keypress",
                "focus",
                "blur",
                "touchstart",
                "touchmove",
                "touchend",
                "touchcancel"
            ],
            EVENTS_TAG: {
                "form": [
                    "reset",
                    "submit"
                ],
                "input": [
                    "change",
                    "input"
                ],
                "textarea": [
                    "change",
                    "input"
                ],
                "select": [
                    "select"
                ],
                "img": [
                    "load",
                    "error"
                ]
            }
        }
    });
})(nx);
(function(nx) {
    /**
     * @namespace nx.util
     */
    var EXPORT = nx.define("nx.util.hash", {
        static: true,
        properties: {
            map: function() {
                return new nx.Map();
            }
        },
        methods: {
            init: function() {
                this.inherited();
                window.addEventListener("hashchange", this.onhashchange.bind(this));
                this.onhashchange();
            },
            getHashString: function() {
                var hash = window.location.hash;
                // FIXME the bug of browser: hash of "xxx#" is "", not "#"
                if (!hash) {
                    hash = window.location.href.indexOf("#");
                    if (hash >= 0) {
                        hash = window.location.href.substring(hash);
                    } else {
                        hash = "";
                    }
                }
                return hash;
            },
            getHashMap: function() {
                return this.toHashMap(this.getHashString());
            },
            setHashMap: function(map) {
                var hash = [];
                nx.each(map, function(value, key) {
                    if (key === "#") {
                        hash.unshift(value || "");
                    } else if (value || typeof value === "string") {
                        hash.push(key + "=" + value);
                    }
                });
                return window.location.href = "#" + hash.join("&");
            },
            onhashchange: function() {
                var maplast, map, hash = this.getHashString();
		map = this.toHashMap(hash);
                // get old map
                maplast = this._lastHashMap || {};
                // update map
                this.updateMap(maplast, map);
                // store the hash map
                this._lastHashMap = map;
            },
            updateMap: function(maplast, map) {
                var dict = this.map();
                var has = Object.prototype.hasOwnProperty;
                nx.each(maplast, function(value, key) {
                    if (!has.call(map, key)) {
                        dict.remove(key);
                    }
                });
                nx.each(map, function(value, key) {
                    dict.set(key, value);
                });
            },
            toHashMap: function(hash) {
                if (!hash) {
                    return {};
                }
                var pairs, main, map = {};
                pairs = hash.substring(1).split("&");
                if (pairs[0].indexOf("=") === -1) {
                    map["#"] = pairs.shift();
                } else {
                    map["#"] = null;
                }
                nx.each(pairs, function(pair) {
                    pair = pair.split("=");
                    if (pair.length < 2) {
                        pair[1] = true;
                    }
                    map[pair[0]] = pair[1];
                });
                return map;
            }
        }
    });

})(nx);
(function(nx) {
    var hasown = Object.prototype.hasOwnProperty;
    var requestAnimationFrame = nx.global.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    nx.path(nx.global, "nx.util.paint", function(painter) {
        var resources = new nx.Object();
        var callback = function() {
            var now = nx.date.now();
            resources.release("recursive");
            resources.retain("recursive", painter(now));
            id = requestAnimationFrame(callback);
        };
        var id = requestAnimationFrame(callback);
        resources.retain({
            release: function() {
                cancelAnimationFrame(id);
                resources.release("recursive");
            }
        });
        return resources;
    });

    nx.path(nx.global, "nx.util.paint.animate", (function() {

        var Runtime, Animation;
        var painting, map, runtimes;
        map = new nx.Map();
        runtimes = new nx.List();

        map.monitor(function(target, runtime) {
            runtime.start(nx.date.now());
        });

        runtimes.monitorContaining(function(runtime) {
            var target = runtime.animation().target();
            if (!map.get(target)) {
                map.set(target, runtime);
            }
            return function() {
                if (runtime === map.get(target)) {
                    var next = runtimes.find(function(item) {
                        return item.animation().target() === target;
                    });
                    if (next) {
                        map.set(target, next);
                    } else {
                        map.remove(target);
                    }
                }
            };
        });

        runtimes.watch("length", function(pname, length) {
            if (length) {
                painting = painting || nx.util.paint(function() {
                    var now = nx.date.now();
                    var map = new nx.Map();
                    nx.each(runtimes, function(runtime, index) {
                        var rate;
                        if (runtime.start()) {
                            rate = runtime.getRate(now);
                            if (runtime.draw(rate)) {
                                runtime.stop(now);
                                runtime.end(now);
                                runtime.release();
                            }
                        }
                    });
                });
            } else {
                painting && painting.release();
            }
        });

        Runtime = nx.define({
            properties: {
                animation: null,
                start: 0,
                stop: 0,
                end: 0,
                duration: 0,
                timingFunction: "linear",
                iterationCount: 1,
                direction: "normal" // "alternate"
            },
            methods: {
                init: function(options) {
                    this.inherited();
                    nx.sets(this, options);
                },
                getRate: function(now) {
                    now = now || nx.date.now();
                    var func, timingFunction = this.timingFunction() || nx.identity;
                    switch (timingFunction) {
                        case "linear":
                            func = nx.identity;
                            break;
                        case "ease":
                            // TODO etc.
                            break;
                    }
                    return Math.max(func((now - this.start()) / this.duration()), 0);
                },
                draw: function(rate) {
                    rate = rate >= 0 ? rate : this.getRate();
                    var target = this.animation().target();
                    var state0 = this.animation().state0();
                    var state1 = this.animation().state1();
                    var direction = this.direction();
                    var iterationCount = this.iterationCount();
                    var completed = false;
                    if (iterationCount === "infinite") {
                        rate = rate - Math.floor(rate);
                    } else {
                        if (rate > iterationCount) {
                            rate = 1;
                            completed = true;
                        }
                    }
                    if (direction === "alternate") {
                        rate = 1 - rate;
                    }
                    nx.each(state1, function(v1, path) {
                        var v0 = state0[path];
                        nx.path(target, path, v1 * rate + v0 * (1 - rate));
                    });
                    return completed;
                }
            }
        });

        Animation = nx.define({
            properties: {
                target: null,
                state0: {
                    value: function() {
                        return {};
                    }
                },
                state1: {
                    value: function() {
                        return {};
                    }
                }
            },
            methods: {
                init: function(target) {
                    this.inherited();
                    this.target(target);
                },
                reset: function() {
                    var target = this.target();
                    var state0 = this.state0();
                    var state1 = this.state1();
                    nx.each(state1, function(value, path) {
                        state0[path] = nx.path(target, path);
                    });
                },
                set: function(settings, prefix) {
                    prefix = prefix ? prefix + "." : "";
                    var target = this.target();
                    var state0 = this.state0();
                    var state1 = this.state1();
                    nx.each(settings, function(value, key) {
                        if (typeof key === "string") {
                            if (typeof value === "number") {
                                if (!hasown.call(state0, prefix + key)) {
                                    state0[prefix + key] = nx.path(target, prefix + key);
                                }
                                state1[prefix + key] = value;
                            } else {
                                this.set(value, prefix + key);
                            }
                        }
                    }.bind(this));
                },
                start: function(duration, timingFunction, iterationCount, direction) {
                    // variable-arguments
                    // default: 1000, "linear", 0, 1, "normal"
                    if (typeof duration === "number") {
                        if (timingFunction === "alternate" || timingFunction === "normal") {
                            direction = timingFunction;
                            iterationCount = 1;
                            timingFunction = "linear";
                        } else {
                            if (typeof timingFunction !== "string" && typeof timingFunction !== "function") {
                                direction = iterationCount;
                                iterationCount = timingFunction;
                                timingFunction = "linear";
                            }
                            if (typeof iterationCount !== "number" && isNaN(iterationCount * 1)) {
                                direction = iterationCount === "alternate" ? "alternate" : "normal";
                                iterationCount = 1;
                            } else {
                                iterationCount = iterationCount || 1;
                                direction = direction === "alternate" ? "alternate" : "normal";
                            }
                        }
                    } else {
                        duration = duration || {};
                        direction = duration.direction === "alternate" ? "alternate" : "normal";
                        iterationCount = duration.iterationCount || 1;
                        timingFunction = duration.timingFunction || "linear";
                        duration = duration.duration || 1000;
                    }
                    var runtime = new Runtime({
                        animation: this,
                        duration: duration,
                        timingFunction: timingFunction,
                        iterationCount: iterationCount,
                        direction: direction
                    });
                    runtime.retain({
                        release: function() {
                            runtime.stop(nx.date.now());
                            runtimes.remove(runtime);
                        }
                    });
                    runtimes.push(runtime);
                    return runtime;
                }
            }
        });

        return function(target, callback) {
            var animation = new Animation(target);
            callback(animation);
            return animation;
        };
    })());

})(nx);
(function () {
    nx.path(nx.global, "nx.util.ajax", (function () {
        var ajax = nx.global.$ ? $.ajax : (function () {
            // TODO
        })();
        return function (opts) {
            // TODO get real opts
            var options = nx.extend({}, opts);
            var resources = new nx.Object();
            // wrap returning functions
            options.success = function () {
                resources.release("abort");
                opts.success && nx.func.apply(opts.success, this, resources, arguments);
            };
            options.error = function () {
                resources.release("abort");
                opts.error && nx.func.apply(opts.error, this, resources, arguments);
            };
            options.complete = function () {
                resources.release("abort");
                opts.complete && nx.func.apply(opts.complete, this, resources, arguments);
            };
            // call ajax
            var xhr = ajax(options);
            // retain abort function
            resources.retain("abort", {
                release: function () {
                    xhr.abort();
                }
            });
            return resources;
        };
    })());
})(nx);
(function(nx) {
    nx.path(nx.global, "nx.util.ajaxs", (function() {
        var ajax = nx.util.ajax;
        var keysof = function(map) {
            var key, keys = [];
            if (map) {
                for (key in map) {
                    keys.push(key);
                }
            }
            return keys;
        };
        return function(options) {
            var resources = new nx.Object();
            var ajaxs = options.ajaxs;
            var key, total, count, keys, results, errorkey, errorval;
            results = {};
            count = 0;
            errorkey = null;
            keys = keysof(ajaxs);
            total = keys.length;
            var completed = function() {
                if (errorkey) {
                    options.error && options.error(errorkey, errorval);
                    options.complete && options.complete();
                } else {
                    options.success && options.success(results);
                    options.complete && options.complete();
                }
                // release all ajaxes
                nx.each(keys, function(key) {
                    resources.release(key);
                });
            };
	    // start all ajaxes
            nx.each(ajaxs || {}, function(value, key) {
                value = nx.extend({}, value);
                var complete = value.complete;
                var success = value.success;
                var error = value.error;
                value.success = function(result) {
                    success && nx.func.apply(success, arguments);
                    results[key] = result, count++;
                };
                value.error = function(result) {
                    nx.func.apply(error, arguments);
                    errorkey = key;
                    errorval = result;
                };
                value.complete = function() {
                    complete && nx.func.apply(complete, arguments);
                    if (errorkey || total <= count) {
                        completed && completed();
                    }
                };
                resources.retain("key", ajax(value));
            });
            return resources;
        };
    })());
})(nx);
(function (nx) {
    var square = nx.math.square;
    /**
     * @class MouseProcessor
     * @namespace nx.ui.capture
     */
    var EXPORT = nx.define("nx.ui.capture.MouseProcessor", {
        properties: {
            msHold: 400,
            event: {},
            track: {},
            handler: {}
        },
        methods: {
            enable: function (target) {
                var instance = this;
                target.addEventListener("mousedown", function (evt) {
                    instance.attach(evt);
                }, true);
                target.addEventListener("mousemove", function (evt) {
                    instance.move(evt);
                }, true);
                target.addEventListener("mouseup", function (evt) {
                    instance.end(evt);
                }, true);
                target.addEventListener("mousedown", function (evt) {
                    instance.detach(evt);
                });
            },
            attach: function (evt) {
                this.handler(null);
                this.event(evt);
                if (evt.capture) {
                    this._lastCapture = evt.capture;
                }
                evt.capture = this.capture.bind(this);
            },
            detach: function (evt) {
                if (this._lastCapture) {
                    evt.capture = this._lastCapture;
                    delete this._lastCapture;
                } else {
                    delete evt.capture;
                }
            },
            capture: function (handler) {
                // make sure only one handler can capture the "drag" event
                var captured, evt = this.event();
                if (handler && evt && evt.button === 0 && !this.handler()) {
                    this.handler(handler);
                    // track and data
                    var track = [];
                    this.track(track);
                    this.track().push([evt.clientX, evt.clientY]);
                    this._timer = setTimeout(this.hold.bind(this), this.msHold());
                    return true;
                }
                return false;
            },
            hold: function () {
                var handler = this.handler();
                var evt = this.event();
                if (this.isTrackLong()) {
                    if (!evt.capturedata) {
                        evt.capturedata = this._makeDragData(evt);
                    }
                    this._call(handler, "capturehold", evt);
                }
                clearTimeout(this._timer);
            },
            move: function (evt) {
                var handler = this.handler();
                if (handler) {
                    // TODO drag start event
                    // append point to the event
                    evt.capturedata = this._makeDragData(evt);
                    // fire events
                    this._call(handler, "capturedrag", evt);
                }
            },
            end: function (evt) {
                var handler = this.handler();
                if (handler) {
                    // append to the event
                    evt.capturedata = this._makeDragData(evt);
                    // fire events
                    this._call(handler, "capturedragend", evt);
                    if (this.isTrackLong()) {
                        this._call(handler, "capturetap", evt);
                    }
                    this._call(handler, "captureend", evt);
                }
                // clear status
                this.handler(null);
                this.track(null);
                this.event(null);
                clearTimeout(this._timer);
            },
            cancel: function () {
                // TODO cancel logic
            },
            isTrackLong: function () {
                var track = this.track();
                if (!track) {
                    return false;
                }
                var origin = track[0];
                return nx.each(track, function (position) {
                    if (square(position[0] - origin[0]) + square(position[1] - origin[1]) > 3 * 3) {
                        return false;
                    }
                });
            },
            _call: function (handler, name, evt) {
                if (handler[name] && typeof handler[name] === "function") {
                    var callback = handler[name].call(handler);
                    if (callback && typeof callback === "function") {
                        return callback(evt);
                    }
                } else if (nx.is(handler, nx.ui.Element)) {
                    handler.fire(name, evt);
                }
            },
            _makeDragData: function (evt) {
                var track = this.track();
                var current = [evt.clientX, evt.clientY],
                    origin = track[0],
                    last = track[track.length - 1];
                current.time = evt.timeStamp;
                track.push(current);
                if (!origin) {
                    origin = last = current.slice();
                }
                // TODO make sure the data is correct when target applied a matrix
                return {
                    target: this.handler(),
                    origin: origin,
                    position: current,
                    offset: [current[0] - origin[0], current[1] - origin[1]],
                    delta: [current[0] - last[0], current[1] - last[1]],
                    // TODO make it readonly
                    track: track
                };
            }
        }
    });
})(nx);
(function (nx) {
    var Vector = nx.geometry.Vector;
    var Math = nx.geometry.Math;
    /**
     * Touch events.
     *
     * @class Matcher
     * @namespace nx.ui.capture.touch
     */
    var EXPORT = nx.define("nx.ui.capture.touch.Matcher", {
        properties: {
            processor: null
        },
        methods: {
            init: function (processor) {
                this.inherited();
                this.processor(processor);
            },
            match: function (session) {
                return false;
            },
            affect: nx.idle
        }
    });
})(nx);
(function (nx) {
    var Vector = nx.geometry.Vector;
    var Math = nx.geometry.Math;
    /**
     * Touch events.
     *
     * @class ClearMatcher
     * @namespace nx.ui.capture.touch
     */
    var EXPORT = nx.define("nx.ui.capture.touch.ClearMatcher", nx.ui.capture.touch.Matcher, {
        properties: {
            timer: null
        },
        methods: {
            match: function (session) {
                return session.count() === 0;
            },
            affect: function (session) {
                var self = this;
                var processor = this.processor();
                return processor.trigger("captureend", session.lastEvent(), 0, function () {
                    processor.reset();
                });
            }
        }
    });
})(nx);
(function (nx) {
    var Vector = nx.geometry.Vector;
    var Math = nx.geometry.Math;
    /**
     * Touch events.
     *
     * @class TapMatcher
     * @namespace nx.ui.capture.touch
     */
    var EXPORT = nx.define("nx.ui.capture.touch.TapMatcher", nx.ui.capture.touch.Matcher, {
        methods: {
            match: function (session) {
                // only touch start happened
                return session.count() === 0 && session.timeline().length === 2 && session.timeline()[1].type === "touchend";
            },
            affect: function (session) {
                var processor = this.processor();
                var evt = session.lastEvent();
                evt.capturedata = {
                    position: session.touches()[0].track[0]
                };
                processor.trigger("capturetap", evt);
            }
        }
    });
})(nx);
(function (nx) {
    var Vector = nx.geometry.Vector;
    var Math = nx.geometry.Math;
    /**
     * Touch events.
     *
     * @class HoldMatcher
     * @namespace nx.ui.capture.touch
     */
    var EXPORT = nx.define("nx.ui.capture.touch.HoldMatcher", nx.ui.capture.touch.Matcher, {
        methods: {
            match: function (session) {
                // only touch start happened
                return session.timeline().length === 1;
            },
            affect: function (session) {
                var self = this;
                var processor = this.processor();
                var evt = session.lastEvent();
                evt.capturedata = {
                    position: session.touches()[0].track[0]
                };
                return processor.trigger("capturehold", session.lastEvent(), processor.msHold());
            }
        }
    });
})(nx);
(function (nx) {
    var Vector = nx.geometry.Vector;
    var Rectangle = nx.geometry.Rectangle;
    var GeoMath = nx.geometry.Math;
    /**
     * Touch events.
     *
     * @class DragMatcher
     * @namespace nx.ui.capture.touch
     */
    var EXPORT = nx.define("nx.ui.capture.touch.DragMatcher", nx.ui.capture.touch.Matcher, {
        properties: {
            touch: null,
            origin: null,
            ending: false
        },
        methods: {
            match: function (session) {
                if (EXPORT.isOneTouch(session)) {
                    if (this.touch()) {
                        return true;
                    }
                    var touch = EXPORT.getTouch(session);
                    this.touch(touch);
                    this.origin(touch.track.length - 1);
                    return false;
                } else {
                    if (this.touch()) {
                        this.ending(true);
                        return true;
                    }
                    return false;
                }
            },
            affect: function (session) {
                var processor = this.processor();
                var ename = this.ending() ? "capturedragend" : "capturedrag";
                var event = session.lastEvent();
                event.capturedata = this.makeZoomData(this.touch().track);
                processor.trigger(ename, event);
                if (this.ending()) {
                    this.touch(null);
                    this.ending(false);
                }
            },
            makeZoomData: function (track) {
                var origin = track[this.origin()];
                var target = track[track.length - 1];
                var previous = track[Math.max(this.origin(), track.length - 2)];
                return {
                    position: target.slice(),
                    origin: origin.slice(),
                    previous: previous.slice(),
                    delta: [target[0] - previous[0], target[1] - previous[1]],
                    offset: [target[0] - origin[0], target[1] - origin[1]],
                    track: track.slice(this.origin())
                };
            }
        },
        statics: {
            isOneTouch: function (session) {
                return session.count() === 1;
            },
            getTouch: function (session) {
                var i, touch, touches = session.touches();
                for (i = 0; i < touches.length; i++) {
                    touch = touches[i];
                    if (!touch.released) {
                        return touch;
                    }
                }
            },
            getTrack: function (session) {
                var i, touch, touches = session.touches();
                for (i = 0; i < touches.length; i++) {
                    touch = touches[i];
                    if (!touch.released) {
                        return touch.track;
                    }
                }
            }
        }
    });
})(nx);
(function (nx) {
    var Vector = nx.geometry.Vector;
    var Rectangle = nx.geometry.Rectangle;
    var GeoMath = nx.geometry.Math;
    /**
     * Touch events.
     *
     * @class TransformMatcher
     * @namespace nx.ui.capture.touch
     */
    var EXPORT = nx.define("nx.ui.capture.touch.TransformMatcher", nx.ui.capture.touch.Matcher, {
        properties: {
            origin: null,
            previous: null
        },
        methods: {
            match: function (session) {
                if (EXPORT.isTwoTouch(session)) {
                    if (this.origin()) {
                        return true;
                    }
                    var rect = EXPORT.getRect(session);
                    this.origin(rect);
                    this.previous(rect);
                    return false;
                } else {
                    return false;
                }
            },
            affect: function (session) {
                var processor = this.processor();
                var event = session.lastEvent();
                event.data = this.makeZoomData(session);
                processor.trigger("capturetransform", event);
                this.previous(EXPORT.getRect(session));
                return {
                    release: function () {
                        var session = this.processor().session();
                        if (!EXPORT.isTwoTouch(session)) {
                            this.origin(null);
                            this.previous(null);
                        }
                    }.bind(this)
                };
            },
            makeZoomData: function (session) {
                var origin = this.origin();
                var previous = this.previous();
                var target = EXPORT.getRect(session);
                return {
                    delta: {
                        origin: [(previous[0][0] + previous[1][0]) / 2, (previous[0][1] + previous[1][1]) / 2],
                        target: [(target[0][0] + target[1][0]) / 2, (target[0][1] + target[1][1]) / 2],
                        scale: EXPORT.distance(target) / EXPORT.distance(previous),
                        rotate: EXPORT.angle(target) / EXPORT.angle(previous)
                    },
                    offset: {
                        origin: [(origin[0][0] + origin[1][0]) / 2, (origin[0][1] + origin[1][1]) / 2],
                        target: [(target[0][0] + target[1][0]) / 2, (target[0][1] + target[1][1]) / 2],
                        scale: EXPORT.distance(target) / EXPORT.distance(origin),
                        rotate: EXPORT.angle(target) / EXPORT.angle(origin)
                    }
                };
            }
        },
        statics: {
            isTwoTouch: function (session) {
                return session.count() === 2;
            },
            getRect: function (session) {
                var rect = [];
                nx.each(session.touches(), function (touch) {
                    if (!touch.released) {
                        rect.push(touch.track[touch.track.length - 1]);
                    }
                });
                // return
                return rect;
            },
            distance: function (rect) {
                var p0 = rect[0];
                var p1 = rect[1];
                var dx = p1[0] - p0[0];
                var dy = p1[1] - p0[1];
                return Math.sqrt(dx * dx + dy * dy);
            },
            angle: function (rect) {
                var p0 = rect[0];
                var p1 = rect[1];
                var dx = p1[0] - p0[0];
                var dy = p1[1] - p0[1];
                return Math.atan(dy, dx);
            }
        }
    });
})(nx);
(function (nx) {
    var Vector = nx.geometry.Vector;
    var Math = nx.geometry.Math;
    /**
     * Touch events.
     *
     * @class Session
     * @namespace nx.ui.capture.touch
     */
    var EXPORT = nx.define("nx.ui.capture.touch.Session", {
        properties: {
            // options
            precisionTime: 200,
            precisionDelta: 5,
            // store
            lastEvent: null,
            // calculation
            count: 0,
            indices: {
                value: function () {
                    return {};
                }
            },
            touches: {
                value: function () {
                    return [];
                }
            },
            timeline: {
                value: function () {
                    return [];
                }
            }
        },
        methods: {
            update: function (evt) {
                var time = evt.timeStamp,
                    changed = false;
                EXPORT.eachTouch(evt, function (touch) {
                    var id = touch.identifier;
                    var position = [touch.clientX, touch.clientY];
                    var ename = evt.type;
                    // FIXME treat touch cancel as touch end
                    ename = (ename === "touchcancel" ? "touchend" : ename);
                    // log the event
                    if (this[ename]) {
                        if (this[ename].call(this, time, id, position) !== false) {
                            changed = true;
                        }
                    }
                }.bind(this));
                if (changed) {
                    this.lastEvent(evt);
                    this.fire("update");
                }
            },
            touchstart: function (time, id, position) {
                // get the touch
                var index, indices = this.indices();
                var touch, touches = this.touches();
                index = indices[id] = touches.length;
                touch = touches[index] = {
                    id: id,
                    index: touches.length,
                    track: [position]
                };
                // increase the count
                this.count(this.count() + 1);
                // update timeline
                var timepiece, timeline = this.timeline();
                if (timeline.length === 1 && Math.approximate(timeline[0].time, time, this.precisionTime())) {
                    timepiece = timeline[0];
                } else {
                    timeline.push(timepiece = {
                        time: time,
                        type: "touchstart",
                        touches: []
                    });
                }
                // update the touches of time piece
                timepiece.touches[index] = touch;
            },
            touchmove: function (time, id, position) {
                // get the touch
                var index, indices = this.indices();
                var touch, touches = this.touches();
                index = indices[id];
                touch = touches[index];
                // ignore for to close touch move
                if (Vector.approximate(touch.track[touch.track.length - 1], position, this.precisionDelta())) {
                    return false;
                }
                touch.track.push(position);
                // update timeline
                var timepiece, timeline = this.timeline();
                timepiece = timeline[timeline.length - 1];
                if (timepiece.type !== "touchmove" || !Math.approximate(timepiece.time, time)) {
                    timeline.push(timepiece = {
                        time: time,
                        type: "touchmove",
                        touches: []
                    });
                }
                // update the touches of time piece
                timepiece.touches[index] = touch;
            },
            touchend: function (time, id) {
                // get the touch
                var index, indices = this.indices();
                var touch, touches = this.touches();
                index = indices[id];
                touch = touches[index];
                // clear
                indices[id] = undefined;
                touch.released = true;
                // increase the count
                this.count(this.count() - 1);
                // update timeline
                var timepiece, timeline = this.timeline();
                timepiece = timeline[timeline.length - 1];
                if (timepiece.type !== "touchend" || !Math.approximate(timepiece.time, time)) {
                    timeline.push(timepiece = {
                        time: time,
                        type: "touchend",
                        touches: []
                    });
                }
                // update the touches of time piece
                timepiece.touches[index] = touch;
            }
        },
        statics: {
            eachTouch: function (evt, callback) {
                var i, n = evt.changedTouches.length;
                for (i = 0; i < n; i++) {
                    if (callback(evt.changedTouches[i], i) === false) {
                        break;
                    }
                }
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * Touch events:
     * touchsessionstart (first touch point)
     * touchsessionzoom (touch 2 point and move)
     * touchsessionhover (touch and keep)
     * touchsessionopen (double tap)
     * touchsessionend (last touch point and no more in a while)
     *
     * @class TouchProcessor
     * @namespace nx.ui.capture
     */
    var EXPORT = nx.define("nx.ui.capture.TouchProcessor", {
        properties: {
            msDouble: 200,
            msHold: 400, // milliseconds of keeping touched
            event: {},
            handlers: {},
            matchers: {
                value: function () {
                    return [
                        new nx.ui.capture.touch.HoldMatcher(this), // matcher of hold event
                        new nx.ui.capture.touch.TapMatcher(this), // matcher of tap event
                        new nx.ui.capture.touch.DragMatcher(this), // matcher of dragging
                        new nx.ui.capture.touch.TransformMatcher(this), // matcher of zooming
                        new nx.ui.capture.touch.ClearMatcher(this) // default matcher of release
                    ];
                }
            },
            session: {
                watcher: function (pname, pvalue, poldvalue) {
                    this.release("session");
                    if (pvalue) {
                        this.retain("session", pvalue.on("update", this.updateSession.bind(this)));
                    }
                }
            }
        },
        methods: {
            enable: function (target) {
                var instance = this;
                target.addEventListener("touchstart", function (evt) {
                    instance.attach(evt);
                }, true);
                target.addEventListener("touchstart", function (evt) {
                    instance.detach(evt);
                });
                target.addEventListener("touchmove", function (evt) {
                    instance.update(evt);
                }, true);
                target.addEventListener("touchend", function (evt) {
                    instance.update(evt);
                }, true);
                target.addEventListener("touchcancel", function (evt) {
                    instance.update(evt);
                }, true);
            },
            attach: function (evt) {
                this.event(evt);
                // add capture on event
                if (evt.capture) {
                    this._lastCapture = evt.capture;
                }
                evt.capture = this.capture.bind(this);
                // start new session if not exists
                if (!this.session()) {
                    this.session(new nx.ui.capture.touch.Session());
                }
            },
            detach: function (evt) {
                // clear capture from event
                if (this._lastCapture) {
                    evt.capture = this._lastCapture;
                    delete this._lastCapture;
                } else {
                    delete evt.capture;
                }
                // update session with event
                this.update(evt);
            },
            capture: function (handler, names) {
                var handlers = this.handlers();
                // initial handlers if not exists
                if (!handlers) {
                    handlers = {};
                    this.handlers(handlers);
                    this.event().preventDefault();
                }
                // make sure only one handler can capture the "drag" event
                var success = true;
                names = typeof names === "string" ? names.replace(/\s/g, "").split(",") : names;
                nx.each(names, function (name) {
                    if (name === "end") {
                        // capture end belongs to all handlers
                        handlers["captureend"] = handlers["captureend"] || [];
                        handlers["captureend"].push(handler);
                    } else {
                        name = "capture" + name;
                        if (handler && !handlers[name]) {
                            handlers[name] = handler;
                        }
                    }
                });
                return success;
            },
            update: function (evt) {
                // update session with event
                if (this.session()) {
                    this.session().update(evt);
                    if (this.handlers()) {
                        evt.preventDefault();
                    }
                }
            },
            reset: function () {
                this.handlers(null);
                this.session().release();
                this.session(null);
            },
            trigger: function (name, evt, delay, delayCallback) {
                // call the notifier
                if (delay) {
                    return nx.timer(delay, function () {
                        this.triggerAction(name, evt);
                        delayCallback && delayCallback();
                    }.bind(this));
                } else {
                    this.triggerAction(name, evt);
                    delayCallback && delayCallback();
                }
            },
            triggerAction: function (name, evt, callback) {
                var self = this;
                var handlers = this.handlers();
                if (name === "captureend") {
                    nx.each(handlers && handlers[name], function (handler) {
                        self.triggerOne(handler, name, evt);
                    });
                } else {
                    if (handlers && handlers[name]) {
                        // check the handler existance
                        self.triggerOne(handlers[name], name, evt);
                    }
                }
            },
            triggerOne: function (handler, name, evt) {
                handler.fire(name, evt);
            },
            updateSession: function () {
                var session = this.session();
                nx.each(this.matchers(), function (matcher) {
                    // release if any previous states occurs
                    matcher.release("affect");
                    // try match the session
                    if (matcher.match(session)) {
                        var result = matcher.affect(session);
                        if (result) {
                            matcher.retain("affect", result);
                        }
                        if (result === false) {
                            return false;
                        }
                    }
                });
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class CaptureManager
     * @namespace nx.ui.capture
     */
    var EXPORT = nx.define("nx.ui.capture.CaptureManager", {
        properties: {
            mouseProcessor: {
                value: function () {
                    return new nx.ui.capture.MouseProcessor();
                }
            },
            touchProcessor: {
                value: function () {
                    return new nx.ui.capture.TouchProcessor();
                }
            }
        },
        methods: {
            enable: function (target) {
                // preprocess target
                if (!target) {
                    target = document;
                } else if (target.resolve) {
                    target = target._dom;
                }
                // enable mouse and touch input capture processors
                this.mouseProcessor().enable(target);
                this.touchProcessor().enable(target);
            }
        },
        statics: {
            offsetTooClose: function (offset) {
                return Math.abs(offset[0]) < 5 && Math.abs(offset[1]) < 5;
            },
            fixRect: function (rect) {
                if (!rect) {
                    return rect;
                }
                rect = nx.clone(rect);
                if (rect.width < 0) {
                    rect.left += rect.width;
                    rect.width = -rect.width;
                }
                if (rect.height < 0) {
                    rect.top += rect.height;
                    rect.height = -rect.height;
                }
                return rect;
            }
        }
    });

    nx.ready(function () {
        var instance = new EXPORT();
        instance.enable();
    });
})(nx);
(function(nx) {

    var global = nx.global;

    var Hierarchical = nx.Hierarchical;
    var cssclass = nx.util.cssclass;
    var cssstyle = nx.util.cssstyle;

    var EXPORT = nx.define("nx.ui.Element", nx.Hierarchical, {
        properties: {
            xmlns: {
                set: function() {
                    throw new Error("Unable to set xmlns of Element.");
                }
            },
            dom: {
                set: function() {
                    throw new Error("Unable to set dom of Element.");
                },
                watcher: function(name, value) {
                    this.release("syncDomEvents");
                    if (nx.is(value, Element)) {
                        this.retain("syncDomEvents", this._sync_dom_events(value));
                    }
                }
            },
            childDefaultType: "nx.ui.Element",
            childList: {
                watcher: function(name, value) {
                    // stop sync with the old child list
                    this.release("syncChildList");
                    // remove all child nodes
                    if (nx.is(value, nx.List)) {
                        this.retain("syncChildList", this._sync_child_list(value));
                    }
                }
            }
        },
        hierarchical: {
            capture: function(meta, context) {
                return this.hierarchicalUpdateCapture(meta, context);
            },
            cssclass: function(meta, context) {
                return this.hierarchicalUpdateClass(meta, context);
            },
            cssstyle: function(meta, context) {
                return this.hierarchicalUpdateStyles(meta, context);
            },
            attributes: function(meta, context) {
                return this.hierarchicalUpdateAttributes(meta, context);
            }
        },
        methods: {
            init: function(tag, xmlns) {
                this.inherited();
                this._xmlns = xmlns || "";
                if (tag instanceof Element) {
                    this._dom = tag;
                    // TODO init with existing DOM Element (important if SEO required)
                    this.notify("dom");
                } else {
                    // initialize xmlns and dom-element
                    if (xmlns) {
                        // TODO default tag for known namespaces and throw error for still missing tag
                        this._dom = document.createElementNS(xmlns, tag);
                    } else {
                        this._dom = document.createElement(tag || "nx-element");
                    }
                    this.notify("dom");
                    // handle the view
                    this.initView();
                }
                // fire ready event
                this.fire("ready");
            },
            initView: function() {
                var instance = this;
                var clazz = instance.constructor;
                // get views' definitions of the whole inheritance
                var view, views = [];
                do {
                    view = clazz.__meta__.view;
                    if (view) {
                        // TODO validate structure configuration
                        views.unshift(view);
                    }
                    clazz = clazz.__super__;
                } while (clazz && clazz !== nx.ui.Element);
                // initialize the element in order
                nx.each(views, function(view) {
                    instance.retain(instance.hierarchicalUpdate(view, instance));
                });
            },
            append: function(child) {
                // TODO to be decided: use append or appendChildren
                return this.hierarchicalAppend(child, this);
            },
            appendTo: function(parent) {
                if (nx.is(parent, EXPORT)) {
                    return parent.append(this);
                }
                var dom = this.dom();
                if (!parent || parent === global || parent === document) {
                    parent = document.body;
                }
                // attach the the parent
                if (parent instanceof Element) {
                    document.body.appendChild(dom);
                    this.parent(parent);
                    return {
                        release: function() {
                            this.parent(null);
                            document.body.removeChild(dom);
                        }.bind(this)
                    };
                }
            },
            hasAttribute: function(name) {
                return this._dom.hasAttribute(name);
            },
            hasAttributeNS: function(xmlns, name) {
                return this._dom.hasAttributeNS(xmlns, name);
            },
            getAttribute: function(name) {
                return this._dom.getAttribute(name);
            },
            getAttributeNS: function(xmlns, name) {
                return this._dom.getAttributeNS(xmlns, name);
            },
            setAttribute: function(name, value) {
                return this._dom.setAttribute(name, value);
            },
            setAttributeNS: function(xmlns, name, value) {
                return this._dom.setAttributeNS(xmlns, name, value);
            },
            removeAttribute: function(name) {
                return this._dom.removeAttribute(name);
            },
            removeAttributeNS: function(xmlns, name) {
                return this._dom.removeAttributeNS(xmlns, name);
            },
            hasClass: function(name) {
                return cssclass.has(this._dom, name);
            },
            addClass: function(name) {
                return cssclass.add(this._dom, name);
            },
            removeClass: function(name) {
                return cssclass.remove(this._dom, name);
            },
            toggleClass: function(name, existance) {
                if (arguments.length > 1) {
                    return cssclass.toggle(this._dom, name, existance);
                } else {
                    return cssclass.toggle(this._dom, name);
                }
            },
            getComputedStyle: function(name) {
                // TODO browser prefix?
                return this._dom.getComputedStyle(name);
            },
            hasStyle: function(name) {
                // FIXME not good implementation
                return this._dom.style.cssText.indexOf(name + ":") >= 0;
            },
            getStyle: function(name) {
                return cssstyle.get(this._dom, name);
            },
            setStyle: function(name, value) {
                return cssstyle.set(this._dom, name, value);
            },
            removeStyle: function(name) {
                return cssstyle.remove(this._dom, name);
            },
            getBound: function() {
                return cssstyle.getBound(this._dom);
            },
            _sync_dom_events: function(dom) {
                var self = this;
                var supported = nx.util.event.supported(dom);
                var resources = new nx.Object();
                nx.each(supported, function(ename) {
                    var callback = function(evt) {
                        self.fire(ename, evt);
                    };
                    resources.retain(this.on("+" + ename, function() {
                        dom.addEventListener(ename, callback);
                    }));
                    resources.retain(this.on("-" + ename, function() {
                        dom.removeEventListener(ename, callback);
                    }));
                }, this);
                nx.each(supported, function(ename) {
                    var callback = function(evt) {
                        self.fire(":" + ename, evt);
                    };
                    resources.retain(this.on("+:" + ename, function() {
                        dom.addEventListener(ename, callback, true);
                    }));
                    resources.retain(this.on("-:" + ename, function() {
                        dom.removeEventListener(ename, callback, true);
                    }));
                }, this);
                return resources;
            },
            _sync_child_list: function(list) {
                // sync with the new child list
                return list.monitorDiff(function(evt) {
                    // TODO async for possible movings
                    var i, j, diff, node, dom, diffs = evt.diffs;
                    var drop, drops = evt.drops;
                    var sibling, join, joins = evt.joins;
                    var node, dom, pdom = this._dom;
                    for (i = 0; i < diffs.length; i++) {
                        diff = diffs[i], drop = drops[i], join = joins[i];
                        switch (diff[0]) {
                            case "splice":
                                // remove if droping
                                for (j = 0; j < drop.length; j++) {
                                    node = drop[j];
                                    if (!node) {
                                        continue;
                                    }
                                    dom = (node instanceof Node) ? node : node._dom;
                                    if (dom instanceof Node) {
                                        pdom.removeChild(dom);
                                    }
                                }
                                // add if joining
                                sibling = pdom.childNodes[diff[1]];
                                for (j = 0; j < join.length; j++) {
                                    // get the DOM node to insert
                                    node = join[j];
                                    if (!node) {
                                        continue;
                                    }
                                    dom = (node instanceof Node) ? node : node._dom;
                                    // apply insert
                                    if (dom instanceof Node) {
                                        sibling ? pdom.insertBefore(dom, sibling) : pdom.appendChild(dom);
                                    }
                                }
                                break;
                            case "move":
                                if (diff[3] > 0) {
                                    // move forward
                                    sibling = pdom.childNodes[diff[1] + diff[2] + diff[3]];
                                    for (j = diff[2] - 1; j >= 0; j--) {
                                        dom = pdom.childNodes[diff[1] + j];
                                        sibling ? pdom.insertBefore(dom, sibling) : pdom.appendChild(dom);
                                        sibling = dom;
                                    }
                                } else {
                                    sibling = pdom.childNodes[diff[1] + diff[3]] || pdom.firstChild;
                                    for (j = diff[2] - 1; j >= 0; j--) {
                                        dom = pdom.childNodes[diff[1] + j];
                                        sibling ? pdom.insertBefore(dom, sibling) : pdom.appendChild(dom);
                                        sibling = dom;
                                    }
                                }
                                break;
                        }
                    }
                }, this);
            },
            hierarchicalAppend: function(meta, context, list) {
                if (meta instanceof Node) {
                    return this.hierarchicalAppendChildren([meta], context, list);
                }
                return this.inherited(meta, context, list);
            },
            hierarchicalAppendString: function(meta, context, list) {
                var resources = this.inherited(meta, context, list);
                if (resources === nx.Object.IDLE_RESOURCE) {
                    return this.hierarchicalAppendHtml(meta, context, list);
                }
            },
            hierarchicalAppendNumber: function(meta, context, list) {
                return this.hierarchicalAppendHtml(meta, context, list);
            },
            hierarchicalAppendHtml: function(html, context, list) {
                var self = this;
                context = context || self;
                // FIXME create element for HTML, etc.
                var container = document.createElement("div");
                container.innerHTML = html;
                var children = Array.prototype.slice.call(container.childNodes);
                return self.hierarchicalAppendChildren(children, context, list);
            },
            hierarchicalUpdateEvent: function(name, handler, context) {
                // preprocess capture
                if (name === "capture") {
                    return this.hierarchicalUpdateCapture(handler, context);
                }
                return this.inherited(name, handler, context);
            },
            hierarchicalUpdateCapture: function(meta, context) {
                var self = this;
                var resources = new nx.Object();
                // preprocess meta
                meta = Hierarchical.getBindingIfString(meta) || meta;
                // bind or listen on event
                if (nx.is(meta, nx.binding)) {
                    resources.retain(nx.Object.binding(context, meta, function(pvalue) {
                        resources.release("recursive");
                        resources.retain("recursive", self.hierarchicalUpdateCapture(pvalue, context));
                    }));
                } else if (nx.is(meta, nx.Object)) {
                    resources.retain(this.hierarchicalUpdateCaptureObject(meta, context));
                } else {
                    var starter, events = [];
                    nx.each(meta, function(handler, name) {
                        if (name === "start") {
                            starter = handler;
                        } else {
                            events.push(name);
                            name = name.split(" ").map(function(name) {
                                return "capture" + name;
                            }).join(" ");
                            resources.retain(self.hierarchicalUpdateEvent(name, handler, context));
                        }
                    });
                    if (events.length) {
                        events = events.join(" ").split(" ");
                        resources.retain(self.hierarchicalUpdateEvent("mousedown touchstart", function(sender, evt) {
                            evt.capture(sender, events);
                            if (starter) {
                                if (typeof starter === "string") {
                                    nx.path(context, starter).call(context, sender, evt);
                                } else {
                                    starter.call(context, sender, evt);
                                }
                            }
                        }, context));
                    }
                }
                return resources;
            },
            hierarchicalUpdateCaptureObject: function(meta, context) {
                var self = this;
                var resources = new nx.Object();
                var captures = new nx.List();
                nx.each(EXPORT.CAPTURES, function(name) {
                    var handler = meta[name];
                    if (!handler || typeof handler !== "function") {
                        return;
                    }
                    if (handler.__type__ === "property") {
                        resources.retain(name + "-watch", meta.watch(name, function(name, handler) {
                            if (typeof handler === "function") {
                                resources.retain(name, self.hierarchicalUpdateEvent("capture" + name, handler.bind(meta), context));
                                captures.toggle(name, true);
                            } else {
                                resources.release(name);
                                captures.toggle(name, false);
                            }
                        }));
                    } else {
                        resources.retain(name, self.hierarchicalUpdateEvent("capture" + name, handler.bind(meta), context));
                        captures.toggle(name, true);
                    }
                });
                resources.retain(captures.watch("length", function(pname, length) {
                    if (length) {
                        resources.retain("start", self.hierarchicalUpdateEvent("mousedown touchstart", function(sender, evt) {
                            evt.capture(sender, captures.toArray());
                            var starter = nx.path(meta, "start");
                            starter && starter.call(context, sender, evt);
                        }, context));
                    } else {
                        resources.release("start");
                    }
                }));
                return resources;
            },
            hierarchicalUpdateAttributes: function(meta, context) {
                var self = this;
                var resources = new nx.Object();
                // set attributes and properties of "child"
                nx.each(meta, function(value, key) {
                    if (key === "class") {
                        resources.retain(self.hierarchicalUpdateClass(value, context));
                    } else if (key === "style") {
                        resources.retain(self.hierarchicalUpdateStyles(value, context));
                    } else {
                        resources.retain(self.hierarchicalUpdateAttribute(key, value, context));
                    }
                });
                return resources;
            },
            hierarchicalUpdateAttribute: function(key, value, context) {
                var self = this;
                context = context || self;
                // parse "{xxx}"
                value = Hierarchical.getBindingIfString(value) || value;
                if (nx.is(value, nx.binding)) {
                    var resources = new nx.Object();
                    resources.retain(nx.Object.binding(context, value, function(pvalue) {
                        resources.release("recursive");
                        resources.retain("recursive", self.hierarchicalUpdateAttribute(key, pvalue, context));
                    }));
                    return resources;
                } else {
                    if (!value && value !== "") {
                        self.removeAttribute(key);
                    } else {
                        self.setAttribute(key, value || "");
                    }
                    return nx.Object.IDLE_RESOURCE;
                }
            },
            hierarchicalUpdateClass: function(value, context) {
                var self = this;
                context = context || self;
                // FIXME for deep recursive, return release instead of update resource manager
                if (nx.is(value, nx.binding)) {
                    return self.hierarchicalUpdateClassBinding(value, context);
                } else {
                    var resources = new nx.Object();
                    if (nx.is(value, "String")) {
                        nx.each(value.split(" "), function(value) {
                            var binding = Hierarchical.getStringBindingByString(value);
                            if (binding) {
                                resources.retain(self.hierarchicalUpdateClassBinding(binding, context));
                            } else {
                                resources.retain(self.hierarchicalUpdateClassValue(value, context));
                            }
                        });
                    } else if (nx.is(value, "Array")) {
                        nx.each(value, function(value) {
                            resources.retain(self.hierarchicalUpdateClass(value, context));
                        });
                    }
                    return resources;
                }
            },
            hierarchicalUpdateClassValue: function(value, context) {
                var self = this;
                context = context || self;
                value && self.addClass(value);
                return {
                    release: function() {
                        value && self.removeClass(value);
                        value = null;
                    }
                };
            },
            hierarchicalUpdateClassBinding: function(value, context) {
                var self = this;
                context = context || self;
                var dom = self.dom();
                var resources = new nx.Object();;
                resources.retain(nx.Object.binding(context, value, function(pvalue) {
                    resources.release("recursive");
                    pvalue && resources.retain("recursive", self.hierarchicalUpdateClass(pvalue, context));
                }));
                return resources;
            },
            hierarchicalUpdateStyles: function(value, context) {
                var self = this;
                // parse "{xxx}"
                value = Hierarchical.getBindingIfString(value) || value;
                var resources;
                if (nx.is(value, nx.binding)) {
                    // as binding
                    resources = new nx.Object();
                    resources.retain(nx.Object.binding(context, value, function(pvalue) {
                        resources.release("recursive");
                        pvalue && resources.retain("recursive", self.hierarchicalUpdateStyles(pvalue, context));
                    }));
                } else if (typeof value === "string") {
                    // TODO plain css text
                    resources = nx.Object.IDLE_RESOURCE;
                } else {
                    resources = new nx.Object();
                    nx.each(value, function(value, key) {
                        resources.retain(self.hierarchicalUpdateStyle(key, value, context));
                    });
                }
                return resources;
            },
            hierarchicalUpdateStyle: function(key, value, context) {
                var self = this;
                context = context || self;
                // parse "{xxx}"
                value = Hierarchical.getBindingIfString(value) || value;
                // apply binding or value
                if (nx.is(value, nx.binding)) {
                    return self.hierarchicalUpdateStyleBinding(key, value, context);
                } else {
                    return self.hierarchicalUpdateStyleValue(key, value, context);
                }
            },
            hierarchicalUpdateStyleValue: function(key, value, context) {
                var self = this;
                context = context || self;
                var lastvalue = self.hasStyle(key) ? self.getStyle(key) : null;
                self.setStyle(key, value);
                return {
                    release: function() {
                        if (lastvalue) {
                            self.setStyle(key, lastvalue);
                        } else {
                            self.removeStyle(key);
                        }
                    }
                };
            },
            hierarchicalUpdateStyleBinding: function(key, value, context) {
                var self = this;
                context = context || self;
                var resources = new nx.Object();
                resources.retain(nx.Object.binding(context, value, function(pvalue) {
                    resources.release("recursive");
                    resources.retain("recursive", self.hierarchicalUpdateStyle(key, pvalue, context));
                }));
                return resources;
            }
        },
        statics: {
            CAPTURES: ["tap", "dragstart", "dragmove", "dragend", "transform", "hold", "end"],
            CSS: nx.util.csssheet.create({
                "nx-element": {
                    "display": "block"
                }
            })
        }
    });
})(nx);
(function (nx) {

    var Element = nx.ui.Element;

    var EXPORT = nx.define("nx.ui.Template", {
        properties: {
            parent: {},
            list: {},
            template: {},
            context: {}
        },
        methods: {
            init: function (parent, list, template, context) {
                this.inherited();
                this.parent(parent);
                this.list(list);
                this.template(template);
                this.context(context);
                this.retain(nx.Object.cascade(this, "parent,list,template,context", function (parent, list, template, context) {
                    if (list) {
                        this.release("target-list");
                        this.retain("target-list", list.monitorContaining(function (item) {
                            return function () {
                                item.release();
                            };
                        }));
                    }
                    if (parent && list && template) {
                        context = context || parent;
                        this.retain("initial", this.applyBinding(parent, list, template.binding, template.pattern, context));
                    }
                }));
            },
            applyBinding: function (parent, list, binding, pattern, context) {
                var self = this;
                var resource = new nx.Object();
                resource.retain(nx.Object.binding(context, binding, function (pvalue) {
                    resource.release("recursive");
                    if (nx.is(pvalue, nx.binding)) {
                        resource.retain("recursive", self.applyTemplate(parent, list, binding, pattern, context));
                    } else if (nx.is(pvalue, nx.List)) {
                        resource.retain("recursive", self.applyList(parent, list, pvalue, pattern, context));
                    } else if (nx.is(pvalue, "Array")) {
                        resource.retain("recursive", self.applyList(parent, list, new nx.List(pvalue), pattern, context));
                    }
                }));
                return resource;
            },
            applyList: function (parent, list, source, pattern, context) {
                context = context || parent;
                var self = this;
                var scopes = nx.List.mapeach(source, "model", {
                    count: "list.length",
                    parent: function () {
                        return parent;
                    },
                    list: function () {
                        return list;
                    },
                    context: function () {
                        return context;
                    },
                    views: nx.binding("parent, context, list, model", function (parent, context, list, model) {
                        if (parent && context && list) {
                            var self = this;
                            this.release("views");
                            var resources = new nx.Object();
                            this.retain("views", resources);
                            return pattern.map(function (meta) {
                                var view = Element.create(parent, meta);
                                Element.extendProperty(view, "scope", self);
                                view.retain(Element.update(view, meta, view));
                                resources.retain(view);
                                return view;
                            });
                        }
                    })
                });
                scopes.retain(scopes.monitorDiff(function (evt) {
                    // TODO handle model movings
                    var tdiffs = [];
                    nx.each(evt.diffs, function (sdiff) {
                        var tdiff = sdiff.slice();
                        switch (tdiff[0]) {
                        case "splice":
                            tdiff[1] *= pattern.length;
                            tdiff[2] *= pattern.length;
                            tdiff[3] = tdiff[3].reduce(function (result, scope) {
                                return result.concat(scope.views());
                            }, []);
                            break;
                        case "move":
                            tdiff[1] *= pattern.length;
                            tdiff[2] *= pattern.length;
                            tdiff[3] *= pattern.length;
                        }
                        tdiffs.push(tdiff);
                    });
                    list.differ(tdiffs);
                }));
                return scopes;
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Image
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.Image", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("img");
            }
        },
        statics: {
            load: function (url, callback) {
                var resources = new nx.Object();
                var img = document.createElement("img");
                img.onload = function () {
                    callback && callback({
                        success: true,
                        image: img,
                        size: {
                            width: img.width,
                            height: img.height
                        }
                    });
                };
                img.onerror = function () {
                    callback && callback({
                        success: false,
                        image: img
                    });
                };
                img.src = url;
                resources.retain({
                    release: function () {
                        callback = null;
                    }
                });
                return resources;
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Form
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.Form", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("form");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Label
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.Label", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("label");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class HyperLink
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.HyperLink", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("a");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Input
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.Input", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("input");
            },
            focus: function () {
                return this.dom().focus();
            },
            blur: function () {
                return this.dom().blur();
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class InputFile
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.InputFile", nx.ui.tag.Input, {
        view: {
            attributes: {
                type: "file"
            },
            events: {
                change: function (sender, evt) {
                    // FIXME Chrome: it will not catch "reset" event of form
                    this.value(this.dom().value);
                }
            }
        },
        properties: {
            value: ""
        }
    });
})(nx);
(function (nx) {
    /**
     * @class InputCheckBox
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.InputCheckBox", nx.ui.tag.Input, {
        view: {
            attributes: {
                type: "checkbox"
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class InputRadio
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.InputRadio", nx.ui.tag.Input, {
        view: {
            attributes: {
                type: "radio"
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class InputButton
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.InputButton", nx.ui.tag.Input, {
        view: {
            attributes: {
                type: "button"
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class InputHidden
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.InputHidden", nx.ui.tag.Input, {
        view: {
            attributes: {
                type: "hidden"
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class TextArea
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.TextArea", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("textarea");
            }
        }
    });
})(nx);
(function(nx) {
    /**
     * @class TableHeadCell
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.TableHeadCell", nx.ui.Element, {
        methods: {
            init: function() {
                this.inherited("th");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Input
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.TableCell", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("td");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Input
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.TableRow", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("tr");
            }
        },
        properties: {
            childDefaultType: {
                value: function () {
                    return nx.ui.tag.TableCell;
                }
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Input
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.Table", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("table");
            }
        },
        properties: {
            childDefaultType: {
                value: function () {
                    return nx.ui.tag.TableRow;
                }
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Span
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.Span", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("span");
            }
        }
    });
})(nx);
(function (nx) {

    var EXPORT = nx.define("nx.ui.tag.Canvas", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("canvas");
            }
        }
    });
})(nx);
(function (nx) {

    var EXPORT = nx.define("nx.ui.tag.Source", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("source");
            }
        }
    });
})(nx);
(function (nx) {

    var EXPORT = nx.define("nx.ui.tag.Audio", nx.ui.Element, {
        view: {
            content: {
                repeat: "sources",
                type: "nx.ui.tag.Source",
                attributes: {
                    src: nx.binding("scope.model.src"),
                    type: nx.binding("scope.model.type")
                }
            }
        },
        properties: {
            sources: {}
        },
        methods: {
            init: function () {
                this.inherited("audio");
            },
            play: function () {
                this.dom().play();
            },
            pause: function () {
                this.dom().pause();
            }
        }
    });
})(nx);
(function (nx) {

    var EXPORT = nx.define("nx.ui.tag.Video", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("video");
            },
	    play: function(){
		this.dom().play();
	    },
	    pause: function(){
		this.dom().pause();
	    }
	}
    });
})(nx);
(function (nx) {
    /**
     * @class HorizontalRule
     * @namespace nx.ui.tag
     */
    var EXPORT = nx.define("nx.ui.tag.HorizontalRule", nx.ui.Element, {
        methods: {
            init: function () {
                this.inherited("hr");
            }
        }
    });
})(nx);
(function(nx) {
    var EXPORT = nx.define("nx.lib.DefaultApplication", nx.ui.Element, {
        properties: {
            size: {
                watcher: function(pname, size) {
                    this.release("size");
                    if (size) {
                        this.retain("size", nx.ready(function() {
                            var fsize = this.getGlobalFontSizeByPageSize(size);
                            if (fsize) {
                                nx.util.cssstyle.set(document.documentElement, "font-size", fsize + "px");
                                this.setStyle("font-size", fsize + "px");
                            } else {
                                nx.util.cssstyle.remove(document.documentElement, "font-size");
                                this.removeStyle("font-size");
                            }
                        }.bind(this)));
                    }
                }
            }
        },
        methods: {
            init: function() {
                this.inherited("nx-app");
                this.retain(this.syncViewScale());
                if (!EXPORT.CSS_GLOBAL) {
                    EXPORT.CSS_GLOBAL = nx.util.csssheet.create({
                        "html": {
                            "height": "100%"
                        },
                        "body": {
                            "margin": "0",
                            "padding": "0",
                            "height": "100%",
                            "color": "#b3b3b3",
                            "font-family": "'Roboto'",
                            "user-select": "none"
                        }
                    });
                }
            },
            syncViewScale: function() {
                var self = this;
                var listener = function(evt) {
                    self.size({
                        width: global.innerWidth,
                        height: global.innerHeight
                    });
                };
                global.addEventListener("resize", listener);
                this.size({
                    width: global.innerWidth,
                    height: global.innerHeight
                });
                return {
                    release: function() {
                        global.removeEventListener("resize", listener);
                    }
                };
            },
            getGlobalFontSizeByPageSize: function(size) {
                return 0;
            }
        }
    });
})(nx);
(function(nx) {
    /**
     * @class Thread
     * @namespace nx.lib.thread
     */
    var EXPORT = nx.define("nx.lib.thread.Thread", {
        properties: {
            worker: null
        },
        methods: {
            init: function(src) {
                this.inherited();
                // TODO leak?
                var worker = this.worker(new Worker(src));
                worker.onmessage = function(evt) {
                    this.fire("message", evt.data);
                }.bind(this);
            },
            send: function(message) {
                this.worker().postMessage(message);
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Node
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.AbstractNode", nx.ui.Element, {
        properties: {
            childDefaultType: {
                value: function () {
                    return nx.lib.svg.Node;
                }
            },
            /**
             * @property graph
             * @type {nx.lib.svg.Svg}
             */
            graph: null,
            // Drawing properties
            /**
             * @property fill
             * @type {String/Number}
             */
            fill: {
                value: "inherit",
                watcher: function (pname, pvalue) {
                    if (pvalue && pvalue != "inherit") {
                        this.setStyle("fill", pvalue);
                    } else {
                        this.removeStyle("fill");
                    }
                }
            },
            /**
             * @property fillComputed
             * @type {Number}
             * @readOnly
             */
            fillComputed: {
                dependencies: "fill,parentNode.strokeComputed",
                value: function (v, pv) {
                    return (v && v != "inherit") ? v : (pv || "black");
                }
            },
            /**
             * @property stroke
             * @type {String/Number}
             */
            stroke: {
                value: "inherit",
                watcher: function (pname, pvalue) {
                    if (pvalue && pvalue != "inherit") {
                        this.setStyle("stroke", pvalue);
                    } else {
                        this.removeStyle("stroke");
                    }
                }
            },
            /**
             * @property strokeComputed
             * @type {Number}
             * @readOnly
             */
            strokeComputed: {
                dependencies: "stroke,parentNode.strokeComputed",
                value: function (v, pv) {
                    return (v && v != "inherit") ? v : (pv || "black");
                }
            },
            /**
             * @property strokeWidth
             * @type {String/Number}
             */
            strokeWidth: {
                value: "inherit",
                watcher: function (pname, pvalue) {
                    if (pvalue && pvalue != "inherit") {
                        this.setStyle("stroke-width", pvalue);
                    } else {
                        this.removeStyle("stroke-width");
                    }
                }
            },
            /**
             * @property strokeWidthComputed
             * @type {Number}
             * @readOnly
             */
            strokeWidthComputed: {
                dependencies: "strokeWidth,parentNode.strokeWidthComputed",
                value: function (v, pv) {
                    return (v >= 0) ? v : (pv || 0);
                }
            }
        },
        methods: {
            hierarchy: function () {
                var rslt = [this],
                    node = this.parentNode();
                while (node) {
                    rslt.unshift(node);
                    node = node.parentNode();
                }
                return rslt;
            }
        },
        statics: {
            cssTransformMatrix: function (matrix) {
                if (!matrix) {
                    // no transform for no matrix
                    return "";
                }
                var css = [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]].join(",").replace(/-?\d+e[+-]?\d+/g, "0");
                return "matrix(" + css + ")";
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class SvgDefs
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.SvgDefs", nx.lib.svg.AbstractNode, {
        methods: {
            init: function () {
                this.inherited("defs", "http://www.w3.org/2000/svg");
            }
        },
        properties: {
            /**
             * @property graph
             * @type {nx.lib.svg.Svg}
             */
            graph: {
                dependencies: "parentNode.graph"
            }
        }
    });
})(nx);
(function(nx) {
    /**
     * @class Canvas
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.Svg", nx.lib.svg.AbstractNode, {
        view: {
            content: {
                name: "defs",
                type: "nx.lib.svg.SvgDefs"
            }
        },
        properties: {
            /**
             * @property graph
             * @type {nx.lib.svg.Svg}
             */
            graph: {
                value: function() {
                    return this;
                }
            },
            /**
             * @property naturalTerminal
             * @type {Boolean}
             */
            naturalTerminal: {
                value: false
            }
        },
        methods: {
            init: function() {
                this.inherited("svg", "http://www.w3.org/2000/svg");
            },
            getWidth: function() {
                return this.$dom.offsetWidth;
            },
            getHeight: function() {
                return this.$dom.offsetHeight;
            },
            serialize: function(toDataUrl) {
                return EXPORT.serialize(this.dom(), toDataUrl);
            }
        },
        statics: {
            getSvgSize: function(svg) {
                var width = svg.getAttribute("width");
                var height = svg.getAttribute("height");
                var vb = svg.getAttribute("viewBox");
                if (width) {
                    width = width.replace(/[^-.0123456789]/g, "") * 1;
                }
                if (height) {
                    height = height.replace(/[^-.0123456789]/g, "") * 1;
                }
                if (vb) {
                    vb = vb.split(" ");
                    width = width || vb[2] * 1 || 0;
                    height = height || vb[3] * 1 || 0;
                }
                return {
                    width: width || 0,
                    height: height || 0
                };
            },
            serialize: function(dom, toDataUrl) {
                var serializer = new XMLSerializer();
                var serialized = serializer.serializeToString(dom);
                if (toDataUrl !== false) {
                    return "data:image/svg+xml;utf8," + serialized;
                } else {
                    return serialized;
                }
            }
        }
    });
    nx.util.csssheet.create({
        "svg": {
            "stroke": "black",
            "fill": "transparent"
        },
        "svg text": {
            "user-select": "none"
        }
    });
})(nx);
(function (nx) {
    var geometry = nx.geometry;
    /**
     * @class Node
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.Node", nx.lib.svg.AbstractNode, {
        mixins: [nx.geometry.MatrixSupport],
        properties: {
            /**
             * @property graph
             * @type {nx.lib.svg.Svg}
             */
            graph: {
                dependencies: "parentNode.graph"
            },
            /**
             * @property cssTransform
             * @type {String}
             * @readOnly
             */
            cssTransform: {
                dependencies: "matrix",
                value: function (matrix) {
                    if (matrix) {
                        return EXPORT.cssTransformMatrix(matrix);
                    }
                },
                watcher: function (pname, pvalue) {
                    if (pvalue) {
                        if (pvalue != "matrix(1,0,0,1,0,0)" || this.hasStyle("transform")) {
                            this.setStyle("transform", pvalue);
                        }
                    }
                }
            },
            naturalTerminal: {
                value: false
            },
            /**
             * @property naturalMatrix
             * @type {Number[3][3]}
             */
            naturalMatrix: {
                dependencies: "parentNode.naturalTerminal, parentNode.naturalMatrix, matrix",
                value: function (term, pm, m, cause) {
                    if (term && cause.indexOf("parentNode.") == 0) {
                        return;
                    }
                    if (pm && m) {
                        this.naturalMatrix(geometry.Matrix.multiply(m, pm));
                    } else if (m) {
                        this.naturalMatrix(m || pm || geometry.Matrix.I);
                    }
                }
            },
            /**
             * @property naturalMatrix_internal_
             * @type {Number[3][3]}
             */
            naturalMatrix_internal_: {
                dependencies: "naturalMatrix",
                value: function (m) {
                    return m && new geometry.Matrix(m);
                }
            },
            /**
             * @property naturalPosition
             * @type {Number[2]}
             * @readOnly
             */
            naturalPosition: {
                dependencies: "naturalMatrix",
                value: function (m) {
                    return (m && [m[2][0], m[2][1]]) || [0, 0];
                }
            },
            /**
             * @property naturalRotate
             * @type {Number}
             * @readOnly
             */
            naturalRotate: {
                dependencies: "naturalMatrix_internal_.rotate"
            },
            /**
             * @property naturalScale
             * @type {Number}
             * @readOnly
             */
            naturalScale: {
                dependencies: "naturalMatrix_internal_.scale"
            }
        },
        methods: {
            init: function (tag) {
                this.inherited(tag || "g", "http://www.w3.org/2000/svg");
            },
            applyNatureTranslate: function (x, y) {
                var parent = this.parentNode();
                var transmatrix = [
                    [1, 0, 0],
                    [0, 1, 0],
                    [x, y, 1]
                ];
                this.matrix(geometry.Matrix.multiply(this.naturalMatrix_internal_().getMatrixInversion(), transmatrix, this.naturalMatrix(), this.matrix()));
            }
        },
        statics: {
            cssTransformMatrix: function (matrix) {
                var css = [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]].join(",").replace(/-?\d+e[+-]?\d+/g, "0");
                return "matrix(" + css + ")";
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Use
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.Use", nx.lib.svg.Node, {
        properties: {
            href: {
                watcher: function (pname, pvalue) {
                    if (pvalue) {
                        this.setAttributeNS("http://www.w3.org/1999/xlink", "href", pvalue);
                    }
                }
            }
        },
        methods: {
            init: function (tag) {
                this.inherited(tag || "use", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Rectangle
     * @extends nx.lib.svg.shape.Path
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.shape.Text", nx.lib.svg.Node, {
        methods: {
            init: function () {
                this.inherited("text");
            }
        },
        view: {
            properties: {
                class: "text"
            }
        },
        properties: {
            text: {
                value: "",
                watcher: function (pname, pvalue) {
                    this.release("text");
                    this.retain("text", this.append(pvalue));
                }
            },
            textAnchor: {
                value: "middle",
                watcher: function (pname, pvalue) {
                    this.setAttribute("text-anchor", pvalue);
                }
            }
        },
        statics: {
            CSS: nx.util.csssheet.create({
                "svg text": {
                    "stroke": "none"
                }
            })
        }
    });
})(nx);
(function (nx) {

    // short cuts of functions

    /**
     * @class Path
     * @extends nx.lib.svg.Node
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.shape.Line", nx.lib.svg.Node, {
        view: {
            attributes: {
                x1: "0",
                y1: "0"
            }
        },
        properties: {
            /**
             * @property dx
             * @type {Number}
             */
            dx: {
                value: 0,
                watcher: function (pname, pvalue) {
                    if (!pvalue && pvalue !== 0) {
                        pvalue = "";
                    }
                    this.setAttribute("x2", pvalue);
                }
            },
            /**
             * @property dy
             * @type {Number}
             */
            dy: {
                value: 0,
                watcher: function (pname, pvalue) {
                    if (!pvalue && pvalue !== 0) {
                        pvalue = "";
                    }
                    this.setAttribute("y2", pvalue);
                }
            }
        },
        methods: {
            init: function () {
                this.inherited("line");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Rectangle
     * @extends nx.lib.svg.shape.Path
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.shape.Rectangle", nx.lib.svg.Node, {
        properties: {
            /**
             * @property center
             * @type {Boolean}
             */
            center: {
                value: false
            },
            /**
             * @property width
             * @type {Number}
             */
            width: {
                value: 0
            },
            /**
             * @property height
             * @type {Number}
             */
            height: {
                value: 0
            },
            /**
             * @property bound_internal_
             * @type {Number[4]}
             * @private
             */
            bound_internal_: {
                dependencies: "center, width, height",
                value: function (center, width, height) {
                    var x, y, w, h;
                    w = Math.abs(width);
                    h = Math.abs(height);
                    if (center) {
                        x = -w / 2;
                        y = -h / 2;
                    } else {
                        x = (width < 0 ? width : 0);
                        y = (height < 0 ? height : 0);
                    }
                    return [x, y, w, h];
                },
                watcher: function (pname, pvalue) {
                    if (pvalue) {
                        nx.each(["x", "y", "width", "height"], function (attr, idx) {
                            if (pvalue[idx]) {
                                this.setAttribute(attr, pvalue[idx]);
                            } else {
                                this.removeAttribute(attr);
                            }
                        }.bind(this));
                    }
                }
            },
            /**
             * @property rx
             * @type {Number}
             */
            rx: {
                value: 0,
                watcher: function (pname, pvalue) {
                    if (pvalue) {
                        this.setAttribute("rx", pvalue);
                    } else {
                        this.removeAttribute("rx");
                    }
                }
            },
            /**
             * @property ry
             * @type {Number}
             */
            ry: {
                value: 0,
                watcher: function (pname, pvalue) {
                    if (pvalue) {
                        this.setAttribute("ry", pvalue);
                    } else {
                        this.removeAttribute("ry");
                    }
                }
            }
        },
        methods: {
            init: function () {
                this.inherited("rect");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Circle
     * @extends nx.lib.svg.shape.Path
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.shape.Circle", nx.lib.svg.Node, {
        properties: {
            /**
             * @property center
             * @type {Boolean}
             */
            center: {
                value: true
            },
            /**
             * @property radius
             * @type {Number}
             */
            radius: {
                value: 10,
                watcher: function (pname, pvalue) {
                    this.setAttribute("r", pvalue || "0");
                }
            },
            centralize_internal_: {
                dependencies: "center, radius",
                async: true,
                value: function (property, center, radius) {
                    if (!center) {
                        this.setAttribute("cx", radius);
                        this.setAttribute("cy", radius);
                    } else {
                        this.setAttribute("cx", 0);
                        this.setAttribute("cy", 0);
                    }
                }
            }
        },
        methods: {
            init: function () {
                this.inherited("circle");
            }
        }
    });
})(nx);
(function (nx) {

    // short cuts of functions

    /**
     * @class Path
     * @extends nx.lib.svg.Node
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.shape.Path", nx.lib.svg.Node, {
        methods: {
            init: function () {
                this.inherited("path");
            }
        },
        properties: {
            vectors: {
                value: []
            },
            d: {
                dependencies: "vectors",
                value: function (vectors) {
                    if (vectors && vectors.length) {
                        var v0, v1, rslt = "M 0 0";
                        do {
                            v = vectors.shift();
                            rslt += " l " + v[0] + " " + v[1];
                        } while (vectors.length);
                        return rslt;
                    }
                    return this._d || "M 0 0";
                },
                watcher: function (pname, pvalue) {
                    this.setAttribute("d", pvalue);
                }
            }
        }
    });
})(nx);
(function (nx) {
    var EXPORT = nx.define("nx.lib.svg.shape.PathGroup", nx.lib.svg.Node, {
        view: {
            content: nx.template({
                source: "data",
                pattern: {
                    type: "nx.lib.svg.shape.Path",
                    properties: {
                        d: nx.binding("scope.model.d"),
                        fill: nx.binding("scope.model.fill"),
                        stroke: nx.binding("scope.model.stroke")
                    }
                }
            })
        },
        properties: {
            data: {}
        }
    });
})(nx);
(function (nx) {

    var Vector = nx.geometry.Vector;
    var multiply = Vector.multiply;
    var rotate = Vector.rotate;
    var length = Vector.abs;
    var plus = Vector.plus;
    var golden = Math.sqrt(5) / 2 - .5;

    /**
     * @class Rectangle
     * @extends nx.lib.svg.shape.Path
     * @namespace nx.lib.svg
     */
    var EXPORT = nx.define("nx.lib.svg.shape.PathLine", nx.lib.svg.shape.Path, {
        properties: {
            operationsUpdater_internal_: {
                dependencies: "dx, dy, dh",
                async: true,
                value: function (property, dx, dy, dh) {
                    if (!dh) {
                        this.vectors([
                            [dx, dy]
                        ]);
                    } else {
                        var v0 = [dx, dy],
                            vd = rotate(length([dx, dy], dh), Math.PI / 2),
                            pt = plus(multiply(v0, .5), vd);
                        var d = "M 0 0";
                        d += " " + ["C"].concat(plus(multiply(vd, golden), multiply(v0, 1 / 6))).concat(plus(vd, multiply(v0, 1 / 3))).concat(pt).join(" ");
                        d += " " + ["C"].concat(plus(vd, multiply(v0, 2 / 3))).concat(plus(multiply(vd, golden), multiply(v0, 5 / 6))).concat(v0).join(" ");
                        this.d(d);
                    }
                }
            },
            /**
             * @property dx
             * @type {Number}
             */
            dx: {
                value: 100
            },
            /**
             * @property dy
             * @type {Number}
             */
            dy: {
                value: 0
            },
            /**
             * @property dh
             * @type {Number}
             */
            dh: {
                value: 0
            }
        }
    });
})(nx);
(function (nx) {

    // short cuts of functions

    var geometry = nx.geometry;
    var Vector = geometry.Vector;
    var rotate = Vector.rotate;
    var length = Vector.abs;
    var multiply = Vector.multiply;
    var plus = Vector.plus;
    var vect = function (v, l, a) {
        v = multiply(v, l);
        if (a) {
            v = rotate(v, a);
        }
        return v;
    };

    var PI = Math.PI;
    var abs = Math.abs,
        sin = geometry.Math.sin,
        cos = geometry.Math.cos,
        tan = geometry.Math.tan,
        cot = geometry.Math.cot;
    var D90 = PI / 2;

    /**
     * @class Arrow
     * @extends nx.lib.svg.PathLine
     * @namespace nx.lib.svg.shape
     */
    var EXPORT = nx.define("nx.lib.svg.shape.Arrow", nx.lib.svg.shape.PathLine, {
        properties: {
            stroke: {
                watcher: function (pname, pvalue) {
                    if (pvalue && pvalue != "inherit") {
                        this.set("fill", pvalue);
                    }
                }
            },
            strokeWidth: {
                value: "inherit",
                watcher: nx.idle
            },
            fill: {
                watcher: nx.idle
            },
            operationsUpdater_internal_: {
                dependencies: "strokeWidthComputed,dx,dy,dh,sharpness,concavity",
                async: true,
                value: function (property, strokeWidthComputed, dx, dy, dh, sharpness, concavity) {
                    var vectors = [];
                    // update the sharpness and concavity
                    concavity = concavity || PI;
                    // add vectors
                    var v = [dx, dy],
                        i = length(v, 1);
                    // prepare data
                    var len = length(v),
                        width = strokeWidthComputed;
                    var a = sharpness / 2,
                        b = concavity / 2,
                        w = width / 2;
                    var len0 = len - w * (cot(a) * 2 - cot(b));
                    // make sure the sharpness is reasonable and the arrow head won't take too much place
                    if (sharpness > 0 && sharpness <= PI && (w * 4 / len < tan(a))) {
                        // start create vectors
                        vectors.push(vect(i, w, D90));
                        vectors.push(vect(i, len0));
                        vectors.push(vect(i, w / sin(b), PI - b));
                        vectors.push(vect(i, width / sin(a), -a));
                        vectors.push(vect(i, width / sin(a), PI + a));
                        vectors.push(vect(i, w / sin(b), b));
                        vectors.push(vect(i, -len0));
                        vectors.push(vect(i, w, D90));
                    } else {
                        vectors.push(vect(i, w, D90));
                        vectors.push([dx, dy]);
                        vectors.push(vect(i, w * 2, -D90));
                        vectors.push([-dx, -dy]);
                        vectors.push(vect(i, w, D90));
                    }
                    this.vectors(vectors);
                }
            },
            /**
             * @property sharpnessDeg
             * @type {Number}
             */
            sharpnessDeg: {
                value: 30
            },
            /**
             * @property sharpness
             * @type {Number}
             */
            sharpness: {
                dependencies: "sharpnessDeg",
                value: function (deg) {
                    if (deg) {
                        return deg * PI / 180;
                    }
                    return PI / 6;
                }
            },
            /**
             * @property concavityDeg
             * @type {Number}
             */
            concavityDeg: {
                value: 0
            },
            /**
             * @property concavity
             * @type {Number}
             */
            concavity: {
                dependencies: "concavityDeg",
                value: function (deg) {
                    if (deg) {
                        return deg * PI / 180;
                    }
                    return PI;
                }
            }
        },
        methods: {
            init: function (options) {
                this.inherited(options);
                this.set("stroke-width", 0);
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class Filter
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.Filter", nx.lib.svg.AbstractNode, {
        properties: {
            /**
             * @property graph
             * @type {nx.lib.svg.Svg}
             */
            graph: {
                dependencies: "parentNode.graph"
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeBlend
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeBlend", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feBlend", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeColorMatrix
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeColorMatrix", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feColorMatrix", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeComponentTransfer
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeComponentTransfer", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feComponentTransfer", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeComposite
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeComposite", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feComposite", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeConvolveMatrix
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeConvolveMatrix", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feConvolveMatrix", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeDiffuseLighting
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeDiffuseLighting", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feDiffuseLighting", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeDisplacementMap
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeDisplacementMap", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feDisplacementMap", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeDistantLight
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeDistantLight", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feDistantLight", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeFlood
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeFlood", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feFlood", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeGaussianBlur
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeGaussianBlur", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feGaussianBlur", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeImage
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeImage", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feImage", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeMerge
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeMerge", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feMerge", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeMorphology
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeMorphology", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feMorphology", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeOffset
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeOffset", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feOffset", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FePointLight
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FePointLight", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("fePointLight", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeSpecularLighting
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeSpecularLighting", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feSpecularLighting", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeSpotLight
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeSpotLight", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feSpotLight", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeTile
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeTile", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feTile", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FeTurbulence
     * @namespace nx.lib.svg.filter
     */
    var EXPORT = nx.define("nx.lib.svg.filter.FeTurbulence", nx.lib.svg.filter.Filter, {
        methods: {
            init: function () {
                this.inherited("feTurbulence", "http://www.w3.org/2000/svg");
            }
        }
    });
})(nx);
(function(nx) {
    var BOUND = 2;
    var DEFAULT_AXIS = "y";
    var EXPORT = nx.define("nx.lib.component.Scroller", nx.ui.Element, {
        view: {
            cssclass: "scroller",
            content: {
                name: "inner"
            },
            capture: {
                start: "handler_dragstart",
                drag: "handler_dragmove",
                dragend: "handler_dragend"
            },
            events: {
                axis: "option_axis"
            }
        },
        properties: {
            pageSize: 1, // not paging
            axis: DEFAULT_AXIS,
            elastic: 2000
        },
        methods: {
            init: function(options) {
                this.inherited();
                nx.sets(this, options);
                this._x = this._y = 0;
            },
            /**
             * Check if scroll is enabled on the given axis.
             */
            isScrollable: function(d) {
                var axis = this.axis() || DEFAULT_AXIS;
                if (arguments.length == 0) {
                    return axis == "x" || axis == "y";
                }
                return d == axis;
            },
            /**
             * Get the scroll limit on the given axis.
             */
            getLimit: function() {
                var axis = this.axis();
                var page, rslt = 0;
                rslt = Math.min(0, this._out[axis] - this._in[axis]);
                // extend the limit to fit paging
                page = this.pageSize();
                if (rslt && page > 1) {
                    rslt = Math.ceil(rslt / page) * page;
                }
                return rslt;
            },
            /**
             * Consider the inner content's current position, returning the real delta caused by the given mouse delta.
             */
            delta: function(delta) {
                if (!this.isScrollable()) {
                    return 0;
                }
                var axis = this.axis();
                var w = this.getLimit(axis);
                var x = this["_" + axis];
                if (x > 0) {
                    if (x * BOUND + delta > 0) {
                        return delta / BOUND;
                    } else if (x * 2 + delta < w) {
                        return (delta - w) / BOUND + w;
                    } else {
                        return x * BOUND + delta - x;
                    }
                } else if ((x - w) < 0) {
                    if ((x - w) * BOUND + delta < 0) {
                        return delta / BOUND;
                    } else if ((x - w) * BOUND + delta > -w) {
                        return (delta + w) / BOUND - w;
                    } else {
                        return delta - (BOUND - 1) * (w - x);
                    }
                } else {
                    if (x + delta > 0) {
                        return (delta - x) / 2;
                    } else if (x + delta < w) {
                        return (delta - x + w) / 2;
                    } else {
                        return delta;
                    }
                }
            },
            freemove: function(v) {
                if (!this.isScrollable()) {
                    return false;
                }
                var axis = this.axis();
                var self = this,
                    a, w, x0;
                var delta, time, bezier;
                var xt, v1, t1, t2, x, s;
                a = this.elastic();
                w = this.getLimit();
                x0 = this["_" + axis];
                if (x0 > 0 || x0 < w) {
                    // out of bound
                    delta = (x0 > 0 ? -x0 : w - x0);
                    time = Math.sqrt(Math.abs(delta * 2 / a / BOUND));
                    bezier = "(0.5, 1, 1, 1)";
                } else {
                    time = Math.abs(v / a);
                    delta = v * time / 2;
                    xt = x0 + delta;
                    if (xt <= 0 && xt >= w) {
                        bezier = "(0, 1, 1, 1)";
                    } else {
                        delta = (xt > 0 ? -x0 : w - x0);
                        v1 = (v >= 0 ? 1 : -1) * Math.sqrt(v * v - 2 * a * delta);
                        t1 = Math.abs((v - v1) / a);
                        t2 = Math.abs(v1 / BOUND / a);
                        time = t1 + t2 * 2;
                        x = v1 * t2 / 2;
                        s = delta + x * 2;
                        bezier = "(" + ((t1 + t2) / time) + "," + (s / delta) + "," + ((t1 + t2 * 1.5) / time) + ", 1)";
                    }
                }
                if (time > 1) {
                    time = 1;
                }
                this.animate(time, bezier);
                this["_" + axis] += delta;
                this.translate(this._x, this._y);
                setTimeout(function() {
                    var pg = self.pageSize() || 1;
                    var offset = self["_" + axis];
                    if (offset % pg) {
                        self["_" + axis] = Math.round(offset / pg) * pg;
                        self.animate(0.15, "(0.5, 1, 1, 1)");
                        self.translate(self._x, self._y);
                        setTimeout(function() {
                            self.animate(false);
                        }, 150);
                    } else {
                        self.animate(false);
                    }
                }, time * 1000 + 10);
            },
            option_axis: function() {
                this.reset();
            },
            /**
             * Refresh the current size of inner/outer panels.
             */
            update: function() {
                var inBound = this.inner().getBound();
                var outBound = this.getBound();
                this._in = {
                    x: inBound.width,
                    y: inBound.height
                };
                this._out = {
                    x: outBound.width,
                    y: outBound.height
                };
            },
            /**
             * Reset the scroll position.
             */
            reset: function() {
                this._x = 0;
                this._y = 0;
                this.translate(this._x, this._y);
            },
            fixbound: function() {
                this.update();
                this.freemove(0);
            },
            handler_dragstart: function(self, evt) {
                this.update();
                this.animate(false);
            },
            handler_dragmove: function(self, evt) {
                if (this.isScrollable()) {
                    // get delta
                    var axis = this.axis();
                    this["_" + axis] += this.delta(evt.capturedata.delta[axis == "x" ? 0 : 1]);
                    // do translation
                    this.translate(this._x, this._y);
                }
            },
            handler_dragend: function(self, evt) {
                if (this.isScrollable()) {
                    var v = EXPORT.getSpeed(evt.capturedata.track);
                    var axis = this.axis();
                    this.freemove(v[axis]);
                }
            },
            translate: function(x, y) {
                this.inner().setStyle("transform", "translate(" + x + "px, " + y + "px)");
                this.inner().setStyle("transform", "translate3d(" + x + "px, " + y + "px, 0)");
            },
            /**
             * The switch of animation, using Bezier curve timing function.
             */
            animate: function(seconds, bezier) {
                if (seconds === false) {
                    this.inner().removeStyle("transition-duration");
                    this.inner().removeStyle("transition-timing-function");
                } else {
                    var val = seconds + "s";
                    this.inner().setStyle({
                        "transition-duration": val,
                        "transition-timing-function": "cubic-bezier" + bezier
                    });
                }
            }
        },
        statics: {
            DEFAULT_AXIS: DEFAULT_AXIS,
            getSpeed: function(track) {
                // TODO better algorithm
                var v = {
                    x: (track[track.length - 1][0] - track[0][0]) * 1000 / Math.max(1, track[track.length - 1].time - track[0].time),
                    y: (track[track.length - 1][1] - track[0][1]) * 1000 / Math.max(1, track[track.length - 1].time - track[0].time)
                };
                if (Math.abs(track[track.length - 1][0] - track[0][0]) < 40) {
                    v.x = 0;
                } else if (Math.abs(v.x) < 1200) {
                    v.x = (v.x > 0 ? 1 : -1) * 1200;
                }
                if (Math.abs(track[track.length - 1][1] - track[0][1]) < 40) {
                    v.y = 0;
                } else if (Math.abs(v.y) < 1200) {
                    v.y = (v.y > 0 ? 1 : -1) * 1200;
                }
                if (track[track.length - 1].time - track[0].time > 300) {
                    v.x = v.y = 0;
                }
                return v;
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * @class FileLabel
     * @extends nx.ui.tag.Label
     */
    var EXPORT = nx.define("nx.lib.component.FileLabel", nx.ui.tag.Label, {
        view: {
            attributes: {
                "for": nx.binding("name"),
                class: ["nx-file-label", nx.binding("disabled", function (disabled) {
                    return disabled ? "disabled" : false;
                })]
            },
            content: [{
                name: "input",
                type: "nx.ui.tag.InputFile",
                attributes: {
                    id: nx.binding("name"),
                    name: nx.binding("name"),
                    accept: nx.binding("accept"),
                    disabled: nx.binding("disabled", function (disabled) {
                        return disabled ? "disabled" : false;
                    })
                },
                events: {
                    change: function () {
                        this.fire("change", this.input().dom());
                    }
                }
            }]
        },
        properties: {
            name: "",
            accept: "",
            disabled: false
        }
    });
})(nx);
(function (nx) {
    var EXPORT = nx.define("nx.lib.component.NormalInput", nx.ui.Element, {
        view: {
            attributes: {
                class: ["nx-normal-input"]
            },
            content: {
                name: "input",
                type: "nx.ui.tag.Input",
                attributes: {
                    value: nx.binding("value", true, function (setter, value) {
                        if (value !== this.input().value) {
                            this.input().value = value;
                        }
                    }),
                    id: nx.binding("id"),
                    name: nx.binding("name"),
                    placeholder: nx.binding("placeholder"),
                    type: nx.binding("password", function (password) {
                        return password ? "password" : "text";
                    })
                },
                events: {
                    input: function (sender, evt) {
                        // TODO better monitor
                        this.value(this.input().dom().value);
                        this.fire("input", evt);
                    }
                }
            }
        },
        properties: {
            id: null,
            value: null,
            name: null,
            placeholder: null,
            password: false
        },
        methods: {
            focus: function () {
                this.input().dom().focus();
            },
            blur: function () {
                this.input().dom().blur();
            }
        },
        statics: {
            CSS: nx.util.csssheet.create({
                ".nx-normal-input": {
                    "position": "relative",
                    "overflow": "hidden"
                },
                ".nx-normal-input > input": {
                    "position": "absolute",
                    "background": "transparent",
                    "left": "0",
                    "top": "0",
                    "width": "100%",
                    "height": "100%",
                    "outline": "none",
                    "border": "0",
                    "border-radius": "inherit",
                    "text-indent": "inherit",
                    "font-size": "inherit",
                    "font-weight": "inherit"
                }
            })
        }
    });
})(nx);
(function (nx, position, dom, ui, global) {
    var DETECTTIMER = 10;
    var CLASS = nx.define("nx.lib.component.CommonContenteditable", nx.ui.Component, {
        events: ["common_contenteditable_change", "common_contenteditable_caret", "common_contenteditable_keydown"],
        properties: {
            textHTML: {
                get: function () {
                    return this.dom().innerHTML;
                }
            },
            textPlain: {
                get: function () {
                    return CLASS.dom.plainate(this.dom()).text;
                },
                set: function (value) {
                    value = value || "";
                    var node;
                    while (this.dom().firstChild) {
                        this.dom().removeChild(this.dom().firstChild);
                    }
                    node = document.createTextNode(value);
                    this.dom().appendChild(node);
                    this.notify("textPlain");
                    // reset caret
                    this._caret = {
                        node: node,
                        text: value,
                        offset: value ? value.length : 0
                    };
                    // notify event
                    this.fire("common_contenteditable_change");
                }
            },
            caret: {
                get: function () {
                    if (!this._caret) {
                        this._caret = {
                            node: this.dom(),
                            text: "",
                            offset: 0
                        };
                    }
                    return this._caret;
                }
            },
            captureKeyCodeList: {
                value: []
            }
        },
        view: {
            properties: {
                spellcheck: "false",
                tabindex: 0,
                contenteditable: "true"
            },
            events: {
                input: "{#_handle_input}",
                keydown: "{#_handle_keydown}",
                keypress: "{#_handle_keypress}",
                focus: "{#_handle_focus_on}",
                blur: "{#_handle_focus_off}",
                mouseup: "{#_handle_mouseup}",
                click: "{#_handle_click}"
            }
        },
        methods: {
            empty: function () {
                this.inherited(arguments);
                // reset caret
                this._caret = null;
                // notify event
                this.fire("common_contenteditable_change");
            },
            displace: function (options) {
                var parent = this.dom();
                var caret = this._caret || {
                    node: parent,
                    text: "",
                    offset: 0
                };
                var text, textnode, node, area, value = options.value;
                if (caret.node === parent) { // caret on the root element
                    if (caret.offset == parent.childNodes.length) { // caret at the end of root element
                        if (typeof value == "string") {
                            textnode = document.createTextNode(value);
                            parent.appendChild(textnode);
                            this.collapse(textnode, value.length);
                        } else if (CLASS.is.element(value)) {
                            value.setAttribute("contenteditable", "false");
                            // add the element
                            parent.appendChild(value);
                            this.collapse(parent, offset + 1);
                        }
                    } else { // caret before a node
                        node = parent.childNodes[caret.offset];
                        if (typeof value == "string") {
                            textnode = document.createTextNode(value);
                            parent.insertBefore(textnode, node);
                            this.collapse(textnode, value.length);
                        } else if (CLASS.is.element(value)) {
                            value.setAttribute("contenteditable", "false");
                            // add the element
                            parent.insertBefore(value, node);
                            this.collapse(parent, offset + 1);
                        }
                    }
                } else if (CLASS.is.text(caret.node)) { // caret on text node
                    // initialize displace area
                    area = options.deltaArea ? options.deltaArea.slice() : [0, 0];
                    area[0] += caret.offset;
                    area[1] += caret.offset;
                    // displace
                    if (typeof value == "string") {
                        text = caret.text.substring(0, area[0]) + value + caret.text.substring(area[1]);
                        caret.node.textContent = text;
                        // collapse the focus
                        this.collapse(caret.node, area[0] + value.length);
                    } else if (CLASS.is.element(value)) {
                        value.setAttribute("contenteditable", "false");
                        // add the element
                        text = caret.text;
                        if (area[0] > 0) {
                            parent.insertBefore(document.createTextNode(text.substring(0, area[0])), node);
                        } else if (CLASS.is.element(node.previousSibling)) {
                            parent.insertBefore(textnode = document.createTextNode(" "), node);
                        }
                        parent.insertBefore(value, node);
                        if (area[1] < text.length) {
                            textnode = document.createTextNode(text.substring(area[1]));
                            parent.insertBefore(textnode, node);
                            parent.removeChild(node);
                            // collapse the focus
                            this.collapse(textnode, 0);
                        } else {
                            textnode = document.createTextNode("\u200D");
                            parent.insertBefore(textnode, node);
                            parent.removeChild(node);
                            // collapse the focus
                            this.collapse(textnode, 0);
                        }
                    }
                }
                // trigger event
                CLASS.dom.purify(this.dom());
                this.fire("common_contenteditable_change");
            },
            detector: function (on) {
                if (on) {
                    // set a timer to check the caret position
                    if (!this._timer_detector) {
                        this._timer_detector = setInterval(function () {
                            if (this._lock_detector) {
                                // the content currently is not detectable
                                return;
                            }
                            this.updateCaret();
                        }.bind(this), DETECTTIMER);
                    }
                } else {
                    // clear the timer
                    if (this._timer_detector) {
                        clearInterval(this._timer_detector);
                        this._timer_detector = false;
                    }
                }
            },
            collapse: function (node, index) {
                window.getSelection().collapse(node, index);
                this.updateCaret();
            },
            updateCaret: function () {
                (function () {
                    if (nx.Env.browser().name == "firefox") {
                        // FIXME firefox bug
                        var selection = window.getSelection();
                        var focusNode = selection.isCollapsed && selection.focusNode;
                        var focusOffset = selection.isCollapsed && selection.focusOffset;
                        if (CLASS.is.text(focusNode) && focusNode === this.dom().lastChild) {
                            if (focusOffset == focusNode.textContent.length) {
                                if (/\s$/.test(focusNode.textContent)) {
                                    window.getSelection().collapse(focusNode, focusOffset - 1);
                                } else {
                                    focusNode.textContent += " ";
                                    window.getSelection().collapse(focusNode, focusOffset);
                                }
                            }
                        }
                    }
                }).call(this);
                var selection = window.getSelection().getRangeAt(0);
                var focusNode = selection.startContainer;
                var plain = CLASS.dom.plainate(focusNode);
                var node = this._caret && this._caret.node;
                var text = this._caret && this._caret.text;
                var offset = this._caret && this._caret.offset;
                var range = this._caret && this._caret.range;
                if (node === focusNode && offset === plain.offset && text === plain.text && range === plain.range) {
                    return;
                }
                this._caret = {
                    node: focusNode,
                    text: plain.text,
                    offset: plain.offset,
                    range: plain.range
                };
                this.fire("common_contenteditable_caret", {
                    node: focusNode,
                    text: plain.text,
                    offset: plain.offset,
                    range: plain.range
                });
            },
            _handle_input: function () {
                this._lock_detector = true;
                // wrap in a timeout: the caret moved AFTER the event "input" processed
                setTimeout(function () {
                    // update
                    CLASS.dom.purify(this.dom());
                    // trigger event
                    this.updateCaret();
                    this.fire("common_contenteditable_change");
                    // release the lock, let the detection be available
                    this._lock_detector = false;
                }.bind(this), 5);
            },
            _handle_focus_on: function () {
                this.detector(true);
            },
            _handle_focus_off: function () {
                this.detector(false);
            },
            _handle_keypress: function (sender, edata) {
                edata.stopPropagation();
            },
            _handle_keydown: function (sender, evt) {
                var link, node;
                var i, captureKeyCodeList = this.captureKeyCodeList();
                for (i = 0; i < captureKeyCodeList.length; i++) {
                    if (evt.which == captureKeyCodeList[i]) {
                        this.fire("common_contenteditable_keydown", evt);
                        break;
                    } else if (evt.which == 13) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        break;
                    }
                }
            },
            _handle_mouseup: function (sender, evt) {
                if (evt.target.tagName == "A" && evt.target.parentNode === this.dom()) {
                    window.getSelection().collapse(this.dom(), CLASS.dom.index(evt.target) + 1);
                }
            },
            _handle_click: function (sender, evt) {
                if (evt.target.tagName == "A" && evt.target.parentNode === this.dom()) {
                    evt.preventDefault();
                }
            }
        },
        statics: {
            is: {
                contain: function (parent, child) {
                    while (child.parentNode && child.parentNode !== child) {
                        if (parent === child.parendNode) {
                            return true;
                        }
                        child = child.parentNode;
                    }
                    return false;
                },
                text: function (node) {
                    // FIXME
                    return !!node && !node.tagName;
                },
                element: function (node) {
                    // FIXME
                    return !!node && !!node.tagName;
                }
            },
            dom: {
                index: function (el) {
                    var i = 0;
                    while (el.previousSibling) {
                        i++;
                        el = el.previousSibling;
                    }
                    return i;
                },
                plainate: function (parent) {
                    var sobj = window.getSelection();
                    var robj = sobj.rangeCount ? sobj.getRangeAt(0) : {};
                    var plainate = function (parent) {
                        var text = "", offset = -1, range = -1;
                        if (CLASS.is.text(parent)) {
                            text = parent.textContent;
                            if (robj.startContainer === parent) {
                                offset = robj.startOffset;
                                if (robj.endContainer === parent) {
                                    range = robj.endOffset - robj.startOffset;
                                }
                            }
                        } else if (CLASS.is.element(parent)) {
                            var i, node, plain, len = parent.childNodes.length;
                            for (i = 0; i < len; i++) {
                                node = parent.childNodes[i];
                                plain = plainate(node);
                                if (offset >= 0) {
                                    text += plain.text;
                                } else {
                                    if (plain.offset >= 0) {
                                        offset = text.length + plain.offset;
                                        range = plain.range;
                                    }
                                    text += plain.text;
                                }
                            }
                            if (robj.startContainer === parent) {
                                offset = text.length;
                                range = 0;
                            }
                        }
                        return {
                            text: text,
                            offset: offset,
                            range: range
                        };
                    }
                    var plain = plainate(parent);
                    // clear "\u200D"
                    var index;
                    while ((index = plain.text.indexOf("\u200D")) >= 0) {
                        if (index < plain.offset) {
                            plain.offset--;
                        }
                        plain.text = plain.text.substring(0, index) + plain.text.substring(index + 1);
                    }
                    return plain;
                },
                purify: function (parent) {
                    function mergeText (text1, text2) {
                        var selection = window.getSelection();
                        var focusNode = selection.isCollapsed && selection.focusNode;
                        var focusOffset = selection.isCollapsed && selection.focusOffset;
                        var caret = (focusNode === text1 ? focusOffset : (focusNode === text2 ? text1.textContent.length + focusOffset : -1));
                        text1.textContent = text1.textContent + text2.textContent;
                        if (caret >= 0) {
                            selection.collapse(text1, caret);
                        }
                    }
                    var i, children = [], len, node, text, plain, textnode;
                    len = parent.childNodes.length;
                    // purify elements
                    for (i = len - 1; i >= 0; i--) {
                        node = parent.childNodes[i];
                        if (CLASS.is.text(node)) {
                            continue;
                        }
                        if (CLASS.is.element(node)) {
                            plain = CLASS.dom.plainate(node);
                            if (node.tagName.toUpperCase() == "A" && node.getAttribute("href") && node.getAttribute("contenteditable") == "false") {
                                continue;
                            }
                            if (plain.text) {
                                // plainate all element into text nodes
                                textnode = document.createTextNode(plain.text);
                                parent.insertBefore(textnode, node);
                                if (plain.offset >= 0) {
                                    window.getSelection().collapse(textnode, plain.offset);
                                }
                            }
                        }
                        parent.removeChild(node);
                    }
                    // merge text nodes
                    len = parent.childNodes.length;
                    for (i = len - 1; i >= 0; i--) {
                        node = parent.childNodes[i];
                        if (CLASS.is.text(node)) {
                            plain = CLASS.dom.plainate(node);
                            if (plain.text) {
                                if (node.textContent !== plain.text) {
                                    node.textContent = plain.text;
                                }
                                if (plain.offset >= 0) {
                                    window.getSelection().collapse(node, plain.offset);
                                }
                                if (CLASS.is.text(node.nextSibling)) {
                                    mergeText(node, node.nextSibling);
                                    parent.removeChild(node.nextSibling);
                                }
                            } else {
                                parent.removeChild(node);
                                if (plain.offset >= 0) {
                                    window.getSelection().collapse(parent, i);
                                }
                            }
                        }
                    }
                    // give a default value
                    if (nx.Env.browser().name == "chrome") {
                        // fix chrome bug
                        var selection = window.getSelection();
                        var focusNode = selection.isCollapsed && selection.focusNode;
                        var focusOffset = selection.isCollapsed && selection.focusOffset;
                        if (focusNode === parent && CLASS.is.element(parent.lastChild) && focusOffset == parent.childNodes.length) {
                            node = document.createTextNode("\u200D");
                            parent.appendChild(node);
                            window.getSelection().collapse(parent, focusOffset);
                        }
                    } else if (nx.Env.browser().name == "firefox") {
                        node = document.createTextNode("\u200D");
                        parent.appendChild(node);
                    }
                }
            }
        }
    });
})(nx, nx.position, nx.dom, nx.ui, window);
(function (nx, position, dom, ui, global) {
    var CLASS = nx.define("nx.lib.component.AutoComplete", nx.ui.Element, {
        view: {
            attributes: {
                class: "position-parent"
            },
            content: [{
                name: "input",
                type: "nx.lib.component.CommonContenteditable",
                attributes: {
                    class: "input form-control",
                    tabindex: nx.binding("tabindex"),
                    contenteditable: nx.binding("contenteditable")
                },
                events: {
                    common_contenteditable_caret: "_handle_input_caret",
                    common_contenteditable_keydown: "_handle_input_keydown",
                    common_contenteditable_change: "_handle_input_change"
                }
            }, {
                name: "list",
                attributes: {
                    tabindex: 0,
                    class: ["list", nx.binding("listVisibilityClass_internal_")],
                    style: {
                        position: "absolute"
                    }
                },
                content: nx.binding("listItemTemplate", function (listItemTemplate) {
                    if (listItemTemplate) {
                        return nx.template({
                            source: "listData",
                            pattern: listItemTemplate
                        });
                    }
                })
            }]
        },
        properties: {
            value: {
                get: function () {
                    return this.input().textPlain();
                },
                set: function (value) {
                    this.input().textPlain(value);
                    this.notify("value");
                }
            },
            contenteditable: {
                value: true
            },
            tabindex: {
                value: -1
            },
            promptMode: {
                // caret, input, select
                value: "input"
            },
            inputCaret_internal_: {
                value: null
            },
            inputCaretReplaceInfo_internal_: {
                value: nx.binding({
                    context: true,
                    source: "promptMode, inputCaret_internal_",
                    callback: function (promptMode, inputCaret_internal_) {
                        if (!inputCaret_internal_ || inputCaret_internal_.offset < 0 || typeof inputCaret_internal_.text !== "string") {
                            return null;
                        }
                        var text = inputCaret_internal_.text,
                            offset = inputCaret_internal_.offset,
                            range = inputCaret_internal_.range;
                        if (range < 0 || range + offset > text.length) {
                            range = text.length - offset;
                        }
                        var target = null,
                            keyword;
                        var text0 = text.substring(0, offset);
                        var text1 = text.substring(offset, offset + range);
                        var text2 = text.substring(offset + range);
                        switch (promptMode) {
                        case "select":
                            target = {
                                keyword: text0,
                                deltaStart: -text0.length,
                                deltaEnd: text.length - text0.length
                            };
                            break;
                        case "caret":
                        case "input":
                        default:
                            if (!text2 || /^\s/.test(text2)) {
                                if (/^(.*\s)?([^\s]+)$/.test(text0)) {
                                    keyword = text0.replace(/^(.*\s)?([^\s]*)$/, "$2");
                                    target = {
                                        keyword: keyword,
                                        deltaStart: -keyword.length,
                                        deltaEnd: range
                                    };
                                }
                            }
                            break;
                        }
                        return target;
                    }
                })
            },
            inputFocus: {
                value: false
            },
            inputCaptureKeyCodeList_internal_: {
                value: [],
                value: nx.binding({
                    context: true,
                    source: "listVisibility_internal_",
                    callback: function (listVisibility_internal_) {
                        return listVisibility_internal_ ? CLASS.captureKeyCodeList : [];
                    }
                }),
                watcher: function () {
                    this.input().captureKeyCodeList(this.inputCaptureKeyCodeList_internal_());
                }
            },
            listData: {
                value: [],
                watcher: function () {
                    var list = this.list();
                    setTimeout(function () {
                        nxex.toolkit.collectionItemHandle(list.content(), function (collection, child) {
                            child.dom().addClass("item");
                            var handleMouseEnter, handleMouseLeave, handleClick;
                            handleMouseEnter = function () {
                                this.listItemActivated(child);
                            }.bind(this);
                            handleMouseLeave = function () {
                                this.listItemActivated(null);
                            }.bind(this);
                            handleClick = function () {
                                this._executeSelection(child.template().model());
                            }.bind(this);
                            child.on("mouseenter", handleMouseEnter);
                            child.on("mouseleave", handleMouseLeave);
                            child.on("click", handleClick);
                            return {
                                release: function () {
                                    child.off("mouseenter", handleMouseEnter);
                                    child.off("mouseleave", handleMouseLeave);
                                    child.off("click", handleClick);
                                }
                            };
                        }.bind(this)).notify();
                    }.bind(this), 1);
                }
            },
            listDataKeyPath: {
                value: ""
            },
            listDataFilter: {
                value: null
            },
            listDataSelector_internal_: {
                value: null,
                value: nx.binding({
                    context: true,
                    source: "listDataKeyPath,listDataFilter",
                    callback: function (listDataKeyPath, listDataFilter) {
                        if (listDataFilter) {
                            return listDataFilter;
                        }
                        return CLASS.selectorByPath(listDataKeyPath);
                    }
                })
            },
            listItemCountLimit: {
                value: 0
            },
            listDataSelected_internal_: {
                value: [],
                value: nx.binding({
                    context: true,
                    source: "inputCaretReplaceInfo_internal_,listData,listDataSelector_internal_,listItemCountLimit",
                    callback: function (inputCaretReplaceInfo_internal_, listData, listDataSelector_internal_, listItemCountLimit) {
                        if (!listDataSelector_internal_) {
                            return [];
                        }
                        var selected = listDataSelector_internal_.call(this, inputCaretReplaceInfo_internal_, listData);
                        if (selected && selected.length > 0 && listItemCountLimit > 0) {
                            selected = selected.slice(0, listItemCountLimit);
                        }
                        return selected;
                    }
                }),
                watcher: function () {
                    var list = this.list();
                    var selected = this.listDataSelected_internal_();
                    if (selected && selected.length) {
                        nx.each(list.content(), function (child) {
                            var i;
                            for (i = 0; i < selected.length; i++) {
                                if (child.template().model() === selected[i]) {
                                    break;
                                }
                            }
                            child.dom().setClass("hidden", i >= selected.length);
                        }.bind(this));
                    }
                }
            },
            listItemActivated: {
                value: -1,
                get: function () {
                    var i, child, children = this.list().content().toArray();
                    for (i = 0; i < children.length; i++) {
                        child = children[i];
                        if (child.dom().hasClass("active")) {
                            return child;
                        }
                    }
                    return null;
                },
                set: function (value) {
                    var i, child, children = this.list().content().toArray();
                    for (i = 0; i < children.length; i++) {
                        child = children[i];
                        if (value === child && !child.dom().hasClass("hidden")) {
                            child.dom().addClass("active");
                        } else {
                            child.dom().removeClass("active");
                        }
                    }
                },
                value: nx.binding({
                    context: true,
                    source: "listDataSelected_internal_",
                    callback: function (listDataSelected_internal_) {
                        // clear the activation if the item is hidden
                        var listItemActivated = this.listItemActivated();
                        if (!listItemActivated || !listItemActivated.dom().hasClass("hidden")) {
                            return null;
                        }
                        return listItemActivated;
                    }
                }),
                watcher: function (pname, pvalue) {
                    if (pvalue) {
                        this._scrollTo(pvalue);
                    }
                }
            },
            listVisibility_internal_: {
                value: true,
                value: nx.binding({
                    context: true,
                    source: "inputFocus,listDataSelected_internal_",
                    callback: function (inputFocus, listDataSelected_internal_) {
                        if (listDataSelected_internal_ && listDataSelected_internal_.length) {
                            if (inputFocus) {
                                return true;
                            }
                        }
                        return false;
                    }
                }),
                watcher: function () {
                    var promptMode = this.promptMode();
                    CLASS.adjustListPosition(promptMode, this, this.list());
                }
            },
            listVisibilityClass_internal_: {
                value: nx.binding("listVisibility_internal_", function (b) {
                    return b ? "" : "hidden";
                })
            },
            listItemTemplate: {
                value: {
                    content: nx.binding("model")
                }
            },
            listDataSelectedItem: {
                value: null,
                value: nx.binding({
                    context: true,
                    source: "promptMode, listData, inputCaretReplaceInfo_internal_, listDataKeyPath",
                    callback: function (promptMode, listData, inputCaretReplaceInfo_internal_, listDataKeyPath) {
                        var result = this.listDataSelectedItem(),
                            value = this.value();
                        if (listData && inputCaretReplaceInfo_internal_) {
                            switch (promptMode) {
                            case "select":
                                var i, item, text, matches = [];
                                for (i = 0; listData && i < listData.length; i++) {
                                    item = listData[i];
                                    text = nx.path(item, listDataKeyPath);
                                    if ((text || "").toLowerCase() === (value || "").toLowerCase()) {
                                        matches.push(item);
                                    }
                                }
                                if (matches.length == 1) {
                                    result = matches[0];
                                } else {
                                    result = null;
                                }
                                break;
                            default:
                                break;
                            }
                        }
                        return result;
                    }
                }),
                watcher: function () {
                    this.fire("execute_selection", this.listDataSelectedItem());
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
                // handler the focus
                this.focusGroup = new nxex.common.FocusGroup();
                this.focusGroup.add(this.input());
                this.focusGroup.add(this.list());
                this.focusGroup.on("focus", this._handle_group_focus, this);
                this.focusGroup.on("blur", this._handle_group_blur, this);
            },
            clear: function () {
                this.input().empty();
                this.fire("execute_change");
            },
            _scrollTo: function (item) {
                var idx = this._getListItemIndex(item);
                var list = this.list();
                var ei = item.dom(),
                    el = list.dom();
                var bi = item.dom().getBound(),
                    bl = list.dom().getBound();
                var hi = ei.offsetHeight,
                    ti = bi.top,
                    hl = el.clientHeight,
                    tl = bl.top,
                    sl = el.scrollTop;
                if (ti + hi > tl + hl) {
                    el.scrollTop += (ti + hi) - (tl + hl);
                }
                if (ti < tl) {
                    el.scrollTop -= tl - ti;
                }
            },
            _executeSelection: function (model) {
                var info = this.inputCaretReplaceInfo_internal_();
                if (info) {
                    var path = this.listDataKeyPath();
                    var text = nx.path(model, path);
                    this.input().displace({
                        deltaArea: [info.deltaStart, info.deltaEnd],
                        value: text
                    });
                    this.listDataSelectedItem(model);
                }
            },
            _getListItemIndex: function (item) {
                var i, child, children = this.list().content().toArray();
                for (i = 0; i < children.length; i++) {
                    child = children[i];
                    if (child === item) {
                        return i;
                    }
                }
                return -1;
            },
            _getListItemRelative: function (item, relation) {
                var result = null;
                var i, children = this.list().content().toArray();
                switch (relation) {
                case "previous-visible":
                    i = this._getListItemIndex(item);
                    while (--i >= 0) {
                        if (!children[i].dom().hasClass("hidden")) {
                            result = children[i];
                            break;
                        }
                    }
                    break;
                case "next-visible":
                    i = this._getListItemIndex(item);
                    while (++i < children.length) {
                        if (!children[i].dom().hasClass("hidden")) {
                            result = children[i];
                            break;
                        }
                    }
                    break;
                case "first":
                case "last":
                case "first-visible":
                case "last-visible":
                case "previous":
                case "next":
                default:
                    // TODO
                    break;
                }
                return result;
            },
            _handle_focus: function () {
                this.input().dom().focus();
            },
            _handle_group_focus: function () {
                this.inputFocus(true);
                this.fire("focus");
            },
            _handle_group_blur: function () {
                this.inputFocus(false);
                this.fire("blur");
            },
            _handle_input_caret: function () {
                this.inputCaret_internal_(this.input().caret());
            },
            _handle_input_change: function () {
                this.inputCaret_internal_(this.input().caret());
                this.fire("execute_change");
            },
            _handle_input_keydown: function (sender, evt) {
                var i, item, items, idx;
                switch (evt.which) {
                case 13:
                    // ENTER
                    if (this.listVisibility_internal_()) {
                        evt.preventDefault();
                        item = this.listItemActivated();
                        if (!item) {
                            item = this._getListItemRelative(item, "next-visible");
                        }
                        if (item && item.model()) {
                            this._executeSelection(item.model());
                        }
                    }
                    break;
                case 38:
                    // UP
                    if (this.listVisibility_internal_()) {
                        evt.preventDefault();
                        item = this.listItemActivated();
                        item = this._getListItemRelative(item, "previous-visible");
                        if (item) {
                            this.listItemActivated(item);
                        }
                    }
                    break;
                case 40:
                    // DOWN
                    if (this.listVisibility_internal_()) {
                        evt.preventDefault();
                        item = this.listItemActivated();
                        item = this._getListItemRelative(item, "next-visible");
                        if (item) {
                            this.listItemActivated(item);
                        }
                    }
                    break;
                }
            }
        },
        statics: {
            captureKeyCodeList: [13, 38, 40],
            caretRect: function () {
                var selection = window.getSelection(),
                    rect;
                if (selection.rangeCount) {
                    rect = selection.getRangeAt(0).getClientRects()[0];
                }
                if (rect) {
                    rect = {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height
                    };
                }
                return rect;
            },
            adjustListPosition: function (mode, input, list) {
                var parent = input.dom().offsetParent;
                if (!parent) {
                    return;
                }
                var rect, prect = parent.getBoundingClientRect();
                var pleft = parent.scrollLeft,
                    ptop = parent.scrollTop;
                switch (mode) {
                case "caret":
                    var rect = CLASS.caretRect();
                    rect.top += ptop - prect.top;
                    rect.left += pleft - prect.left;
                    // set the list position
                    // FIXME to the document's bound, the list position should be fixed
                    list.dom().setStyle("left", rect.left);
                    list.dom().setStyle("top", rect.top + rect.height);
                    break;
                case "input":
                case "select":
                default:
                    // get the correct rect
                    var rect = input.dom().getBound();
                    rect.top += ptop - prect.top;
                    rect.left += pleft - prect.left;
                    // set the list position
                    // FIXME to the document's bound, the list position should be fixed
                    list.dom().setStyle("left", rect.left);
                    list.dom().setStyle("top", rect.top + rect.height);
                    list.dom().setStyle("width", rect.width);
                    break;
                }
            },
            selectorByPath: function (path) {
                function getKeys(data) {
                    var i, item, keys = [];
                    for (i = 0; i < data.length; i++) {
                        item = data[i];
                        keys.push(nx.path(item, path));
                    }
                    return keys;
                }

                function match(keyword, key) {
                    return key && key.toLowerCase().replace(/\s/g, "").indexOf(keyword.toLowerCase().replace(/\s/g, "")) == 0 && key.length > keyword.length;
                }
                return function (replaceInfo, data) {
                    var i, keys, rslt = [];
                    if (replaceInfo) {
                        keys = getKeys(data);
                        keyword = replaceInfo.keyword;
                        for (i = 0; i < data.length; i++) {
                            if (match(keyword, keys[i])) {
                                rslt.push(data[i]);
                            }
                        }
                    }
                    return rslt;
                };
            }
        }
    });
})(nx, nx.position, nx.dom, nx.ui, window);
(function (nx) {
    var EXPORT = nx.define("nx.lib.component.CentralizedImage", nx.ui.Element, {
        view: {
            attributes: {
                class: ["nx-centralized-image"]
            },
            content: {
                name: "image",
                type: "nx.ui.tag.Image",
                attributes: {
                    src: nx.binding("src")
                },
                events: {
                    load: function () {
                        var image = this.image();
                        var dom = image.dom();
                        image.toggleClass("size-height", dom.height > dom.width);
                        image.toggleClass("size-width", dom.width >= dom.height);
                        this.fire("ready");
                    }
                }
            }
        },
        properties: {
            src: {}
        },
        statics: {
            CSS: nx.util.csssheet.create({
                ".nx-centralized-image": {
                    "position": "relative",
                    "overflow": "hidden"
                },
                ".nx-centralized-image > img": {
                    "position": "absolute",
                    "left": "0px",
                    "top": "0px",
                    "right": "0px",
                    "bottom": "0px",
                    "margin": "auto"
                },
                ".nx-centralized-image > img.size-height": {
                    "width": "100%"
                },
                ".nx-centralized-image > img.size-width": {
                    "height": "100%"
                }
            })
        }
    });
})(nx);
(function (nx) {
    var Matrix = nx.geometry.Matrix;
    var cssstyle = nx.util.cssstyle;
    var EXPORT = nx.define("nx.lib.component.SvgIcon", nx.ui.Element, {
        view: {
            cssclass: "nx-comp svg-icon",
            content: {
                type: "nx.ui.tag.Image",
                attributes: {
                    src: "{imgsrc}"
                }
            }
        },
        properties: {
            src: "",
            bgsrc: "",
            key: "",
            resize: null,
            fill: null,
            svg: {
                dependencies: "src",
                async: true,
                value: function (property, src) {
                    this.release("svg");
                    src && this.retain("svg", EXPORT.loadSvg(src, function (svg) {
                        property.set(svg);
                    }));
                }
            },
            bgsvg: {
                dependencies: "bgsrc",
                async: true,
                value: function (property, src) {
                    this.release("bgsvg");
                    src && this.retain("bgsvg", EXPORT.loadSvg(src, function (svg) {
                        property.set(svg);
                    }));
                }
            },
            imgsrc: {
                dependencies: "svg,bgsvg,key,resize,fill",
                value: function (svg, bgsvg, key, resize, fill) {
                    if (!svg) {
                        return "//:0";
                    }
                    if (!key) {
                        return nx.lib.svg.Svg.serialize(bgsvg || svg) || "//:0";
                    } else {
                        var dom = svg.querySelector("#" + key);
                        if (!dom) {
                            return "//:0";
                        }
                        var tmp, size, width, height, matrix;
                        size = EXPORT.getSvgSize(svg);
                        if (bgsvg) {
                            bgsvg = bgsvg.cloneNode(true);
                            resize = EXPORT.getSvgSize(bgsvg);
                        } else {
                            // create an SVG
                            bgsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            if (resize) {
                                bgsvg.setAttribute("width", resize.width + "px");
                                bgsvg.setAttribute("height", resize.height + "px");
                            } else {
                                bgsvg.setAttribute("width", size.width + "px");
                                bgsvg.setAttribute("height", size.height + "px");
                            }
                        }
                        // clone the target dom
                        dom = dom.cloneNode(true);
                        dom.removeAttribute("id");
                        EXPORT.cleanStyle(dom);
                        // check if resizing
                        if (resize && resize.width && resize.height) {
                            width = size.width, height = size.height;
                            if (width && height) {
                                scale = Math.min(resize.width / width, resize.height / height);
                                matrix = Array([scale, 0, 0], [0, scale, 0], [0, 0, 1]);
                                // wrap dom
                                tmp = document.createElementNS("http://www.w3.org/2000/svg", "g");
                                tmp.appendChild(dom);
                                dom = tmp;
                                cssstyle.set(dom, "transform", nx.util.cssstyle.toCssTransformMatrix(matrix));
                            }
                        }
                        // append to svg
                        cssstyle.set(dom, "fill", fill);
                        bgsvg.appendChild(dom);
                        // create image source
                        return nx.lib.svg.Svg.serialize(bgsvg);
                    }
                }
            }
        },
        statics: {
            cleanStyle: function (dom) {
                if (dom instanceof Element) {
                    dom.removeAttribute("class");
                    dom.removeAttribute("style");
                    var i, n = dom.childNodes.length;
                    for (i = 0; i < n; i++) {
                        EXPORT.cleanStyle(dom.childNodes[i]);
                    }
                }
            },
            loadSvg: function (url, callback) {
                return nx.util.ajax({
                    url: url,
                    success: function (resources, svg) {
                        if (typeof svg === "string") {
                            var temp = document.createElement("div");
                            temp.innerHTML = svg;
                            svg = temp.querySelector("svg");
                        } else if (!svg.tagName || svg.tagName.toLowerCase() !== "svg") {
                            svg = svg.querySelector("svg");
                        }
                        callback(svg);
                    }
                });
            },
            getSvgSize: function (svg) {
                var width = svg.getAttribute("width");
                var height = svg.getAttribute("height");
                var vb = svg.getAttribute("viewBox");
                if (width) {
                    width = width.replace(/[^-.0123456789]/g, "") * 1;
                }
                if (height) {
                    height = height.replace(/[^-.0123456789]/g, "") * 1;
                }
                if (vb) {
                    vb = vb.split(" ");
                    width = width || vb[2] * 1 || 0;
                    height = width || vb[3] * 1 || 0;
                }
                return {
                    width: width || 0,
                    height: height || 0
                };
            },
            CSS: nx.util.csssheet.create({
                ".nx-comp.svg-icon": {
                    "position": "relative"
                },
                ".nx-comp.svg-icon > img": {
                    "width": "100%",
                    "height": "100%",
                    "outline": "none",
                    "border": "0"
                },
                ".nx-comp.svg-icon:after": {
                    "content": " ",
                    "position": "absolute",
                    "background": "transparent",
                    "left": "0",
                    "top": "0",
                    "width": "100%",
                    "height": "100%"
                }
            })
        }
    });
})(nx);
(function (nx, global) {

    /**
     * Supplies some util functions for Graph.
     *
     * @class Util
     * @namespace nx.topology.common
     * @static
     */
    var EXPORT = nx.define('nx.topology.common.Util', {
        statics: {
            /**
             * Create filter function to test if the item is already in the given map.
             *
             * @method getIdFilter
             * @param map The map to check ID conflict.
             * @return {function&lt;value&gt;}
             *  The filter function.
             */
            getIdFilter: function (map) {
                return function (value) {
                    var id = nx.path(value, "id");
                    var exist = map.get(id);
                    return !exist || exist === value;
                };
            },
            /**
             * Create filter function which will test value's type.
             *
             * @method getTypeFilter
             * @param type The expected type of value.
             * @return {function&lt;value&gt;}
             *  The filter function.
             */
            getTypeFilter: function (type) {
                return function (value) {
                    return nx.is(value, type);
                };
            },
            /**
             * This util method in order to resolve this problem:<br/>
             * Consider we attempt have a target X, with property P.
             * <ul>
             * <li>
             * When X.P is false or null or undefined etc.,
             * <ul><li>It's necessary to monitor a list with monitor MF;</li></ul>
             * </li>
             * <li>
             * When X.P is true,
             * <ul><li>It's necessary to monitor a list with monitor MT;</li></ul>
             * </li>
             * </ul>
             * So let's resolve this problem with syntax:<br/>
             * <pre>
             * monitorOnCondition(list, {
             *     target: X
             *     property: P,
             *     monitorByTrue: MT,
             *     monitorByFalse: MF
             * });
             * </pre>
             *
             * @method monitorOnCondition
             * @param list The list to be monitored.
             * @param condition
             * @return nx.topology.common.Edge
             */
            monitorOnCondition: function (list, cond) {
                if (!cond.target || !cond.property || !cond.monitorByTrue && !cond.monitorByFalse) {
                    return;
                }
                return cond.target.watch(cond.property, function (pn, pv) {
                    var w = pv ? cond.monitorByTrue : cond.monitorByFalse;
                    return w && list.monitorContaining(w);
                });
            },
            /**
             * This util returns a monitor function of List, which is used to synchronize item existance between 2 lists.
             *
             * @method getListSyncMonitor
             * @param list The target list to be synchronized.
             * @param sync
             *  <ul>
             *  <li>If true, make sure target list will have all items as source list has;</li>
             *  <li>If false, make sure target list will not have any item as source list has.</li>
             *  </ul>
             *  Default true.
             * @return {function&lt;item&gt;}
             *  The monitor function.
             */
            getListSyncMonitor: function (list, sync) {
                if (sync !== false) {
                    return function (item) {
                        list.push(item);
                        return function () {
                            list.remove(item);
                        };
                    };
                } else {
                    return function (item) {
                        list.remove(item);
                        return function () {
                            list.push(item);
                        };
                    };
                }
            },
            /**
             * This util returns a monitor function of List, which is used to synchronize a map of item and its id with a list.
             *
             * @method getIdMappingMonitor
             * @param map The target map
             * @return {function&lt;item&gt;}
             *  The monitor function.
             */
            getIdMappingMonitor: function (map) {
                return function (item) {
                    map.set(item.id(), item);
                    return function () {
                        map.remove(item.id());
                    };
                };
            },
            /**
             * This util get a value-array in a map with an id-array.
             *
             * @method getValuesByIds
             * @param map The target map
             * @param ids The id array
             * @return {Array}
             *  The values.
             */
            getValuesByIds: function (map, ids) {
                var value, values = [];
                var i, id, len = ids ? ids.length : 0;
                for (i = 0; i < len; i++) {
                    id = ids[i];
                    value = map.get(id);
                    if (value) {
                        values.push(value);
                    } else {
                        return null;
                    }
                }
                return values;
            },
            createMapping: function (inList, inOptions) {
                var sourcePaths = inOptions.sources,
                    targetPaths = inOptions.targets;
                //support ',' separator:
                sourcePaths = typeof sourcePaths === 'string' ? sourcePaths.split(',') : sourcePaths;
                targetPaths = typeof targetPaths === 'string' ? targetPaths.split(',') : targetPaths;
                var unchanged = function (inValue) {
                    return [inValue];
                };
                //monitor release
                return inList.monitorContaining(function (item) {
                    var srcValues = sourcePaths.map(function (path) {
                        return nx.path(item.originalData(), path.trim());
                    });
                    if (inOptions.input) {
                        var tarValues = inOptions.input.apply(item, srcValues);
                        nx.each(targetPaths, function (path, index) {
                            nx.path(item, path.trim(), tarValues[index]);
                        });
                    }
                    if (inOptions.output) {
                        var resource = nx.Object.cascade(item, targetPaths, function () {
                            srcValues = inOptions.output.apply(item, arguments);
                            //console.log(srcValues);
                            nx.each(sourcePaths, function (path, index) {
                                nx.path(item.originalData(), path.trim(), srcValues[index]);
                            });
                        });
                    }
                    return function () {
                        resource && resource.release();
                    };
                });
            },
            buildDirectMappings: function () {
                var mappings = [];
                var unchanged = function (inValue) {
                    return [inValue];
                };
                nx.each(arguments, function (arg) {
                    mappings.push({
                        sources: arg,
                        targets: arg,
                        input: unchanged,
                        output: unchanged
                    });
                });
                return mappings;
            },
            buildDirectMapping: function () {
                var unchanged = function (inValue) {
                    return [inValue];
                };
                return {
                    sources: arguments[0],
                    targets: arguments[1],
                    input: unchanged,
                    output: unchanged
                };
            }
        }
    });

}(nx, nx.global));
(function (nx, global) {

    /**
     * @class Filter
     * @extends nx.UniqueList
     * @namespace nx.topology.common
     * @protected
     */
    nx.define('nx.topology.common.FilterList', nx.UniqueList, {
        methods: {
            match: function (value) {
                var match = true;
                this.each(function (filter) {
                    if (typeof filter === "function") {
                        if (!filter(value)) {
                            match = false;
                            return false;
                        }
                    }
                });
                return match;
            }
        }
    });

}(nx, nx.global));
(function (nx, global) {

    /**
     * @class FilterUniqueList
     * @extends nx.UniqueList
     * @namespace nx.topology.common
     * @protected
     */
    nx.define('nx.topology.common.FilterUniqueList', nx.UniqueList, {
        properties: {
            /**
             * Make sure each item equal user's expectation.
             *
             * @type Function<Boolean>
             * @property filters
             */
            filters: {
                set: function () {
                    throw new Error("Unable to set filters of List");
                },
                watcher: function (propertyName, propertyValue) {
                    this.release("syncFilters");
                    if (propertyValue) {
                        this.retain("syncFilters", propertyValue.monitorContaining(function (filter) {
                            if (typeof filter !== "function") {
                                return;
                            }
                            // remove duplicated items
                            var data = this._data;
                            var i, len = data.length;
                            for (i = len - 1; i >= 0; i--) {
                                if (!filter(data[i])) {
                                    this.removeAt(i);
                                }
                            }
                        }, this));
                    }
                }
            }
        },
        methods: {
            init: function (data, filters) {
                this.inherited(data);
                // create filters
                this._filters = new nx.topology.common.FilterList((nx.is(filters, "Array") || nx.is(filters, nx.List)) ? filters : (filters && [filters]));
                this.notify("filters");
            },
            _differ: function (diffs) {
                // check if filer available
                var filters = this.filters();
                if (!filters) {
                    return this.inherited(diffs);
                }
                // check if it's all removes
                for (i = 0; i < diffs.length; i++) {
                    if (diffs[i][0] !== "remove") {
                        // TODO move
                        // not all removes
                        var i, value, joins, drops, diff, counting;
                        var data = this._data;
                        // optimize for single diff
                        if (diffs.length === 1) {
                            diff = diffs[0];
                            counting = this._counting_map;
                            // check the duplication and get the actual diffs
                            switch (diff[0]) {
                            case "splice":
                                joins = diff[3];
                                drops = data.slice(diff[1], diff[1] + diff[2]);
                                // clear joins for duplication
                                for (i = joins.length - 1; i >= 0; i--) {
                                    value = joins[i];
                                    if (!filters.match(value)) {
                                        if (joins === diff[3]) {
                                            joins = joins.slice();
                                            diffs = [
                                                ["splice", diff[1], diff[2], joins]
                                            ];
                                        }
                                        joins.splice(i, 1);
                                    }
                                }
                                break;
                            }
                            // check if any diff necessary
                            if (diffs && diffs.length) {
                                return this.inherited(diffs);
                            } else {
                                return null;
                            }
                        }
                        // TODO more optimize by pre-reject insert
                        var evt = this.inherited(diffs);
                        for (i = data.length - 1; i > 0; i--) {
                            value = data[i];
                            if (!filter.match(value)) {
                                data.splice(i, 1);
                                if (evt.diffs === diffs) {
                                    evt.diffs = evt.diffs.slice();
                                }
                                evt.diffs.push(["splice", i, 1, []]);
                                evt.drops.push([value]);
                                evt.joins.push([]);
                            }
                        }
                        return evt;
                    }
                    break;
                }
                return this.inherited(diffs);
            }
        }
    });

}(nx, nx.global));
/// require GraphEntity

(function (nx, global) {

    /**
     * Data wrapper class of entity.
     * @class Vertex
     * @namespace nx.topology.model
     */

    nx.define('nx.topology.model.Entity', {
        properties: {
            /**
             * Data of graph entity.
             *
             * @type Object
             * @property originalData
             */
            originalData: null,
            /**
             * Identity of the edge
             * @type Number
             * @property id
             */
            id: null
        }
    });

}(nx, nx.global));
(function (nx, global) {

    /**
     * Data wrapper class of vertex
     * @class Vertex
     * @extends nx.topology.model.Entity
     * @namespace nx.topology.model
     */

    nx.define('nx.topology.model.Vertex', nx.topology.model.Entity, {
        properties: {
            /**
             * All edges launched from this vertex.
             *
             * @type nx.topology.common.FilterUniqueList
             * @property edges
             * @readOnly
             */
            edges: {
                value: function () {
                    return new nx.topology.common.FilterUniqueList();
                }
            }
        }
    });

}(nx, nx.global));
(function (nx, global) {

    /**
     * A union which contains entities, and supplies collapsing&expanding.
     *
     * @class Union
     * @extends nx.topology.model.Entity
     * @namespace nx.topology.model
     */

    nx.define('nx.topology.model.Union', nx.topology.model.Entity, {
        properties: {
            /**
             * Collapse status of the node set.
             * @type Boolean
             * @property collapse
             */
            collapse: false,
            /**
             * A node set can have a root vertex and collapse to it.
             *
             * @type nx.topology.model.Vertex
             * @property vertexRoot
             */
            vertexRoot: null,
            /**
             * Directly contained entities of current union.
             *
             * @type nx.List
             * @property entities
             */
            entities: {
                value: function () {
                    return new nx.topology.common.FilterUniqueList();
                }
            },
            /**
             * All non-set vertex in the union, including entities in sub-union.
             *
             * @type nx.topology.common.FilterUniqueList
             * @property vertices
             * @readOnly
             */
            vertices: {
                value: function () {
                    return new nx.topology.common.FilterUniqueList();
                }
            },
            /**
             * All visible entities inside when the vertex is expanded.
             *
             * @type nx.topology.common.FilterUniqueList
             * @property entitiesVisible
             * @readOnly
             */
            entitiesVisible: {
                value: function () {
                    return new nx.topology.common.FilterUniqueList();
                }
            },
            /**
             * All edges launched from this union.
             *
             * @type nx.topology.model.edges
             * @property edges
             * @readOnly
             */
            edges: {
                value: function () {
                    return new nx.topology.common.FilterUniqueList();
                }
            }
        }
    });

}(nx, nx.global));
(function (nx, global) {

    /**
     * Data wrapper class of edge.
     * @class Edge
     * @extends nx.topology.model.GraphEntity
     * @namespace nx.topology.model
     */

    nx.define('nx.topology.model.Edge', {
        properties: {
            /**
             * Data of graph edge.
             *
             * @type Object
             * @property originalData
             */
            originalData: null,
            /**
             * Identity of the edge
             * @type Number
             * @property id
             */
            id: null,
            /**
             * Source of the edge
             * @type nx.topology.model.Vertex
             * @property source
             */
            source: null,
            /**
             * Target of the edge
             * @type nx.topology.model.Vertex
             * @property target
             */
            target: null
        }
    });

}(nx, nx.global));
(function (nx, global) {

    /**
     * List of edge.
     * @class Connection
     * @extends nx.topology.model.Edge
     * @namespace nx.topology.model
     */

    nx.define('nx.topology.model.Connection', nx.topology.model.Edge, {
        properties: {
            /**
             * List of edge
             * @type nx.List
             * @property edges
             */
            edges: {
                value: function () {
                    return new nx.topology.common.FilterUniqueList();
                }
            }
        }
    });

}(nx, nx.global));
/// require util
/// require bean

(function (nx, global) {

    var Util = nx.path(global, "nx.topology.common.Util");

    /**
     * Basic graph class, supporting vertex/edge model.
     *
     * @class Graph
     * @namespace nx.topology.model
     * @constructor
     * @param data Initialize data of graph.
     */
    var EXPORT = nx.define('nx.topology.model.Graph', {
        properties: {
            /**
             * A map contains pairs of vertex id and edge.
             *
             * @type nx.Map
             * @property entitiesMap
             */
            entitiesMap: {
                value: function () {
                    return new nx.Map();
                }
            },
            /**
             * A list contains all entities.
             *
             * @type nx.topology.common.FilterUniqueList
             * @property vertices
             */
            vertices: {
                dependencies: "entitiesMap",
                value: function (map) {
                    if (!map) {
                        return;
                    }
                    var list = new nx.topology.common.FilterUniqueList();
                    // initialize the vertices
                    list.filters().push(Util.getTypeFilter(nx.topology.model.Vertex));
                    list.filters().push(Util.getIdFilter(map));
                    // sync vertices and entitiesMap
                    list.monitorContaining(function (item) {
                        map.set(item.id(), item);
                        return function () {
                            map.remove(item.id());
                        };
                    });
                    return list;
                }
            },
            /**
             * A list contains all edges.
             *
             * @type nx.topology.common.FilterUniqueList
             * @property edges
             */
            edges: {
                dependencies: "entitiesMap, vertices",
                value: function (entitiesMap, vertices) {
                    if (!entitiesMap || !vertices) {
                        return;
                    }
                    var list = new nx.topology.common.FilterUniqueList();
                    var entitiesMap = this.entitiesMap();
                    // sync vertices and edge
                    vertices.monitorContaining(function (vertex) {
                        return function () {
                            var i, edge;
                            for (i = list.length() - 1; i >= 0; i--) {
                                edge = list.get(i);
                                if (edge.source() === vertex || edge.target() === vertex) {
                                    list.splice(i, 1);
                                }
                            }
                        };
                    });
                    // make sure link reachable
                    list.filters().push(function (item) {
                        if (!item || !nx.is(item, nx.topology.model.Edge)) {
                            return false;
                        }
                        if (!item.target() || !item.source()) {
                            return false;
                        }
                        return entitiesMap.has(item.target().id()) && entitiesMap.has(item.source().id());
                    });
                    // sync edges and vertex.edges
                    list.monitorContaining(function (edge) {
                        var source = entitiesMap.get(edge.source().id());
                        var target = entitiesMap.get(edge.target().id());
                        source.edges().push(edge);
                        target.edges().push(edge);
                        return function () {
                            source.edges().remove(edge);
                            target.edges().remove(edge);
                        };
                    });
                    return list;
                }
            },
            /**
             * A map contains pairs of edge id and edge.
             *
             * @type nx.Map
             * @property edgeMap
             */
            edgeMap: {
                dependencies: "edges",
                value: function (list) {
                    var map = new nx.Map();
                    // sync edges and edgeMap
                    list.monitorContaining(function (item) {
                        map.set(item.id(), item);
                        return function () {
                            map.remove(item.id());
                        };
                    });
                    return map;
                }
            },
            mappingVertices: {
                value: function () {
                    var self = this;
                    var list = new nx.topology.common.FilterUniqueList();
                    list.monitorContaining(function (item) {
                        var resource = self.createVertexMapping(item);
                        return function () {
                            resource.release();
                        }
                    });
                    return list;
                }
            },
            mappingEdges: {
                value: function () {
                    var self = this;
                    var list = new nx.topology.common.FilterUniqueList();
                    list.monitorContaining(function (item) {
                        var resource = self.createEdgeMapping(item);
                        return function () {
                            resource.release();
                        }
                    });
                    return list;
                }
            },
            /**
             * A map contains pairs of status key and list.
             * A statusList is a list contains all entities or edges which matches the status definition.
             *
             * @type nx.Map
             * @property statusListMap
             */
            statusListMap: {
                dependencies: "vertices, edges",
                value: function (vertices, edges) {
                    return new nx.Map({
                        vertices: vertices,
                        edges: edges
                    });
                }
            },
            /**
             * A map contains pairs of status key and definition.
             *
             * @type nx.Map
             * @property statusDefinitionMap
             */
            statusDefinitionMap: {
                dependencies: "statusListMap",
                value: function (listmap) {
                    if (!listmap) {
                        return;
                    }
                    var self = this;
                    var map = new nx.Map();
                    map.monitor(function (key, conf) {
                        if (!conf.relation) {
                            throw "No relation defined";
                        }
                        var list, tmp = nx.List.calculate(conf.relation, listmap);
                        if (conf.filter) {
                            list = nx.List.select(tmp, conf.filter, conf.condition);
                            list.retain(tmp);
                        } else {
                            list = tmp;
                        }
                        listmap.set(key, list);
                        return function () {
                            if (list) {
                                listmap.remove(key);
                                list.release();
                                list = null;
                            }
                        };
                    });
                    return map;
                }
            }
        },
        methods: {
            init: function (data) {
                this.inherited();
                if (data) {
                    var vertices = nx.path(data, "vertices"),
                        edges = nx.path(data, "edges");
                    nx.each(vertices, function (vertex) {
                        this.vertices().push(this.createVertex(vertex))
                    }, this);
                    nx.each(edges, function (edge) {
                        this.edges().push(this.createEdge(edge));
                    }, this);
                }
            },
            /**
             * Create a Vertex object for further process, with same ID key at least.
             *
             * @method createVertex
             * @param data A Object with id and other data
             * @return nx.topology.model.Vertex Vertex
             */
            createVertex: function (data) {
                var vertex = new nx.topology.model.Vertex(),
                    id = nx.path(data, 'id');
                id = (id == null) ? nx.uuid() : id;
                vertex.id(id);
                vertex.originalData(data);
                return vertex;
            },
            /**
             * Create an Edge object for further process, which have a generated ID, and indicated Vertex object on source/target property at least.
             *
             * @method createEdge
             * @param data A Object with id and other data
             * @return nx.topology.model.Edge
             */
            createEdge: function (data) {
                var edge,
                    id = nx.path(data, 'id') || nx.uuid(),
                    sid = nx.path(data, 'source'),
                    tid = nx.path(data, 'target');
                var entitiesMap = this.entitiesMap(),
                    source = entitiesMap.get(sid),
                    target = entitiesMap.get(tid);
                if (!source || !target) {
                    return null;
                }
                edge = new nx.topology.model.Edge(data);
                edge.id(id);
                edge.originalData(data);
                edge.source(source);
                edge.target(target);
                return edge;
            },
            createVertexMapping: function (inOptions) {
                return Util.createMapping(this.vertices(), inOptions);
            },
            createEdgeMapping: function (inOptions) {
                return Util.createMapping(this.edges(), inOptions);
            }
        }
    });

}(nx, nx.global));
/// require util
/// require bean
/// require Graph

(function (nx, global) {

    var Util = nx.path(nx.global, "nx.topology.common.Util");

    /**
     * A graph which supporting collapse/expand by Union.
     *
     * @class CollapsibleGraph
     * @extends nx.topology.model.Graph
     * @namespace nx.topology.model
     * @constructor
     * @param data Initalize data of the graph.
     */
    var EXPORT = nx.define('nx.topology.model.CollapsibleGraph', nx.topology.model.Graph, {
        properties: {
            /**
             * A map to get parent union of any vertex/union by ID.
             *
             * @type nx.Map
             * @property entitiesParentMap
             * @private
             */
            entitiesParentMap: {
                value: function () {
                    return new nx.Map();
                }
            },
            /**
             * List of unions.
             *
             * @type nx.List
             * @property unions
             */
            unions: {
                dependencies: "vertices, entitiesMap, entitiesParentMap, statusListMap",
                value: function (vertices, map, pmap, listmap) {
                    if (!map || !pmap || !listmap) {
                        return;
                    }
                    var list = new nx.topology.common.FilterUniqueList();
                    list.filters().push(Util.getTypeFilter(nx.topology.model.Union));
                    list.filters().push(Util.getIdFilter(map));
                    list.filters().push(function (item) {
                        item.entities().each(function (child) {
                            var parent = pmap.get(child.id());
                            if (parent && parent !== item) {
                                throw new Error("Failed adding union " + item.id() + " which containing child " + child.id() + " belongs to some other union.");
                            }
                        });
                        return true;
                    });
                    list.monitorContaining(Util.getIdMappingMonitor(map));
                    list.monitorContaining(EXPORT.privates.unionLeafWatcher);
                    list.monitorContaining(EXPORT.privates.unionEdgeWatcher);
                    list.monitorContaining(EXPORT.privates.unionVisibleWatcher);
                    // update parent map
                    var detach = function (item) {
                        var parent = pmap.get(item.id());
                        if (parent) {
                            parent.entities().remove(item);
                        }
                    };
                    vertices.monitorContaining(function (vertex) {
                        return function () {
                            detach(vertex);
                        };
                    });
                    list.monitorContaining(function (union) {
                        var res = union.entities().monitorContaining(function (item) {
                            var lastparent = pmap.get(item.id());
                            if (lastparent && lastparent !== union) {
                                lastparent.entities().remove(item);
                            }
                            pmap.set(item.id(), union);
                            return function () {
                                pmap.remove(item.id());
                            };
                        });
                        return function () {
                            res.release();
                            detach(union);
                        };
                    });
                    // add to status map
                    listmap.set("unions", list);
                    return list;
                }
            },
            /**
             * Top level entities.
             * Top level directly contained in graph, not contained in a union.
             *
             * @type nx.topology.common.FilterUniqueList
             * @property entitiesTopLevel
             * @private
             */
            entitiesTopLevel: {
                dependencies: "vertices, unions",
                value: function (vertices, unions) {
                    if (!vertices || !unions) {
                        return;
                    }
                    var list = new nx.topology.common.FilterUniqueList();
                    //watch vertices
                    vertices.monitorContaining(Util.getListSyncMonitor(list));
                    //watch unions
                    unions.monitorContaining(function (item) {
                        //add
                        var res = item.entities().monitorContaining(Util.getListSyncMonitor(list, false));
                        list.push(item);
                        //remove
                        return function () {
                            list.remove(item);
                            res.release();
                        };
                    });
                    return list;
                }
            },
            /**
             * All entities which are not hidden by collapse.
             *
             * @type nx.topology.common.FilterUniqueList
             * @property entitiesVisible
             * @readOnly
             */
            entitiesVisible: {
                dependencies: "entitiesMap, entitiesTopLevel",
                value: function (map, tlist) {
                    if (!map || !tlist) {
                        return;
                    }
                    var vlist = new nx.topology.common.FilterUniqueList();
                    tlist.monitorContaining(function (item) {
                        var watcher;
                        vlist.push(item);
                        if (nx.is(item, nx.topology.model.Union)) {
                            watcher = Util.monitorOnCondition(item.entitiesVisible(), {
                                target: item,
                                property: "collapse",
                                monitorByFalse: Util.getListSyncMonitor(vlist),
                                monitorByTrue: function (i) {
                                    vlist.remove(i);
                                }
                            });
                        }
                        return function () {
                            if (watcher) {
                                watcher.release();
                            }
                            if (!map.get(item.id())) {
                                vlist.remove(item);
                            }
                        };
                    });
                    return vlist;
                }
            },
            /**
             * List of connections.
             *
             * @type nx.List
             * @property unions
             */
            connections: {
                dependencies: "entitiesVisible",
                value: function (entitiesVisible) {
                    if (!entitiesVisible) {
                        return;
                    }
                    var list = new nx.topology.common.FilterUniqueList();
                    var vStarList = new nx.topology.common.FilterUniqueList();
                    entitiesVisible.monitorContaining(function (gVertex) {
                        if (nx.is(gVertex, nx.topology.model.Union)) {
                            var gWatcher = gVertex.watch('collapse', function (pn, pv) {
                                vStarList.toggle(gVertex, pv);
                            });
                            return function () {
                                gWatcher.release();
                            }
                        } else {
                            vStarList.push(gVertex);
                            return function () {
                                vStarList.remove(gVertex);
                            };
                        }
                    });
                    var esmgr = {
                        isContained: function (v1, v2) {
                            return v1.entitiesVisible && v1.entitiesVisible().contains(v2);
                        },
                        getRelated: function (vstar, edge) {
                            var vertex;
                            vStarList.each(function (v) {
                                if (v !== vstar && v.edges().contains(edge)) {
                                    // FIXME low performance, maybe wrong logic
                                    if (esmgr.isContained(v, vstar) || esmgr.isContained(vstar, v)) {
                                        return;
                                    }
                                    vertex = v;
                                    return false;
                                }
                            });
                            return vertex;
                        },
                        map: {},
                        cache: {},
                        clear: function (source, target) {
                            var temp, sourceMap;
                            if (EXPORT.privates.compare(source, target)) {
                                temp = target, target = source, source = temp;
                            }
                            sourceMap = esmgr.map[source];
                            if (sourceMap) {
                                var es = sourceMap[target];
                                if (es) {
                                    var scache = esmgr.cache[source];
                                    var tcache = esmgr.cache[target];
                                    scache.splice(scache.indexOf(es), 1);
                                    tcache.splice(tcache.indexOf(es), 1);
                                }
                                delete sourceMap[target];
                            }
                        },
                        set: function (source, target, connection) {
                            var temp, sourceMap;
                            if (EXPORT.privates.compare(source, target)) {
                                temp = target, target = source, source = temp;
                            }
                            sourceMap = esmgr.map[source] = esmgr.map[source] || {};
                            sourceMap[target] = connection;
                            var cache = esmgr.cache;
                            (cache[source] = cache[source] || []).push(connection);
                            (cache[target] = cache[target] || []).push(connection);
                        },
                        get: function (source, target) {
                            var temp, sourceMap;
                            if (EXPORT.privates.compare(source, target)) {
                                temp = target, target = source, source = temp;
                            }
                            sourceMap = esmgr.map[source];
                            return sourceMap && sourceMap[target];
                        }
                    };
                    vStarList.monitorContaining(function (vstar) {
                        var res = vstar.edges().monitorContaining(function (edge) {
                            var vertex = esmgr.getRelated(vstar, edge);
                            if (vertex) {
                                var sid = vstar.id();
                                var tid = vertex.id();
                                var es = esmgr.get(sid, tid);
                                if (!es) {
                                    es = new nx.topology.model.Connection();
                                    es.source(vstar);
                                    es.target(vertex);
                                    esmgr.set(sid, tid, es);
                                    list.push(es);
                                }
                                es.edges().push(edge);
                                return function () {
                                    es.edges().remove(edge);
                                    if (es.edges().length() === 0) {
                                        list.remove(es);
                                        esmgr.clear(sid, tid);
                                    }
                                };
                            }
                        });
                        return function () {
                            var i, es, cache = esmgr.cache[vstar.id()];
                            if (cache) {
                                for (i = cache.length - 1; i >= 0; i--) {
                                    es = cache[i];
                                    list.remove(es);
                                    esmgr.clear(es.source().id(), es.target().id());
                                }
                            }
                            res.release();
                        };
                    });
                    return list;
                }
            },
            mappingUnions: {
                value: function () {
                    var self = this;
                    var list = new nx.topology.common.FilterUniqueList();
                    list.monitorContaining(function (item) {
                        var resource = self.createUnionMapping(item);
                        return function () {
                            resource.release();
                        }
                    });
                    return list;
                }
            }
        },
        methods: {
            init: function (data) {
                this.inherited(data);
                // initialize default relation map
                this.statusListMap().set("unions", this.unions());
                // initialize data
                var i, lenmark, vs, unions = (nx.path(data, "unions") || []).slice();
                do {
                    lenmark = unions.length;
                    for (i = unions.length - 1; i >= 0; i--) {
                        if (vs = this.createUnion(unions[i])) {
                            this.unions().push(vs);
                            unions.splice(i, 1);
                        }
                    }
                } while (unions.length && unions.length !== lenmark);
            },
            /**
             * Create a union.
             * 
             * @method createUnion
             * @param data The data of the union
             * @return a union created by the data.
             */
            createUnion: function (inData) {
                var union = new nx.topology.model.Union();
                var id, rootId, vertexRoot;
                var vertexIds, vertices;
                id = nx.path(inData, 'id');
                rootId = nx.path(inData, 'root');
                vertexIds = nx.path(inData, 'entities') || [];
                vertexRoot = this.entitiesMap().get(rootId);
                vertices = Util.getValuesByIds(this.entitiesMap(), vertexIds);
                // contain itself
                if (vertexIds.indexOf(id) > -1) {
                    return null;
                }
                if (!vertices) {
                    return null;
                }
                union.id(id);
                union.collapse(inData.collapse);
                union.originalData(inData);
                union.vertexRoot(vertexRoot);
                union.entities().push.apply(union.entities(), vertices);
                return union;
            }
        },
        statics: {
            privates: {
                compare: function (source, target) {
                    // TODO Make sure different type of value can be compared
                    return source > target;
                },
                unionLeafWatcher: function (union) {
                    var list = union.vertices();
                    var res = union.entities().monitorContaining(function (item) {
                        if (!nx.is(item, nx.topology.model.Union)) {
                            list.push(item);
                            return function () {
                                list.remove(item);
                            };
                        } else {
                            var res = item.vertices().monitorContaining(Util.getListSyncMonitor(list));
                            return function () {
                                res.release();
                            };
                        }
                    });
                    return function () {
                        res.release();
                    };
                },
                unionEdgeWatcher: function (union) {
                    var list = union.edges();
                    var res = union.entities().monitorContaining(function (item) {
                        var res = item.edges().monitorContaining(function (edgeItem) {
                            list.toggle(edgeItem);
                            return function () {
                                list.toggle(edgeItem);
                            };
                        });
                        return function () {
                            res.release();
                        };
                    });
                    return function () {
                        res.release();
                    };
                },
                unionVisibleWatcher: function (union) {
                    var list = union.entitiesVisible();
                    // visible list
                    var res = union.entities().monitorContaining(function (item) {
                        list.push(item);
                        var watcher;
                        if (nx.is(item, nx.topology.model.Union)) {
                            watcher = Util.monitorOnCondition(item.entities(), {
                                target: item,
                                property: "collapse",
                                monitorByFalse: Util.getListSyncMonitor(list),
                                monitorByTrue: function (i) {
                                    list.remove(i);
                                }
                            });
                        }
                        return function () {
                            if (watcher) {
                                watcher.release();
                            }
                            list.remove(item);
                        };
                    });
                    return function () {
                        res.release();
                    };
                },
                createUnionMapping: function (inOptions) {
                    return Util.createMapping(this.unions(), inOptions);
                }
            }
        }
    });

}(nx, nx.global));
/// require util
/// require bean

(function (nx, global) {

    var Util = nx.path(global, "nx.topology.common.Util");

    /**
     * Basic graph class, supporting vertex/edge model.
     *
     * @class TopologyModel
     * @namespace nx.topology.model
     * @constructor
     * @param data Initialize data of graph.
     */
    var EXPORT = nx.define('nx.topology.model.TopologyModel', nx.topology.model.CollapsibleGraph, {
        methods: {
            init: function (config) {
		// TODO vertify mappings
                this.inherited(config.data);
                // initialize entities and edges
                if (config && config.mapping) {
		    // TODO initialize mapping
                }
                if (config && config.list) {
                    nx.each(config.list, function (value, key) {
                        this.statusDefinitionMap().set(key, value);
                    }, this);
                }
            }
        }
    });

}(nx, nx.global));
(function (nx) {
    var EXPORT = nx.define("nx.topology.view.shape.DefaultNodeShape", nx.lib.svg.shape.Node, {
        view: {
            cssstyle: {
                width: "{icon.width}",
                height: "{icon.height}"
            },
            content: [{
                type: "nx.lib.svg.shape.Text",
                content: "{icon.text.0}"
            }, {
                type: "nx.lib.svg.shape.Text",
                content: "{icon.text.1}"
            }]
        },
        properties: {
            icon: {
                dependencies: "model.type",
                value: function (type) {
                    return EXPORT.ICONS[type] || EXPORT.ICONS.unknown;
                }
            },
            topology: null,
            model: null
        },
        statics: {
            ICONS: {
                unknown: {
                    width: 32,
                    height: 32,
                    text: ["\ue612", "\ue611"]
                },
                switch: {
                    width: 32,
                    height: 32,
                    text: ["\ue618", "\ue619"]
                },
                router: {
                    width: 32,
                    height: 32,
                    text: ["\ue61c", "\ue61d"]
                },
                wlc: {
                    width: 32,
                    height: 32,
                    text: ["\ue60f", "\ue610"]
                },
                server: {
                    width: 32,
                    height: 32,
                    text: ["\ue61b", "\ue61a"]
                },
                phone: {
                    width: 32,
                    height: 32,
                    text: ["\ue61e", "\ue61f"]
                },
                nexus5000: {
                    width: 32,
                    height: 32,
                    text: ["\ue620", "\ue621"]
                },
                ipphone: {
                    width: 32,
                    height: 32,
                    text: ["\ue622", "\ue623"]
                },
                host: {
                    width: 32,
                    height: 32,
                    text: ["\ue624", "\ue625"]
                },
                camera: {
                    width: 32,
                    height: 32,
                    text: ["\ue626", "\ue627"]
                },
                accesspoint: {
                    width: 32,
                    height: 32,
                    text: ["\ue628", "\ue629"]
                },
                groups: {
                    width: 32,
                    height: 32,
                    text: ["\ue615", "\ue62f"]
                },
                groupm: {
                    width: 32,
                    height: 32,
                    text: ["\ue616", "\ue630"]
                },
                groupl: {
                    width: 32,
                    height: 32,
                    text: ["\ue617", "\ue631"]
                },
                collapse: {
                    width: 16,
                    height: 16,
                    text: ["\ue62e", "\ue61d"]
                },
                expand: {
                    width: 14,
                    height: 14,
                    text: ["\ue62d", "\ue61d"]
                },
                cloud: {
                    width: 48,
                    height: 48,
                    text: ["\ue633", "\ue633"]
                },
                unlinked: {
                    width: 32,
                    height: 32,
                    text: ["\ue646", "\ue61d"]
                },
                firewall: {
                    width: 32,
                    height: 32,
                    text: ["\ue647", "\ue648"]
                },
                hostgroup: {
                    width: 32,
                    height: 32,
                    text: ["\ue64d", "\ue64c"]
                },
                wirelesshost: {
                    width: 32,
                    height: 32,
                    text: ["\ue64e", "\ue64c"]
                }
            }
        }
    });
})(nx);
(function (nx) {
    var EXPORT = nx.define("nx.topology.view.Group", nx.lib.svg.Node, {
        view: {
            cssclass: "group",
            content: nx.binding("model.collapse", function (collapsed) {
                return collapsed ? "{content_collapsed}" : "{content_expanded}";
            }),
            extend: {
                content_collapsed: {
                    cssclass: "group-content-collapse",
                    content: nx.binding("topology.nodeShapeType", function (type) {
                        return {
                            type: type,
                            properties: {
                                topology: "{topology}",
                                model: "{model}"
                            }
                        };
                    })
                },
                content_expanded: {
                    cssclass: "group-content-expand",
                    content: [nx.binding("topology.groupShapeType", function (type) {
                        return {
                            type: type,
                            properties: {
                                topology: "{topology}",
                                model: "{model}"
                            }
                        };
                    }), {
                        repeat: nx.binding("model.entities", function (entities) {
                            return nx.List.select(entities, function (entity) {
                                return nx.is(entity, nx.topology.model.Union);
                            });
                        }),
                        type: "nx.topology.view.Group",
                        properties: {
                            topology: "{scope.owner}",
                            model: "{scope.model}"
                        }
                    }, {
                        repeat: nx.binding("model.entities", function (entities) {
                            return nx.List.select(entities, function (entity) {
                                return !nx.is(entity, nx.topology.model.Union);
                            });
                        }),
                        type: "nx.topology.view.Node",
                        properties: {
                            topology: "{scope.owner}",
                            model: "{scope.model}"
                        }
                    }]
                }
            }
        },
        properties: {
            topology: null,
            model: null
        }
    });
})(nx);
(function (nx) {
    var EXPORT = nx.define("nx.topology.view.Node", nx.lib.svg.Node, {
        view: {
            cssclass: "node",
            content: nx.binding("topology.nodeShapeType", function (type) {
                return {
                    type: type,
                    properties: {
                        topology: "{topology}",
                        model: "{model}"
                    }
                };
            })
        },
        properties: {
            topology: null,
            model: null
        }
    });
})(nx);
(function (nx) {
    var EXPORT = nx.define("nx.topology.view.Link", nx.lib.svg.Node, {
        view: {
            cssclass: "link"
        }
    });
})(nx);
(function (nx) {
    var EXPORT = nx.define("nx.topology.view.Topology", nx.lib.svg.Svg, {
        view: {
            content: {
                name: "stage",
                attributes: {
                    class: "stage",
                    style: {
                        transform: nx.binding("matrixInitial.matrix, matrix.matrix", function (m0, m) {
                            return nx.lib.svg.AbstractNode.cssTransformMatrix(m0 && m && nx.geometry.Matrix.multiply(m0, m));
                        })
                    }
                },
                content: [{
                    repeat: nx.binding("model.entitiesTopLevel", function (entities) {
                        return nx.List.select(entities, function (entity) {
                            return nx.is(entity, nx.topology.model.Union);
                        });
                    }),
                    type: "nx.topology.view.Group",
                    properties: {
                        topology: "{scope.owner}",
                        model: "{scope.model}"
                    }
                }, {
                    repeat: "model.connections",
                    type: "nx.topology.view.Link",
                    properties: {
                        topology: "{scope.owner}",
                        model: "{scope.model}"
                    }
                }, {
                    repeat: nx.binding("model.entitiesTopLevel", function (entities) {
                        return nx.List.select(entities, function (entity) {
                            return !nx.is(entity, nx.topology.model.Union);
                        });
                    }),
                    type: "nx.topology.view.Node",
                    properties: {
                        topology: "{scope.owner}",
                        model: "{scope.model}"
                    }
                }]
            }
        },
        properties: {
            model: null,
            matrixInitial: new nx.geometry.Matrix(),
            matrix: new nx.geometry.Matrix(),
            nodeShapeType: "nx.topology.view.shape.DefaultNodeShape",
            groupShapeType: "nx.topology.view.shape.DefaultGroupShape",
            linkShapeType: "nx.topology.view.shape.DefaultLinkShape"
        },
        methods: {
            init: function (config) {
                this.inherited();
                this.model(new nx.topology.model.TopologyModel({
                    data: config.data,
                    mapping: config.mapping,
                    lists: config.lists
                }));
            }
        }
    });
})(nx);
