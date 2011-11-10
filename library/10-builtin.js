/**
  Copyright 2010-2011 Mateusz Paprocki <mattpap@gmail.com>
  Copyright 2011 Christian Iversen <ci@sikkerhed.org>

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
**/

var hasattr = Function(function(obj, name) {
    return defined(obj[name]);
});

var getattr = Function(function(obj, name, value) {
    var _value = obj[name];

    if (defined(_value)) {
        return _value;
    } else {
        if (defined(value)) {
            return value;
        } else {
            throw py_builtins.AttributeError.__call__(obj, name);
        }
    }
});

var setattr = Function(function(obj, name, value) {
    obj[name] = value;
});

var hash = Function(function(obj) {
    if (hasattr(obj, '__hash__')) {
        return obj.__hash__.__call__();
    } else if (typeof(obj) === 'number') {
        return obj === -1 ? -2 : obj;
    } else {
        throw py_builtins.AttributeError.__call__('__hash__');
    }
});

var len = Function(function(obj) {
    if (hasattr(obj, '__len__')) {
        return obj.__len__.__call__();
    } else {
        throw py_builtins.AttributeError.__call__('__len__');
    }
});

var dir = Function(function(obj) {
    var res = list.__call__();
    for (var i in obj) {
        res.append.__call__(__py2js_str.__call__(i));
    }
    return res;
});

var repr = Function(function(obj) {
    if (!defined(obj)) {
        return "None";
    } else if (hasattr(obj, '__repr__')) {
        return obj.__repr__.__call__(obj);
    } else if (hasattr(obj, '__str__')) {
        return obj.__str__.__call__(obj);
    } else if (hasattr(obj, 'toString')) {
        return obj.toString();
    } else {
        throw py_builtins.AttributeError.__call__('__repr__, __str__ or toString not found on ' + typeof(obj));
    }
});

var range = Function(function(start, end, step) {
    start = js(start);

    if (!defined(end)) {
        end = start;
        start = 0;
    } else {
        end = js(end);
    }

    if (!defined(step)) {
        step = 1;
    } else {
        step = js(step);
    }

    var seq = [];

    for (var i = start; i < end; i += step) {
        seq.push(i);
    }

    if (py_builtins.__python3__)
        return iter.__call__(seq);
    else
        return list.__call__(seq);
});

var xrange = Function(function(start, end, step) {
    return iter.__call__(range(start, end, step));
});

var map = Function(function() {
    if (arguments.length < 2) {
        throw py_builtins.TypeError.__call__("map() requires at least two args");
    }

    if (arguments.length > 2) {
        throw py_builtins.NotImplementedError.__call__("only one sequence allowed in map()");
    }

    var func = arguments[0];
    var seq = iter.__call__(arguments[1]);

    var items = list.__call__();

    iterate(seq, function(item) {
        items.append.__call__(func(item));
    });

    if (py_builtins.__python3__)
        return iter.__call__(items);
    else
        return items;
});

var zip = Function(function() {
    if (!arguments.length) {
        return list.__call__();
    }

    var iters = list.__call__();
    var i;

    for (i = 0; i < arguments.length; i++) {
        iters.append.__call__(iter.__call__(arguments[i]));
    }

    var items = list.__call__();

    while (true) {
        var item = list.__call__();

        for (i = 0; i < arguments.length; i++) {
            try {
                var value = iters.__getitem__.__call__(i).next.__call__();
            } catch (exc) {
                if (js(isinstance.__call__(exc, py_builtins.StopIteration))) {
                    return items;
                } else {
                    throw exc;
                }
            }

            item.append.__call__(value);
        }

        items.append.__call__(tuple.__call__(item));
    }
    return None;
});

var isinstance = Function(function(obj, cls) {
    if (cls.__class__ === tuple) {
        var length = cls.__len__.__call__();

        if (js(length.__eq__.__call__($c0))) {
            return False;
        }

        for (var i = 0; i < length; i++) {
            var _cls = cls.__getitem__.__call__(i);

            if (js(isinstance.__call__(obj, _cls))) {
                return True;
            }
        }

        return False;
    } else {
        var c = obj.__class__;
        while (c) {
            if (c === cls)
                return True;
            c = c.__super__;
        }
        return False;
    }
});

py_builtins.bool = function(a) {
    if ((a !== null) && defined(a.__bool__)) {
        return a.__bool__.__call__();
    } else {
        if (a) {
            return True;
        } else {
            return False;
        }
    }
};

py_builtins.eq = function(a, b) {
    if ((a != null) && defined(a.__eq__))
        return a.__eq__.__call__(b);
    else if ((b != null) && defined(b.__eq__))
        return b.__eq__.__call__(a);
    else
        return bool.__call__(a === b);
};

py_builtins._int = Function(function(value) {
    if (typeof(value) === "number") {
        return _int.__call__(parseInt(value, 10));
    } else if (js(isinstance(value, _int))) {
        return value;
    } else if (js(isinstance(value, _float))) {
        return _int.__call__(parseInt(value._obj, 10));
    } else {
        var s = value.toString();
        if (s.match(/^[-+0-9]+$/)) {
            return _int.__call__(parseInt(value, 10));
        } else {
            throw py_builtins.ValueError.__call__("Invalid integer: " + value);
        }
    }
});

py_builtins.__not__ = Function(function(obj) {
   if (hasattr(obj, '__nonzero__')) {
       return py_builtins.bool(!js(obj.__nonzero__.__call__()));
   } else if (hasattr(obj, '__len__')) {
       return py_builtins.bool(js(obj.__len__.__call__()) === 0);
   } else {
       return py_builtins.bool(!js(obj));
   }
});

py_builtins.__is__ = Function(function(a, b) {
    return py_builtins.bool(a === b);
});

py_builtins._float = Function(function(value) {
    if (typeof(value) === "number") {
        return _float.__call__(parseFloat(value));
    } else if (js(isinstance(value, _int))) {
        return _float.__call__(parseFloat(value._obj));
    } else if (js(isinstance(value, _float))) {
        return value;
    } else {
        var s = value.toString();
        if (s.match(/^[-+]?[0-9]+(\.[0-9]*)?$/)) {
            return _float.__call__(parseFloat(value));
        } else {
            throw py_builtins.ValueError.__call__("Invalid float: " + value);
        }
    }
});

py_builtins.max = Function(function(list) {
    if (js(len(list).__eq__.__call__($c0)))
        throw py_builtins.ValueError.__call__("max() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter.__call__(list), function(item) {
                if ((result === null) || js(item.__gt__.__call__(result)))
                    result = item;
        });

        return result;
    }
});

py_builtins.min = Function(function(list) {
    if (js(len(list).__eq__.__call__($c0)))
        throw py_builtins.ValueError.__call__("min() arg is an empty sequence");
    else {
        var result = null;

        iterate(iter.__call__(list), function(item) {
                if ((result === null) || js(item.__lt__.__call__(result)))
                    result = item;
        });

        return result;
    }
});

py_builtins.sum = Function(function(list) {
    var result = 0;

    iterate(iter.__call__(list), function(item) {
        result += js(item);
    });

    return result;
});

py_builtins.print = function(s) {
    if (typeof(console) != "undefined" && defined(console.log)) {
        console.log.apply(null, arguments);
    } else {
        if (arguments.length <= 1) {
            if (defined(s)) {
                print(__py2js_str.__call__(s));
            } else {
                print("");
            }
        } else {
            var args = tuple.__call__(Array.prototype.slice.call(arguments, 0));
            print(__py2js_str.__call__(" ").join.__call__(args));
        }
    }
};

py_builtins.filter = Function(function(f, l) {
   var res = list.__call__();
   iterate(iter.__call__(l), function(item) {
     if (js(py_builtins.bool(f.__call__(item)))) {
       res.append.__call__(item);
     }
   });
   return res;
});

py_builtins.reduce = Function(function(func, seq) {
    var initial;
    if (arguments.length == 3) {
        initial = arguments[2];
    } else {
        initial = null;
    }
    if (len(seq) < 2) {
        return initial;
    }
    var accum, start;
    if (arguments.length == 3) {
        accum = initial;
        start = 0;
    } else {
        accum = func(seq.__getitem__.__call__(0), seq.__getitem__.__call__(1));
        start = 2;
    }
    for (var i = start; i < len(seq); i++) {
        accum = func(accum, seq.__getitem__.__call__(i));
    }
    return accum;
});
