jQuery(document).ready(function () {
    
    /*
        Fullscreen background
    */
    $.backstretch("/static/img/login_background.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function () {
        $.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function () {
        $.backstretch("resize");
    });
    
    /*
        Form validation
    */
    $('.registration-form input[type="text"], .registration-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });
    
    $('.registration-form').on('submit', function (e) {
        
        $(this).find('input[type="text"], textarea').each(function () {
            if ($(this).val() == "") {
                e.preventDefault();
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
            }
        });
        
    });
    //显示忘记密码
    $('#forgetBtn').click(function () {
        $('body').append('<div class="modal-backdrop fade"></div>');
        $(".modal").show();
        $('.fade').addClass("in");
    });
    //关闭忘记密码
    $('.close,.close-forget').click(function () {
        $('.modal-backdrop').remove();
        $(".fade").removeClass('in');
        $(".modal").hide();
        
    })
    
});
