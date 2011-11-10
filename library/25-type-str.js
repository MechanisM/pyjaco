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

var basestring = __inherit(object, "basestring");

var __py2js_str;

basestring.prototype.__init__ = function(s) {
    if (!defined(s)) {
        this._obj = '';
    } else {
        if (typeof(s) === "string") {
            this._obj = s;
        } else if (defined(s.__str__)) {
            this._obj = js(s.__str__.__call__());
        } else if (defined(s.toString)) {
            this._obj = s.toString();
        } else
            this._obj = js(s);
    }
};

var __basestring_real__ = basestring.__call__;

basestring.__call__ = function(obj) {
    if (js(isinstance(obj, basestring))) {
        return obj;
    } else {
        return __basestring_real__(obj);
    }
};

basestring.prototype.__str__ = function () {
    return this;
};

basestring.prototype.__repr__ = function () {
    return "'" + this + "'";
};

basestring.prototype._js_ = function () {
    return this._obj;
};

basestring.prototype.__hash__ = function () {
    var value = 0x345678;
    var length = this.__len__();

    for (var index in this._obj) {
        value = ((1000003*value) & 0xFFFFFFFF) ^ this._obj[index];
        value = value ^ length;
    }

    if (value == -1) {
        value = -2;
    }

    return value;
};

basestring.prototype.__len__ = function() {
    return _int.__call__(this._obj.length);
};

basestring.prototype.__iter__ = function() {
    return iter.__call__(this._obj);
};

basestring.prototype.__mod__ = function(args) {
    return basestring.__call__(sprintf(this, args));
};

basestring.prototype.__bool__ = function() {
    return py_builtins.bool(this._obj);
};

basestring.prototype.__eq__ = function(s) {
    if (typeof(s) === "string")
        return bool.__call__(this._obj == s);
    else if (js(isinstance.__call__(s, basestring)))
        return bool.__call__(this._obj == s._obj);
    else
        return False;
};

basestring.prototype.__gt__ = function(s) {
    if (typeof(s) === "string")
        return bool.__call__(this._obj > s);
    else if (js(isinstance.__call__(s, basestring)))
        return bool.__call__(this._obj > s._obj);
    else
        return False;
};

basestring.prototype.__lt__ = function(s) {
    if (typeof(s) === "string")
        return bool.__call__(this._obj < s);
    else if (js(isinstance.__call__(s, basestring)))
        return bool.__call__(this._obj < s._obj);
    else
        return False;
};

basestring.prototype.__contains__ = function(item) {
    for (var index in this._obj) {
        if (item == this._obj[index]) {
            return True;
        }
    }

    return False;
};

basestring.prototype.__getitem__ = function(index) {
    var seq;
    if (js(isinstance.__call__(index, slice))) {
        var s = index;
        var inds = js(s.indices.__call__(len(this)));
        var start = inds[0];
        var stop = inds[1];
        var step = inds[2];
        seq = "";
        for (var i = start; i < stop; i += step) {
            seq = seq + js(this.__getitem__.__call__(i));
        }
        return this.__class__.__call__(seq);
    } else if ((index >= 0) && (index < js(len(this))))
        return this._obj[index];
    else if ((index < 0) && (index >= -js(len(this))))
        return this._obj[index+js(len(this))];
    else
        throw py_builtins.IndexError.__call__("string index out of range");
};

basestring.prototype.__setitem__ = function(index, value) {
    throw py_builtins.TypeError.__call__("'str' object doesn't support item assignment");
};

basestring.prototype.__delitem__ = function(index) {
    throw py_builtins.TypeError.__call__("'str' object doesn't support item deletion");
};

basestring.prototype.__add__ = function(c) {
    return basestring.__call__(this._obj + c._obj);
};

basestring.prototype.__iadd__ = basestring.prototype.__add__;

basestring.prototype.count = function(needle, start, end) {
    if (!defined(start))
        start = 0;
    if (!defined(end))
        end = null;
    var count = 0;
    var s = js(this.__getitem__.__call__(slice.__call__(start, end)));
    needle = js(str.__call__(needle));
    var idx = s.search(needle);
    while (true) {
        if (idx == -1)
            break;
        if (s === "")
            break;
        count += 1;
        s = s.substr(idx + 1);
//        print("New index: ", idx + 1, "[" + s + "]");
        idx = s.search(needle);
//        print("  res: ", idx);
    }
    return count;
};

basestring.prototype.index = Function(function(value, start, end) {
    if (!defined(start)) {
        start = 0;
    }

    for (var i = js(start); !defined(end) || (start < end); i++) {
        var _value = this._obj[i];

        if (!defined(_value)) {
            break;
        }

        if (_value == value) {
            return _int.__call__(i);
        }
    }

    throw py_builtins.ValueError.__call__("substring not found");
});

basestring.prototype.find = Function(function(s) {
    return this._obj.search(js(s));
});

basestring.prototype.rfind = Function(function(s) {
    var rev = function(s) {
        var a = list.__call__(__py2js_str.__call__(s));
        a.reverse.__call__();
        a = __py2js_str.__call__("").join.__call__(a);
        return a;
    };
    var a = rev(this);
    var b = rev(s);
    var r = a.find.__call__(b);
    if (r == -1)
        return r;
    return len(this) - len(b) - r;
});

basestring.prototype.join = Function(function(s) {
    return __py2js_str.__call__(js(s).join(js(this)));
});

basestring.prototype.replace = Function(function(old, _new, count) {
    old = js(old);
    _new = js(_new);
    var old_s;
    var new_s;

    if (defined(count))
        count = js(count);
    else
        count = -1;
    old_s = "";
    new_s = this._obj;
    while ((count != 0) && (new_s != old_s)) {
        old_s = new_s;
        new_s = new_s.replace(old, _new);
        count -= 1;
    }
    return __py2js_str.__call__(new_s);
});

basestring.prototype.lstrip = Function(function(chars) {
    if (js(len(this)) === 0)
        return this;
    if (defined(chars))
        chars = tuple.__call__(chars);
    else
        chars = tuple.__call__(["\n", "\t", " "]);
    var i = 0;
    while ((i < js(len(this))) && (js(chars.__contains__.__call__(this.__getitem__.__call__(i))))) {
        i += 1;
    }
    return this.__getitem__.__call__(slice.__call__(i, null));
});

basestring.prototype.rstrip = Function(function(chars) {
    if (js(len(this)) === 0)
        return this;
    if (defined(chars))
        chars = tuple.__call__(chars);
    else
        chars = tuple.__call__(["\n", "\t", " "]);
    var i = js(len(this))-1;
    while ((i >= 0) && (js(chars.__contains__.__call__(this.__getitem__.__call__(i))))) {
        i -= 1;
    }
    return this.__getitem__.__call__(slice.__call__(i+1));
});

basestring.prototype.strip = Function(function(chars) {
    return this.lstrip.__call__(chars).rstrip.__call__(chars);
    return this.lstrip.__call__(chars).rstrip.__call__(chars);
});

basestring.prototype.split = Function(function(sep) {
    var r_new;
    if (defined(sep)) {
        var r = list.__call__(this._obj.split(sep));
        r_new = list.__call__([]);
        iterate(iter.__call__(r), function(item) {
                r_new.append.__call__(basestring.__call__(item));
        });
        return r_new;
    }
    else {
        r_new = list.__call__([]);
        iterate(iter.__call__(this.split.__call__(" ")), function(item) {
                if (len(item) > 0)
                    r_new.append.__call__(item);
        });
        return r_new;
    }
});

basestring.prototype.splitlines = Function(function() {
    return this.split.__call__("\n");
});

basestring.prototype.lower = Function(function() {
    return __py2js_str.__call__(this._obj.toLowerCase());
});

basestring.prototype.upper = Function(function() {
    return __py2js_str.__call__(this._obj.toUpperCase());
});

basestring.prototype.encode = Function(function(encoding) {
    return this;
});

basestring.prototype.decode = Function(function(encoding) {
    return this;
});

var str = __inherit(basestring, "str");
var unicode = __inherit(basestring, "unicode");

unicode.prototype.__init__ = function(s) {
    if (!defined(s)) {
        this._obj = '';
    } else {
        if (typeof(s) === "string") {
            this._obj = s;
        } else if (defined(s.__unicode__)) {
            this._obj = js(s.__unicode__());
        } else if (defined(s.toString)) {
            this._obj = s.toString();
        } else
            this._obj = js(s);
    }
};

__py2js_str = str;
