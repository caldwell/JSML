//  Copyright (c) 2012 David Caldwell,  All Rights Reserved.

(function($) {
    $.fn.myPlugin = function() {
        var orig = $.fn.html
        $.fn.html = function(value) {
            if (typeof value != 'Array')
                return orig(value)
        }
    };
})(jQuery);
