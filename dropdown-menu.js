// jQuery().dropdown_menu() by Daniel Upshaw 2012-2013
// http://danielupshaw.com/jquery-css-dropdown-plugin/readme.html

// Functionality from Brandon Aaron's bgiframe plugin directly implemented to accomodate for IE7 quirks:
// http://brandonaaron.net/code/bgiframe/docs

// Beginning semi-colon for concatenated scripts and any improperly closed plugins
;(function( $, window, document, undefined ) {
    $.fn.extend({
        dropdown_menu : function (options) {
            var _defaults = {
                sub_indicator_class  : 'dropdown-menu-sub-indicator',
                vertical_class       : 'dropdown-menu-vertical',
                shadow_class         : 'dropdown-menu-shadow',
                hover_class          : 'dropdown-menu-hover',
                open_delay           : 150,
                close_delay          : 300,
                animation_open       : { opacity : 'show' },
                speed_open           : 'fast',
                animation_close      : { opacity : 'hide' },
                speed_close          : 'fast',
                sub_indicators       : false,
                drop_shadows         : false,
                vertical             : false
            };

            // Test for IE <= 7
            var ie7 = ($.browser.msie && $.browser.version < 8);

            return this.each(function() {
                var elm        = $(this);
                // Needs this single/double quote precedence for JSON data
                // <div data-options='{"sub_indicators":"true"}'></div>
                var metadata   = elm.data('options');
                var o          = $.extend({}, _defaults, options, metadata);

                // *********** //
                var sub_indicator = $('<span class="' + o.sub_indicator_class + '">&#187;</span>');

                if (o.vertical) {
                    elm.addClass(o.vertical_class);
                }

                // Remove whitespace between inline-block elements
                $('>li', elm).css({ 'font-size' : elm.css('font-size') });
                elm.css({ 'font-size' : '0' });

                elm.find('li:has(ul)').each(function() {
                    // Add a class to the LI to indicate that it has a submenu
                    $(this).addClass(o.sub_indicator_class);

                    // Add arrow/indicator element if enabled
                    if (o.sub_indicators) {
                        $('>a:first-child', this).append(sub_indicator.clone());
                    }

                    // Get the submenu and hide it, but keep display:block so if necessary the width can be calculated
                    var submenu = $('>ul', this).css({ 'visibility' : 'hidden' , 'display' : 'block' });

                    // Add drop shadow class if enabled
                    if (o.drop_shadows) {
                        submenu.addClass(o.shadow_class);
                    }

                    // For vertical menus
                    if (o.vertical) {
                        var left = $(this).width();
                        submenu.css({ 'top' : 0 , 'left' : left });
                    }

                    // IE <= 7
                    if (ie7) {
                        // Lock submenu UL width in CSS so that the LI's can stretch
                        // Wrap in setTimeout() else the arrow may not be included
                        setTimeout(function() {
                            submenu.css({ 'width' : submenu.innerWidth() });
                        }, 0);
                    }

                    // Handle hover states
                    $(this).on({
                        mouseenter : function(e) {
                            clearTimeout($(this).data('close_timer'));
                            clearTimeout($(this).data('open_timer'));

                            // $.proxy() keeps "this" context
                            $(this).data('open_timer', setTimeout($.proxy(function() {
                                $(this).addClass(o.hover_class);

                                submenu.css({ 'visibility' : 'visible' });

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
                                    submenu.animate(o.animation_close, o.speed_close);
                                } else {
                                    submenu.hide().css({ 'visibility' : 'hidden' });
                                }
                            }, this), o.close_delay));
                        }
                    });
                });
            });
        }
    });
})( jQuery, window , document );