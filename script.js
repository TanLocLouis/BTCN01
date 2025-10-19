$(function () {
    var $para = $('.container-1').first().find('.container-content p');
    var initialHtml = $para.html();
    var currentHtml = initialHtml;

    function makeRegexFromInput(input) {
        if (!input) return null;

        // detect regex-like input
        var meta = /[\[\](){}|\\.+*?^$]/;
        if (meta.test(input)) {
            try {
                return new RegExp(input, 'gi');
            } catch (e) {
            }
        }

        // escape literal input
        var escaped = input.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        return new RegExp(escaped, 'gi');
    }

    // Highlight button (uses search input)
    $('#btn-hightlight').on('click', function (e) {
        e.preventDefault();

        var input = $('#search-input').val().trim();
        var color = $('#color-picker').val() || '#ffff00';
        // return early if no input
        if (!input) return;

        var regex = makeRegexFromInput(input);
        if (!regex) return;

        // replace matches with highlighted spans (use span.highlight which styles from CSS variable)
        currentHtml = currentHtml.replace(regex, function (match) {
            return '<span class="highlight">' + match + '</span>';
        });

        // set css variable so highlights show the selected background color
        document.documentElement.style.setProperty('--highlight-color', color);
        $para.html(currentHtml);
    })

    // Outside color-picker controls highlight text color (foreground)
    $('#color-picker').on('input', function (e) {
        var color = $(this).val() || '#000000';
        // set CSS variable for highlight foreground color
        document.documentElement.style.setProperty('--highlight-fore', color);
        // also apply to sample-text color so user sees the text color change
        $('#sample-text').css('color', color);
    });

    // toggle sample options dropdown
    $('#sample-text-option').on('click', function (e) {
        e.stopPropagation();
        var $opts = $('#sample-options');
        var hidden = $opts.attr('aria-hidden') === 'true';
        $opts.attr('aria-hidden', hidden ? 'false' : 'true');
    });

    // close dropdown when clicking outside
    $(document).on('click', function () {
        $('#sample-options').attr('aria-hidden', 'true');
    });

    // prevent clicks inside the dropdown from closing it 
    $('#sample-options').on('click', function (e) {
        e.stopPropagation();
    });

    // apply sample formatting when checkboxes change
    function applySampleFormatting() {
        var $label = $('#sample-text');
        $label.removeClass('sample-bold sample-italic sample-underline');
        if ($('#sample-bold').is(':checked')) $label.addClass('sample-bold');
        if ($('#sample-italic').is(':checked')) $label.addClass('sample-italic');
        if ($('#sample-underline').is(':checked')) $label.addClass('sample-underline');
    }

    $('#sample-bold, #sample-italic, #sample-underline').on('change', applySampleFormatting);

    // sample background color input controls highlight background color
    $('#sample-bg-color').on('input change', function () {
        var color = $(this).val() || '#ffff00';
        $('#sample-text').css('background-color', color);
        // set CSS variable for highlight background color
        document.documentElement.style.setProperty('--highlight-color', color);
    });

    // Initialize sample formatting and color
    applySampleFormatting();
    if ($('#sample-bg-color').length) {
        var initBg = $('#sample-bg-color').val();
        $('#sample-text').css('background-color', initBg);
        document.documentElement.style.setProperty('--highlight-color', initBg);
    }
    // initialize highlight foreground from outside color-picker
    if ($('#color-picker').length) {
        var initFore = $('#color-picker').val();
        if (initFore) document.documentElement.style.setProperty('--highlight-fore', initFore);
        $('#sample-text').css('color', initFore);
    }


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

        currentHtml = initialHtml;
        $para.html(initialHtml);
        $('#search-input').val('');
    })
});
