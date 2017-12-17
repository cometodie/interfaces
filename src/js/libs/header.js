$(function(){   
    $(window).on('load', $('body').height($('md-content').height()));
    $('md-tab-item').on("click", reload);
    $('button').on("click", reload);
    function reload(){
        setTimeout(()=>{
            $('body').height($('md-content').height());
        }, 600);
    }
});

