// jQuery().dropdown_menu() by Daniel Upshaw 2012-2013

// Beginning semi-colon for concatenated scripts and any improperly closed plugins
;(function( $, window, document, undefined ) {
    $.fn.extend({
        dropdown_menu : function (options) {
            var _defaults = {
                sub_indicator_class  : 'dropdown-menu-sub-indicator',
                vertical_class       : 'dropdown-menu-vertical',
                shadow_class         : 'dropdown-menu-shadow',
                hover_class          : 'dropdown-menu-hover',
                open_delay           : 200,
                close_delay          : 300,
                animation            : { opacity : 'show' },
                speed                : 'fast',
                sub_indicators       : false,
                drop_shadows         : false,
                vertical             : false
            };

            var ieLT7    = ($.browser.msie && $.browser.version < 8);
            var bgiframe = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="javascript:false;"'+
                           'style="display:block;position:absolute;z-index:-1;'+
                           'filter:Alpha(Opacity=\'0\');'+
                           'top:expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\');'+
                           'left:expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\');'+
                           'width:expression(this.parentNode.offsetWidth+\'px\');'+
                           'height:expression(this.parentNode.offsetHeight+\'px\');"/>';

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

                elm.find('li:has(ul)').on({
                    mouseenter : function(e) {
                        clearTimeout($(this).data('close_timer'));
                        clearTimeout($(this).data('open_timer'));

                        // $.proxy() keeps "this" context
                        $(this).data('open_timer', setTimeout($.proxy(function() {
                            $(this).addClass(o.hover_class);

                            var submenu = $(this).find('>ul').css({ 'visibility' : 'visible' });
                            if (o.vertical) {
                                submenu.css({ 'top' : 0 , 'left' : $(this).width()});
                            }

                            submenu.stop();
                            submenu.animate(o.animation, o.speed);
                        }, this), o.open_delay));
                    },
                    mouseleave : function(e) {
                        clearTimeout($(this).data('close_timer'));
                        clearTimeout($(this).data('open_timer'));

                        // $.proxy() keeps "this" context
                        $(this).data('close_timer', setTimeout($.proxy(function() {
                            $(this).removeClass(o.hover_class).find('>ul').hide().css({ 'visibility' : 'hidden' });
                        }, this), o.close_delay));
                    }
                }).each(function() {
                    // Add a class to the LI to indicate that it has a submenu
                    $(this).addClass(o.sub_indicator_class);
                    // Add sub indicators if enabled
                    if (o.sub_indicators) {
                        $('>a:first-child', this).append(sub_indicator.clone());
                    }
                    // Add drop shadow class if enabled
                    if (o.drop_shadows) {
                        $('>ul', this).addClass(o.shadow_class);
                    }
                    // Add bgiframe for <= IE7 to reliably fix z-indexing issues
                    if (ieLT7) {
                        $('>ul', this).each(function() {
                            if ($(this).children('iframe.bgiframe').length === 0) {
                                this.insertBefore(document.createElement(bgiframe), this.firstChild);
                            }
                        });
                    }
                });
            });
        }
    });
})( jQuery, window , document );