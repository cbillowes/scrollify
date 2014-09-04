scrollify
=========

Simple vertical jQuery vertical scroll plugin.

This plugin requires jquery v1.11.1 or later although it has not been tested with later versions.

Usage example:
--------------

  $(".categoryScroller").scrollify({
      activeElementClassName: 'active', 
      elementSelector: 'li',
      leftButtonSelector: '.categoryScroller .left-button',
      rightButtonSelector: '.categoryScroller .right-button',
      moveAnimationDuration: 300,
      activateOnMove: true,
      activateCallback: function($activeElement) {
          $('.content').text($activeElement.text());
      }
  });

This is my first jQuery plugin so it may not be perfect. All feedback is welcomed!