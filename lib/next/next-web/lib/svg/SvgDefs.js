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
