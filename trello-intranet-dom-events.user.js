// ==UserScript==
// @name        Trello-Intranet
// @namespace   sc
// @author      sc
// @version     1.2.0
// @description Intranet sites and trello integration
// @match       https://trello.com/*
// @license     cannot use
// @grant       GM_xmlhttpRequest
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==

// 1.1.0 - dodanie opcji na zmianę hostname dla redmine
// 1.2.0 - zmiana logowania na API Key

this.$ = this.jQuery = jQuery.noConflict(true);

function changeRedmine(hostname) {

    var issueUrlPrefix = 'http://' + hostname + '/issues/';

    // <a href="https://trello.com/c/tPRVtPv6/253-odprawa-9-05" class="known-service-link">
    // <img src="https://d78fikflryjgj.cloudfront.net/images/services/e1b7406bd79656fdd26ca46dc8963bee/trello.png" class="known-service-icon">
    // Odprawa 9.05
    // </a>

    // <a rel="noreferrer" target="_blank" href="http://redmine/issues/11510">http://redmine/issues/11510</a>

    $( document ).on( "click", "a.offsite", function() {

    });

    $('a[href^="'+issueUrlPrefix+'"]')
        .not('.redmine')
        .each(function() {
        $this = $(this);
        var text = $this.attr('href');

        var idRegex = /\/issues\/(\d+)/i;
        var id = idRegex.exec(text)[1];
        console.log("Redmine: Task parsed: " + id);

        $this
            .addClass('known-service-link')
            .addClass('redmine-'+id)
            .addClass('redmine')
            .empty()
            .append('<img src="http://'+hostname+'/favicon.ico" class="known-service-icon" />')
        //http://redmine/themes/a1/images/logo.png
        //http://redmine/favicon.ico
            .append(text);


        var url = issueUrlPrefix + id + ".json";
        console.log('Redmine: GET on: ' + url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            //user: 'xxx',
            //password: 'dummy',
            onload: function(response) {
                try {
                    //console.log(response);
                    var task = jQuery.parseJSON(response.responseText);
                    //console.log(task);
                    var taskId = task.issue.id;
                    var linkText = taskId + ' - ' + task.issue.subject;
                    //console.log('Redmine: GET for: ' + taskId + ' - ' + linkText);
                    $('.redmine-'+taskId)
                        .text(linkText)
                        .prepend('<img src="http://'+hostname+'/favicon.ico" class="known-service-icon" />');
                    //console.log('Redmine: Replaced for ' + taskId);
                }
                catch (err) {
                    console.log('Redmine: GET error ' + err.message);
                }
            }
        });
    });

}

function changePortal() {

}

function init() {
    //console.log('init');

    changeRedmine('redmine');
    changeRedmine('redmine.office.local');
    changePortal();
}

try{
    document.addEventListener('DOMNodeInserted', function(e){
        setTimeout(init, 1000); 
    });
}
catch (err) {
    console.error(err);
}


