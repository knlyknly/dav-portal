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
