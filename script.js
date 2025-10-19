$(function () {
    // Cache the paragraph element and original HTML
    var $para = $('.container-1').first().find('.container-content p');
    var initialHtml = $para.html();
    var currentHtml = initialHtml;

    function makeRegexFromInput(input) {
        if (!input) return null;

        // If user types something that looks like a regex (contains [](){}|\\.+*?^$), try to build a regex.
        var meta = /[\[\](){}|\\.+*?^$]/;
        if (meta.test(input)) {
            try {
                return new RegExp(input, 'gi');
            } catch (e) {
            }
        }

        // Escape literal input
        var escaped = input.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        return new RegExp(escaped, 'gi');
    }
});
