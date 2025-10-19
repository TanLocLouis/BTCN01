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

    $('btn-hightlight').on('click', function (e) {
        e.preventDefault();

        var input = $('#search-input').val().trim();
        var color = $('#color-picker').val() || 'yellow';
        // return early if no input
        if (!input) return;

        var regex = makeRegexFromInput(input);
        if (!regex) return;

        // replace matches with highlighted spans
        var highlighted = currentHtml.replace(regex, function (match) {
            return '<span class="highlight" style="background-color:' + color + '">' + match + '</span>';
        });

        $para.html(highlighted);
    })
});
