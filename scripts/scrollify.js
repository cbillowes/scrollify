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
        var firstElement
          , moveAnimationForSwipe;

        if (!options) return;

        options.$scroller = $(this);

        init = function() {
            setDefaults();
            options.activeElementSelector = '.' + options.activeElementClassName;

            $(options.rightButtonSelector).on('click', moveRight);
            $(options.leftButtonSelector).on('click', moveLeft);
            $(options.elementSelector).on('click', function() {
                activate($(this));
            });
            
            moveToActiveElement();

            if (options.enableSwiping) {
                enableSwiping();
            }
        },
        setDefaults = function () {
            if (!options.mininumSwipeDistanceInPx) options.mininumSwipeDistanceInPx = 100;
            if (!options.moveAnimationDurationForSwipe) options.moveAnimationDurationForSwipe = 100;
        },
        getFirstElement = function() {
            var element = $(options.$scroller).find(firstElement);
            if (element.size() === 0) {
                element = $(options.$scroller).find(options.elementSelector + ':first-child');
            }
            return $(element);
        },
        animateMove = function(element, animation) {
            var duration = (moveAnimationForSwipe) ? options.moveAnimationDurationForSwipe : options.moveAnimationDuration;
            $(element).animate(animation, duration);
        },
        activate = function(element) {
            var ignoreCallback = true;

            $(options.$scroller).find(options.activeElementSelector).removeClass(options.activeElementClassName);
            $(element).addClass(options.activeElementClassName);
            if (options.activateCallback) {
                options.activateCallback($(element));
            }
            if (options.moveActivatedToFirst) {
                moveToActiveElement(ignoreCallback);
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
        moveToActiveElement = function(ignoreCallback) {
            var foundActive = false;
            var scrollerLeftOffset = $(options.$scroller).offset().left;

            $(options.$scroller).find(options.elementSelector).each(function(i) {
                if (!foundActive && !$(this).hasClass(options.activeElementClassName)) {
                    animateMove($(this), {'margin-left': '-' + ($(this).outerWidth() + (scrollerLeftOffset * (i + 1))) + 'px'});
                }

                if ($(this).hasClass(options.activeElementClassName)) {
                    firstElement = $(this);
                    if (options.activateCallback && !ignoreCallback) {
                        options.activateCallback($(this));
                    }
                    foundActive = true;
                } 
            });
        },
        enableSwiping = function() {
            var startSwipeCursorLocation;

            options.$scroller
                .attr('unselectable', 'on')
                .on('selectstart', false);


            options.$scroller.on('mousedown', function(evt) { 
                startSwipeCursorLocation = evt.clientX;
            });

            options.$scroller.on('mouseup', function(evt) { 
                var endSwipeCursorLocation = evt.clientX;
                var actualSwipeDistance = startSwipeCursorLocation - endSwipeCursorLocation;

                if (Math.abs(actualSwipeDistance) < options.mininumSwipeDistanceInPx) return;

                if (actualSwipeDistance > 0) {
                    swipe(actualSwipeDistance, moveLeft);
                } else {
                    swipe(actualSwipeDistance, moveRight);
                }
            });
        },
        swipe = function(actualSwipeDistance, swipeCallback) {
            var timesToSwipe = Math.abs(parseInt(actualSwipeDistance / options.mininumSwipeDistanceInPx, 10));
            moveAnimationForSwipe = true;

            while (timesToSwipe > 0) {
                swipeCallback();
                timesToSwipe -= 1;
            }

            moveAnimationForSwipe = false;
        }

        init();
        return this;
    };
}(jQuery));