/**
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

var method;
var str;

var lock = false;

function pymethod(obj, func) {
    this.obj = obj;
    this.func = func;
}

pymethod.prototype.__call__ = function() {
    return this.func.apply(this.obj, arguments);
};

function fixup(obj) {
    if (!lock) {
        lock = true;
        for (var o in obj) {
            if (typeof(obj[o]) === "function")
                if ((o !== "toString") && (o !== "__init__")) {
//print("### fixing", o, "->", obj[o].toString().split("\n").join(""));
                    obj[o] = method.__call__(obj, obj[o]);
                }
        }
        lock = false;
    }
}

var ObjectMetaClass = function(cls, clsname) {

    this.__call__ = function() {
//        print("__call__(", clsname, ")");
        var obj = new cls();
        fixup(obj);
        // obj.__init__.apply(obj, arguments);
        if (typeof(obj.__init__ === "function")) {
            obj.__init__.apply(obj, arguments);
        } else {
            obj.__init__.__call__.apply(obj.__init__, arguments);
        }
        return obj;
    };

    this.__setattr__ = function(k, v) {
        this.prototype[k] = v;
    };

    this.__getattr__ = function(k) {
//        print("this", k, typeof(this.prototype[k]));
        if (typeof(this.prototype[k]) === "function") {
            this.prototype[k] = pyfunction(this.prototype[k]);
        }
        return this.prototype[k];
    };

    this.__delattr__ = function(k) {
        delete this.prototype[k];
    };

    this.__repr__ = function() {
        return str.__call__("<class " + this.__name__ + ">");
    };

    this.__eq__ = function(other) {
        return py_builtins.bool(this === other);
    };

    this.toString = function() {
        return js(this.__repr__());
    };

    this.prototype = cls.prototype;
};

var __inherit = function(cls, name) {
//    print("__inherit(" + "cls" + ", " + name + ")");
    if (!defined(name)) {
        throw py_builtins.TypeError.__call__("The function __inherit must get exactly 2 arguments");
    }

    var x = function() {  };

    /* Inheritance from cls */
    for (var o in cls.prototype) {
//        print("overriding ", o);
        x.prototype[o] = cls.prototype[o];
    }

    /* Receive bacon */
    var res = new ObjectMetaClass(x, name);
    res.__getattr__ = new pymethod(res, res.__getattr__);
    res.__setattr__ = new pymethod(res, res.__setattr__);
    res.__name__ = name;
    res.__super__ = cls;
    res.prototype.__name__  = name;
    res.prototype.__class__ = res;
    res.prototype.__super__ = cls;
    return res;
};

var object = __inherit(function() {}, "object");

object.prototype.__init__ = function() {
};

object.prototype.__setattr__ = function(k, v) {
    this[js(k)] = v;
};

object.prototype.__getattr__ = function(k) {
    return this[js(k)];
    // if (typeof(this[k]) === "function")
    //     if (k !== "toString")
    //         this[k] = method.__call__(this, this[k]);
};

object.prototype.__delattr__ = function(k) {
    delete this[js(k)];
};

object.prototype.__repr__ = function() {
    return str.__call__("<instance of " + this.__class__.__name__ + ">");
};

object.prototype.__str__ = object.prototype.__repr__;

object.prototype.__ne__ = function (other) {
    return py_builtins.__not__(this.__eq__.__call__(other));
};

object.prototype.__cmp__ = function (y) {
    var g = this.__gt__.__call__(y);
    if (js(g)) {
        return 1;
    } else {
        return -js(this.__lt__.__call__(y));
    }
};

object.prototype.toString = function () {
    return js(this.__str__.__call__());
};
