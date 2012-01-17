######################################################################
##
## Copyright 2012 Christian Iversen <ci@sikkerhed.org>
##
## Permission is hereby granted, free of charge, to any person
## obtaining a copy of this software and associated documentation
## files (the "Software"), to deal in the Software without
## restriction, including without limitation the rights to use,
## copy, modify, merge, publish, distribute, sublicense, and/or sell
## copies of the Software, and to permit persons to whom the
## Software is furnished to do so, subject to the following
## conditions:
##
## The above copyright notice and this permission notice shall be
## included in all copies or substantial portions of the Software.
##
## THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
## EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
## OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
## NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
## HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
## WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
## FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
## OTHER DEALINGS IN THE SOFTWARE.
##
######################################################################

class ISTNode(object):

    def __init__(self, **attr):
        for x in attr:
            if not x in self._fields:
                raise TypeError("IST node [%s] does not take attribute [%s]" % (self.__class__.__name__, x))
            else:
                setattr(self, x, attr[x])
        for x in self._fields:
            if not x in attr:
                raise TypeError("IST node [%s] requires attribute [%s]" % (self.__class__.__name__, x))


    def str(self, indent = 0):
        i = "  "*indent
        s = "%s%s: " % (i, self.__class__.__name__)
        i += "  "
        f = []
        for k in self._fields:
            v = getattr(self, k)
            if isinstance(v, list):
                s += "\n%s%s [" % (i, k)

                for l in v:
                    s += "\n%s" % (l.str(indent + 2))

                if v == []:
                    s += "]"
                else:
                    s += "\n%s]" % i
            else:
                if isinstance(v, ISTNode):
                    f = "%s = %s" % (k, v.str())
                else:
                    f = "%s = %s" % (k, v)
                s += "\n%s%s" % (i, f)
        return s

## Annotations

class Annotation(ISTNode):
    _fields = ["data"]

class Comment(Annotation):
    _fields = ["comment"]

class Code(ISTNode):
    _fields = []

class Block(Code):
    _fields = ["body"]

class Function(Code):
    _fields = ["name", "params", "body"]

## Statements

class Statement(Code):
    _fields = []

class If(Code):
    _fields = ["cond", "body", "orelse"]

class While(Code):
    _fields = ["conf", "body"]

class TryExcept(Code):
    _fields = ["body", "errorbody"]

class For(Code):
    _fields = ["init", "cond", "incr", "body"]

class Raise(Code):
    _fields = ["expr"]

class Break(Code):
    _fields = []

class Continue(Code):
    _fields = []

class Return(Code):
    _fields = ["expr"]

## Expressions

class Call(Code):
    _fields = ["func", "params"]

class Assign(Code):
    _fields = ["lvalue", "rvalue"]

class BinOp(Code):
    _fields = ["left", "right", "op"]

    def str(self, indent = 0):
        return "%s[%s %s %s]" % ("  " * indent, self.left.str(), self.op, self.right.str())

class Value(Code):
    _fields = ["value"]

    def str(self, indent = 0):
        return "%s[%s: %s]" % ("  " * indent, self.value.__class__.__name__, repr(self.value))

class GetAttr(Code):
    _fields = ["base", "attr"]

    def str(self, indent = 0):
        return "%s%s -> %s" % ("  " * indent, self.base.str(), self.attr)

class Name(Code):
    _fields = ["id"]

    def str(self, indent = 0):
        return self.id
