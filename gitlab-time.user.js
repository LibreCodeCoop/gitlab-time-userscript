// ==UserScript==
// @name         GitLab Total Time
// @namespace    https://github.com/LibreCodeCoop/gitlab-time-userscript/
// @version      0.1
// @description  Add total time to header of lists on GitLab boards
// @author       Vitor Mattos
// @license      AGPL-v3.0+
// @match        http*://*/*/boards
// @match        http*://*/*/boards?*
// @match        http*://*/*/boards/*
// @icon         https://gitlab.com/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

function listTotalTime() {
    $('header.board-header div.issue-count-badge').each(function() {
        var container = $(this).children();
        var timeElement = container.find('span.list-total-time');
        if(timeElement.length === 0) {
            container.append('<span class="gl-display-inline-flex gl-ml-3 list-total-time"></span>')
        }
        timeElement = container.find('span.list-total-time')

        timeElement.attr('time_m', 0)
        timeElement.attr('time_h', 0)
    });

    $('time:not([datetime]').each(function() {
        var countElement = $(this).closest('div.board-inner').find('span.list-total-time');
        var time = $(this).text()
        var type = time.slice(-1)
        time = time.slice(0, -1)
        countElement.attr('time_' + type, parseInt(countElement.attr('time_' + type)) + parseInt(time))
    })

    $('span.list-total-time').each(function() {
        var min = parseInt($(this).attr('time_m'))
        if (min >= 60) {
            $(this).attr('time_h', parseInt($(this).attr('time_h')) + min / 60)
            $(this).attr('time_m', parseInt($(this).attr('time_m')) + min % 60)
        }
        var minPad = $(this).attr('time_m')
        minPad = ('00' + minPad).slice(-2)
        $(this).html(
            '<svg role="img" aria-hidden="true" class="gl-mr-2 gl-icon s16" data-testid="hourglass-icon"><use href="/assets/icons-05c4d4d8f3cc1fe0f22064d47d6a57d254ff9686a08abb74993ade21581e46f8.svg#hourglass"></use></svg>'
            + $(this).attr('time_h')
            + ':'
            + minPad
        )
    });
}

$(document).ready(function() {
    setTimeout(function () {
        $('<div class="gl-ml-3 gl-display-flex gl-align-items-center"><button title="" data-qa-selector="boards_config_button" type="button" class="btn btn-default btn-md gl-button" id="refresh-list-time"><!----> <!---->  <span class="gl-button-text">Refresh times</span></button></div>').insertAfter($('[data-testid="boards-create-list"]'));

        $('#refresh-list-time').on("click", function(){
            listTotalTime()
        })
    }, 1000)
});
