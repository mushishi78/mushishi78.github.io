/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        $(".post-content").fitVids();

        // Creates Captions from Alt tags
        $(".post-content img").each(function() {
            // Let's put a caption if there is one
            if($(this).attr("alt"))
              $(this).wrap('<figure class="image"></figure>')
              .after('<figcaption>'+$(this).attr("alt")+'</figcaption>');
        });

        var image_element = $('.teaserimage-image');
        var image = image_element.css('background-image');
        if(image) {
            var rand = Math.floor((Math.random() * 4) + 1);
            image = image.replace('pigeons-01', 'pigeons-0' + rand);
            image_element.css('background-image', image);
        }

    });

}(jQuery));