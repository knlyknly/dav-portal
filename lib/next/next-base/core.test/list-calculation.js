module("list-calculation");

test("select", function() {
    var source = new nx.List([1, 2, 4, 5]);
    // target tests
    var target = nx.List.select(source, function(n) {
        return n >= 3;
    });
    equalSet(target.data(), [4, 5], "On init, result correct.");
    source.push(3, 10);
    equalSet(target.data(), [3, 4, 5, 10], "On add matched item, result correct.");
    source.push(-10, -20);
    equalSet(target.data(), [3, 4, 5, 10], "On add unmatched item, result correct.");
    source.push(-1, 6);
    equalSet(target.data(), [3, 4, 5, 6, 10], "On add both item, result correct.");
    source.remove(3, 4);
    equalSet(target.data(), [5, 6, 10], "On remove matched item, result correct.");
    source.remove(-10, 1);
    equalSet(target.data(), [5, 6, 10], "On remove unmatched item, result correct.");
    source.remove(2, 10);
    equalSet(target.data(), [5, 6], "On remove both item, result correct.");
    target.release();
    equalSet(target.data(), [], "On release, result empty.");
    source.push(1, 2, 3, 4);
    equalSet(target.data(), [], "On add after release, result not effected correct.");
    source.remove(-20, 5, 6);
    equalSet(target.data(), [], "On remove after release, result not effected correct.");
});

test("mapping", function() {
    var source = new nx.List([1, 2, 4]);
    // target tests
    var target = nx.List.mapping(source, function(n) {
        return n + 100;
    });
    deepEqual(target.data(), [101, 102, 104], "On init, result correct.");
    source.splice(0, 0, 3);
    deepEqual(target.data(), [103, 101, 102, 104], "On add matched item, result correct.");
    source.remove(1, 4);
    deepEqual(target.data(), [103, 102], "On remove item, result correct.");
    source.move(1, 1, -1);
    deepEqual(target.data(), [102, 103], "On move item, result correct.");
    target.release();
    deepEqual(target.data(), [102, 103], "On release, result not effected correct.");
    source.push(1, 3, 5);
    deepEqual(target.data(), [102, 103], "On add after release, result not effected correct.");
    source.remove(2, 5);
    deepEqual(target.data(), [102, 103], "On remove after release, result not effected correct.");
});

test("mapping key", function() {
    var Item = nx.define({
        properties: {
            x: 0
        },
        statics: {
            create: function(v) {
                var item = new Item();
                item.x(v);
                return item;
            }
        }
    });
    var i1 = Item.create(0);
    var i2 = Item.create(1);
    var i3 = Item.create(2);
    var source = new nx.List([i1, i2]);
    // target tests
    var target = nx.List.mapping(source, "x");
    deepEqual(target.data(), [0, 1], "On init, result correct.");
    i2.x(10);
    deepEqual(target.data(), [0, 10], "On change init item, result correct.");
    source.splice(0, 0, i3);
    deepEqual(target.data(), [2, 0, 10], "On add matched item, result correct.");
    i3.x(20);
    deepEqual(target.data(), [20, 0, 10], "On change added item, result correct.");
    source.remove(i1);
    deepEqual(target.data(), [20, 10], "On remove item, result correct.");
    source.move(0, 1, 1);
    deepEqual(target.data(), [10, 20], "On move item, result correct.");
    i1.x(100);
    deepEqual(target.data(), [10, 20], "On change removed item, result correct.");
    target.release();
    deepEqual(target.data(), [10, 20], "On release, result not effected correct.");
    i3.x(2);
    deepEqual(target.data(), [10, 20], "On change item after release, result not effected correct.");
    source.push(i1);
    deepEqual(target.data(), [10, 20], "On add after release, result not effected correct.");
    source.remove(i2);
    deepEqual(target.data(), [10, 20], "On remove after release, result not effected correct.");
});

test("mapping binding", function() {
    var Item = nx.define({
        properties: {
            x: 0
        },
        statics: {
            create: function(v) {
                var item = new Item();
                item.x(v);
                return item;
            }
        }
    });
    var i1 = Item.create(1);
    var i2 = Item.create(2);
    var i3 = Item.create(3);
    var source = new nx.List([i1, i2]);
    // target tests
    var target = nx.List.mapping(source, "x", true, function(opr, x) {
        opr.set(x * x);
    });
    deepEqual(target.data(), [1, 4], "On init, result correct.");
    i2.x(10);
    deepEqual(target.data(), [1, 100], "On change init item, result correct.");
    source.splice(0, 0, i3);
    deepEqual(target.data(), [9, 1, 100], "On add matched item, result correct.");
    i3.x(-10);
    deepEqual(target.data(), [100, 1, 100], "On change added item, result correct.");
    source.remove(i2);
    deepEqual(target.data(), [100, 1], "On remove item, result correct.");
    i2.x(100);
    deepEqual(target.data(), [100, 1], "On change removed item, result correct.");
    source.move(0, 1, 1);
    deepEqual(target.data(), [1, 100], "On remove item, result correct.");
    i3.x(9);
    deepEqual(target.data(), [1, 81], "On change moved item, result correct.");
    target.release();
    deepEqual(target.data(), [1, 81], "On release, result not effected correct.");
    i3.x(2);
    deepEqual(target.data(), [1, 81], "On change item after release, result not effected correct.");
    source.push(i2);
    deepEqual(target.data(), [1, 81], "On add after release, result not effected correct.");
    source.remove(i1);
    deepEqual(target.data(), [1, 81], "On remove after release, result not effected correct.");
});

false && test("mapping release each", function() {
    var tlist = [];
    var source = new nx.List([1, 2, 3]);
    var target = nx.List.mapping(source, function(n) {
        tlist.push(-n);
        return {
            release: function() {
                tlist.splice(tlist.indexOf(-n), 1);
            }
        };
    });
    deepEqual(tlist, [-1, -2, -3], "On init, result correct.");
    source.push(4);
    deepEqual(tlist, [-1, -2, -3, -4], "On add, result correct.");
    source.remove(2);
    deepEqual(tlist, [-1, -3, -4], "On remove, result correct.");
    source.splice(1, 0, 2);
    deepEqual(tlist, [-1, -3, -4, -2], "On splice add, result correct.");
    source.splice(1, 2, 5);
    deepEqual(tlist, [-1, -4, -5], "On splice, result correct.");
    source.move(1, 1, 1);
    source.remove(5);
    deepEqual(tlist, [-1, -4], "On remove after move, result correct.");
});

false && test("tuple 2 linear", function() {
    var list = new nx.List([1, 3, 5, 7, 9]);
    var target = nx.List.tuple(list, 2);
    deepEqual(target.data(), Array([1, 3], [3, 5], [5, 7], [7, 9]), "init correct");
    list.push(11, 13);
    deepEqual(target.data(), Array([1, 3], [3, 5], [5, 7], [7, 9], [9, 11], [11, 13]), "push correct");
    list.splice(2, 0, 4);
    deepEqual(target.data(), Array([1, 3], [3, 4], [4, 5], [5, 7], [7, 9], [9, 11], [11, 13]), "insert correct");
    list.splice(4, 1, 8);
    deepEqual(target.data(), Array([1, 3], [3, 4], [4, 5], [5, 8], [8, 9], [9, 11], [11, 13]), "replace correct");
    list.pop();
    deepEqual(target.data(), Array([1, 3], [3, 4], [4, 5], [5, 8], [8, 9], [9, 11]), "pop correct");
    list.remove(3, 4, 5, 8, 9);
    deepEqual(target.data(), Array([1, 11]), "remove correct");
    list.remove(1);
    deepEqual(target.data().length, 0, "boundary down correct");
    list.push(12);
    deepEqual(target.data(), Array([1, 12]), "boundary up correct");
});

false && test("tuple 3 gap 2 loop", function() {
    var list = new nx.List([1, 3, 5, 7, 9]);
    var target = nx.List.tuple(list, 3, 2, true); // loop
    deepEqual(target.data(), Array([1, 3, 5], [5, 7, 9], [9, 1, 3]), "init correct");
    list.push(11, 13); // 1,3,5,7,9,11,13
    deepEqual(target.data(), Array([1, 3, 5], [5, 7, 9], [9, 11, 13], [13, 1, 3]), "push correct");
    list.splice(2, 0, 4); // 1,3,4,5,7,9,11,13
    deepEqual(target.data(), Array([1, 3, 4], [4, 5, 7], [7, 9, 11], [11, 13, 1]), "insert correct");
    list.splice(4, 1, 8);
    deepEqual(target.data(), Array([1, 3, 4], [4, 5, 8], [8, 9, 11], [11, 13, 1]), "replace correct");
    list.pop();
    deepEqual(target.data(), Array([1, 3, 4], [4, 5, 8], [8, 9, 11], [11, 1, 3]), "pop correct");
    list.remove(3, 4, 5, 8);
    deepEqual(target.data(), Array([1, 9, 11], [11, 1, 9]), "remove correct");
    list.remove(1);
    deepEqual(target.data().length, 0, "boundary down correct");
    list.push(12);
    deepEqual(target.data(), Array([9, 11, 12], [12, 9, 11]), "boundary up correct");
});

false && test("tuple linear update", function() {
    var list = new nx.List([1, 3, 5, 7]);
    var target = nx.List.tuple(list, 2, 2, false, function(tuple, v0, v1) {
        return [tuple.length(), tuple.size(), tuple.index(), v0, v1].join(":");
    });
    deepEqual(target.data(), ["0:1:3", "2:5:7"], "init correct");
    list.push(9, 11, 13);
    deepEqual(target.data(), ["0:1:3", "2:5:7", "4:9:11"], "push correct");
    list.splice(2, 0, 4);
    deepEqual(target.data(), ["0:1:3", "2:4:5", "4:7:9", "6:11:13"], "insert correct");
    list.splice(4, 1, 8);
    deepEqual(target.data(), ["0:1:3", "2:4:5", "4:8:9", "6:11:13"], "replace correct");
    list.pop();
    deepEqual(target.data(), ["0:1:3", "2:4:5", "4:8:9"], "pop correct");
    list.remove(3, 4, 5, 8, 9);
    deepEqual(target.data(), ["0:1:11"], "remove correct");
    list.remove(1);
    deepEqual(target.data().length, 0, "boundary down correct");
    list.push(12);
    deepEqual(target.data(), ["0:11:12"], "boundary up correct");
});

test("mapeach", function() {
    var Class = nx.define({
        properties: {
            index: 0,
            earned: 0,
            spent: 0,
            earnedBefore: 0,
            spentTotal: 0
        },
        methods: {
            init: function(data) {
                this.inherited();
                nx.sets(this, data);
            }
        }
    });
    var s1, s2, s3;
    var list = new nx.List([
        s1 = new Class({
            earned: 100,
            spent: 50
        }),
        s2 = new Class({
            earned: 200,
            spent: 30
        })
    ]);
    s3 = new Class({
        earned: 300,
        spent: 20
    });
    // get data
    var data = function() {
        keys = ["index", "earnedBefore", "spentTotal"];
        return target._data.map(function(item) {
            var rslt = [nx.is(item, Class)];
            nx.each(keys, function(key) {
                rslt.push(item[key].call(item));
            });
            return rslt;
        });
    };
    // target tests
    target = nx.List.mapeach(list, {
        "index+": nx.math.one,
        "+earnedBefore": "earned",
        "spentTotal+": "spent"
    });
    deepEqual(data(), Array([true, 1, 0, 50], [true, 2, 100, 80]), "on init, result correct");
    list.unshift(s3);
    deepEqual(data(), Array([true, 1, 0, 20], [true, 2, 300, 70], [true, 3, 400, 100]), "on add, result correct");
    s1.spent(70);
    deepEqual(data(), Array([true, 1, 0, 20], [true, 2, 300, 90], [true, 3, 400, 120]), "on change 'key+', result correct");
    s3.earned(400);
    deepEqual(data(), Array([true, 1, 0, 20], [true, 2, 400, 90], [true, 3, 500, 120]), "on change '+key', result correct");
    list.remove(s1);
    deepEqual(data(), Array([true, 1, 0, 20], [true, 2, 400, 50]), "on remove, result correct");
    list.move(0, 1, 1);
    deepEqual(data(), Array([true, 1, 0, 30], [true, 2, 200, 50]), "on move, result correct");
    target.release();
    deepEqual(data(), [], "on release, target cleared");
});

test("mapeach as", function() {
    var Class = nx.define({
        properties: {
            index: 0,
            earned: 0,
            spent: 0,
            earnedBefore: 0,
            spentTotal: 0
        },
        methods: {
            init: function(data) {
                this.inherited();
                nx.sets(this, data);
            }
        }
    });
    var s1, s2, s3;
    var list = new nx.List([
        s1 = new Class({
            earned: 100,
            spent: 50
        }),
        s2 = new Class({
            earned: 200,
            spent: 30
        })
    ]);
    s3 = new Class({
        earned: 300,
        spent: 20
    });
    // get data
    var data = function() {
        keys = ["index", "earnedBefore", "spentTotal"];
        return target._data.map(function(item) {
            var rslt = [nx.is(item.o(), Class)];
            nx.each(keys, function(key) {
                rslt.push(item[key].call(item));
            });
            return rslt;
        });
    };
    // target tests
    target = nx.List.mapeach(list, "o", {
        "+earnedBefore": "o.earned",
        "spentTotal+": "o.spent"
    });
    deepEqual(data(), Array([true, 0, 0, 50], [true, 1, 100, 80]), "on init, result correct");
    list.unshift(s3);
    deepEqual(data(), Array([true, 0, 0, 20], [true, 1, 300, 70], [true, 2, 400, 100]), "on add, result correct");
    s1.spent(70);
    deepEqual(data(), Array([true, 0, 0, 20], [true, 1, 300, 90], [true, 2, 400, 120]), "on change 'key+', result correct");
    s3.earned(400);
    deepEqual(data(), Array([true, 0, 0, 20], [true, 1, 400, 90], [true, 2, 500, 120]), "on change '+key', result correct");
    list.remove(s1);
    deepEqual(data(), Array([true, 0, 0, 20], [true, 1, 400, 50]), "on remove, result correct");
    list.move(0, 1, 1);
    deepEqual(data(), Array([true, 0, 0, 30], [true, 1, 200, 50]), "on move, result correct");
    target.release();
    deepEqual(data(), [], "on release, target cleared");
});

test("concatenate", function() {
    var a = new nx.List([1, 3, 5]);
    var b = new nx.List([2, 4, 6]);
    var list = new nx.List([a]);
    // target tests
    var target = nx.List.concatenate(list);
    deepEqual(target.data(), [1, 3, 5], "On init, result correct.");
    list.push(b);
    deepEqual(target.data(), [1, 3, 5, 2, 4, 6], "On add list, result correct.");
    a.push(7);
    deepEqual(target.data(), [1, 3, 5, 7, 2, 4, 6], "On add to front list, result correct.");
    b.unshift(0);
    deepEqual(target.data(), [1, 3, 5, 7, 0, 2, 4, 6], "On add to back list, result correct.");
    a.remove(5);
    deepEqual(target.data(), [1, 3, 7, 0, 2, 4, 6], "On remove from front list, result correct.");
    b.remove(2);
    deepEqual(target.data(), [1, 3, 7, 0, 4, 6], "On remove back from list, result correct.");
    a.splice(1, 1, 1.1, 1.2, 1.3);
    deepEqual(target.data(), [1, 1.1, 1.2, 1.3, 7, 0, 4, 6], "On splice front list, result correct.");
    b.splice(2, 1, 8, 10, 12);
    deepEqual(target.data(), [1, 1.1, 1.2, 1.3, 7, 0, 4, 8, 10, 12], "On splice back list, result correct.");
    list.move(0, 1, 1);
    deepEqual(target.data(), [0, 4, 8, 10, 12, 1, 1.1, 1.2, 1.3, 7], "On move list, result correct.");
    b.move(0, 1, 4);
    deepEqual(target.data(), [4, 8, 10, 12, 0, 1, 1.1, 1.2, 1.3, 7], "On move item backward, result correct.");
    a.move(4, 1, -4);
    deepEqual(target.data(), [4, 8, 10, 12, 0, 7, 1, 1.1, 1.2, 1.3], "On move item forward, result correct.");
    list.remove(a);
    deepEqual(target.data(), [4, 8, 10, 12, 0], "On remove list, result correct.");
});

test("cross", function() {
    var a = new nx.List([1, 2, 3, 4]);
    var b = new nx.List([2, 3, 4]);
    var c = new nx.List([1, 3, 6]);
    // target tests
    var target = nx.List.cross([a, b, c]);
    equalSet(target.data(), [3], "On init, result correct.");
    b.push(1);
    equalSet(target.data(), [1, 3], "On add, result correct.");
    a.remove(3);
    equalSet(target.data(), [1], "On remove, result correct.");
    target.release();
    equalSet(target.data(), [1], "On release, result not effected correct.");
    c.push(5);
    equalSet(target.data(), [1], "On add after release, result not effected correct.");
    c.remove(1);
    equalSet(target.data(), [1], "On remove after release, result not effected correct.");
});

test("union", function() {
    var a = new nx.List([1, 2, 3, 4]);
    var b = new nx.List([2, 3, 4]);
    var c = new nx.List([1, 3, 5]);
    // target tests
    var target = nx.List.union([a, b, c]);
    equalSet(target.data(), [1, 2, 3, 4, 5], "On init, result correct.");
    b.push(6);
    equalSet(target.data(), [1, 2, 3, 4, 5, 6], "On add, result correct.");
    a.remove(2);
    equalSet(target.data(), [1, 2, 3, 4, 5, 6], "On remove, result not effected correct.");
    b.remove(2);
    equalSet(target.data(), [1, 3, 4, 5, 6], "On remove, result correct.");
    target.release();
    equalSet(target.data(), [1, 3, 4, 5, 6], "On release, result not effected correct.");
    c.push(7);
    equalSet(target.data(), [1, 3, 4, 5, 6], "On add after release, result not effected correct.");
    b.remove(5, 6);
    equalSet(target.data(), [1, 3, 4, 5, 6], "On remove after release, result not effected correct.");
});
test("complement", function() {
    var a = new nx.List([1, 2, 3, 4]);
    var b = new nx.List([2, 3, 5]);
    var c = new nx.List([4]);
    // target tests
    var target = nx.List.complement([a, b, c]);
    equalSet(target.data(), [1], "On init, result correct.");
    a.push(6, 7, 8);
    equalSet(target.data(), [1, 6, 7, 8], "On add, result correct.");
    a.remove(2);
    equalSet(target.data(), [1, 6, 7, 8], "On remove, result not effected correct.");
    b.push(6);
    equalSet(target.data(), [1, 7, 8], "On remove, result not effected correct.");
    c.push(8);
    equalSet(target.data(), [1, 7], "On remove, result not effected correct.");
    a.remove(1);
    equalSet(target.data(), [7], "On remove, result correct.");
    target.release();
    equalSet(target.data(), [7], "On release, result not effected correct.");
    a.push(9);
    equalSet(target.data(), [7], "On add after release, result not effected correct.");
    b.remove(5, 6);
    equalSet(target.data(), [7], "On remove after release, result not effected correct.");
});
test("symmetric difference", function() {
    var a = new nx.List([1, 2, 10, 11, 12]);
    var b = new nx.List([2, 3, 10, 11]);
    var c = new nx.List([3, 1, 10]);
    // target tests
    var target = nx.List.delta([a, b, c]);
    equalSet(target.data(), [10, 12], "On init, result correct.");
    a.remove(10);
    equalSet(target.data(), [12], "On remove, result correct.");
    b.remove(10);
    equalSet(target.data(), [10, 12], "On remove again, result correct.");
    c.remove(10);
    equalSet(target.data(), [12], "On remove third-time, result correct.");
    c.push(21);
    equalSet(target.data(), [12, 21], "On add, result correct.");
    b.push(21);
    equalSet(target.data(), [12], "On add again, result correct.");
    a.push(21);
    equalSet(target.data(), [12, 21], "On add third-time, result correct.");
    target.release();
    equalSet(target.data(), [12, 21], "On release, result not effected correct.");
    a.push(9);
    equalSet(target.data(), [12, 21], "On add after release, result not effected correct.");
    b.remove(2, 10);
    equalSet(target.data(), [12, 21], "On remove after release, result not effected correct.");
});
test("and", function() {
    var a = new nx.List([]);
    var b = new nx.List([1, 2]);
    var c = new nx.List([11, 12]);
    // target tests
    var target = nx.List.and([a, b, c]);
    equalSet(target.data(), [], "On init, result correct.");
    a.push(100);
    equalSet(target.data(), [11, 12], "On add to short-circuit collection, result correct.");
    c.push(13);
    equalSet(target.data(), [11, 12, 13], "On add to hit collection, result correct.");
    b.remove(1, 2);
    equalSet(target.data(), [], "On remove to short-circuit collection, result correct.");
    b.push(1);
    equalSet(target.data(), [11, 12, 13], "On add to second short-circuit collection, result correct.");
    c.remove(11);
    equalSet(target.data(), [12, 13], "On remove to hit collection, result correct.");
    a.remove(100);
    equalSet(target.data(), [], "On remove to first short-circuit collection, result of correct.");
    target.release();
    equalSet(target.data(), [], "On release, result not effected correct.");
    a.push(201);
    equalSet(target.data(), [], "On add after release, result not effected correct.");
    c.remove(11, 12, 13);
    equalSet(target.data(), [], "On remove after release, result not effected correct.");
});
test("or", function() {
    var a = new nx.List([]);
    var b = new nx.List([1, 2]);
    var c = new nx.List([11, 12]);
    // target tests
    var target = nx.List.or([a, b, c]);
    equalSet(target.data(), [1, 2], "On init, result correct.");
    a.push(100);
    equalSet(target.data(), [100], "On add to short-circuit collection, result of correct.");
    a.remove(100);
    equalSet(target.data(), [1, 2], "On remove to short-circuit collection, result of correct.");
    b.push(3);
    equalSet(target.data(), [1, 2, 3], "On add to hit collection, result correct.");
    b.remove(1, 3);
    equalSet(target.data(), [2], "On remove to hit collection, result correct.");
    b.remove(2);
    equalSet(target.data(), [11, 12], "On remove last one to hit collection, result correct.");
    c.push(13);
    equalSet(target.data(), [11, 12, 13], "On add to last hit collection, result correct.");
    c.remove(11);
    equalSet(target.data(), [12, 13], "On remove to last hit collection, result correct.");
    a.push(200);
    equalSet(target.data(), [200], "On add to short-circuit again, result correct.");
    target.release();
    equalSet(target.data(), [200], "On release, result not effected correct.");
    a.push(201);
    equalSet(target.data(), [200], "On add after release, result not effected correct.");
    c.remove(11, 12, 13);
    equalSet(target.data(), [200], "On remove after release, result not effected correct.");
});
