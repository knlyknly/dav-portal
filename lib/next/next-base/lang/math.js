(function (nx) {
    function precised(f) {
        return function (param) {
            var v = f(param);
            return EXPORT.approximate(v, 0) ? 0 : v;
        }
    }

    nx.math = {
        approximate: function (a, b, precision) {
            precision = precision || 1e-10;
            var v = a - b;
            return v < precision && v > -precision;
        },
        square: function (v) {
            return v * v;
        },
        sin: precised(Math.sin),
        cos: precised(Math.cos),
        tan: precised(Math.tan),
        cot: function (a) {
            var tan = Math.tan(a);
            if (tan > 1e10 || tan < -1e10) {
                return 0;
            }
            return 1 / tan;
        },
        zero: function () {
            return 0
        },
        one: function () {
            return 1;
        },
        and: function () {
            var i, result = !!arguments[0];
            for (i = 1; i < arguments.length; i++) {
                result = result && arguments[i];
            }
            return result;
        },
        or: function () {
            var i, result = !!arguments[0];
            for (i = 1; i < arguments.length; i++) {
                result = result || arguments[i];
            }
            return result;
        },
        not: function (x) {
            return !x;
        },
        square: function (x) {
            return x * x;
        },
        plus: function () {
            var x = arguments[0] || 0;
            for (i = 1; i < arguments.length; i++) {
                x += arguments[i];
            }
            return x;
        },
        multiply: function () {
            var x = arguments[0] || 1;
            for (i = 1; i < arguments.length; i++) {
                x *= arguments[i];
            }
            return x;
        },
        divide: function (a, b) {
            return a / b;
        },
        minus: function (a, b) {
            return a - b;
        },
        sign: function (v) {
            return v < 0 ? -1 : (v > 0 ? 1 : 0);
        }
    };
})(nx)
