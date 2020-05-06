// Copyright (c) 2009-2020 David Caldwell and Jim Radford.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.

function jsml(array, _document) {
    if (!_document) _document = window.document;
    var valid = function (a, array) {
        if (a === undefined || a === null)
            throw("undefined value in: " + JSON.stringify(array));
        else
            return true;
    };
    if (array.constructor === String) // allows for jsml("Plain text")
        return _document.createTextNode(array);

    if (!array.length) return []; // [['div'],[]] => [['div']]
    if (array[0].constructor === Array) { // [[],[],...] ==> [],[],...
        var f = _document.createFragment();
        for (var i=0, l=array.length; i<l; i++) {
            n = jsml(array[i], _document);
            if (n.constructor === Array)
                r=r.concat(n);
            else
                r.push(n);
        }
        return r;
    }

    var el = array[0];
    if (typeof el.nodeType === "undefined")
        el = el.charAt(0) == "#"
            ? _document.getElementById(el.substring(1))
            : _document.createElement(el);

    for (var i=1, l=array.length; i<l; i++) {
        var a = array[i];
        if (!valid(a, array))
            continue;
        else if (a.constructor === Array) {
            if (a.length !== 0) {
                var n = jsml(a, _document);
                if (n.constructor == Array)
                    for (var $i=0, $l=n.length; $i<$l; $i++)
                        el.appendChild(n[$i]);
                else
                    el.appendChild(n);
            }
        }
        else if (a.constructor === Object)
            for (var p in a) {
                var ap = a[p];
                if (valid(ap,a) && ap.constructor === Object)
                  for (var s in ap)
                    el[p][s] = ap[s];
                else
                    if (_document === window.document)
                        el[p] = ap;
                    else
                        el.setAttribute(p, ap);
            }
        else if (typeof a.nodeType === "number")
            el.appendChild(a);
        else if (typeof a  === "function")
            a(el)
        else
            el.appendChild(_document.createTextNode(a));
    }
    return el;
}

export { jsml };
