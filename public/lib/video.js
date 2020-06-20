let modalId = $('#image-gallery');

$(document)
  .ready(function () {

    $(".vid").hover(function () {

      $(this).get(0).play();
    }, function () {
      $(this).get(0).pause();
      $(this).get(0).currentTime = 0;
    });


    $(".zoom").hover(function () {

      $(this).addClass('transition');
    }, function () {

      $(this).removeClass('transition');
    });
    $('.videoModal').on('hide.bs.modal', function() {
      var memory = $(this).html();
      $(this).html(memory);
 });

    loadGallery(true, 'a.thumbnail');

    //This function disables buttons when needed
    function disableButtons(counter_max, counter_current) {
      $('#show-previous-image, #show-next-image')
        .show();
      if (counter_max === counter_current) {
        $('#show-next-image')
          .hide();
      } else if (counter_current === 1) {
        $('#show-previous-image')
          .hide();
      }
    }

    /**
     *
     * @param setIDs        Sets IDs when DOM is loaded. If using a PHP counter, set to false.
     * @param setClickAttr  Sets the attribute for the click handler.
     */

    function loadGallery(setIDs, setClickAttr) {
      let current_image,
        selector,
        counter = 0;

      $('#show-next-image, #show-previous-image')
        .click(function () {
          if ($(this)
            .attr('id') === 'show-previous-image') {
            current_image--;
          } else {
            current_image++;
          }

          selector = $('[data-video-id="' + current_image + '"]');
          updateGallery(selector);
        });

      function updateGallery(selector) {
        let $sel = selector;
        current_image = $sel.data('video-id');
        $('#image-gallery-title')
          .text($sel.data('title'));
        $('#image-gallery-image')
          .attr('src', $sel.data('video'));
        
         
                   
        disableButtons(counter, $sel.data('video-id'));
      }

      if (setIDs == true) {
        $('[data-video-id]')
          .each(function () {
            counter++;
            $(this)
              .attr('data-video-id', counter);
          });
      }
      $(setClickAttr)
        .on('click', function () {
          updateGallery($(this));
        });
    }


  });
