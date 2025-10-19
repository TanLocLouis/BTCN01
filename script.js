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

    $('#btn-hightlight').on('click', function (e) {
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

    // update highlight color in real-time
    $('#color-picker').on('input', function (e) {
        var color = $(this).val() || 'yellow';
        $('.highlight').css('background-color', color);
    });


    $('#btn-delete').on('click', function (e) {
        e.preventDefault();
        var input = $('#search-input').val().trim();
        if (!input) return;
        var regex = makeRegexFromInput(input);
        if (!regex) return;

        // Remove matches from the working copy and update display
        currentHtml = currentHtml.replace(regex, '');
        $para.html(currentHtml);
    });

    $('#btn-reset').on('click', function (e) {
        e.preventDefault();
    })
});
