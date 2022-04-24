document.addEventListener('DOMContentLoaded', function() {
  $('#readMore').click(function(e) {
    e.stopPropagation();
    $('.justify').css({
      'height': 'auto',
    })
  });

  $(document).click(function() {
    $('.justify').css({
      'height': '120px'
    })
  })

  $('#readMore').click(function(e) {
    e.stopPropagation();
    $('#readMore').css({
      'display': 'none',
    })
  });

  $(document).click(function() {
    $('#readMore').css({
      'display': 'block'
    })
  })
});
