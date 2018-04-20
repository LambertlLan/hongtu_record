jQuery(document).ready(function () {
    /*
        Fullscreen background
    */
    $.backstretch("/static/img/register_background.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function () {
        $.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function () {
        $.backstretch("resize");
    });
    
    /*
        Form
    */
    $('.registration-form fieldset:first-child').fadeIn('slow');
    
    $('.registration-form input[type="text"], .registration-form input[type="password"], .registration-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });
    
    function checkEmpty($this) {
        let parent_fieldset = $this.parents('fieldset');
        let flag = true;
        parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function () {
            if ($(this).val() === "") {
                $(this).addClass('input-error');
                flag = false;
            }
            else {
                $(this).removeClass('input-error');
            }
        });
        return flag;
    }
    
    // next step
    function nextStep($this) {
        let parent_fieldset = $this.parents('fieldset');
        let next_step = true;
        
        if (next_step) {
            parent_fieldset.fadeOut(400, function () {
                parent_fieldset.next().fadeIn();
            });
        }
    }
    
    $('.registration-form .btn-next').on('click', function () {
        if (!checkEmpty($(this))) return false;
        nextStep($(this))
        
    });
    
    // previous step
    $('.registration-form .btn-previous').on('click', function () {
        $(this).parents('fieldset').fadeOut(400, function () {
            $(this).prev().fadeIn();
        });
    });
    
    
    //获取验证码
    $("#getMsgBtn").click(function () {
        let phoneNumber = $("#phoneNumber").val();
        getMsgCode($(this), phoneNumber);
    });
    //提交验证码
    $("#subMsgBtn").click(function () {
        let _this = $(this);
        if (!checkEmpty($(this))) return false;
        let msgCode = $("#msgCode").val();
        if (checkMsgCode(msgCode)) {
            //开始请求后台验证验证码
            $.post(urls.checkMsgCode, {msgCode: msgCode}, function (res) {
                console.log(res);
                if (res.code === 0) {
                    nextStep(_this);
                } else {
                    alert(res.msg)
                }
            })
        } else {
            alert("输入不正确")
        }
    });
    
    //验证两次密码输入
    $("#checkPwdBtn").click(function () {
        let pwd = $("#form-password").val();
        let repeatPwd = $("#form-repeat-password").val();
        if (!checkEmpty($(this))) {
            return false;
        }
        if (pwd.length < 6 || pwd.length > 16) {
            alert("请输入6-16位之间的字母和数字");
            return false;
        }
        if (pwd === repeatPwd) {
            nextStep($(this));
        } else {
            alert("两次密码输入不一致");
        }
    });
    
    // 提交注册信息
    $('#registSubBtn').click(function () {
        
        if (!checkEmpty($(this))) return false;
        let email = $("#form-email").val();
        if (!checkEmail(email)) {
            alert("邮箱格式不正确");
            return false;
        }
        let name = $("#form-name").val();
        if (!checkChinese(name)) {
            alert("姓名必须是中文");
            return false
        }
        //验证通过,提交后台
        let data = {
            phone: $("#phoneNumber").val(),
            name: name,
            email: email,
            password: $("#form-password").val(),
        };
        $.post(urls.register, data, function (res) {
            if (res.code === 0) {
                window.location.href = "/record/index/"
            } else {
                alert(res.msg)
            }
        })
        
        
    })
    
    
});
