/*!
 * Scrollify v1.0
 * https://github.com/cbillowes/scrollify
 *
 * Copyright (c) 2014 Clarice Bouwer
 * @cbillowes
 * Released under the MIT license
 * https://github.com/cbillowes/scrollify/blob/master/LICENSE
 
 * Date: 2014-09-04T20:33Z
 */

 (function($) {
    $.fn.scrollify = function(options) {
        var firstElement;
        if (!options) return;

        options.$scroller = $(this);

        init = function() {
            options.activeElementSelector = '.' + options.activeElementClassName;

            $(options.rightButtonSelector).on('click', moveRight);
            $(options.leftButtonSelector).on('click', moveLeft);
            $(options.elementSelector).on('click', function() {
                activate($(this));
            });
            
            moveToActiveElement();
        },
        getFirstElement = function() {
            var element = $(options.$scroller).find(firstElement);
            if (element.size() === 0) {
                element = $(options.$scroller).find(options.elementSelector + ':first-child');
            }
            return $(element);
        },
        animateMove = function(element, animation) {
            $(element).animate(animation, options.moveAnimationDuration);
        },

        activate = function(element) {
            $(options.$scroller).find(options.activeElementSelector).removeClass(options.activeElementClassName);
            $(element).addClass(options.activeElementClassName);
            if (options.activateCallback) {
                options.activateCallback($(element));
            }
        },
        moveLeft = function() {
            var $firstElement = getFirstElement();
            var $previousElement = $($(options.$scroller).find($firstElement).prev());
            if ($previousElement.size() > 0) {
                animateMove($previousElement, {'margin-left': '0px'});
                firstElement = $previousElement;
                if (options.activateOnMove) {
                    activate($previousElement);
                }
            }
        },
        moveRight = function() {
            var $firstElement = getFirstElement();

            var $nextElement = $($(options.$scroller).find($firstElement).next());
            if ($nextElement.size() > 0) {
                animateMove($firstElement, {'margin-left': '-' + $firstElement.outerWidth() + 'px'});
                firstElement = $nextElement;
                if (options.activateOnMove) {
                    activate($nextElement);
                }
            }
        },
        moveToActiveElement = function() {
            var foundActive = false;
            var scrollerLeftOffset = $(options.$scroller).offset().left;

            $(options.$scroller).find(options.elementSelector).each(function(i) {
                if (!foundActive && !$(this).hasClass(options.activeElementClassName)) {
                    $(this).css({'margin-left': '-' + ($(this).outerWidth() + (scrollerLeftOffset * (i + 1))) + 'px'});
                }

                if ($(this).hasClass(options.activeElementClassName)) {
                    firstElement = $(this);
                    if (options.activateCallback) {
                        options.activateCallback($(this));
                    }
                    foundActive = true;
                } 
            });
        }

        init();
        return this;
    };
}(jQuery));