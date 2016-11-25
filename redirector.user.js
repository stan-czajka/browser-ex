// ==UserScript==
// @name       Redirector
// @namespace  sc
// @version    1.0
// @description  Przekierowania stron do zmiany nazwy domenowej
// @match      http://*/*
// @license    cannot use
// @run-at document-start
// ==/UserScript==

redirectToPage("redmine", "redmine.office.local");
redirectToPage("redmine.orca.inet", "redmine.office.local");

function redirectToPage(hostSource, hostTarget)
{
    //console.log(window.location.hostname);
    //if(window.location.hostname.indexOf(page1) != -1)
    if(window.location.hostname == hostSource)
    {
        window.location.hostname = hostTarget;
    }
}