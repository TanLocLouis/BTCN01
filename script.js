$(function () {
    var $para = $('.container-1').first().find('.container-content p');
    var initialHtml = $para.html();
    var currentHtml = initialHtml;

    var formatOption = {
        bold: $('#sample-bold'),
        italic: $('#sample-italic'),
        underline: $('#sample-underline')
    }

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

    // Highlight button (uses search input) -----------------------------------------
    $('#btn-hightlight').on('click', function (e) {
        e.preventDefault();

        var input = $('#search-input').val().trim();
        var color = $('#sample-bg-color').val() || '#ffff00';
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

        var $hightlight = $('.highlight');
        $hightlight.removeClass('sample-bold sample-italic sample-underline');
        if ($('#sample-bold').is(':checked')) $hightlight.addClass('sample-bold');
        if ($('#sample-italic').is(':checked')) $hightlight.addClass('sample-italic');
        if ($('#sample-underline').is(':checked')) $hightlight.addClass('sample-underline');
    })
    //-------------------------------------------------------------------------------


    // Dropdown ---------------------------------------------------------------
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
    //-------------------------------------------------------------------------------



    // Sample text controls ---------------------------------------------
    // outside color-picker controls highlight text color (foreground)
    $('#color-picker').on('input', function (e) {
        var color = $(this).val() || '#000000';
        // set CSS variable for highlight foreground color
        document.documentElement.style.setProperty('--highlight-fore', color);
        // also apply to sample-text color so user sees the text color change
        $('#sample-text').css('color', color);
    });


    // apply sample formatting when checkboxes change
    function applySampleFormatting() {
        // update for Sample text
        var $label = $('#sample-text');
        $label.removeClass('sample-bold sample-italic sample-underline');
        if ($('#sample-bold').is(':checked')) $label.addClass('sample-bold');
        if ($('#sample-italic').is(':checked')) $label.addClass('sample-italic');
        if ($('#sample-underline').is(':checked')) $label.addClass('sample-underline');

        // update realtime highlights in the paragraph
        var $hightlight = $('.highlight');
        $hightlight.removeClass('sample-bold sample-italic sample-underline');
        if ($('#sample-bold').is(':checked')) $hightlight.addClass('sample-bold');
        if ($('#sample-italic').is(':checked')) $hightlight.addClass('sample-italic');
        if ($('#sample-underline').is(':checked')) $hightlight.addClass('sample-underline');
    }
    $('#sample-bold, #sample-italic, #sample-underline').on('change', applySampleFormatting);


    // change background color in realtime 
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
    //-------------------------------------------------------------------------------


    // Delete button (uses search input) --------------------------------------------
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
    //-------------------------------------------------------------------------------


    // Reset button -----------------------------------------------------------------
    $('#btn-reset').on('click', function (e) {
        e.preventDefault();

        currentHtml = initialHtml;
        $para.html(initialHtml);
        $('#search-input').val('');
    })
    //-------------------------------------------------------------------------------
    

    // Expand/Collapse for sidebar sections -----------------------------------------
    $('.side-section-title').on('click', function () {
        const $section = $(this).closest('.side-section');
        const $content = $section.find('p');

        // Toggle visibility with slide animation
        $content.slideToggle(200);

        // Optionally toggle an "active" class for styling (arrow icon, etc.)
        $section.toggleClass('collapsed');
    });
    //-------------------------------------------------------------------------------


    // dragable Sidebar ------------------------------------------------

});
