/**
  Copyright 2010-2011 Ondrej Certik <ondrej@certik.cz>
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

var dict = __inherit(object, "dict");

dict.prototype.__init__ = function(args) {
    var items;
    var key;
    var value;

    if (defined(args)) {
        if (defined(args.__iter__)) {
            items = {};
            iterate(iter.__call__(args), function(item) {
                    key = js(item.__getitem__.__call__(0));
                    value = item.__getitem__.__call__(1);
                    items[key] = value;
            });
            this._items = items;
        }
        else
            this._items = args;
    } else {
        this._items = {};
    }
};

dict.prototype.__str__ = function () {
    var strings = [];

    for (var key in this._items) {
        strings.push(js(str.__call__(key)) + ": " + js(str.__call__(this._items[key])));
    }

    return str.__call__("{" + strings.join(", ") + "}");
};

dict.prototype._js_ = function () {
    var items = {};

    var _this_dict = this; // so that we can access it from within the closure:
    iterate(iter.__call__(this), function(key) {
        items[js(key)] = js(_this_dict.__getitem__.__call__(key));
    });

    return items;
};

dict.prototype.__hash__ = function () {
    throw py_builtins.TypeError.__call__("unhashable type: 'dict'");
};

dict.prototype.__len__ = function() {
    var count = 0;

    for (var key in this._items)
        count += 1;

    return _int.__call__(count);
};

dict.prototype.__iter__ = function() {
    return iter.__call__(this.keys.__call__());
};

dict.prototype.__contains__ = function(key) {
    return bool.__call__(defined(this._items[key]));
};

dict.prototype.__getitem__ = function(key) {
    var value = this._items[key];

    if (defined(value)) {
        return value;
    } else {
        throw py_builtins.KeyError.__call__(str.__call__(key));
    }
};

dict.prototype.__setitem__ = function(key, value) {
    this._items[key] = value;
};

dict.prototype.__delitem__ = function(key) {
    if (js(this.__contains__.__call__(key))) {
        delete this._items[key];
    } else {
        throw py_builtins.KeyError.__call__(str.__call__(key));
    }
};

dict.prototype.get = Function(function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        return _value;
    } else {
        if (defined(value)) {
            return value;
        } else {
            return None;
        }
    }
});

dict.prototype.items = Function(function() {
    var items = list.__call__();

    for (var key in this._items) {
        items.append.__call__(tuple.__call__([key, this._items[key]]));
    }

    return items;
});

dict.prototype.keys = Function(function() {
    var keys = list.__call__();

    for (var key in this._items) {
        keys.append.__call__(key);
    }

    return keys;
});

dict.prototype.values = Function(function() {
    var values = list.__call__();

    for (var key in this._items) {
        values.append.__call__(this._items[key]);
    }

    return values;
});

dict.prototype.update = Function(function(other) {
   var _this = this;
   iterate(iter.__call__(other),
     function(key) {
        _this._items[js(key)] = other.__getitem__(key);
     }
   );
});

dict.prototype.clear = Function(function() {
    for (var key in this._items) {
        delete this._items[key];
    }
});

dict.prototype.pop = Function(function(key, value) {
    var _value = this._items[key];

    if (defined(_value)) {
        delete this._items[key];
    } else {
        if (defined(value)) {
            _value = value;
        } else {
            throw py_builtins.KeyError.__call__(str.__call__(key));
        }
    }

    return _value;
});

dict.prototype.popitem = function() {
    var _key;

    for (var key in this._items) {
        _key = key;
        break;
    }

    if (defined(key)) {
        return [_key, this._items[_key]];
    } else {
        throw py_builtins.KeyError.__call__("popitem(): dictionary is empty");
    }
};
