  $(document).ready(function() {
    $('#password, #confirmPassword').on('keyup', function() {
      if ($('#password').val() == $('#confirmPassword').val()) {
        $('#message').html('').css('color', 'green');
      } else
        $('#message').html('Passwords do not match').css('color', 'red');
    });
  });


  // $('#usercheck').on('change', function() {
  //    $.get('/usercheck?username='+$('#usernameValue').val().toLowerCase(), function(response) {
  //    $('#usernameResponseHidden').text(response.message)
  //    if ($('#usernameResponseHidden').html() === "user exists"){
  //        $('#usernameResponse').text('That username is taken. Please pick another')
  //    }
