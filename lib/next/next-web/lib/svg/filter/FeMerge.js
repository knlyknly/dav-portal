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
