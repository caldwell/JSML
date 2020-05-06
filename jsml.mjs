// Copyright (c) 2009-2020 David Caldwell and Jim Radford.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.

function jsml(array, _document) {
    if (!_document) _document = window.document;
    var valid = (a, array) => a !== undefined && a !== null || (() => { throw("undefined value in: " + JSON.stringify(array)) })();
    if (array.constructor === String) // allows for jsml("Plain text")
        return _document.createTextNode(array);

    if (!array.length) return _document.createDocumentFragment(); // [['div'],[]] => [['div']]
    if (array[0].constructor === Array) { // [[],[],...] ==> [],[],...
        var f = _document.createDocumentFragment();
        for (let e of array)
            if (valid(e, array))
                f.appendChild(jsml(e, _document));
        return f;
    }

    var el = array[0];
    if (typeof el.nodeType === "undefined")
        el = el.charAt(0) == "#"
            ? _document.getElementById(el.substring(1))
            : _document.createElement(el);

    for (var a of array.slice(1)) {
        if (!valid(a, array))
            continue;
        else if (a.constructor === Array) {
            if (a.length !== 0)
                el.appendChild(jsml(a, _document));
        }
        else if (a.constructor === Object)
            for (let [k,v] of Object.entries(a)) {
                if (valid(v,a) && v.constructor === Object)
                    for (let [sk,sv] of Object.entries(v))
                        el[k][sk] = sv;
                else
                    if (_document === window.document)
                        el[k] = v;
                    else
                        el.setAttribute(k, v);
            }
        else if (typeof a.nodeType === "number")
            el.appendChild(a);
        else if (typeof a  === "function")
            a(el) // ['div', _=>some_var=_ ] save reference to deep element
        else
            el.appendChild(_document.createTextNode(a));
    }
    return el;
}

export { jsml };
