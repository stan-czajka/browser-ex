// ==UserScript==
// @name        Redmine-Toggl-Button
// @namespace   RedmineTogglButton
// @description Przycisk do włączania kontekstu zadania z redmine na toggl
// @match     http://redmine.office.local/issues/*
// @version     0.0.4
// @license     cannot use
// @grant       GM_xmlhttpRequest
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==

// 0.0.1 - prototyp
// 0.0.2 - poprawka logiwania przez API Key
// 0.0.3 - dodanie notifications zamiast disabled
// 0.0.4 - dodanie mapowania nazw projektów

console.log('RedmineTogglButton: init');

// https://www.toggl.com/api/v8/me
var toggl_api_key = 'x'; // DO UZUPEŁNIENIA
var toggl_workspace_id = 1; // DO UZUPEŁNIENIA
var toggl_api = 'https://www.toggl.com/api/v8/'

var start_button_id='toggl-start';
var start_input_id='toggl-comment';

// mapowanie nazwy projektu z redmine na jego ID w toggl
// https://www.toggl.com/api/v8/workspaces/{workspace_id}/projects
var projects = {
  // do uzupełnienia
};

function changeButton() {
  $('#' + start_input_id).prop('disabled', true);
  $('#' + start_button_id).unbind( "click" ).click(function(e) {
      e.preventDefault();
  }).removeAttr('href');
}

function stopEntry() {
  
}

function notify(msg) {
    var options = {
        icon: "http://blog.toggl.com/wp-content/uploads/2015/04/toggl-button-light.png"
    };

 if (!("Notification" in window)) {
    alert("Ta przeglądarka nie obsługuje powiadomień");
  }
  // Sprawdźmy czy uprawnienia dla powiadomienia zostały nadane
  else if (Notification.permission === "granted") {
    // jeżeli są tworzymy powiadomienie
    var notification = new Notification(msg, options);
  }

  // W innym przypadku tworzymy zapytanie o uprawnienia
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      //Jeżeli użytkownik zaakceptuje tworzymy powiadomienie
      if (permission === "granted") {
        var notification = new Notification(msg, options);
      }
    });
  }
}

function startEntry() {
  var url =  toggl_api + 'time_entries/start';
  
  var now = new Date(); //without params it defaults to "now"
  var start_time = now.toJSON();
    
  var project = $('.current-project').text();

  var start_request = 
    {
      "time_entry":
      {
        "start":start_time,
        "description":$('#' + start_input_id).val(),
        //"tags":[""],
        "wid":toggl_workspace_id,
        "created_with":"RedmineTogglButton",
        "pid": projects[project]
      }
    };
  
  console.log('RedmineTogglButton: startEntry:');
  console.log(start_request);
  
  var basic_auth = "Basic " + btoa(toggl_api_key + ":" + "api_token");
  
  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    //user: toggl_api_key,
    //password: 'api_token',
    data: JSON.stringify(start_request),
    headers: {
      "Content-Type": "application/json",
      "Authorization": basic_auth
    },
    onload: function(response) {
      console.log('RedmineTogglButton: POST ' + url + ' response');
      console.log(response);
      try {
          notify("Wysłano do toggl");
      }
      catch (err) {
        console.log('RedmineTogglButton: POST ' + url + ' error ' + err.message);
      }
    }
  });
  
  console.log('RedmineTogglButton: POST ' + url + ' sent...');
}

function initButton() {
  console.log('RedmineTogglButton: initButton');
  
  var text = window.location;
  var idRegex = /\/issues\/(\d+)/i;
  var id = idRegex.exec(text)[1];
  console.log("RedmineTogglButton: Task id parsed: " + id);
  
  var button_style='background-image: url(http://blog.toggl.com/wp-content/uploads/2015/04/toggl-button-light.png);background-size: 21px 21px;background-repeat: no-repeat;';
  
  var init_value = '#' + id;
  $('#content .contextual:first').prepend('<input type="text" id="' + start_input_id + '" value="' + init_value + '" />');
  $('#content .contextual:first').prepend('<a class="icon" style="' + button_style + '" href="#" id="' + start_button_id + '">Start</a>&nbsp;');
  
  $('#' + start_button_id).click(startEntry);  
  $('#' + start_input_id).keypress(function(event){
    var keycode = event.keyCode || event.which;
    if(keycode == '13') {
       startEntry(); 
    }
  }); 
}

$(function() {
  console.log('RedmineTogglButton: ready');
  try{
    initButton();
  }
  catch (err) {
      console.error(err);
  }
}); 
