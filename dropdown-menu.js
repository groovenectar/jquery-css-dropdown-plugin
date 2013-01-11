// jQuery().dropdown_menu() by Daniel Upshaw 2012-2013
// http://danielupshaw.com/jquery-css-dropdown-plugin/readme.html

// Beginning semi-colon for concatenated scripts and any improperly closed plugins
;(function( $, window, document, undefined ) {
    $.fn.extend({
        dropdown_menu : function (options) {
            var _defaults = {
                sub_indicator_class  : 'dropdown-menu-sub-indicator',   // Class given to LI's with submenus
                vertical_class       : 'dropdown-menu-vertical',        // Class for a vertical menu
                shadow_class         : 'dropdown-menu-shadow',          // Class for drop shadow on submenus
                hover_class          : 'dropdown-menu-hover',           // Class applied to hovered LI's
                open_delay           : 150,                             // Delay on menu open
                close_delay          : 300,                             // Delay on menu close
                animation_open       : { opacity : 'show' },            // Animation for menu open
                speed_open           : 'fast',                          // Animation speed for menu open
                animation_close      : { opacity : 'hide' },            // Animation for menu close
                speed_close          : 'fast',                          // Animation speed for menu close
                sub_indicators       : false,                           // Whether to show arrows for submenus
                drop_shadows         : false,                           // Whether to apply drop shadow class to submenus
                vertical             : false,                           // Whether the root menu is vertically aligned
                viewport_overflow    : 'auto',                          // Handle submenu opening offscreen: "auto", "move", "scroll", or false
                init                 : function() {}                    // Callback function applied on init
            };

            // Test for IE <= 7
            var ie7 = ($.browser.msie && $.browser.version < 8);

            return this.each(function() {
                var menu     = $(this);
                // Needs this single/double quote precedence for JSON data
                // <ul data-options='{"sub_indicators":"true"}'></ul>
                var metadata = menu.data('options');
                var o        = $.extend({}, _defaults, options, metadata);

                // Arrow element
                var sub_indicator = $('<span class="' + o.sub_indicator_class + '">&#187;</span>');

                // Add vertical menu class
                if (o.vertical) {
                    menu.addClass(o.vertical_class);
                }

                // Remove whitespace between inline-block elements
                $('>li', menu).css({ 'font-size' : menu.css('font-size') });
                menu.css({ 'font-size' : '0' });

                menu.find('li:has(ul)').each(function() {
                    // Add a class to the LI to indicate that it has a submenu
                    $(this).addClass(o.sub_indicator_class);

                    // Add arrow/indicator element if enabled
                    if (o.sub_indicators) {
                        $('>a:first-child', this).append(sub_indicator.clone());
                    }

                    // Get the submenu and hide it, but keep display:block so the width can be calculated
                    var submenu = $('>ul', this).css({ 'visibility' : 'hidden', 'display' : 'block' });

                    // Add drop shadow class if enabled
                    if (o.drop_shadows) {
                        submenu.addClass(o.shadow_class);
                    }

                    // IE <= 7
                    if (ie7) {
                        // Wrap in setTimeout() else the arrow may not be included
                        setTimeout(function() {
                            // Lock submenu UL width in CSS so that the LI's can stretch
                            submenu.css({ 'width' : submenu.width() });
                        }, 0);
                    }

                    // Handle hover states
                    $(this).on({
                        mouseenter : function(e) {
                            clearTimeout($(this).data('close_timer'));
                            clearTimeout($(this).data('open_timer'));

                            // If the submenu has already been opened
                            if ($(this).hasClass(o.hover_class)) {
                                return;
                            }

                            // $.proxy() keeps "this" context
                            $(this).data('open_timer', setTimeout($.proxy(function() {
                                $(this).addClass(o.hover_class);

                                // For vertical menus
                                if (o.vertical) {
                                    submenu.css({ 'top' : 0 , 'left' : $(this).width() });
                                } else {
                                    submenu.css({ 'top' : '', 'left' : '' });
                                }

                                // So we can check the offset
                                submenu.css({ 'visibility' : 'hidden', 'display' : 'block' });

                                // Check if the submenu is overflowing off the page
                                overflow_x = submenu.offset().left + submenu.width() > $(window).scrollLeft() + $(window).width();
                                overflow_y = submenu.offset().top + submenu.height() > $(window).scrollTop() + $(window).height();
                                overflow   = overflow_x || overflow_y;

                                if (overflow && o.viewport_overflow) {
                                    // Padding to accomodate for drop shgadows, etc
                                    var padding = 10;
                                    if (o.viewport_overflow === 'auto') o.viewport_overflow = ie7 ? 'scroll' : 'move';

                                    switch (o.viewport_overflow) {
                                        case 'move' :
                                            var left = overflow_x ? ($(window).scrollLeft() + $(window).width()) - submenu.width() - padding : submenu.offset().left;
                                            var top  = overflow_y ? ($(window).scrollTop() + $(window).height()) - submenu.height() - padding : submenu.offset().top;
                                            submenu.offset({ left : left , top : top });
                                            break;
                                        case 'scroll' :
                                            if (overflow_x) {
                                                var scrollLeft = submenu.offset().left - $(window).width() + submenu.width() + padding;
                                                $('html').animate({ scrollLeft : scrollLeft }, 'fast');
                                                //$(window).scrollLeft(scrollLeft);
                                            }
                                            if (overflow_y) {
                                                var scrollTop = submenu.offset().top - $(window).height() + submenu.height() + padding;
                                                $('html').animate({ scrollTop : scrollTop }, 'fast');
                                                //$(window).scrollTop(scrollTop);
                                            }
                                            break;
                                    }
                                }

                                // Restore display state
                                submenu.hide().css({ 'visibility' : 'visible' });

                                if (o.animation_open) {
                                    submenu.animate(o.animation_open, o.speed_open);
                                } else {
                                    submenu.show();
                                }
                            }, this), o.open_delay));
                        },
                        mouseleave : function(e) {
                            clearTimeout($(this).data('close_timer'));
                            clearTimeout($(this).data('open_timer'));

                            $(this).data('close_timer', setTimeout($.proxy(function() {
                                $(this).removeClass(o.hover_class);

                                if (o.animation_close) {
                                    submenu.animate(o.animation_close, o.speed_close, function() {
                                        submenu.css({ 'visibility' : 'hidden' });
                                    });
                                } else {
                                    submenu.hide().css({ 'visibility' : 'hidden' });
                                }
                            }, this), o.close_delay));
                        },
                        // For touch devices, disable the link if its submenu is not showing yet
                        touchstart : function(e) {
                            $('>a:first-child', this).one('click', $.proxy(function(e) {
                                if (!$(this).hasClass(o.hover_class)) {
                                    e.preventDefault();
                                } else {
                                    return true;
                                }
                            }, this));
                        }
                    });
                });

                // Wrap in setTimeout() to ensure processes have completed
                setTimeout(function() {
                    // Completely hide the submenus
                    $('ul', menu).hide(1)
                    .promise()
                    .done(function() {
                        // Apply the init callback
                        o.init.call(menu[0]);
                    });
                }, 0);
            });
        }
    });
})( jQuery, window , document );