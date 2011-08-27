// Copyright (c) 2009-2012 David Caldwell and Jim Radford.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.

(function($) {
    $.fn.jsml = function(value) {
        var el = $.fn.jsml.dom(value);

        for ( var i = 0, l = this.length; i < l; i++ ) {
            // Remove element nodes and prevent memory leaks
            if ( this[i].nodeType === 1 ) {
                jQuery.cleanData( this[i].getElementsByTagName("*") );
                this[i].appendChild(el.cloneNode(true));
            }
        }
        return this;
    };

    $.fn.jsml.dom = function (array) {
        var valid = function (a, array) {
            if (a === undefined || a === null)
                printf("undefined value in: %j\n", array);
            else
                return true;
        };
        if (array.constructor === String)
            return document.createTextNode(array);
        var el = array[0];
        if (typeof el.nodeType === "undefined")
            el = el.charAt(0) == "#"
            ? document.getElementById(el.substring(1))
            : document.createElement(el);

        for (var i=1, l=array.length; i<l; i++) {
            var a = array[i];
            if (!valid(a, array))
                continue;
            if (a.constructor === Array) {
                if (a.length === 0 || a[0].constructor === Array)
                    for (var j in a) // [[],[],...] ==> [],[],...
                        el.appendChild($.fn.jsml.dom(a[j]))
                else
                    el.appendChild($.fn.jsml.dom(a));
            }
            else if (typeof a.nodeType !== "undefined")
                el.appendChild(a);
            else if (a.constructor === $)
                for ( var $i = 0, $l = a.length; $i < $l; $i++ )
                    el.appendChild(a[$i]);
            else if (a.constructor === Object)
                for (var p in a) {
                    var ap = a[p];
                    if (valid(ap,a) && ap.constructor === Object)
                        for (s in ap)
                            el[p][s] = ap[s];
                    else
                        el[p] = ap;
                }
            else
                el.appendChild(document.createTextNode(a));
        }
        return el;
    }
})(jQuery);
