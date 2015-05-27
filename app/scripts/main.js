'use strict';

var App = (function(){
  var authToken, apiHost;

  var run = function(){
    console.log('inside App.run');

    //if user is currently logged out: show sign_in & sign_up nav item, hide logout nav item
    if(localStorage['authToken'] == undefined){
      $('#sign_in').show();
      $('#sign_up').show();
      $('#logout').hide();
    } else { //user is logged in: hide sign_in & sign_up nav item, show logout nav item
      $('#sign_in').hide();
      $('#sign_up').hide();
      $('#logout').show();
    };

    authToken = localStorage.getItem('authToken');
    apiHost = 'http://localhost:3000/api/v1';

    setupAjaxRequests();

    $('#loadPosts').on('click', loadPosts);
    $('#loginForm').on('submit', submitLogin);
    $('#registrationForm').on('submit', submitRegistration);
    $('#logout').on('click', logout);
  };

  var setupAjaxRequests = function(){
    $.ajaxPrefilter(function( options ){
      options.headers = {};
      options.headers['AUTHORIZATION'] = "Token token=" + authToken;
    });
  };

  var loadPosts = function(){
    $.ajax({
      url: apiHost + '/posts',
      type: 'GET',
      dataType: 'JSON'
    }).done(function(data){
    console.table(data);

    }).fail(acceptFailure);
  };

  var acceptFailure = function(error){
    //if status is unauthorized / 401, then redirect to login page
    if (error.status === 401){
      window.location.href = '/sign_in.html';
    }
  };

  var submitLogin = function(event){
    event.preventDefault();
    var $form;
    $form = $(this);
    $.ajax({
      url: apiHost + '/users/sign_in',
      type: 'POST',
      data: $form.serialize()
    })
    .done(loginSuccess)
    .fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });

  };

  var submitRegistration = function(event){
    event.preventDefault();
    $.ajax({
      url: apiHost + '/users',
      type: 'POST',
      data: {
        user: {
          email: $('#email').val(),
          password: $('#password').val()
        }
      }
    })
    .done(loginSuccess)
    .fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });
    // return false;
  };

  var loginSuccess = function(userData){
    //recieve the authToken in the response, userData.token
    localStorage.setItem('authToken', userData.token);
    console.log('Logged in!');

    //redirect to homepage when done
    window.location.href = '/';

    //hide sign_in & sign_up nav item, show logout nav item
    $('#sign_in').hide();
    $('#sign_up').hide();
    $('#logout').show();
  };

  var logout = function(){
    localStorage.removeItem('authToken');
    console.log('Logged out!');

    //redirect to homepage when done
    window.location.href = '/';

    // show sign_in & sign_up nav item, hide logout nav item
    $('#sign_in').show();
    $('#sign_up').show();
    $('#logout').hide();
  };

  return {
    run: run
  };

})();

$().ready(function(){
  App.run();

});
