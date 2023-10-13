// Copyright (c) 2009-2012 David Caldwell and Jim Radford.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.

(function($) {
    "use strict";
    var jsml = function() {
        var el = jsml.dom.apply(this, arguments);
        if (arguments.length === 1)
            el = [el];

        this.empty();

        for (var i=0, l=this.length; i < l; i++)
            if ( this[i].nodeType === 1 )
                for (var e=0; e < el.length; e++)
                    this[i].appendChild(el[e].cloneNode(true));

        return this;
    };

    jsml.elements = {};

    jsml.make = function (value) {
        return $(jsml.dom(value));
    };

    jsml.dom = function (array) {
        var i, j, l, $i, $l;

        if (arguments.length > 1) {
            var results = [];
            for (i=0; i<arguments.length; i++)
                results[i] = jsml.dom(arguments[i]);
            return results;
        }

        var valid = function (a, array) {
            if (a === undefined || a === null)
                throw("undefined value in: " + JSON.stringify(array));
            else
                return true;
        };
        if (array.constructor === String)
            return document.createTextNode(array);

        if (jsml.elements.hasOwnProperty(array[0])) {
            var ex = jsml.elements[array[0]](array);
            if (ex.constructor === Array)
                return jsml.dom(ex);
            else if (typeof ex.nodeType !== "undefined")
                return ex;
            else if ((ex.constructor === $) && (ex.length >= 1))
                return ex[0];
            else
                return document.createTextNode(ex);
        }

        var el = document.createElement(array[0]);

        for (i=1, l=array.length; i<l; i++) {
            var a = array[i];
            if (!valid(a, array))
                continue;
            if (a.constructor === Array) {
                if (a.length === 0 || (a[0].constructor === Array || a[0].constructor === $ || typeof a[0].nodeType !== "undefined")) {
                    for (j in a) // [[],[],...] ==> [],[],...
                        if (a[j].constructor === Array)
                            el.appendChild(jsml.dom(a[j]));
                        else if (a[j].constructor === $)
                            for ($i = 0, $l = a[j].length; $i < $l; $i++ )
                                el.appendChild(a[j][$i]);
                        else if (typeof a[j].nodeType !== "undefined")
                            el.appendChild(a[j]);
                } else
                    el.appendChild(jsml.dom(a));
            }
            else if (typeof a.nodeType !== "undefined")
                el.appendChild(a);
            else if (a.constructor === $)
                for ($i = 0, $l = a.length; $i < $l; $i++ )
                    el.appendChild(a[$i]);
            else if (a.constructor === Object)
                for (var p in a) {
                    var ap = a[p];
                    if (valid(ap,a) && ap.constructor === Object)
                        for (var s in ap)
                            el[p][s] = ap[s];
                    else
                        el[p] = ap;
                }
            else
                el.appendChild(document.createTextNode(a));
        }
        return el;
    };

    $.fn.jsml = jsml;
})(jQuery);
