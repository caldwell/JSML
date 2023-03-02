// Copyright (c) 2009-2020 David Caldwell and Jim Radford.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.

import { Fragment, createElement } from 'react';

function jsr(array) { return jsr_inner(array); }

function jsr_inner(array, path=[]) {
    var dump = (array) => JSON.stringify(array, (_,v) => v==undefined ? null : v); // Convert undefined to null so the bad key shows up
    var pathstr = (path) => path.map(p => typeof p == "string"    ? `<${p}>`
                                        : typeof p == "function"  ? `<${p.name}()>`
                                        : p == Fragment           ? `<React.Fragment>`
                                                                  : '<???>').join(" -> ");
    var valid = (a, array) => a !== undefined && a !== null || (() => { throw(`undefined value in ${pathstr(path)}: ${dump(array)}`) })();
    let react_ignored = (a) => a == undefined || a == null || a === false || a === true;

    if (array.constructor === String) return array.toString(); // allows for jsml("Plain text") (which is only valid in react when recursing)
    if (array.$$typeof == Symbol.for('react.element')) return createElement(Fragment, null, array); // jsr([jsr(['div'])])
    if (!array.length) return []; // [['div'],[]] => [['div']]

    if (array[0].constructor === Array || array[0].$$typeof == Symbol.for('react.element')) { // [[],[],...] ==> [],[],...
        return createElement(Fragment, null, ...array.map((e) => react_ignored(e) || jsr_inner(e, path)));
    }

    var el = array[0];
    var props = {};
    var children = [];

    for (var a of array.slice(1)) {
        if (react_ignored(a))
            continue;
        else if (a.constructor === Array) {
            if (a.length !== 0)
                children.push(jsr_inner(a, [...path, el]));
        }
        else if (a.$$typeof == Symbol.for('react.element'))
            children.push(a);
        else if (a.constructor === Object)
            for (let [k,v] of Object.entries(a)) {
                if (typeof el == "string" && valid(v,a) && v.constructor === Object) {
                    props[k] = {};
                    for (let [sk,sv] of Object.entries(v))
                        props[k][sk] = sv;
                }
                else
                    props[k] = v;
            }
        else if (typeof a  === "function")
            props.ref = a; // ['div', _=>some_var=_ ] save reference to deep element
        else
            children.push(a.toString());
    }
    return createElement(el, props, ...children);
}

export { jsr };
