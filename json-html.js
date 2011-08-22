//  Copyright (c) 2012 David Caldwell,  All Rights Reserved.

(function($) {
    var orig = $.fn.html
    $.fn.html = function(value) {
        if (value.constructor !== Array)
            return orig.call(this, value)
        return this;
    };
})(jQuery);
