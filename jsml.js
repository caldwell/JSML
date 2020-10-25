// Copyright (c) 2009-2012 David Caldwell and Jim Radford.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.

(function($) {
    "use strict";

    var valid = function (a, array) {
        if (a === undefined || a === null)
            throw("undefined value in: " + JSON.stringify(array));
        else
            return true;
    };
    var omerge = function (a, b) {
        for (var p in a) {
            if (!a.hasOwnProperty(p)) continue;
            var ap = a[p];
            if (valid(ap,a) && ap.constructor === Object)
                omerge(ap, b[p]);
            else
                b[p] = ap;
        }
    };
    var processContent = function(array, start, el) {
        for (var i = start, l = array.length; i < l; i++) {
            var a = array[i];
            if (!valid(a, array))
                continue;
            if (a.constructor === Array) {
                if (a.length === 0 || (a[0].constructor === Array || a[0].constructor === $ || typeof a[0].nodeType !== "undefined")) {
                    processContent(a, 0, el); // [[],[],...] ==> [],[],...
                } else
                    el.appendChild(jsml.dom(a));
            }
            else if (typeof a.nodeType !== "undefined")
                el.appendChild(a);
            else if (a.constructor === $)
                for (var $i = 0, $l = a.length; $i < $l; $i++ )
                    el.appendChild(a[$i]);
            else if (a.constructor === Object)
                omerge(a, el);
            else
                el.appendChild(document.createTextNode(a));
        }
    };

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

    jsml.make = function (value) {
        return $(jsml.dom(value));
    };

    jsml.dom = function (array) {
        if (arguments.length > 1) {
            var results = [];
            for (var i=0; i<arguments.length; i++)
                results[i] = jsml.dom(arguments[i]);
            return results;
        }

        if (array.constructor === String)
            return document.createTextNode(array);
        var el = document.createElement(array[0]);

        processContent(array, 1, el);
        return el;
    };

    $.fn.jsml = jsml;
})(jQuery);
