(function(nx) {
    var KEYWORDS = ["name", "events", "properties", "content", "extend"];

    var rSingleStringBinding = /^\{([^\}]*)\}$/;
    var rStringBinding = /\{([^\}]*)\}/g;
    var rBlank = /\s/g;

    var EXPORT = nx.define("nx.Hierarchical", {
        properties: {
            parent: null,
            childDefaultType: "nx.Hierarchical",
            childList: {
                set: function() {
                    throw new Error("Unable to set child list out of Hierarchical.");
                },
                watcher: function(pname, value) {
                    // stop sync with the old child list
                    this.release("syncChildList");
                    // remove all child nodes
                    if (nx.is(value, nx.List)) {
                        var self = this;
                        this.retain("syncChildList", value.monitorDiff(function(evt) {
                            nx.each(evt.diffs, function(diff, idx) {
                                var drops = evt.drops[idx];
                                var joins = evt.joins[idx];
                                nx.each(drops, function(drop) {
                                    if (nx.is(drop, EXPORT)) {
                                        drop.parent(null);
                                    }
                                });
                                nx.each(joins, function(join) {
                                    if (nx.is(join, EXPORT)) {
                                        join.parent(self);
                                    }
                                });
                            });
                        }));
                    }
                }
            }
        },
        methods: {
            init: function() {
                this.inherited();
                // initialize the child list
                this._childList = new nx.List();
                this.notify("childList");
                // initialize the hierarchical definitions
                this.initHierarchy();
            },
            initHierarchy: function() {
                var instance = this;
                var clazz = instance.constructor;
                // get instance's hierarchies of the whole inheritance
                var hierarchical, hierarchicals = [];
                do {
                    hierarchical = clazz.__meta__.hierarchical;
                    if (hierarchical) {
                        // TODO validate structure configuration
                        hierarchicals.unshift(hierarchical);
                    }
                    clazz = clazz.__super__;
                } while (clazz && clazz !== EXPORT);
                // initialize the element in order
                nx.each(hierarchicals, function(hierarchical) {
                    instance.__hierarchical__ = instance.__hierarchical__ || {};
                    nx.each(hierarchical, function(initializer, key) {
                        if (KEYWORDS.indexOf(key) >= 0) {
                            throw new Error("Cannot use hierarchical keyword: " + key);
                        }
                        if (instance.__hierarchical__[key]) {
                            // TODO conflict on inherit path
                        }
                        instance.__hierarchical__[key] = initializer;
                    });
                });
            },
            hierarchicalUpdate: function(meta, context) {
                var self = this;
                context = context || self;
                var resources = new nx.Object();
                // set as a named child
                if (meta.name) {
                    EXPORT.extendProperty(context, meta.name, self);
                }
                // extend hierarchical configurations
                nx.each(self.__hierarchical__, function(hierarchical, key) {
                    if (meta[key]) {
                        resources.retain(hierarchical.call(self, meta[key], context));
                    }
                });
                // bind event on "self" to "context"
                nx.each(meta.events, function(handler, name) {
                    resources.retain(self.hierarchicalUpdateEvent(name, handler, context));
                });
                // set properties of "self"
                nx.each(meta.properties, function(value, key) {
                    resources.retain(self.hierarchicalUpdateProperty(key, value, context));
                });
                // set content of "self" for only Hierarchical
                resources.retain(self.hierarchicalAppend(meta.content, context));
                // set property-as-child extending of "self"
                nx.each(meta.extend, function(meta, key) {
                    var target = nx.path(self, key);
                    if (target) {
                        if (meta.type) {
                            throw new Error("Cannot specify type while extending existing self: " + key);
                        }
                        resources.retain(target.hierarchicalUpdate(meta, context));
                    } else {
                        // TODO key as path
                        // create if specified path not exists
                        target = EXPORT.create(self, meta);
                        // update the target
                        EXPORT.extendProperty(self, key, target);
                        resources.retain(target.hierarchicalUpdate(meta, context));
                    }
                });
                return resources;
            },
            hierarchicalAppend: function(meta, context, list) {
                var self = this;
                var child, type, res, binding, template;
                if (!meta && meta !== 0) {
                    // not an available meta
                    return nx.Object.IDLE_RESOURCE;
                } else if (nx.is(meta, Array)) {
                    return self.hierarchicalAppendArray(meta, context, list);
                } else if (typeof meta === "string") {
                    // text
                    return self.hierarchicalAppendString(meta, context, list);
                } else if (typeof meta === "number") {
                    // number
                    return self.hierarchicalAppendNumber(meta, context, list);
                } else if (nx.is(meta, EXPORT)) {
                    // Hierarchical
                    return self.hierarchicalAppendChildren([meta], context, list);
                } else if (meta instanceof nx.binding) {
                    // binding
                    return self.hierarchicalAppendBinding(meta, context, list);
                } else if (meta instanceof nx.template || !nx.is(meta, nx.Object) && meta.repeat) {
                    // template
                    template = EXPORT.getTemplateByObject(meta) || meta;
                    return self.hierarchicalAppendTemplate(template, context, list);
                } else {
                    // meta
                    child = EXPORT.create(self, meta);
                    // update the child
                    child.retain(child.hierarchicalUpdate(meta, context));
                    res = self.hierarchicalAppendChildren([child], context, list);
                    return {
                        release: function() {
                            if (res) {
                                child.release();
                                res.release();
                                res = null;
                            }
                        }
                    };
                }
            },
            hierarchicalAppendArray: function(meta, context, list) {
                var self = this;
                var resources = new nx.Object();
                nx.each(meta, function(meta) {
                    resources.retain(self.hierarchicalAppend(meta, context, list));
                });
                return resources;
            },
            hierarchicalAppendString: function(meta, context, list) {
                var self = this;
                // check string-style-binding
                binding = EXPORT.getBindingIfString(meta);
                if (binding) {
                    // string-style-binding
                    return self.hierarchicalAppendBinding(binding, context, list);
                }
                return nx.Object.IDLE_RESOURCE;
            },
            hierarchicalAppendNumber: function(meta, context, list) {
                return nx.Object.IDLE_RESOURCE;
            },
            hierarchicalAppendChildren: function(children, context, list) {
                var self = this;
                context = context || self;
                list = EXPORT.getFlatList(self, true, list);
                // append children to self
                list.spliceAll(list.length(), 0, children);
                return {
                    release: function() {
                        if (children) {
                            // TODO optimize
                            list.remove.apply(list, children);
                            children = null;
                        }
                    }
                };
            },
            hierarchicalAppendBinding: function(binding, context, list) {
                var self = this;
                context = context || self;
                list = EXPORT.getFlatList(self, false, list);
                // bind to the list
                var resources = new nx.Object();
                resources.retain(nx.Object.binding(context, binding, function(result) {
                    resources.release("recursive");
                    resources.retain("recursive", self.hierarchicalAppend(result, context, list));
                }));
                return resources;
            },
            hierarchicalAppendTemplate: function(template, context, list) {
                var self = this;
                context = context || self;
                list = EXPORT.getFlatList(self, false, list);
                return new nx.HierarchicalTemplate(self, list, template, context);
            },
            hierarchicalUpdateEvent: function(name, handler, context) {
                var self = this;
                var resources = new nx.Object();
                // preprocess handler
                if (typeof handler === "string") {
                    if (context[handler] && context[handler].__type__ === "method") {
                        handler = context[handler];
                    } else {
                        handler = EXPORT.getBindingIfString(handler, true);
                    }
                }
                // bind or listen on event
                if (handler) {
                    if (nx.is(handler, nx.binding)) {
                        resources.retain(nx.Object.binding(context, handler, function(pvalue) {
                            resources.release("recursive");
                            resources.retain("recursive", self.hierarchicalUpdateEvent(name, pvalue, context));
                        }));
                    } else if (typeof handler === "function") {
                        name = name.indexOf(" ") >= 0 ? name.split(" ") : [name];
                        nx.each(name, function(name) {
                            resources.retain(self.on(name, handler, context));
                        });
                    }
                }
                return resources;
            },
            hierarchicalUpdateProperty: function(key, value, context) {
                var self = this;
                context = context || self;
                // parse "{xxx}"
                value = EXPORT.getBindingIfString(value) || value;
                if (nx.is(value, nx.binding)) {
                    var resources = new nx.Object();
                    return nx.Object.binding(context, value, function(pvalue) {
                        resources.release("recursive");
                        resources.retain("recursive", self.hierarchicalUpdateProperty(key, pvalue, context));
                    });
                    return resources;
                } else {
                    nx.path(self, key, value);
                    return nx.Object.IDLE_RESOURCE;
                }
            }
        },
        statics: {
            extendProperty: function(owner, name, value) {
                if (owner[name]) {
                    // TODO handle name conflict
                    throw new Error("Property name conflict: " + name);
                }
                nx.Object.extendProperty(owner, name, {}, true);
                nx.path(owner, name, value);
            },
            create: function(parent, meta) {
                var type, child;
                // create the child with specified type
                type = (typeof meta.type === "string") ? nx.path(global, meta.type) : meta.type;
                type = (typeof type === "function") ? type : (parent && parent.childDefaultType && parent.childDefaultType());
                type = (typeof type === "string") ? nx.path(global, type) : type;
                type = type || EXPORT;
                child = new type();
                return child;
            },
            getFlatList: function(target, plain, list) {
                // get the default list
                list = list || target._childList;
                // get or create the target list
                var group, last, flat, tmp;
                group = list._concatenate;
                if (!group) {
                    if (plain) {
                        last = list;
                    } else {
                        last = new nx.List();
                        group = new nx.List([list, last]);
                        flat = nx.List.concatenate(group);
                        flat._concatenate = group;
                        if (list === target._childList) {
                            // start with the original list in element
                            // notify the child list change
                            target._childList = flat;
                            target.notify("childList");
                        } else {
                            list._flat.group.splice(list._flat.index, 1, flat);
                        }
                        // update the old list
                        list._flat = {
                            group: group,
                            index: 0
                        };
                        // prepare the new list
                        last._flat = {
                            group: group,
                            index: 1
                        };
                    }
                } else {
                    if (plain) {
                        last = group.get(-1);
                        // create another list if the last one is not plain
                        if (!last._flat.plain) {
                            last = new nx.List();
                            group.push(last);
                            last._flat = {
                                plain: true,
                                group: group,
                                index: group.length() - 1
                            };
                        }
                    } else {
                        last = new nx.List();
                        group.push(last);
                        last._flat = {
                            group: group,
                            index: group.length() - 1
                        };
                    }
                }
                return last;
            },
            getStringBindingByString: function(base) {
                if (base.indexOf("{") >= 0) {
                    if (rSingleStringBinding.test(base)) {
                        return nx.binding(base.substring(1, base.length - 1));
                    }
                    var keys = [];
                    var replacements = {};
                    base.replace(rStringBinding, function(match, key, index) {
                        key = key.replace(rBlank, "");
                        if (key) {
                            if (keys.indexOf(key) === -1) {
                                keys.push(key);
                            }
                            var replacement = replacements[key] = replacements[key] || [];
                            if (replacement.indexOf(match) === -1) {
                                replacement.push(match);
                            }
                        }
                        return "";
                    });
                    // create binding if has key
                    if (keys.length) {
                        return nx.binding(keys, function() {
                            var args = arguments;
                            var result = base;
                            nx.each(keys, function(key, idx) {
                                var value = args[idx];
                                if (typeof value !== "string" && typeof value !== "number") {
                                    if (!value) {
                                        // false/null/undefined/NaN/...
                                        value = "false";
                                    } else if (nx.is(value, nx.Object)) {
                                        value = value.__id__;
                                    } else {
                                        value = "true";
                                    }
                                }
                                nx.each(replacements[key], function(r) {
                                    result = result.replace(r, value);
                                });
                            });
                            return result;
                        });
                    }
                }
                // has not a binding
                return null;
            },
            getBindingIfString: function(value, force) {
                if (nx.is(value, nx.binding)) {
                    return value;
                }
                var path = null;
                // since model is not a pass-through property any further, {path.from.self} would be more useful
                if (value && typeof value === "string") {
                    if (value.charAt(0) === "{" && value.charAt(value.length - 1) === "}") {
                        path = value.substring(1, value.length - 1);
                    } else if (force) {
                        path = value;
                    }
                }
                return path && nx.binding(path);
            },
            getTemplateByObject: function(config) {
                if (!config || nx.is(config, nx.template)) {
                    return config;
                }
                var binding, value = config.repeat;
                if (nx.is(value, nx.binding)) {
                    binding = value;
                } else if (nx.is(value, Array)) {
                    binding = nx.binding(function() {
                        return value;
                    });
                } else if (value && typeof value === "string") {
                    if (value.charAt(0) === "{" && value.charAt(value.length - 1) === "}") {
                        value = value.substring(1, value.length - 1);
                    }
                    binding = nx.binding(value);
                }
                config = nx.extend({}, config);
                delete config.repeat;
                return binding && nx.template(binding, config);
            }
        }
    });
})(nx);
