/**
 * @class string
 * @namespace nx
 */
nx.string = {
    camelize: function (str) {
        return str.replace(/-\w/g, function (c) {
            return c.charAt(1).toUpperCase();
        });
    },
    uncamelize: function (str) {
        return str.replace(/[A-Z]/g, function (c) {
            return "-" + c.toLowerCase();
        });
    }
};
