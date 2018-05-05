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
    //登录按钮
    $('#loginBtn').click(function () {
        let flag = true;
        $(this).parents("form").find('input[type="text"],input[type="password"], textarea').each(function () {
            if ($(this).val() === "") {
                $(this).addClass('input-error');
                flag = false
            }
            else {
                $(this).removeClass('input-error');
                flag = true;
            }
            
        });
        if (flag) {
            let phone = $("#form-phone").val();
            let password = $("#form-password").val();
            if (checkMobile(phone)) {
                $.post(urls.login, {phone: phone, password: password}, function (res) {
                    if (res.code !== 0) {
                        alert(res.msg);
                    } else {
                        window.location.href = "/record/index/"
                    }
                })
            }
        }
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
    });
    //获取验证码
    $("#getMsgBtn").click(function () {
        let phoneNumber = $("#resetPhone").val();
        
        getMsgCode($(this), phoneNumber,0);
    });
    //重置密码
    $("#resetPwdBtn").click(function () {
        let reqData = {
            phoneNumber: $("#resetPhone").val(),
            newPwd: $("#newPwd").val(),
            repeatNewPwd: $("#repeatNewPwd").val(),
            msgCode: $("#msgCode").val()
        };
        if (!checkMobile(reqData.phoneNumber)) {
            return false;
        }
        if (!checkMsgCode(reqData.msgCode)) {
            alert("验证码格式不正确");
            return false;
        }
        if (reqData.newPwd.length < 6 || reqData.newPwd.length > 16) {
            alert("请输入6-16位之间的字母和数字");
            return false;
        }
        if (reqData.newPwd !== reqData.repeatNewPwd) {
            alert("两次密码输入不一致");
            return false;
        }
        $.post(urls.reset_pwd, reqData, function (res) {
            if (res.code === 0) {
                alert("重置密码成功,请登录");
                $('.modal-backdrop').remove();
                $(".fade").removeClass('in');
                $(".modal").hide();
                $("#resetPhone").val(reqData.phoneNumber)
            } else {
                alert(res.msg)
            }
        })
    })
});
