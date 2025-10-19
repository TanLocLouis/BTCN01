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

    // Highlight button (uses search input)
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
    //-


    // Dropdown 
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
    //-



    // Sample text controls 
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
    //-


    // Delete button (uses search input)
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
    //-


    // Reset button
    $('#btn-reset').on('click', function (e) {
        e.preventDefault();

        currentHtml = initialHtml;
        $para.html(initialHtml);
        $('#search-input').val('');
    })
    //-
    

    // expand/Collapse for sidebar sections ONLY when clicking triangle icon
    $(document).on('click', '.side-section-arrow', function (e) {
        e.stopPropagation();
        const $section = $(this).closest('.side-section');
        const $content = $section.find('p');
        $content.slideToggle(200);
        $section.toggleClass('collapsed');
    });

    // dragable Sidebar 
    $(".side").sortable({
        axis: "y",             // Only vertical drag
        handle: ".side-section-drag", // Drag only by ns-resize icon
        cursor: "grabbing",
        placeholder: "side-section-placeholder",
        start: function (event, ui) {
            ui.placeholder.height(ui.item.height());
            ui.item.addClass("dragging");
        },
        stop: function (event, ui) {
            ui.item.removeClass("dragging");
        },
        update: function (event, ui) {
            // Optional: log new order
            const newOrder = $(this).children().map(function () {
                return this.id;
            }).get();
            console.log("Sidebar new order:", newOrder);
        }
    });

    $('.container-drag-drop').sortable({
        revert: 500,
        items: '.drag-grid-item',
        placeholder: 'drag-grid-placeholder',
        tolerance: 'pointer',
        start: function (event, ui) {
            ui.item.addClass('dragging');
            ui.placeholder.height(ui.item.height());
            ui.placeholder.width(ui.item.width());
        },
        change: function (event, ui) {
            // Smoothly move other items into position
            $('.drag-grid-item:not(.ui-sortable-helper)').each(function () {
            const $this = $(this);
            $this.stop(true, true).animate({
                top: $this.position().top,
                left: $this.position().left
            }, 500);
            });
        },
        stop: function (event, ui) {
            ui.item.removeClass('dragging');
        }
    });



    // add icon to grid when Add new is clicked
    $(document).on('click', '.container-header-middle button', function() {
        var $select = $(this).siblings('.custom-select').find('select');
        var selectedIndex = $select.prop('selectedIndex');
        var icons = ['🐭', '🐕', '😺', '🦅', '🐄', '🐎'];
        var labels = ['Mouse', 'Dog', 'Cat', 'Eagle', 'Cow', 'Horse'];
        var icon = icons[selectedIndex] || '❓';
        var label = labels[selectedIndex] || 'Unknown';
        var $grid = $(this).closest('.container-1').find('.container-drag-drop');
        var $item = $('<div class="drag-grid-item"></div>');
        const html =
        '<div class="grid-item"> <span class="icon">' + icon + '</span><span class="label">' + label + '</span>' +'</div>';
        $item.html(html);
        $grid.append($item);
    });


 // load saved active index (if any)
  const savedIndex = localStorage.getItem('activeMenuIndex');
  if (savedIndex) {
    $('.nav-menu li[data-index="' + savedIndex + '"], .footer-menu li[data-index="' + savedIndex + '"]')
      .addClass('active');
  }

  // hover and click sync
  $('.nav-menu li, .footer-menu li').on({
    mouseenter: function () {
      const index = $(this).index();
      $('.nav-menu li, .footer-menu li').removeClass('hover');
      $('.nav-menu li').eq(index).addClass('hover');
      $('.footer-menu li').eq(index).addClass('hover');
    },
    mouseleave: function () {
    },
    click: function () {
      const index = $(this).index();
      $('.nav-menu li, .footer-menu li').removeClass('active');
      $('.nav-menu li').eq(index).addClass('active');
      $('.footer-menu li').eq(index).addClass('active');
    }
  });



});