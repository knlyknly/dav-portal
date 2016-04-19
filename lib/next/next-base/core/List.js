(function(nx) {

    var global = nx.global;
    var splice = Array.prototype.splice;
    var slice = Array.prototype.slice;
    var hasown = Object.prototype.hasOwnProperty;
    var mathsign = Math.sign || nx.math.sign;

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

    /**
     * @class List
     * @namespace nx
     */
    var EXPORT = nx.define("nx.List", {
        properties: {
            length: {
                set: function() {
                    throw new Error("Unable to set length of List");
                }
            },
            data: {
                set: function() {
                    throw new Error("Unable to set data of List");
                }
            }
        },
        methods: {
            /**
             * @constructor
             * @param data {Array|List} Initial list.
             */
            init: function(data) {
                this.inherited();
                // optimize
                this._counting_map = new nx.Counter();
                this._counting_num = 0;
                this._counting_res = null;
                // initialize
                this._length = 0;
                this._data = [];
                if (nx.is(data, "Array")) {
                    this.spliceAll(0, 0, data.slice());
                } else if (nx.is(data, EXPORT)) {
                    this.spliceAll(0, 0, data._data.slice());
                }
            },
            /**
             * To Array.
             *
             * @method toArray
             * @return An array with the whole list data.
             */
            toArray: function() {
                return this._data.slice();
            },
            /**
             * Create a sub list from specified start position and length.
             *
             * @method slice
             * @param start Optional. Default 0.
             * @param end Optional. Default the current length of list.
             * @return A difference-object.
             */
            slice: function(start, end) {
                return new EXPORT(slice.call(this._data, start, end));
            },
            /**
             * Get the value at speicified position.
             *
             * @method get
             * @param index The index of value to be get.
             * @return value
             */
            get: function(index) {
                if (index >= 0) {
                    return this._data[index];
                } else if (index < 0) {
                    return this._data[this._data.length + index];
                }
            },
            /**
             * Iterate all values and indices in the list.
             *
             * @method each
             * @param callback The callback for each value.
             * @param context (Optional)
             * @return False if the iteration stoped by returning false in the callback.
             */
            each: function(callback, context) {
                return nx.each(this._data, callback, context);
            },
            __each__: function(callback, context) {
                return nx.each(this._data, callback, context);
            },
            /**
             * Check the list containing a value or not.
             *
             * @method contains
             * @param value
             * @return Containing or not.
             */
            contains: function(value) {
                return this._data.indexOf(value) >= 0;
            },
            /**
             * Find the first index of a value.
             *
             * @method indexOf
             * @return The index value, -1 if not found
             */
            indexOf: function(value, since) {
                return this._data.indexOf(value, since);
            },
            /**
             * Find the last index of a value.
             *
             * @method lastIndexOf
             * @param value The value attemp to find
             * @param since The start point.
             * @return The index value, -1 if not found
             */
            lastIndexOf: function(value, since) {
                if (since === undefined) {
                    return this._data.lastIndexOf(value);
                } else {
                    return this._data.lastIndexOf(value, since);
                }
            },
            /**
             * Find an item that matches the check function.
             *
             * @method fn The match function
             * @return The item.
             */
            find: function(fn) {
                if (this._data.find) {
                    return this._data.find(fn);
                } else {
                    var i;
                    for (i = 0; i < this._data.length; i++) {
                        if (fn(this._data[i])) {
                            return this._data[i];
                        }
                    }
                }
            },
            /**
             * Find an item that matches the check function, and returns its index.
             *
             * @method fn The match function
             * @return The index, -1 if not found.
             */
            findIndex: function(fn) {
                if (this._data.find) {
                    return this._data.findIndex(fn);
                } else {
                    var i;
                    for (i = 0; i < this._data.length; i++) {
                        if (fn(this._data[i])) {
                            return i;
                        }
                    }
                    return -1;
                }
            },
            /**
             * Add variable number of items at the tail of list.
             *
             * @method push
             * @return New length.
             */
            push: function() {
                this.spliceAll(this._data.length, 0, slice.call(arguments));
                return this._data.length;
            },
            /**
             * Add an array of items at the tail of list.
             *
             * @method pushAll
             * @return New length.
             */
            pushAll: function(items) {
                this.spliceAll(this._data.length, 0, items);
                return this._data.length;
            },
            /**
             * Remove the last item at the head of list.
             *
             * @method pop
             * @return The pop item.
             */
            pop: function() {
                return this.spliceAll(this._data.length - 1, 1, [])[0];
            },
            /**
             * Insert variable number of items at the head of list.
             *
             * @method unshift
             * @return New length.
             */
            unshift: function() {
                this.spliceAll(0, 0, slice.call(arguments));
                return this._data.length;
            },
            /**
             * Insert an array of items at the head of list.
             *
             * @method unshift
             * @return New length.
             */
            unshiftAll: function(items) {
                this.spliceAll(0, 0, items);
                return this._data.length;
            },
            /**
             * Remove the first item at the head of list.
             *
             * @method shift
             * @return The shift item.
             */
            shift: function() {
                return this.spliceAll(0, 1, [])[0];
            },
            /**
             * Remove specified count of items from specified start position, and insert variable number of items at the position.
             *
             * @method splice
             * @param from Optional. Default 0.
             * @param count Optional. Default the current length of list.
             * @return A difference-object.
             */
            splice: function(from, count) {
                return this.spliceAll(from, count, slice.call(arguments, 2));
            },
            /**
             * Remove specified count of items from specified start position, and insert variable number of items at the position.
             *
             * @private
             * @method splice
             * @return droped items.
             */
            spliceAll: function(from, count, addtions) {
                // follow Array.prototype.splice
                if (from < 0) {
                    from = this._length + from;
                }
                if (count < 0) {
                    count = 0;
                }
                if (from + count > this._length) {
                    if (from > this._length) {
                        from = this._length;
                    }
                    count = this._length - from;
                }
                // do splice by differ
                var removement = this.differ([
                    ["splice", from, count, addtions]
                ]);
                return removement.drops[0];
            },
            /**
             * Remove all specified value, including duplicated, in the list.
             *
             * @method remove
             * @param value... The value to be cleared.
             * @return Removed count.
             */
            remove: function() {
                return this.removeAll(slice.call(arguments));
            },
            /**
             * Remove all specified value, including duplicated, in the list.
             *
             * @method remove
             * @param value... The value to be cleared.
             * @return Removed count.
             */
            removeAll: function(values) {
                if (!values) {
                    return this.clear().length;
                }
                var count = 0;
                var i, idx, value, diffs = [];
                for (i = 0; i < values.length; i++) {
                    value = values[i];
                    while ((idx = this.indexOf(value, idx + 1)) >= 0) {
                        diffs.push(["splice", idx, 1, []]);
                        count++;
                    }
                }
                diffs.sort(function(a, b) {
                    return b[1] - a[1];
                });
                this.differ(diffs);
                return count;
            },
            /**
             * Remove all items in the list.
             *
             * @method clear
             * @return Removed items.
             */
            clear: function() {
                var differ = this.differ([
                    ["splice", 0, this._length, []]
                ]);
                return differ.drops[0];
            },
            /**
             * Set the existence of a value in the list.
             *
             * @method toggle
             * @param value The value whose existence attempt to be toggled.
             * @param existence (Optional) Default hasnot(value).
             */
            toggle: function(value, existence) {
                if (arguments.length > 1) {
                    if (!existence) {
                        this.remove(value);
                    } else if (this.indexOf(value) < 0) {
                        this.push(value);
                    }
                    return existence;
                } else {
                    if (this.indexOf(value) >= 0) {
                        this.remove(value);
                        return false;
                    } else {
                        this.push(value);
                        return true;
                    }
                }
            },
            /**
             * Set the index of an item, splice if not exist yet.
             *
             * @method setIndex
             * @param item The value about to move
             * @param index (Optional) Default hasnot(value).
             * @return The final index
             */
            setIndex: function(item, index) {
                var indexFrom = this.indexOf(item);
                if (indexFrom === -1) {
                    var differ = this.differ([
                        ["splice", index, 0, [item]]
                    ]);
                    return differ.diffs[0][1];
                } else {
                    return indexFrom + this.move(indexFrom, 1, index - indexFrom);
                }
            },
            /**
             * Set the existence of a value in the list.
             *
             * @method setIndexAt
             * @param value The value whose existence attempt to be toggled.
             * @param existence (Optional) Default hasnot(value).
             */
            setIndexAt: function(from, index) {
                var len = this._length;
                // check from
                from < 0 && (from = len + from);
                if (from < 0 || from >= len) {
                    // bad from moves nothing
                    return 0;
                }
                return from + this.move(from, 1, index - from);
            },
            /**
             * Specify an area of items and move it backward/forward.
             *
             * @method setIndexAt
             * @param from The lower-bound of the area
             * @param count The size of the area
             * @param delta The delta of the moving
             * @return The delta actually moved
             */
            move: function(from, count, delta) {
                var len = this._length;
                // check from
                from < 0 && (from = len + from);
                if (from < 0 || from >= len) {
                    // bad from moves nothing
                    return 0;
                }
                // check count
                if (from + count > len) {
                    count = len - from;
                } else if (count < 0) {
                    if (from + count < 0) {
                        count = from;
                        from = 0;
                    } else {
                        count = -count;
                        from = from - count;
                    }
                }
                if (count <= 0) {
                    // bad count moves nothing
                    return 0;
                }
                // check delta
                if (from + count + delta > len) {
                    delta = len - from - count;
                } else if (from + delta < 0) {
                    delta = -from;
                }
                if (delta === 0) {
                    // bad count moves nothing
                    return 0;
                }
                // apply the differ of move
                this.differ([
                    ["move", from, count, delta]
                ]);
                return delta;
            },
            /**
             * Apply an array of differences to the list, getting the droped items.
             *
             * @method differ
             * @param diffs The differences
             * @return droped items.
             */
            differ: function(diffs) {
                var length = this._length;
                var evt = this._differ(diffs);
                if (evt && evt.diffs.length) {
                    this.fire("diff", evt);
                    if (length !== this._data._length) {
                        this._length = this._data.length;
                        this.notify("length");
                    }
                }
                return evt;
            },
            _differ: function(diffs) {
                var drops = [];
                var joins = [];
                nx.each(diffs, function(diff) {
                    switch (diff[0]) {
                        case "splice":
                            drops.push(nx.func.apply(splice, this._data, diff[1], diff[2], diff[3]));
                            joins.push(diff[3]);
                            break;
                        case "move":
                            // ["move", from, count, delta]
                            nx.func.apply(splice, this._data, diff[1] + diff[3], 0,
                                this._data.splice(diff[1], diff[2]));
                            drops.push([]);
                            joins.push([]);
                    }
                }, this);
                return {
                    diffs: diffs || [],
                    drops: drops,
                    joins: joins
                };
            },
            _counting_register: function() {
                this._counting_num++;
                var map = this._counting_map;
                if (this._counting_num > 0) {
                    if (!this._counting_res) {
                        // refresh counting map
                        map.clear();
                        nx.each(this._data, function(value) {
                            map.increase(value);
                        });
                        // add monitor of counting
                        this._counting_res = this.on("diff", function(sender, evt) {
                            var mapdelta = new nx.Counter();
                            var i, diff, drop, join;
                            var diffs, drops, joins;
                            diffs = evt.diffs, drops = evt.drops, joins = evt.joins;
                            for (i = 0; i < diffs.length; i++) {
                                diff = diffs[i], drop = drops[i], join = joins[i];
                                // consider removement and addition has no cross item
                                nx.each(drop, function(value) {
                                    mapdelta.decrease(value);
                                });
                                nx.each(join, function(value) {
                                    mapdelta.increase(value);
                                });
                            }
                            // apply delta map
                            var change = [];
                            mapdelta.each(function(delta, value) {
                                if (delta > 0 || delta < 0) {
                                    map.increase(value, delta);
                                    change.push({
                                        value: value,
                                        count: map.get(value)
                                    });
                                }
                            });
                            // fire event
                            this.fire("counting", change);
                        }, this);
                    }
                }
                return {
                    release: function() {
                        // FIXME logical fault on multiple release
                        this._counting_num--;
                        if (this._counting_num <= 0) {
                            if (this._counting_res) {
                                this._counting_res.release();
                                this._counting_res = null;
                            }
                        }
                    }.bind(this)
                };
            },
            /**
             * Supplies a whole life-cycle of a monitoring on a list.
             *
             * @method monitorDiff
             * @param handler lambda(diff) handling diff events.
             * @return releaser A Object with release method.
             */
            monitorDiff: function(handler, context) {
                var self = this;
                var data = this._data.slice();
                if (data.length) {
                    handler.call(context, {
                        diffs: Array(["splice", 0, 0, data]),
                        drops: Array([]),
                        joins: [data]
                    });
                }
                var resource = this.on("diff", function(sender, evt) {
                    handler.call(context, evt);
                });
                return {
                    release: function() {
                        if (resource) {
                            var data = self._data.slice();
                            if (data.length) {
                                handler.call(context, {
                                    diffs: Array(["splice", 0, data.length, []]),
                                    drops: [data],
                                    joins: Array([])
                                });
                            }
                            resource.release();
                        }
                    }
                };
            },
            /**
             * Apply a diff watcher, which handles each item in the list, to the list.
             *
             * @method monitorContaining
             * @param handler lambda(item) returning a release method
             * @return releaser A Object with release method.
             */
            monitorContaining: function(handler, context) {
                var counter = this._counting_map;
                var resources = new nx.Map();
                var retain = function(value, resource) {
                    // accept release function or direct resource as releaser
                    if (typeof resource === "function") {
                        resource = {
                            release: resource
                        };
                    }
                    // remember the releaser
                    if (resource && typeof resource.release === "function") {
                        resources.set(value, resource);
                    }
                };
                // increase counting listener
                var res_counting = this._counting_register();
                // watch the further change of the list
                var listener = this.on("counting", function(sender, change) {
                    nx.each(change, function(item) {
                        var release, resource = resources.get(item.value);
                        if (resource) {
                            if (item.count <= 0) {
                                resource.release();
                                resources.remove(item.value);
                            }
                        } else {
                            if (item.count > 0) {
                                release = handler.call(context, item.value);
                                retain(item.value, release);
                            }
                        }
                    });
                }, this);
                // and don't forget the existing items in the list
                nx.each(this._data, function(item) {
                    var resource = handler.call(context, item);
                    retain(item, resource);
                }, this);
                // return unwatcher
                return {
                    release: function() {
                        if (listener) {
                            // clear resources
                            resources.each(function(resource, value) {
                                resource.release();
                            });
                            resources.clear();
                            // clear listener
                            listener.release();
                            listener = null;
                        }
                        if (res_counting) {
                            res_counting.release();
                            res_counting = null;
                        }
                    }
                };
            },
            /**
             * Apply a diff watcher, which handles each item in the list, to the list.
             *
             * @method monitorCounting
             * @param handler lambda(item) returning a release method
             * @return releaser A Object with release method.
             */
            monitorCounting: function(handler, context) {
                var counter = this._counting_map;
                var resources = new nx.Map();
                // increase counting listener
                var res_counting = this._counting_register();
                // watch the further change of the list
                var listener = this.on("counting", function(sender, change) {
                    nx.each(change, function(item) {
                        var resource = resources.get(item.value);
                        if (resource) {
                            resource(item.count);
                            if (item.count <= 0) {
                                resources.remove(item.value);
                            }
                        } else if (item.count > 0) {
                            resource = handler.call(context, item.value, item.count);
                            if (resource) {
                                resources.set(item.value, resource);
                            }
                        }
                    });
                }, this);
                // and don't forget the existing items in the list
                nx.each(counter, function(value, count) {
                    var resource = handler(context, value, count);
                    if (resource) {
                        resources.set(value, resource);
                    }
                }, this);
                // return unwatcher
                return {
                    release: function() {
                        if (listener) {
                            // clear resources
                            resources.each(function(resource, value) {
                                resource(0);
                            });
                            resources.clear();
                            // clear listener
                            listener.release();
                            listener = null;
                        }
                        if (res_counting) {
                            res_counting.release();
                            res_counting = null;
                        }
                    }
                };
            }
        },
        statics: {
            /**
             * This util returns a monitor function of ObservableList, which is used to synchronize item existance between 2 lists.
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
            getListSyncMonitor: function(coll, sync) {
                if (sync !== false) {
                    return function(item) {
                        coll.push(item);
                        return function() {
                            coll.remove(item);
                        };
                    };
                } else {
                    return function(item) {
                        coll.remove(item);
                        return function() {
                            coll.push(item);
                        };
                    };
                }
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
             * <tr><td>&&</td><td>and (the first empty list or the last list)</td></tr>
             * <tr><td>||</td><td>or (the first non-empty list)</td></tr>
             * </table>
             *
             * @method buildExpressionTree
             * @param {Array of token} tokens
             * @return {Array tree} Parsed syntax tree of the expression tokens.
             * @static
             */
            buildExpressionTree: (function() {
                var PRIORITIES = [
                    ["-"],
                    ["&"],
                    ["^"],
                    ["|"],
                    ["&&"],
                    ["||"]
                ];
                var getPriority = function(opr) {
                    for (var i = 0; i < PRIORITIES.length; i++) {
                        if (PRIORITIES[i].indexOf(opr) >= 0) {
                            return i;
                        }
                    }
                };
                var buildExpressionNode = function(opr, opn1, opn2) {
                    if (Object.prototype.toString.call(opn1) === "[object Array]" && opn1[0] === opr) {
                        opn1.push(opn2);
                        return opn1;
                    }
                    return [opr, opn1, opn2];
                };
                return function(tokens) {
                    if (typeof tokens === "string") {
                        tokens = tokens.match(REGEXP_TOKENS);
                    }
                    tokens = tokens.concat([")"]);
                    var token, opr, oprstack = [];
                    var opn, opnstack = [];
                    var operands = [];
                    while (tokens.length) {
                        token = tokens.shift();
                        if (token === ")") {
                            while ((opr = oprstack.pop())) {
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
                            if (operands.indexOf(token) == -1) {
                                operands.push(token);
                            }
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
                    if (opnstack[0]) {
                        opnstack[0].operands = operands;
                    }
                    return opnstack[0];
                };
            })(),
            /**
             * Apply a inter-list releation to a list.
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
             * <li>Logical and means 'first empty list or last list'</li>
             * <li>Logical or means 'first non-empty list or last list'</li>
             * </ul>
             *
             * @method calculate
             * @param target {nx.List} The target list.
             * @param expression {String} The relation expression.
             * @param map {nx.Map} The relation expression.
             * @return An object with release method.
             */
            calculate: function(expression, map) {
                // TODO more validation on the expression
                if (!expression.match(REGEXP_CHECK)) {
                    throw new Error("Bad expression.");
                }
                // initialize map with normal object
                if (!nx.is(map, nx.Map)) {
                    map = new nx.Map(map);
                }
                var tokens = expression.match(REGEXP_TOKENS);
                var requirements = tokens.filter(RegExp.prototype.test.bind(REGEXP_OPN));
                var tree = EXPORT.buildExpressionTree(tokens);
                // sync with the list existence
                var target = new nx.List();
                var reqmgr = {
                    count: 0,
                    map: {},
                    sync: function() {
                        if (reqmgr.count === requirements.length) {
                            var coll;
                            if (typeof tree === "string") {
                                // need not to calculate
                                coll = map.get(tree);
                            } else {
                                target.retain(coll);
                                coll = EXPORT.calculateTree(tree, map);
                            }
                            target.retain(coll.monitorContaining(EXPORT.getListSyncMonitor(target)));
                        }
                    },
                    monitor: function(key, value) {
                        if (requirements.indexOf(key) >= 0) {
                            reqmgr.count += ((!reqmgr.map[key]) * 1 + (!!value) * 1 - 1);
                            reqmgr.map[key] = value;
                            reqmgr.sync();
                        }
                    }
                };
                target.retain(map.monitor(reqmgr.monitor));
                return target;
            },
            calculateTree: function(tree, map) {
                var target, iterate, opr = tree[0];
                // short-circuit for logical operatiors (&& and ||)
                switch (opr) {
                    case "&&":
                        target = new nx.List();
                        iterate = function(idx) {
                            var coll, resource;
                            if (typeof tree[idx] === "string") {
                                coll = map.get(tree[idx]);
                                resource = new nx.Object();
                            } else {
                                resource = coll = EXPORT.calculateTree(tree[idx], map);
                            }
                            if (idx >= tree.length - 1) {
                                resource.retain(coll.monitorContaining(EXPORT.getListSyncMonitor(target)));
                            } else {
                                resource.retain(coll.watch("length", function(n, v) {
                                    if (v) {
                                        return iterate(idx + 1);
                                    }
                                }));
                            }
                            return resource;
                        };
                        target.retain(iterate(1));
                        break;
                    case "||":
                        target = new nx.List();
                        iterate = function(idx) {
                            var coll, resource;
                            if (typeof tree[idx] === "string") {
                                coll = map.get(tree[idx]);
                                resource = new nx.Object();
                            } else {
                                resource = coll = EXPORT.calculateTree(tree[idx], map);
                            }
                            if (idx >= tree.length - 1) {
                                resource.retain(coll.monitorContaining(EXPORT.getListSyncMonitor(target)));
                            } else {
                                resource.retain(coll.watch("length", function(n, v) {
                                    if (!v) {
                                        return iterate(idx + 1);
                                    } else {
                                        return coll.monitorContaining(EXPORT.getListSyncMonitor(target));
                                    }
                                }));
                            }
                            return resource;
                        };
                        target.retain(iterate(1));
                        break;
                    default:
                        target = (function() {
                            var target, calcs = [];
                            var i, coll, colls = [];
                            for (i = 1; i < tree.length; i++) {
                                if (typeof tree[i] === "string") {
                                    coll = map.get(tree[i]);
                                } else {
                                    coll = EXPORT.calculateTree(tree[i], map);
                                    calcs.push(coll);
                                }
                                colls.push(coll);
                            }
                            target = EXPORT[OPERATORNAMES[opr]](colls);
                            nx.each(calcs, function(calc) {
                                target.retain(calc);
                            });
                            return target;
                        })();
                        break;
                }
                return target;
            },
            /**
             * Select a sub-list from a source list.
             * Usage:
             * <pre>
             * // select all items from list with property active==true
             * resource = subList.select(list, "active")
             * // select all items from list with path owner.name=="Knly"
             * resource = subList.select(list, "owner.name", function(name){
             *     return name==="Knly";
             * });
             * // select all string item from list
             * resource = subList.select(list, function(item){
             *     return typeof item === "string";
             * });
             * </pre>
             * 
             * @method select
             * @param {nx.List} source
             * @param {String} conditions (Optional)
             * @param {Function} determinator
             * @return resource for release the binding
             * @static
             */
            select: function(source, conditions, determinator) {
                if (!nx.is(source, EXPORT)) {
                    // TODO select from array
                    return null;
                }
                // FIXME keep the order of items as it was in source
                if (typeof conditions === "function") {
                    determinator = conditions;
                    conditions = null;
                }
                if (!determinator) {
                    determinator = nx.identity;
                }
                var target = new EXPORT();
                target.retain(source.monitorContaining(function(item) {
                    var resource;
                    if (conditions) {
                        if (nx.is(item, nx.Object)) {
                            // monitor the specified conditions
                            resource = nx.Object.cascade(item, conditions, function() {
                                target.toggle(item, determinator.apply(target, arguments));
                            });
                        } else {
                            // determine the specified conditions if unable to monitor
                            target.toggle(item, determinator.call(target, nx.path(item, conditions)));
                        }
                    } else {
                        // no condition specified means determine item itself
                        target.toggle(item, determinator.call(target, item));
                    }
                    return function() {
                        resource && resource.release();
                        target.toggle(item, false);
                    };
                }));
                return target;
            },
            /**
             * Summarize all values of a list and return to a callback function.
             *
             * @method summarize
             * @param {nx.List} source
             * @param {Function} callback
             * @return resource for release the binding
             * @static
             */
            summarize: function(source, callback) {
                sum = 0;
                return source.monitorDiff(function(evt) {
                    nx.each(evt.diffs, function(diff, idx) {
                        var vdrop = evt.drops[idx];
                        var vjoin = evt.joins[idx];
                        var delta = nx.math.plus.apply(this, vjoin) - nx.math.plus.apply(this, vdrop);
                        if (delta) {
                            sum = sum + delta;
                        }
                    });
                    callback(sum);
                });
            },
            sorting: function(list, comparator) {
                // TODO
            },
            /**
             * Mapping a list to another list with a mapper.
             * 
             * @method mapping
             * @param {nx.List} source
             * @param {String} paths Optional.
             * @param {Boolean} async Optional.
             * @param {Function} handler Optional.
             * @return resource for release the mapping
             * @static
             */
            mapping: function(source, paths, async, handler) {
                var binding = nx.binding(paths, async, handler);
                // create the target
                var target = new EXPORT();
                // prepare lengths and starts
                var internal = {
                    listeners: [],
                    shift: function(index, delta) {
                        var i;
                        for (i = index; i < internal.listeners.length; i++) {
                            internal.listeners[i].index += delta;
                        }
                    },
                    listen: function(item, index) {
                        var listener, resource;
                        listener = {
                            index: index,
                            set: function(value) {
                                if (hasown.call(listener, "value")) {
                                    target.splice(listener.index, 1, value);
                                }
                                listener.value = value;
                            },
                            release: function() {
                                resource && resource.release();
                                resource = null;
                                if (listener.value && typeof listener.value.release === "function") {
                                    listener.value.release();
                                }
                            }
                        };
                        if (binding.paths && binding.paths.length) {
                            resource = nx.Object.binding(item, binding, function(value) {
                                listener.set(value);
                            });
                        } else if (!binding.async) {
                            listener.set(binding.handler(item));
                        } else {
                            binding.handler({
                                get: function() {
                                    return listener.value;
                                },
                                set: listener.set
                            }, item);
                        }
                        return listener;
                    },
                    release: function() {
                        nx.each(internal.listeners, function(listener) {
                            listener.release();
                        });
                    },
                    move: function(i, n, d) {
                        var p, listener, listeners = internal.listeners;
                        var movements = [
                            [i, n, d],
                            d > 0 ? [i + n, d, -n] : [i + d, -d, n]
                        ];
                        // shift both parts
                        nx.each(movements, function(movement) {
                            for (p = 0; p < movement[1]; p++) {
                                listener = listeners[movement[0] + p];
                                listener.index += movement[2];
                            }
                        });
                        nx.func.apply(splice, internal.listeners, i + d, 0, internal.listeners.splice(i, n));
                    }
                };
                // initialize all listeners
                source.each(function(item, idx) {
                    var listener = internal.listen(item, idx);
                    target.push(listener.value);
                    internal.listeners.push(listener);
                });
                // sync listeners and sources
                target.retain(internal);
                target.retain(source.on("diff", function(sender, evt) {
                    var diffs = [];
                    nx.each(evt.diffs, function(diff, idx) {
                        var drop, join, pos, additions, listeners;
                        switch (diff[0]) {
                            case "splice":
                                pos = diff[1], drop = evt.drops[idx], join = evt.joins[idx];
                                // listeners
                                listeners = join.map(function(source, idx) {
                                    return internal.listen(source, pos + idx);
                                });
                                additions = listeners.map(function(listener) {
                                    return listener.value;
                                });
                                // sync listeners, release removed ones
                                internal.shift(pos + drop.length, join.length - drop.length);
                                drop = nx.func.apply(splice, internal.listeners, pos, drop.length, listeners);
                                // release droped
                                nx.each(drop, function(listener) {
                                    listener.release();
                                });
                                // add diffs
                                diffs.push(["splice", pos, drop.length, additions]);
                                break;
                            case "move":
                                internal.move(diff[1], diff[2], diff[3]);
                                diffs.push(diff.slice());
                                break;
                        }
                    });
                    diffs.length && target.differ(diffs);
                }));
                return target;
            },
            tuple: function(source, size, circle, updater) {
                var target = new nx.List();
                var internal = {
                    tuples: [],
                    resources: [],
                    changed: null,
                    lock: function(callback) {
                        internal.changed = [];
                        callback();
                        internal.changed = null;
                    },
                    shift: function(from) {

                    }
                };
                target.retain(source.on("diff", function(sender, evt) {
                    var diffs = [];
                    nx.each(evt.diffs, function(diff, idx) {
                        var drop, join, pos, additions, listeners;
                        switch (diff[0]) {
                            case "splice":
                                pos = diff[1], drop = evt.drops[idx], join = evt.joins[idx];
                                // listeners
                                listeners = join.map(function(source, idx) {
                                    return internal.listen(source, pos + idx);
                                });
                                additions = listeners.map(function(listener) {
                                    return listener.value;
                                });
                                // sync listeners, release removed ones
                                internal.shift(pos + drop.length, join.length - drop.length);
                                drop = nx.func.apply(splice, internal.listeners, pos, drop.length, listeners);
                                // release droped
                                nx.each(drop, function(listener) {
                                    listener.release();
                                });
                                // add diffs
                                diffs.push(["splice", pos, drop.length, additions]);
                                break;
                            case "move":
                                internal.move(diff[1], diff[2], diff[3]);
                                diffs.push(diff.slice());
                                break;
                        }
                    });
                    diffs.length && target.differ(diffs);
                }));
                return target;
            },
            mapeach: function(source, as, mappings) {
                // variable arguments
                if (typeof as !== "string") {
                    mappings = as;
                    as = "$origin";
                }
                // create the target
                var target = new nx.List();
                // preprocess mappings
                mappings = (function(mappings) {
                    var has, o = {};
                    nx.each(mappings, function(mapping, key) {
                        var def = {};
                        // get the binding object
                        if (!nx.is(mapping, nx.binding)) {
                            if (nx.is(mapping, "String") || nx.is(mapping, "Function")) {
                                mapping = nx.binding(mapping);
                            } else if (nx.is(mapping, "Array")) {
                                mapping = nx.binding.apply(mapping);
                            } else if (mapping.paths || mapping.handler) {
                                mapping = nx.binding(mapping);
                            } else {
                                throw new Error("Malformed mapping definition");
                            }
                        }
                        // check if set 'as'
                        if (as === "$origin" && mapping.paths) {
                            mapping.paths = mapping.paths.map(function(path) {
                                return as + "." + path;
                            });
                        }
                        // get the intention of summarizing
                        if (key.charAt(0) === "+") {
                            def.summarize = "0";
                            key = key.substring(1);
                        } else if (key.charAt(key.length - 1) === "+") {
                            def.summarize = "1";
                            key = key.substring(0, key.length - 1);
                        }
                        // mark it
                        def.binding = mapping;
                        def.path = key;
                        o[key.replace(/\./g, "\\$")] = def;
                        has = true;
                    });
                    if (!has && as === "$origin") {
                        throw new Error("Missing mapping definition.");
                    }
                    return o;
                })(mappings);
                // create internal resource manager
                var internal;
                var Item = (function() {
                    var properties = {};
                    // create resource properties
                    properties.index = -1;
                    properties[as] = null;
                    nx.each(mappings, function(mapping, key) {
                        var v = {};
                        v.value = mapping.binding;
                        properties[key + "$value"] = v;
                        if (mapping.summarize) {
                            v.watcher = function(pname, pvalue, poldvalue) {
                                this._index >= 0 && internal.shift(this._index + 1, key, (pvalue || 0) - (poldvalue || 0));
                            };
                            properties[key + "$sum"] = null;
                        }
                    });
                    if (as !== "$origin") {
                        // create value properties
                        nx.each(mappings, function(mapping, key) {
                            if (key.indexOf("$") === -1) {
                                properties[key] = null;
                            }
                        });
                    }
                    return nx.define({
                        properties: properties
                    });
                })();
                internal = {
                    values: [],
                    resources: [],
                    locked: false,
                    create: function(source) {
                        var item = new Item();
                        item[as].call(item, source);
                        return item;
                    },
                    lock: function(callback) {
                        internal.locked = true;
                        callback();
                        internal.locked = false;
                    },
                    shift: function(from, key, delta) {
                        if (!internal.locked) {
                            var i, resource, sum;
                            for (i = from; i < internal.resources.length; i++) {
                                resource = internal.resources[i];
                                sum = resource["_" + key + "$sum"];
                                resource[key + "$sum"].call(resource, sum + delta);
                            }
                        }
                    },
                    splice: function(from, ndrop, resources, values, dropping) {
                        var vdrops = nx.func.apply(splice, internal.values, from, ndrop, values);
                        var rdrops = nx.func.apply(splice, internal.resources, from, ndrop, resources);
                        var i, shifted, deltas, resource;
                        // update the index of incomings
                        nx.each(resources, function(resource, idx) {
                            resource.index(from + idx);
                        });
                        // get shifted and deltas
                        shifted = resources.length - rdrops.length;
                        deltas = {};
                        nx.each(mappings, function(mapping, key) {
                            var sum, val, last;
                            var summarize = mapping.summarize;
                            if (summarize) {
                                last = internal.resources[from - 1];
                                sum = last ? last["_" + key + "$sum"] : 0;
                                val = last ? last["_" + key + "$value"] : 0;
                            }
                            nx.each(rdrops, function(resource) {
                                if (summarize) {
                                    // update deltas with drops
                                    deltas[key] = deltas[key] || 0;
                                    deltas[key] -= resource["_" + key + "$value"] || 0;
                                }
                            });
                            nx.each(resources, function(resource, idx) {
                                // update the summarize value
                                if (summarize) {
                                    // update deltas with joins
                                    deltas[key] = deltas[key] || 0;
                                    deltas[key] += resource["_" + key + "$value"] || 0;
                                    // update the sum/val variables
                                    sum += val;
                                    val = resource["_" + key + "$value"];
                                    // update the sum of resource
                                    resource[key + "$sum"].call(resource, sum);
                                }
                            });
                        });
                        // process droped resources
                        dropping(rdrops);
                        // initialize all mappings on each resource
                        nx.each(mappings, function(mapping, key) {
                            var path = mapping.path;
                            var summarize = mapping.summarize;
                            nx.each(resources, function(resource, idx) {
                                var value = values[idx];
                                // extend value if property not exists
                                if (key.indexOf("$") === -1 && !value[key]) {
                                    nx.Object.extendProperty(value, key, {});
                                }
                                // apply binding
                                var binding = (function() {
                                    switch (summarize) {
                                        case "0":
                                            return nx.binding(key + "$sum");
                                        case "1":
                                            return nx.binding(key + "$value," + key + "$sum", function(a, b) {
                                                return a + b;
                                            });
                                        default:
                                            return nx.binding(key + "$value");
                                    }
                                })();
                                resource.retain(nx.Object.binding(resource, binding, function(val) {
                                    nx.path(value, path, val);
                                }));
                            });
                        });
                        // shift resources behind
                        for (i = from + resources.length; i < internal.resources.length; i++) {
                            resource = internal.resources[i];
                            resource.index(resource.index() + shifted);
                            nx.each(deltas, function(delta, key) {
                                var sum = resource["_" + key + "$sum"];
                                resource[key + "$sum"].call(resource, sum + delta);
                            });
                        }
                    },
                    move: function(i, n, d) {
                        var deltas, movements = [
                            [i, n, d, {}],
                            d > 0 ? [i + n, d, -n, {}] : [i + d, -d, n, {}]
                        ];
                        // summarize all shifts
                        nx.each(movements, function(movement, index) {
                            var p, resource, resources = internal.resources;
                            for (p = 0; p < movement[1]; p++) {
                                resource = resources[movement[0] + p];
                                nx.each(mappings, function(mapping, key) {
                                    if (mapping.summarize) {
                                        movement[3][key] = (movement[3][key] || 0) + resource["_" + key + "$value"];
                                    }
                                });
                            }
                        });
                        // swap deltas of movements
                        deltas = movements[0][3];
                        movements[0][3] = movements[1][3];
                        movements[1][3] = deltas;
                        // do all shifts: index and all keys
                        nx.each(movements, function(movement, index) {
                            var sign = mathsign(movement[2]);
                            var p, resource, resources = internal.resources;
                            for (p = 0; p < movement[1]; p++) {
                                resource = resources[movement[0] + p];
                                resource.index(resource._index + movement[2]);
                                nx.each(movement[3], function(delta, key) {
                                    var sum = resource["_" + key + "$sum"];
                                    resource[key + "$sum"].call(resource, sum + sign * delta);
                                });
                            }
                        });
                        nx.func.apply(splice, internal.resources, i + d, 0, internal.resources.splice(i, n));
                    }
                };
                target.retain(source.monitorDiff(function(evt) {
                    // diffs of target
                    var diffs = [];
                    nx.each(evt.diffs, function(diff, idx) {
                        switch (diff[0]) {
                            case "splice":
                                var from = diff[1];
                                var drop = evt.drops[idx];
                                var join = evt.joins[idx];
                                var rjoin = join.map(internal.create);
                                var vjoin = join.map(function(value, idx) {
                                    return as === "$origin" ? value : rjoin[idx];
                                });
                                // splice them
                                internal.lock(function() {
                                    internal.splice(from, drop.length, rjoin, vjoin, function(rdrops) {
                                        nx.each(rdrops, function(resource) {
                                            resource.release();
                                        });
                                    });
                                });
                                // append diff
                                if (drop.length || vjoin.length) {
                                    diff && diffs.push(["splice", from, drop.length, vjoin]);
                                }
                                break;
                            case "move":
                                internal.lock(function() {
                                    internal.move(diff[1], diff[2], diff[3]);
                                });
                                diffs.push(diff.slice());
                                break;
                        }
                    });
                    diffs.length && target.differ(diffs);
                }));
                return target;
            },
            /**
             * Sync a target list as several source lists' concatenate list.
             *
             * @method concatenate
             * @param async (Optional) Default false.
             * @param sources Array or list of sources.
             * @return resource for release this concatenate.
             */
            concatenate: function(async, sources) {
                // optional arguments
                if (typeof async !== "boolean") {
                    sources = async;
                    async = false;
                }
                if (nx.is(sources, "Array")) {
                    sources = new EXPORT(sources);
                }
                // create the target
                var target = new EXPORT();
                // prepare lengths and starts
                var internal = {
                    diffs: [],
                    resources: [],
                    affect: function() {
                        target.differ(internal.diffs || []);
                        internal.diffs = [];
                    },
                    differ: function(diffs, immediate) {
                        internal.diffs = internal.diffs.concat(diffs);
                        if (async && !immediate) {
                            // TODO asynchronizely affect, e.g. timeout-zero, animation-frame, etc.
                        } else {
                            internal.affect();
                        }
                    },
                    shift: function(since, shifted, delta) {
                        var i;
                        for (i = since; i < internal.resources.length; i++) {
                            internal.resources[i].index += shifted;
                            internal.resources[i].start += delta;
                        }
                    },
                    create: function(source) {
                        var resource = new nx.Object();
                        resource.retain(source.on("diff", function(sender, evt) {
                            resource.differ(evt.diffs);
                        }));
                        resource.differ = function(diffs) {
                            diffs = diffs.slice();
                            var i, diff, delta = 0;
                            for (i = 0; i < diffs.length; i++) {
                                diff = diffs[i] = diffs[i].slice();
                                diff[1] += resource.start;
                                switch (diff[0]) {
                                    case "splice":
                                        delta -= diff[2];
                                        delta += diff[3].length;
                                        break;
                                    case "move":
                                        // fine to do nothing
                                        break;
                                }
                            }
                            resource.length += delta;
                            delta && internal.shift(resource.index + 1, 0, delta);
                            internal.differ(diffs);
                        };
                        return resource;
                    },
                    splice: function(from, ndrop, resources, values, dropping) {
                        var rdrops = nx.func.apply(splice, internal.resources, from, ndrop, resources);
                        var i, shifted, drop, join, start, end;
                        end = start = internal.resources[from - 1] ? internal.resources[from - 1].start + internal.resources[from - 1].length : 0;
                        // get shifted and delta
                        shifted = resources.length - rdrops.length;
                        drop = 0, join = [];
                        nx.each(rdrops, function(resource) {
                            drop += resource.length;
                        });
                        nx.each(resources, function(resource, idx) {
                            var value = values[idx];
                            resource.index = from + idx;
                            resource.start = end;
                            resource.length = value.length();
                            end += resource.length;
                            join = join.concat(value.data());
                        });
                        // process droped resources
                        dropping(rdrops);
                        // shift resources behind
                        if (shifted || (join.length - drop)) {
                            internal.shift(from + resources.length, shifted, join.length - drop);
                        }
                        // return the diff
                        if (drop || join.length) {
                            return ["splice", start, drop, join];
                        }
                    },
                    move: function(i, n, d) {
                        var resources = internal.resources;
                        var start = resources[i].start;
                        var deltas, movements = [
                            [i, n, d, 0],
                            d > 0 ? [i + n, d, -n, 0] : [i + d, -d, n, 0]
                        ];
                        // summarize all shifts
                        nx.each(movements, function(movement, index) {
                            var p, resource, resources = internal.resources;
                            for (p = 0; p < movement[1]; p++) {
                                resource = resources[movement[0] + p];
                                movement[3] += resource.length;
                            }
                        });
                        // swap deltas of movements
                        deltas = movements[0][3];
                        movements[0][3] = movements[1][3];
                        movements[1][3] = deltas;
                        // do all shifts: index and all keys
                        nx.each(movements, function(movement, index) {
                            var sign = mathsign(movement[2]);
                            var p, resource, resources = internal.resources;
                            for (p = 0; p < movement[1]; p++) {
                                resource = resources[movement[0] + p];
                                resource.index += movement[2];
                                resource.start += sign * movement[3];
                            }
                        });
                        nx.func.apply(splice, internal.resources, i + d, 0, internal.resources.splice(i, n));
                        if (movements[0][3] && movements[1][3]) {
                            return ["move", start, movements[1][3], mathsign(d) * movements[0][3]];
                        }
                    },
                    release: function() {
                        internal.affect();
                        nx.each(internal.resources, function(resource) {
                            resource.release();
                        });
                    }
                };
                // sync listeners and sources
                target.retain(internal);
                target.retain(sources.monitorDiff(function(evt) {
                    var diffs = [];
                    nx.each(evt.diffs, function(diff, idx) {
                        var from, drop, join, rjoin, vjoin;
                        switch (diff[0]) {
                            case "splice":
                                var from = diff[1];
                                var drop = evt.drops[idx];
                                var join = evt.joins[idx];
                                var rjoin = join.map(internal.create);
                                // splice them
                                diff = internal.splice(from, drop.length, rjoin, join, function(rdrops) {
                                    nx.each(rdrops, function(resource) {
                                        resource.release();
                                    });
                                });
                                break;
                            case "move":
                                diff = internal.move(diff[1], diff[2], diff[3]);
                                break;
                        }
                        // append diff
                        diff && diffs.push(diff);
                    });
                    diffs.length && internal.differ(diffs, true);
                }));
                return target;
            },
            /**
             * Affect target to be the cross list of sources lists.
             * Release object could stop the dependencies.
             *
             * @method cross
             * @param sources {Array of List}
             * @return an object with release method
             * @static
             */
            cross: function(sources) {
                var target = new nx.List();
                var counter = new nx.Counter();
                if (nx.is(sources, Array)) {
                    sources = new nx.List(sources);
                }
                target.retain(counter.on("increase", function(o, evt) {
                    if (evt.count == sources.length()) {
                        target.push(evt.item);
                    }
                }));
                target.retain(counter.on("decrease", function(o, evt) {
                    if (evt.count == sources.length() - 1) {
                        target.remove(evt.item);
                    }
                }));
                target.retain(sources.monitorContaining(function(source) {
                    return source.monitorContaining(function(item) {
                        counter.increase(item, 1);
                        return function() {
                            counter.decrease(item, 1);
                        };
                    });
                }));
                return target;
            },
            /**
             * Affect target to be the union list of sources lists.
             * Release object could stop the dependencies.
             *
             * @method union
             * @param sources {Array of List}
             * @return an object with release method
             * @static
             */
            union: function(sources) {
                var target = new nx.List();
                var counter = new nx.Counter();
                if (nx.is(sources, Array)) {
                    sources = new nx.List(sources);
                }
                target.retain(counter.on("increase", function(o, evt) {
                    if (evt.count === 1) {
                        target.push(evt.item);
                    }
                }));
                target.retain(counter.on("decrease", function(o, evt) {
                    if (evt.count === 0) {
                        target.remove(evt.item);
                    }
                }));
                target.retain(sources.monitorContaining(function(source) {
                    return source.monitorContaining(function(item) {
                        counter.increase(item, 1);
                        return function() {
                            counter.decrease(item, 1);
                        };
                    });
                }));
                return target;
            },
            /**
             * Affect target to be the complement list of sources lists.
             * Release object could stop the dependencies.
             *
             * @method complement
             * @param sources {Array of List}
             * @return an object with release method
             * @static
             */
            complement: function(sources) {
                var target = new nx.List();
                var counter = new nx.Counter();
                var length = sources.length;
                target.retain(counter.on("count", function(o, evt) {
                    var previous = evt.previousCount,
                        count = evt.count;
                    if (previous < length && count >= length) {
                        target.push(evt.item);
                    }
                    if (previous >= length && count < length) {
                        target.remove(evt.item);
                    }
                }));
                target.retain(sources[0].monitorContaining(function(item) {
                    counter.increase(item, length);
                    return function() {
                        counter.decrease(item, length);
                    };
                }));
                nx.each(sources, function(coll, index) {
                    if (index > 0) {
                        target.retain(coll.monitorContaining(function(item) {
                            counter.decrease(item);
                            return function() {
                                counter.increase(item);
                            };
                        }));
                    }
                });
                return target;
            },
            /**
             * Affect target to be the symmetric difference list of sources lists.
             * Release object could stop the dependencies.
             * The name 'delta' is the symbol of this calculation in mathematics.
             * @reference {http://en.wikipedia.org/wiki/Symmetric_difference}
             * @method delta
             * @param target {List}
             * @param sources {Array of List}
             * @return an object with release method
             * @static
             */
            delta: function(sources) {
                var target = new nx.List();
                nx.each(sources, function(coll) {
                    target.retain(coll.monitorContaining(function(item) {
                        target.toggle(item);
                        return function() {
                            if (!target.__released__) {
                                target.toggle(item);
                            }
                        };
                    }));
                });
                return target;
            },
            /**
             * Affect target to be the equivalent list of the first empty list or the last list.
             * Release object could stop the dependencies.
             *
             * @method and
             * @param sources {Array of List}
             * @return an object with release method
             * @static
             */
            and: function(sources) {
                var target = new nx.List();
                var iterate = function(idx) {
                    var watcher, resource, coll = sources[idx];
                    if (idx === sources.length - 1) {
                        return coll.monitorContaining(function(item) {
                            target.push(item);
                            return function() {
                                if (!target.__released__) {
                                    target.remove(item);
                                }
                            };
                        });
                    }
                    return coll.watch("length", function(n, v) {
                        if (v) {
                            return iterate(idx + 1);
                        }
                    });
                };
                target.retain(iterate(0));
                return target;
            },
            /**
             * Affect target to be the equivalent list of the first non-empty list.
             * Release object could stop the dependencies.
             *
             * @method or
             * @param sources {Array of List}
             * @return an object with release method
             * @static
             */
            or: function(sources) {
                var target = new nx.List();
                var iterate = function(index) {
                    var coll = sources[index];
                    return coll.watch("length", function(name, value) {
                        if (index < sources.length - 1 && !value) {
                            return iterate(index + 1);
                        } else {
                            return coll.monitorContaining(function(item) {
                                target.push(item);
                                return function() {
                                    if (!target.__released__) {
                                        target.remove(item);
                                    }
                                };
                            });
                        }
                    });
                };
                target.retain(iterate(0));
                return target;
            }
        }
    });

})(nx);
