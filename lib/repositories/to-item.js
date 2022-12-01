'use strict';

Object.defineProperty(Object.prototype, 'bugu_to', {
    value: function value(map) {

        function toInt(key) {
            key = toString(key);
            var h = 0,
                i = key.length;
            while (i > 0) {
                h = (h << 5) - h + key.charCodeAt(--i) | 0;
            }
            return Math.abs(h);
        }

        function toString(obj) {
            var str = '';
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    str += property + ': ' + obj[property];
                }
            }
            return str || str.toString();
        }

        if (typeof map === "undefined") return this;
        var int = toInt(toString(this));
        var nodes = Array.from(map).sort(function (a, b) {
            return a - b;
        });

        return nodes[int % nodes.length];
    },
    enumerable: false
});