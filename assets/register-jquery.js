  $(document).ready(function() {
    $('#password, #confirmPassword').on('keyup', function() {
      if ($('#password').val() == $('#confirmPassword').val()) {
        $('#message').html('').css('color', 'green');
      } else
        $('#message').html('Passwords do not match').css('color', 'red');
    });
  });
