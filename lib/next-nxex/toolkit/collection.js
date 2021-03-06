(function (nx, ui, toolkit, global) {

    var REGEXP_CHECK = /^(&&|\|\||&|\||\^|-|\(|\)|[a-zA-Z\_][a-zA-Z\d\_]*|\s)*$/;
    var REGEXP_TOKENS = /&&|\|\||&|\||\^|-|\(|\)|[a-zA-Z\_][a-zA-Z\d\_]*/g;
    var REGEXP_OPN = /[a-zA-Z\_][a-zA-Z\d\_]*/;
    var REGEXP_OPR = /&&|\|\||&|\||\^|-|\(|\)/;
    var OPERATORNAMES = {
        "-": "complement",
        "&": "cross",
        "^": "delta",
        "|": "union",
        "&&": "and",
        "||": "or"
    };

    var EXPORT = nx.path(toolkit, "collection", {
        Counter: nx.define({
            events: [
                /**
                 * An event which notifies the happening of a count change of item.
                 * @event change
                 * @param {Object} evt The event object with item, count, previousCount.
                 */
                'change',
                /**
                 * Same as change event but only happens on count increasing.
                 * @event increase
                 * @param {Object} evt The event object with item, count, previousCount.
                 */
                'increase',
                /**
                 * Same as change event but only happens on count decreasing.
                 * @event decrease
                 * @param {Object} evt The event object with item, count, previousCount.
                 */
                'decrease'
            ],
            methods: {
                init: function () {
                    this._nummap = {};
                    this._strmap = {};
                    this._objmap = [];
                    this._nxomap = {};
                    this._null = 0;
                    this._undefined = 0;
                },
                /**
                 * Get count of specified item.
                 *
                 * @method getCount
                 * @param {Any} item The counting item.
                 * @return Count of the item.
                 */
                getCount: function (item) {
                    switch (Object.prototype.toString.call(item)) {
                    case "[object Null]":
                        return this._null;
                    case "[object Undefined]":
                        return this._undefined;
                    case "[object Number]":
                        return this._nummap[item] || 0;
                    case "[object String]":
                        return this._strmap[item] || 0;
                    default:
                        if (item.__id__) {
                            return this._nxomap[item.__id__] || 0;
                        } else {
                            return EXPORT.getArrayMapValue(this._objmap, item) || 0;
                        }
                    }
                },
                /**
                 * Set count of specified item.
                 *
                 * @method setCount
                 * @param {Any} item The counting item.
                 * @param {Number} count The count to be set.
                 * @return Set result count.
                 */
                setCount: function (item, count) {
                    // XXX optimizable for obj-map
                    var previousCount = this.getCount(item);
                    // check if change happening
                    if (previousCount === count) {
                        return count;
                    }
                    // change count
                    switch (Object.prototype.toString.call(item)) {
                    case "[object Null]":
                        this._null = count;
                        break;
                    case "[object Undefined]":
                        this._undefined = count;
                        break;
                    case "[object Number]":
                        this._nummap[item] = count;
                        break;
                    case "[object String]":
                        this._strmap[item] = count;
                        break;
                    default:
                        if (item.__id__) {
                            this._nxomap[item.__id__] = count;
                        } else {
                            EXPORT.setArrayMapValue(this._objmap, item, count);
                        }
                        break;
                    }
                    // trigger events
                    var event = {
                        item: item,
                        previousCount: previousCount,
                        count: count
                    }
                    if (previousCount > count) {
                        this.fire('decrease', event);
                    } else {
                        this.fire('increase', event);
                    }
                    this.fire('change', event);
                    return count;
                },
                /**
                 * Increase the count of given item.
                 *
                 * @method increase
                 * @param {Any} item The item to count.
                 * @param {Number} increment The increment, default 1.
                 * @return The increasing result
                 */
                increase: function (inItem, i) {
                    i = arguments.length > 1 ? Math.floor(i * 1 || 0) : 1;
                    return this.setCount(inItem, this.getCount(inItem) + i);
                },
                /**
                 * Decrease the count of given item.
                 *
                 * @method decrease
                 * @param {Any} item The item to count.
                 * @param {Number} decrement The decrement, default 1.
                 * @return The decreasing result
                 */
                decrease: function (inItem, i) {
                    i = arguments.length > 1 ? Math.floor(i * 1 || 0) : 1;
                    return this.setCount(inItem, this.getCount(inItem) - i);
                },
                __addArrayItem: function (inItem) {
                    this._arrcache.push(inItem);
                },
                __removeArrayItem: function (inItem) {
                    var index = this._arrcache.indexOf(inItem);
                    this._arrcache.splice(index, 1);
                },
                __getArrayCounter: function (inItem) {
                    var counter = 0;
                    nx.each(this._arrcache, function (item) {
                        if (inItem === item) {
                            counter++;
                        }
                    });
                    return counter;
                }
            },
            statics: {
                _getArrayMapItem: function (map, key) {
                    return map.filter(function (item) {
                        return item.key === key;
                    })[0];
                },
                getArrayMapValue: function (map, key) {
                    return (EXPORT._getArrayMapItem(map, key) || {}).value;
                },
                setArrayMapValue: function (map, key, value) {
                    var item = EXPORT._getArrayMapItem(map, key);
                    if (!item) {
                        map.push({
                            key: key,
                            value: value
                        });
                    } else {
                        item.value = value;
                    }
                    return value;
                }
            }
        }),
        /**
         * Prepare a calculation provider for a map of collections.
         *
         * @class CollectionRelation
         * @namespace nxex.toolkit.collection
         * @constructor
         * @param map {Object/Map} A map indicates names of the collection for calculation.
         */
        Calculation: nx.define({
            properties: {
                map: {
                    value: function () {
                        return new nx.data.ObservableDictionary();
                    }
                }
            },
            methods: {
                init: function (map) {
                    this.map().setItems(map);
                },
                /**
                 * Apply a inter-collection releation to a collection.
                 * Supported operators:<br/>
                 * <table>
                 * <tr><th>Operator</th><th>Calculation</th><th>Method</th></tr>
                 * <tr><td>&amp;</td><td>Sets cross</td><td>cross</td></tr>
                 * <tr><td>|</td><td>Sets union</td><td>union</td></tr>
                 * <tr><td>^</td><td>Sets symmetric difference</td><td>delta</td></tr>
                 * <tr><td>-</td><td>Sets complement</td><td>complement</td></tr>
                 * <tr><td>&amp;&amp;</td><td>Sets logical and</td><td>and</td></tr>
                 * <tr><td>||</td><td>Sets logical or</td><td>or</td></tr>
                 * </table>
                 * Tips:
                 * <ul>
                 * <li>Logical and means 'first empty collection or last collection'</li>
                 * <li>Logical or means 'first non-empty collection or last collection'</li>
                 * </ul>
                 *
                 * @method calculate
                 * @param target {Collection} The target collection.
                 * @param expression {String} The relation expression.
                 * @return An object with release method.
                 */
                calculate: function (target, expression) {
                    // TODO more validation on the expression
                    if (!expression.match(REGEXP_CHECK)) {
                        throw new Error("Bad expression.");
                    }
                    var self = this;
                    var map = this.map();
                    var tokens = expression.match(REGEXP_TOKENS);
                    var requirements = tokens.filter(RegExp.prototype.test.bind(REGEXP_OPN));
                    var tree = EXPORT.buildExpressionTree(tokens);
                    // sync with the collection existence
                    var res, monitor;
                    var reqmgr = {
                        count: 0,
                        map: {},
                        sync: function () {
                            res && (res.release(), res = null);
                            if (reqmgr.count === requirements.length) {
                                target.clear();
                                if (typeof tree === "string") {
                                    // need not to calculate
                                    res = self.map().getItem(tree).monitor(EXPORT.getCollectionSyncMonitor(target));
                                } else {
                                    res = self._calculate(target, tree);
                                }
                            }
                        },
                        monitor: function (key, value) {
                            if (requirements.indexOf(key) >= 0) {
                                /*
                                if (map[key] && !value) {
                                    reqmgr.count--;
                                } else if (!map[key] && value) {
                                    reqmgr.count++;
                                }*/
                                reqmgr.count += ((!reqmgr.map[key]) * 1 + (!!value) * 1 - 1);
                                reqmgr.map[key] = value;
                                reqmgr.sync();
                            }
                        }
                    };
                    monitor = map.monitor(reqmgr.monitor);
                    return {
                        release: function () {
                            res && res.release();
                            monitor.release();
                        }
                    };
                },
                _calculate: function (target, tree) {
                    var self = this;
                    var res, iterate, opr = tree[0];
                    // short-circuit for logical operatiors (&& and ||)
                    switch (opr) {
                    case "&&":
                        iterate = function (idx) {
                            var coll, calc, watch, itr;
                            if (typeof tree[idx] === "string") {
                                coll = self.map().getItem(tree[idx]);
                            } else {
                                coll = new nx.data.ObservableCollection();
                                calc = self._calculate(coll, tree[idx]);
                            }
                            if (idx >= tree.length - 1) {
                                watch = coll.monitor(function (item) {
                                    target.add(item);
                                    return function () {
                                        target.remove(item);
                                    };
                                });
                            } else {
                                watch = coll.watch("length", function (n, v) {
                                    if (v) {
                                        itr = iterate(idx + 1);
                                    } else if (itr) {
                                        itr.release();
                                        itr = null;
                                    }
                                });
                                watch.affect();
                            }
                            return {
                                release: function () {
                                    itr && itr.release();
                                    watch && watch.release();
                                    calc && calc.release();
                                }
                            };
                        };
                        res = iterate(1);
                        break;
                    case "||":
                        iterate = function (idx) {
                            var coll, calc, watch, itr;
                            if (typeof tree[idx] === "string") {
                                coll = self.map().getItem(tree[idx]);
                            } else {
                                coll = new nx.data.ObservableCollection();
                                calc = self._calculate(coll, tree[idx]);
                            }
                            if (idx >= tree.length - 1) {
                                watch = coll.monitor(EXPORT.getCollectionSyncMonitor(target));
                            } else {
                                watch = coll.watch("length", function (n, v) {
                                    if (itr) {
                                        itr.release();
                                    }
                                    if (!v) {
                                        itr = iterate(idx + 1);
                                    } else {
                                        itr = coll.monitor(EXPORT.getCollectionSyncMonitor(target));
                                    }
                                });
                                watch.affect();
                            }
                            return {
                                release: function () {
                                    itr && itr.release();
                                    watch && watch.release();
                                    calc && calc.release();
                                }
                            };
                        };
                        res = iterate(1);
                        break;
                    default:
                        iterate = function () {
                            var i, coll, colls = [];
                            var calc, calcs = [];
                            for (i = 1; i < tree.length; i++) {
                                if (typeof tree[i] === "string") {
                                    coll = self.map().getItem(tree[i]);
                                } else {
                                    coll = new nx.data.ObservableCollection();
                                    calc = self._calculate(coll, tree[i]);
                                }
                                colls.push(coll);
                                calcs.push(calc);
                            }
                            calc = EXPORT[OPERATORNAMES[opr]](target, colls);
                            return {
                                release: function () {
                                    nx.each(calcs, function (calc) {
                                        calc && calc.release();
                                    });
                                    calc.release();
                                }
                            };
                        };
                        res = iterate();
                        break;
                    }
                    return res;
                }
            }
        }),
        /**
         * This util returns a monitor function of ObservableCollection, which is used to synchronize item existance between 2 collections.
         *
         * @method getCollectionSyncMonitor
         * @param collection The target collection to be synchronized.
         * @param sync
         *  <ul>
         *  <li>If true, make sure target collection will have all items as source collection has;</li>
         *  <li>If false, make sure target collection will not have any item as source collection has.</li>
         *  </ul>
         *  Default true.
         * @return {function&lt;item&gt;}
         *  The monitor function.
         */
        getCollectionSyncMonitor: function (coll, sync) {
            if (sync !== false) {
                return function (item) {
                    coll.add(item);
                    return function () {
                        coll.remove(item);
                    };
                };
            } else {
                return function (item) {
                    coll.remove(item);
                    return function () {
                        coll.add(item);
                    };
                };
            }
        },
        /**
         * Affect target to be the cross collection of sources collections.
         * Release object could stop the dependencies.
         *
         * @method cross
         * @param target {Collection}
         * @param sources {Array of Collection}
         * @return an object with release method
         * @static
         */
        cross: function (target, sources) {
            target.clear();
            var counter = new EXPORT.Counter();
            var monitors = [];
            var increaseHandler = counter.on("increase", function (o, evt) {
                if (evt.count == sources.length) {
                    target.add(evt.item);
                }
            });
            var decreaseHandler = counter.on("decrease", function (o, evt) {
                if (evt.count == sources.length - 1) {
                    target.remove(evt.item);
                }
            });

            nx.each(sources, function (coll) {
                var monitor = coll.monitor(function (item) {
                    counter.increase(item, 1);
                    return function () {
                        counter.decrease(item, 1);
                    };
                });
                monitors.push(monitor);
            });
            return {
                release: function () {
                    increaseHandler.release();
                    decreaseHandler.release();
                    nx.each(monitors, function (monitor) {
                        monitor.release();
                    });
                }
            };
        },
        /**
         * Affect target to be the union collection of sources collections.
         * Release object could stop the dependencies.
         *
         * @method union
         * @param target {Collection}
         * @param sources {Array of Collection}
         * @return an object with release method
         * @static
         */
        union: function (target, sources) {
            target.clear();
            var counter = new EXPORT.Counter();
            var monitors = [];
            var increaseHandler = counter.on("increase", function (o, evt) {
                if (evt.count == 1) {
                    target.add(evt.item);
                }
            });
            var decreaseHandler = counter.on("decrease", function (o, evt) {
                if (evt.count == 0) {
                    target.remove(evt.item);
                }
            });

            nx.each(sources, function (coll) {
                var monitor = coll.monitor(function (item) {
                    counter.increase(item, 1);
                    return function () {
                        counter.decrease(item, 1);
                    };
                });
                monitors.push(monitor);
            });
            return {
                release: function () {
                    increaseHandler.release();
                    decreaseHandler.release();
                    nx.each(monitors, function (monitor) {
                        monitor.release();
                    });
                }
            };
        },
        /**
         * Affect target to be the complement collection of sources collections.
         * Release object could stop the dependencies.
         *
         * @method complement
         * @param target {Collection}
         * @param sources {Array of Collection}
         * @return an object with release method
         * @static
         */
        complement: function (target, sources) {
            target.clear();
            var counter = new EXPORT.Counter();
            var monitors = [];
            var length = sources.length;
            var changeHandler = counter.on("change", function (o, evt) {
                var previous = evt.previousCount,
                    count = evt.count;
                if (previous < length && count >= length) {
                    target.add(evt.item);
                }
                if (previous >= length && count < length) {
                    target.remove(evt.item);
                }
            });
            var globalMonitor = sources[0].monitor(function (item) {
                counter.increase(item, length);
                return function () {
                    counter.decrease(item, length);
                };
            });
            monitors.push(globalMonitor);
            nx.each(sources, function (coll, index) {
                if (index > 0) {
                    var monitor = coll.monitor(function (item) {
                        counter.decrease(item);
                        return function () {
                            counter.increase(item);
                        };
                    });
                    monitors.push(monitor);
                }
            });
            return {
                release: function () {
                    changeHandler.release();
                    nx.each(monitors, function (monitor) {
                        monitor.release();
                    });
                }
            };
        },
        /**
         * Affect target to be the symmetric difference collection of sources collections.
         * Release object could stop the dependencies.
         * The name 'delta' is the symbol of this calculation in mathematics.
         * @reference {http://en.wikipedia.org/wiki/Symmetric_difference}
         * @method delta
         * @param target {Collection}
         * @param sources {Array of Collection}
         * @return an object with release method
         * @static
         */
        delta: function (target, sources) {
            target.clear();
            var bound = true;
            var monitors = [];
            nx.each(sources, function (coll) {
                var monitor = coll.monitor(function (item) {
                    target.toggle(item);
                    return function () {
                        if (bound) {
                            target.toggle(item);
                        }
                    };
                });
                monitors.push(monitor);
            });
            return {
                release: function () {
                    bound = false;
                    nx.each(monitors, function (monitor) {
                        monitor.release();
                    });
                }
            };
        },
        /**
         * Affect target to be the equivalent collection of the first non-empty collection.
         * Release object could stop the dependencies.
         *
         * @method or
         * @param target {Collection}
         * @param sources {Array of Collection}
         * @return an object with release method
         * @static
         */
        or: function (target, sources) {
            target.clear();
            var res, bound = true;
            var iterator = function (index) {
                var watch, res, coll = sources[index];
                watch = coll.watch('length', function (name, value) {
                    res && res.release();
                    if (index < sources.length - 1 && !value) {
                        res = iterator(index + 1);
                    } else {
                        res = coll.monitor(function (item) {
                            target.add(item);
                            return function () {
                                if (bound) {
                                    target.remove(item);
                                }
                            };
                        });
                    }
                });
                watch.affect();
                return {
                    release: function () {
                        res && res.release();
                        watch && watch.release();
                    }
                };
            };
            res = iterator(0);
            return {
                release: function () {
                    bound = false;
                    res.release();
                }
            }
        },
        /**
         * Affect target to be the equivalent collection of the first empty collection or the last collection.
         * Release object could stop the dependencies.
         *
         * @method and
         * @param target {Collection}
         * @param sources {Array of Collection}
         * @return an object with release method
         * @static
         */
        and: function (target, sources) {
            target.clear();
            var bound = true;
            var iterate = function (idx) {
                var watcher, resource, coll = sources[idx];
                if (idx === sources.length - 1) {
                    return coll.monitor(function (item) {
                        target.add(item);
                        return function () {
                            if (bound) {
                                target.remove(item);
                            }
                        };
                    });
                }
                watcher = coll.watch("length", function (n, v) {
                    if (v) {
                        resource = iterate(idx + 1);
                    } else if (resource) {
                        resource.release();
                        resource = null;
                    }
                });
                watcher.affect();
                return {
                    release: function () {
                        if (resource) {
                            resource.release();
                        }
                        watcher.release();
                    }
                };
            };
            var resource = iterate(0);
            return {
                release: function () {
                    bound = false;
                    resource.release();
                }
            };
        },
        /**
         * Build a tree of expresson syntax with the expression tokens.
         * e.g. tokens ["A", "|", "B", "&", "(", "C", "&", "D", ")"], which was separated from expression "A | B & (C | D)",
         * will be separated into [|, A, [&, B, [|, C, D]]], because '&' has higher priority than '|',
         * and braced "C | D" has higher priority than &. <br/>
         * <br/>
         * Similar to the priorities in JavaScript:<br/>
         * <table>
         * <tr><th>operator</th><th>functionality</th></tr>
         * <tr><td>()</td><td>braces</td></tr>
         * <tr><td>-</td><td>complement</td></tr>
         * <tr><td>&</td><td>cross</td></tr>
         * <tr><td>^</td><td>symmetric difference</td></tr>
         * <tr><td>|</td><td>union</td></tr>
         * <tr><td>&&</td><td>and (the first empty collection or the last collection)</td></tr>
         * <tr><td>||</td><td>or (the first non-empty collection)</td></tr>
         * </table>
         *
         * @method buildExpressionTree
         * @param {Array of token} tokens
         * @return {Array tree} Parsed syntax tree of the expression tokens.
         * @static
         */
        buildExpressionTree: (function () {
            var PRIORITIES = [
                ["-"],
                ["&"],
                ["^"],
                ["|"],
                ["&&"],
                ["||"]
            ];
            var getPriority = function (opr) {
                for (var i = 0; i < PRIORITIES.length; i++) {
                    if (PRIORITIES[i].indexOf(opr) >= 0) {
                        return i;
                    }
                }
            };
            var buildExpressionNode = function (opr, opn1, opn2) {
                if (Object.prototype.toString.call(opn1) === "[object Array]" && opn1[0] === opr) {
                    opn1.push(opn2);
                    return opn1;
                }
                return [opr, opn1, opn2];
            };
            return function (tokens, priors) {
                tokens = tokens.concat([")"]);
                var token, opr, oprstack = [];
                var opn, opnstack = [];
                while (tokens.length) {
                    token = tokens.shift();
                    if (token === ")") {
                        while (opr = oprstack.pop()) {
                            if (opr === "(") {
                                break;
                            }
                            opn = opnstack.pop();
                            opnstack.push(buildExpressionNode(opr, opnstack.pop(), opn));
                        }
                    } else if (token === "(") {
                        oprstack.push(token);
                    } else if (token.match(REGEXP_OPN)) {
                        opnstack.push(token);
                    } else if (token.match(REGEXP_OPR)) {
                        while (oprstack.length) {
                            opr = oprstack.pop();
                            if (opr === "(" || getPriority(opr) > getPriority(token)) {
                                oprstack.push(opr);
                                break;
                            }
                            opn = opnstack.pop();
                            opnstack.push(buildExpressionNode(opr, opnstack.pop(), opn));
                        }
                        oprstack.push(token);
                    }
                }
                return opnstack[0];
            };
        })()
    });
})(nx, nx.ui, nxex.toolkit, window);
