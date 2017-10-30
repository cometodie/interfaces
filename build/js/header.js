$(function(){   
    $(window).on('load', $('body').height($('md-content').height()));
    $('md-tab-item').click(function(){
        function reload(){
            $('body').height($('md-content').height());
        }
        setTimeout(reload, 450);
    });
});