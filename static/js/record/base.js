/**
 * Created by ZBF on 2016/9/18.
 */
$(function () {
    $(".declare").click(function () {
        sky.declare();
    });
    $(".lookWarrant").click(function () {
        sky.authorize();
    });
    $(".checkbox").click(function () {
        var o = $(this);
        if (o.hasClass("active")) {
            o.removeClass("active");
        } else {
            o.addClass("active");
        }
    });
    if (!placeholderSupport()) {
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    }
    ;
});

function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}

$(".header .min-nav").on("click", function () {
    var e = $(this);
    var mobileMenu = $("#mobileMenu");
    if (mobileMenu.hasClass("open")) {
        mobileMenu.removeClass("open");
        e.removeClass("open");
        mobileMenu.animate({
            "height": "0px",
        }, 500, function () {
            mobileMenu.css("visibility", "hidden");
        });
    } else {
        mobileMenu.addClass("open");
        e.addClass("open");
        mobileMenu.animate({
            "height": (mobileMenu.find("li").length * 41) + 2 + "px",
        }, 500);
        mobileMenu.css("visibility", "visible");
    }
})
$(".header-acc .min-nav").on("click", function () {
    var mobileMenu = $("#mobileMenu");
    var e = $(this);
    if (mobileMenu.hasClass("open")) {
        mobileMenu.removeClass("open");
        e.removeClass("open");
    } else {
        mobileMenu.addClass("open");
        e.addClass("open");
    }
})

function returnCode(code) {
    switch (code) {
        case 0:
            return true;
            break;
        case 11000:
            sky.promptWin("提示", "<p>session 已过期,请重新登录</p>");
            return false;
            break;
        case 11001:
            sky.promptWin("提示", "<p>积分不足,请充值</p>");
            return false;
            break;
        case "9998":
            if (userType == 3) {
                sky.promptWin("提示", "<p>您是企业账号请使用U-Key登录系统查询！</p>");
            } else {
                sky.permitPrompt(userType);
            }
            return false;
            break;
        case "9950":
            sky.rechargeTips();
            return false;
            break;
        default:
            return false;
            break;
    }
}

function formatDate(t) { //格式化时间戳
    var time = new Date(parseInt(t));
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    var minute = time.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    var second = time.getSeconds();
    if (second < 10) {
        second = '0' + second;
    }
    return year + "-" + month + "-" + date;
}

function formatDateMonth(t) { //格式化时间戳
    var time = new Date(t);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    var minute = time.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    var second = time.getSeconds();
    if (second < 10) {
        second = '0' + second;
    }
    return year + "-" + month;
}

function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function cutOffData(str) {
    if (str.length != 6) {
        return str;
    }
    return str.substring(0, 4) + "-" + str.substring(4);
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    
    if (arr = document.cookie.match(reg))
        
        return unescape(arr[2]);
    else
        return null;
}

//出生日期年龄计算
function calculateAge(str) {
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear();
        return (Y - r[1]);
    }
    return ("出生日期格式不正确");
}

var sky = (function () {
    var body = $("body");
    var winClose = function () {
        $(".sky-win").remove();
        $(document.body).css({
            "overflow-x": "auto",
            "overflow-y": "auto"
        });
    }
    var isMobile = function () {
        if (document.documentElement.clientWidth <= 768) {
            return true;
        } else {
            return false;
        }
    };
    var loding = function () {
        var html = '<div class="loader ball-clip-rotate" id="loader">' +
            '<div></div>' +
            '</div>';
        body.append(html);
    };
    var lodingClose = function () {
        $("#loader").remove();
    }
    var form = function (h) {
        if ($(".sky-win")) {
            winClose();
        }
        var html = '<div class="sky-win-main sky-win"><div class="container-fluid">' +
            '<div class="sky-win-form">' + h + '</div>' +
            '</div></div><div class="sky-win-bg sky-win"></div>';
        body.append(html);
        var sky_main = $(".sky-win-main");
        var sky_container = $(".sky-win-main .container-fluid");
        var clientHeight = document.documentElement.clientHeight;
        var sky_top = clientHeight - sky_container.height();
        $(".sky-win .sky-close").click(function () {
            winClose();
        });
        $(".sky-win-bg").click(function () {
            winClose();
        });
        $(document.body).css({
            "overflow-x": "hidden",
            "overflow-y": "hidden"
        });
        $(window).resize(function () {
            if (sky_main) {
                if (isMobile()) {
                    sky_main.css({"margin-top": '0px', "top": sky_top < 0 ? 0 : sky_top + 'px'});
                } else {
                    sky_main.css({"margin-top": -(sky_main.height() / 2) + 'px', "top": '50%'});
                }
            }
        });
        if (!isMobile()) {
            sky_main.css("margin-top", -(sky_main.height() / 2) + 'px');
        } else {
            sky_main.animate({
                top: sky_top < 0 ? 0 : sky_top + 'px'
            }, 500);
        }
    }
    //登录弹窗
    var login = function () {
        var html = '<div class="sky-form-header"><span class="title">欢迎回来</span></div>' +
            '<div class="form">' +
            '<div class="icon-left-input acc"><i></i><input type="text" placeholder="请输入手机号码或账号"></div>' +
            '<div class="icon-left-input pwd"><i></i><input type="password" placeholder="请输入登录密码"></div>' +
            '<a class="m-btn" id="sky_sub" style="display: block;background-color: #2a86ff;border-color: #2a86ff">登录</a><a class="pull-right forgetPwd" style="color:#2a86ff" onclick="sky.forgetPwd()">忘记密码</a>' +
            '</div>';
        form(html);
        
        function sub() {
            var acc_input = $(".sky-win-form .acc");
            var pwd_input = $(".sky-win-form .pwd");
            var acc = acc_input.find("input").val();
            var pwd = pwd_input.find("input").val();
            if (!Utils.IsIllegal(acc)) {
                acc_input.addClass("warn");
                sky.msg("您输入的账号不正确");
                return;
            }
            if (!Utils.IsIllegal(pwd)) {
                pwd_input.addClass("warn");
                sky.msg("您输入的密码不正确");
                return;
            }
            sky.loding();
            $.ajax({
                type: 'post',
                url: 'sign/in.do',
                dataType: 'json',
                data: {
                    account: acc,
                    password: pwd
                },
                success: function (res) {
                    try {
                        sky.lodingClose();
                        if (returnCode(res.retCode)) {
                            location.href = "accIndexV.do";
                        } else {
                            sky.msg(res.retMsg);
                        }
                    } catch (e) {
                        sky.msg("发生异常：" + e);
                    }
                },
                error: function (xhr, type) {
                    sky.lodingClose();
                    sky.msg("服务器连接错误！");
                }
            })
        }
        
        $("#sky_sub").click(function () {
            sub()
        });
        
    }
    //注册弹窗
    
    //忘记密码
    var forgetPwd = function () {
        var html = '<div class="sky-form-header"><span class="title">忘记密码</span></div>' +
            '<div class="form">' +
            '<div class="icon-left-input phone"><i></i><input type="text" placeholder="请输入手机号码"></div>' +
            '<div class="icon-left-input imgCode"><i></i><input type="text" placeholder="请输入图片验证码"></div>' +
            '<a class="getImgCode code"><img src="message/imageCode.do"></a>' +
            '<div class="icon-left-input code"><i></i><input type="text" placeholder="请输入验证码"></div>' +
            '<a class="getPhoneCode code" style="color: #2a86ff;border-color: #2a86ff">获取验证码</a>' +
            '<div class="icon-left-input pwd"><i></i><input type="text" placeholder="请输入密码"></div>' +
            '<div class="icon-left-input cpwd"><i></i><input type="text" placeholder="重复密码"></div>' +
            '<a class="m-btn min sky_close" style="color: #2a86ff;border-color: #2a86ff">取消</a><a style="background-color: #2a86ff;border-color: #2a86ff" class="m-btn min pull-right" id="sky_sub">更改密码</a>' +
            '</div>';
        form(html);
        $(".getImgCode").click(function () {
            $(this).find("img").attr("src", "message/imageCode.do?" + Math.random());
        });
        $(".sky_close").click(function () {
            winClose();
        });
        $("#sky_sub").click(function () {
            var phone_input = $(".sky-win-form .phone");
            var code_input = $(".sky-win-form .code");
            var pwd_input = $(".sky-win-form .pwd");
            var cpwd_input = $(".sky-win-form .cpwd");
            
            var phone = phone_input.find("input").val();
            var code = code_input.find("input").val();
            var pwd = pwd_input.find("input").val();
            var cpwd = cpwd_input.find("input").val();
            
            if (!Utils.IsMobile(phone)) {
                phone_input.addClass("warn");
                sky.msg("您输入的手机号码不正确");
                return;
            }
            if (!Utils.IsPhoneCode(code)) {
                code_input.addClass("warn");
                sky.msg("您输入的短信验证码不正确");
                return;
            }
            if (!Utils.IsIllegal(pwd)) {
                pwd_input.addClass("warn");
                sky.msg("您输入的密码不正确");
                return;
            }
            if (pwd != cpwd) {
                cpwd_input.addClass("warn");
                sky.msg("两次密码输入不一致");
                return;
            }
            sky.loding();
            $.ajax({
                type: 'post',
                url: 'user/forgetPwd.do',
                dataType: 'json',
                data: {
                    mobile: phone,
                    code: code,
                    password: pwd
                },
                success: function (res) {
                    $(".getImgCode").find("img").attr("src", "message/imageCode.do?" + Math.random());
                    sky.lodingClose();
                    try {
                        if (returnCode(res.retCode)) {
                            location.replace(document.referrer);
                        } else {
                            sky.msg(res.retMsg);
                        }
                    } catch (e) {
                        sky.msg("发生异常：" + e);
                    }
                },
                error: function (xhr, type) {
                    $(".getImgCode").find("img").attr("src", "message/imageCode.do?" + Math.random());
                    sky.lodingClose();
                    sky.msg("服务器连接错误！");
                    console.log(xhr, type);
                }
            })
        });
        var time = 60;
        $(".getPhoneCode").click(function () {
            if (time != 60) {
                return;
            }
            var t = $(this);
            var phone = $(".phone input").val();
            var imgCode = $(".imgCode input").val();
            if (!Utils.IsMobile(phone)) {
                sky.msg("手机号码格式输入错误！");
                return;
            }
            if (!Utils.IsCode(imgCode)) {
                sky.msg("图片验证码输入错误！");
                return;
            }
            $.ajax({
                type: 'post',
                url: 'message/send.do',
                dataType: 'json',
                data: {
                    mobile: phone,
                    imageCode: imgCode
                },
                success: function (res) {
                    sky.lodingClose();
                    if (returnCode(res.retCode)) {
                        var setTime = setInterval(function () {
                            if (time >= 0) {
                                t.html(time + "s后重新发送");
                                time--;
                            } else {
                                time = 60;
                                clearInterval(setTime);
                                t.html("获取验证码");
                            }
                        }, 1000);
                    } else {
                        sky.msg(res.retMsg);
                    }
                },
                error: function (xhr, type) {
                    sky.lodingClose();
                    sky.msg("服务器连接错误！");
                }
            })
        });
    }
    //消息弹窗
    var msg = function (text) {
        if ($(".sky-msg").length != 0) {
            return;
        }
        var html = '<div class="sky-msg">' + text + '</div>';
        body.append(html);
        $(".sky-msg").css("margin-left", -($(".sky-msg").width() / 2) + "px");
        setTimeout(function () {
            $(".sky-msg").remove();
        }, 1000);
    };
    //弹窗
    var win = function (title, h) {
        if ($(".sky-win")) {
            winClose();
        }
        var html = '<div class="sky-win-main sky-win"><div class="container-fluid">' +
            '<div class="sky-win-header">' + title + '<a class="sky-close"></a></div>' +
            '<div class="sky-win-content">' + h + '</div>' +
            '</div></div><div class="sky-win-bg sky-win"></div>';
        body.append(html);
        var sky_main = $(".sky-win-main");
        var sky_container = $(".sky-win-main .container-fluid");
        var clientHeight = document.documentElement.clientHeight;
        var sky_top = clientHeight - sky_container.height();
        $(".sky-win .sky-close").click(function () {
            winClose();
        });
        $(".sky-win-bg").click(function () {
            winClose();
        });
        $(document.body).css({
            "overflow-x": "hidden",
            "overflow-y": "hidden"
        });
        $(window).resize(function () {
            if (sky_main) {
                if (isMobile()) {
                    sky_main.css({"margin-top": '0px', "top": sky_top < 0 ? 0 : sky_top + 'px'});
                } else {
                    sky_main.css({"margin-top": -(sky_main.height() / 2) + 'px', "top": '50%'});
                }
            }
        });
        if (!isMobile()) {
            sky_main.css("margin-top", -(sky_main.height() / 2) + 'px');
        } else {
            sky_main.animate({
                top: sky_top < 0 ? 0 : sky_top + 'px'
            }, 500);
        }
    };
    //提示小弹窗
    var promptWin = function (title, h) {
        if ($(".sky-win")) {
            winClose();
        }
        var html = '<div class="sky-win-main prompt sky-win"><div class="container-fluid">' +
            '<div class="sky-win-header">' + title + '<a class="sky-close"></a></div>' +
            '<div class="sky-win-content">' + h + '</div>' +
            '</div></div><div class="sky-win-bg sky-win"></div>';
        body.append(html);
        var sky_main = $(".sky-win-main");
        var sky_container = $(".sky-win-main .container-fluid");
        var clientHeight = document.documentElement.clientHeight;
        var sky_top = clientHeight - sky_container.height();
        $(".sky-win .sky-close").click(function () {
            winClose();
        });
        $(".sky-win-bg").click(function () {
            winClose();
        });
        /*$(document.body).css({
            "overflow-x": "hidden",
            "overflow-y": "hidden"
        });*/
        $(window).resize(function () {
            if (sky_main) {
                if (isMobile()) {
                    sky_main.css({"margin-top": '0px', "top": sky_top < 0 ? 0 : sky_top + 'px'});
                } else {
                    sky_main.css({"margin-top": -(sky_main.height() / 2) + 'px', "top": '50%'});
                }
            }
        });
        if (!isMobile()) {
            sky_main.css("margin-top", -(sky_main.height() / 2) + 'px');
        } else {
            sky_main.animate({
                top: sky_top < 0 ? 0 : sky_top + 'px'
            }, 500);
        }
    };
    //退出
    var quit = function () {
        var h = '<div class="sky-quit"><p>您确定退出吗?</p><a class="cancel">取消</a><a class="ok">退出</a></div>';
        promptWin("提示", h);
        $(".sky-quit .ok").click(function () {
            $.ajax({
                type: 'post',
                url: urls.logout,
                success: function (res) {
                    if (returnCode(res.code)) {
                        location.href = "/login/";
                    } else {
                        sky.msg(res.msg);
                    }
                },
                error: function (xhr, type) {
                    sky.lodingClose();
                    sky.msg("服务器连接错误！");
                }
            })
        });
        $(".sky-quit .cancel").click(function () {
            winClose();
        });
    }
    //免责声明
    var declare = function () {
        var h = '<div class="text-left sky-declare">' +
            '<p>宏图数据提醒您：在使用www.hongtushuju.com前，请您务必仔细阅读并透彻理解本声明。您可以选择不使用宏图数据，但如果您使用，您的使用行为将被视为对本声明全部内容的认可</p>' +
            '<ul class="list-unstyled">' +
            '<li>1.鉴于宏图数据以非人工检索方式、根据您提供的内容自动生成由第三方服务商提供的数据内容报告，除宏图数据注明之服务条款外，其他一切因使用宏图数据而可能遭致的意外、疏忽、侵权及其造成的损失，宏图数据对其概不负责，亦不承担任何法律责任。</li>' +
            '<li>2.任何通过使用宏图数据而获得的数据信息均由第三方服务商制作或提供，宏图数据对其数据来源的真实性、准确性概不负责，亦不承担任何法律责任。</li>' +
            '<li>3.您应该对使用宏图数据产品产生的结果自行承担风险。宏图数据不做任何形式的保证：不保证产品结果满足您的要求，不保证服务不中断。因网络状况、通讯线路、第三方网站等任何原因而导致您不能正常使用宏图数据，宏图数据不承担任何法律责任。</li>' +
            '<li>4. 宏图数据尊重并保护所有使用宏图数据的个人隐私权，您注册的用户名、电子邮件地址等个人资料，非经您亲自许可或根据相关法律、法规的强制性规定，宏图数据不会主动地泄露给第三方。宏图数据提醒您：您在使用本产品时所键入的查询信息将不被认为是您的个人隐私资料。\n</li>' +
            '<li>5.任何单位或个人认为通过宏图数据所获得的内容可能涉嫌侵犯其相关权利的，应该及时向宏图数据提出书面权利通知，并提供身份证明、权属证明及详细侵权情况证明。宏图数据在收到上述法律文件后，将会依法保护您的权利不受侵犯。</li>' +
            '</ul>' +
            '</div>';
        promptWin("免责声明", h);
    }
    //企业用户UKey登录提示
    var loginPrompt = function () {
        var html = '<div class="login"><img src="img/login.png" class="img-responsive center-block">' +
            '<p>您当前为企业账号登录，</p>' +
            '<p>没有该项目查询权限，请插入UKey登录后查询。</p></div>';
        promptWin("提示", html);
    }
    //用户权限升级提示
    var permitPrompt = function (id) {
        var user = "";
        switch (parseInt(id)) {
            case 0:
                user = "普通用户";
                break;
            case 1:
                user = "实名用户";
                break;
            case 2:
                user = "U-Key用户";
                break;
            case 3:
                user = "企业用户";
                break;
            default:
                user = "未知用户";
                break;
        }
        var html = '<div class="permit"><p class="text-left">您当前为' + user + '，没有该项目查询权限，账户升级后即可查询。</p>' +
            '<a class="m-btn">立刻升级</a></div>';
        promptWin("提示", html);
        $(".m-btn").click(function () {
            if (parseInt(id) == 1) {
                location.href = "accUpgradeV.do";
            } else if (parseInt(id) == 0) {
                location.href = "accVerifiedV.do";
            }
        });
    }
    //充值提示
    var rechargeTips = function () {
        var html = '<div class="permit"><p class="text-left">您的积分不足请充值！</p>' +
            '<a class="m-btn">立刻充值</a></div>';
        promptWin("提示", html);
        $(".m-btn").click(function () {
            location.href = "accRechargeV.do";
        });
    }
    //授权说明
    var authorize = function () {
        var html = '<div class="box"><div class="tabBox">' +
            '<p style="text-indent: 2rem;line-height: 2rem">本协议是您和【深圳市毅展宏图信息科技有限公司】（以下简称“本公司”）为明确服务内容及双方权利义务等而签订。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">当您在点击确认“同意本协议”或实际使用本公司提供的服务即视为您授权（或获得有效的授权且可将该等授权转授权）本公司，您确认授权（或获得有效的转授权）本公司查看您拟查询的包括但不限于附件中所列您或第三人的所有信息，并将视为已阅读并理解本协议的全部内容。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">请您仔细阅读粗体字的标记，并确保您（及被查询的第三人）已明确知悉本协议的某些条款可能对您（及被查询的第三人）权益具有或可能具有重大关系的条款。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">如果您在任何时候对任何内容存在疑虑或异议，或者不同意本协议的任意内容，或者无法准确理解本公司对条款的解释或者未获得第三人的有效授权请不要进行后续操作，一旦您点击同意本协议或进行后续操作或使用本公司的服务，均视为您同意本协议。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">根据《征信业管理条例》第十八条规定，向征信机构查询个人信息的，应当取得信息主体本人的书面同意并约定用途，但是，法律规定可以不经同意查询的除外，征信机构不得违反前款规定提供个人信息。\n' +
            '勾选以获取该查询用户授权即默认您已获取该查询用户授权，如若发生法律纠纷，我方不承担任何责任。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">一、授权条款 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">1.1您确认在您授权/转授权我们验证并获取您或第三人的包括但不限于本协议附件中所列的信息之前，已仔细阅读、充分理解并自愿接受本协议的全部内容，一旦您使用本公司的服务，即表示您同意并遵守本协议的所有约定。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">1.2您同意，在您授权/转授权我们验证并获取您或第三人本协议附件所列的包括但不限于您或第三人的收入、存款、有价证券、商业保险、不动产的信息和纳税数额信息等信息后，本公司有权按照附件中所列的授权内容进行数据查询、获取、使用、暂时保存。本人已被明确告知提供上述信息可能会给本人带来财产或信用损失、以及其他可能的不利后果，包括但不限于：采集这些信息对本人的信用评级（评分）、信用报告等结果可能产生的不利影响，以及该等信息被信息使用者依法提供给第三方后被他人不当利用的风险，但本人仍然同意授权本单位采集或向依法成立的征信机构采集这些信息。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">1.3您理解并同意，您使用本公司服务时，即授权本公司根据您所提供或授权或查询所得的各项信息及本公司独立获得的信息进行数据收集，并可依法整理、保存、加工、使用、提供并出具数据报告。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">1.4您理解并同意，本公司在为您提供数据服务过程中，对于所知悉的您或第三人的不良信息，可依法向您的信息接入路径所对应的第三方公司提供，并不再另行告知您。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">1.5您授权/转授权本公司将数据或报告转交至您的信息接入路径所对应的第三方公司，用于您在第三方公司的业务分析、审核贷款信用、给予信贷评分、审核贷款申请条件、贷后关系及风险控制等用途。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">1.6您理解并同意，您不可撤销的授权/转授权本公司向第三方公司查询或核实您的相关信息（但法律、法规、监管政策禁止查询的除外）；您同意本公司、本公司关联公司/合作公司有权对您的相关交易信息进行收集并在与业务相关的其他第三方之间共享；同时同意本公司将查询获取的信息进行暂时保存、整理、加工。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">1.7本公司所生成的数据报告只是利用现有的技术手段对信息做如实的收集，而不对该等信息作任何的修改；但基于互联网信息更新的速度，及第三方存储的信息可能存在的滞后等原因，故本公司不对信息的有效性、准确性、正确性、可靠性、质量、稳定性、完整性和及时性做出任何承诺和保证。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">二、服务限制及终止</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">2.1您在使用本公司服务之前，如涉及第三人的，应当取得该第三人的合法有效授权，并且该等授权可转委托，否则您不得使用本公司的服务。 若您未能提供该等授权或该等授权有瑕疵的，本公司有权终止向您提供服务，由此产生的责任，由您自行承担，若因此给本公司造成损失或不良影响的，本公司有权追偿。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">2.2若您利用本公司提供的服务，违反相关法律、行政法规、地方性法规、部门规章、违反公序良俗、诚实信用、违背社会公共利益或侵犯第三人合法权益的，本公司有权终止服务并要求您立即停止使用本公司服务，由此给本公司带来损失的，本公司有权追偿。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">三、保密及隐私</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.1您保证获悉的属于本公司的且无法自公开渠道获得的文件及资料（包括但不限于商业秘密、公司计划、运营活动、财务信息、技术信息、经营信息及其他商业秘密）予以保密。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.2对于以下信息，双方均免除相应的保密责任：由公众通过合法途径获知的信息；有明确证据证明从第三方获知的；</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.3本条规定的保密义务具有永久法律效力，不因本协议的变更、解除或终止而终止。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.4任何一方违反本保密条款约定的，应当赔偿由此给对方造成的一切损失。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5本公司重视对客户隐私的保护，因收集信息是出于遵守国家法律法规的规定以及向您提供服务及提升服务质量的目的，本公司不会因商业目的而向他人提供您/第三人的任何信息，我们会在下列情况下才会将您的查询信息与第三方分享：</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.1获得信息主体的同意/授权/转授权；</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.2为了向您提供或推荐服务、产品或为了向您提供更完善的服务，我们会在必要时向合作机构共享您的相关信息；</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.3本公司的各项服务及客户服务，并维护、改进这些服务。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.4在某些情况下只有共享您的信息才能向您提供您需要的服务或者产品，或处理您与他人的交易或者纠纷、争议；</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.5比较信息的准确性，并与第三方进行验证。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.6本公司为维护本公司及关联公司权益或国家、集体、第三人的权益而预防或禁止的非法活动。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.7经您或第三人许可的其他用途。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">3.5.8根据法律法规的规定或有关机关的要求。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">四、不可抗力 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">4.1因不可抗力或者其他意外事件，使得本协议的履行不可能、不必要或者无意义的，双方均不承担责任。本合同所称之不可抗力指不能预见、不能避免并不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、疾病、黑客攻击、网络故障、计算机故障、木马、电信部门技术管制、政府行为或任何其它自然或人为造成的灾难等客观情况。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">4.2如任意一方发生不可抗力事件，该方应立即用可能的快捷方式通知另一方。双方应在协商一致的基础上决定是否延期履行本协议、终止本协议。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">五、用户义务及免责声明</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">5.1您承诺，您所提供的信息均为您合法享有或第三人有效授权您享有、获取、保存的第三人的真实信息，不得为虚假或非法获取的信息；若涉嫌虚假信息或盗用他人信息，本公司有权拒绝为您提供服务，由此而产生的全部法律责任将由您自行承担，本公司不对此承担任何法律责任，若因此对本公司带来损失的，本公司有权追究您的法律责任。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">5.2本公司仅对本协议中所列明的义务承担责任。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">5.3您明确因交易所产生的任何风险应由交易双方自行承担。 </p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">六、法律争议及适用</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">6.1本协议的生效、解释、履行及争议的解决均适用中华人民共和国法律（为免歧义，不包括香港、台湾、澳门地区）。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">6.2在协议履行期间，凡由本协议引起的或与本协议有关的一切争议、纠纷，您应与本公司首先协商解决。协商不成，向上海市浦东新区人民法院提起诉讼。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">七、其他</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">7.1本协议为电子版本，一经您点击确认，立即生效。本授权一经做出，便不可撤销。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">7.2本协议的某一条款被确认无效，均不影响本协议其他条款的效力。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">7.3您在此不可撤销的同意，为了向您提供更优质、高效的服务，本公司有权将本协议项下您的部分或全部授权转授权（或将本协议项下本公司的部分或全部权利义务转移）给具有合法资质的第三方数据查询公司；该第三方公司可按附件中所列的您的授权类别进行数据查询并将查询结果反馈给本公司。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">7.4本协议未尽事宜，由双方另行签订补充协议，补充协议效力与本协议效力相同。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">7.5本协议附件为协议不可分割的组成部分并且与本协议正文条款具有同等效力。</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">特别提示：</p>' +
            '<p style="text-indent: 2rem;line-height: 2rem">为了保障您的合法权益，您应当阅读并遵守本授权书，请您务必审慎阅读，并充分理解本授权书的全部内容，特别是以加粗形式特别提示您注意的，若您不接受本授权书的任何条款，请您立即停止授权。</p>' +
            '<table class="table m-t-2">' +
            '<thead><tr><td class="title">授权类别</td><td class="title">授权内容</td></tr></thead>' +
            '<tbody>' +
            '<tr>' +
            '<td class="title">运营商信息</td>' +
            '<td>查看但不限于被查询人运营商基本信息（姓名、身份证号、手机号）等信息在内的各类信息</td>' +
            '</tr>' +
            '<tr>' +
            '<td>个人对外投资信息</td>' +
            '<td>查看包括但不限于被查询人对外投资基本信息（姓名、身份证号、组织机构代码、公司名称、法人姓名、成立时间、股东姓名、投资比例、投资金额）等信息在内的各类信息</td>' +
            '</tr>' +
            '<tr>' +
            '<td>反欺诈报告</td>' +
            '<td>查看包括但不限于被查询人多维度欺诈识别基本信息（用户出生地:省份、手机号城市、用户姓名、用户出生地:城市、年龄、手机号、身份证、性别、手机号归属地、用户注册信息情况、身份证在那些类型的机构中使用过、用这个身份证绑定的其他手机号码、用这个身份证号码绑定的其他姓名、用这个手机号码绑定的其他身份证、电话号码在那些类型的机构中使用过、用这个手机号码绑定的其他姓名）等信息在内的各类信息</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div></div>';
        win("授权说明", html);
    };
    //P2P记录
    var urgeMoneyRecord = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data;
                        var html = '<div class="box"><div class="tabBox"><table class="text-center record table">' +
                            '<tr class="sky-tab-title">' +
                            '<th>借款类型</th>' +
                            '<th>借款金额</th>' +
                            '<th>合同年月</th>' +
                            '<th>逾期级别</th>' +
                            '<th>数据报送时间</th>' +
                            '</tr>';
                        if (data.length != 0) {
                            for (var i in data) {
                                html += '<tr class="border-x-none">' +
                                    '<td>' + data[i].borrowType + '</td>' +
                                    '<td>' + data[i].borrowAmount + '万</td>' +
                                    '<td>' + cutOffData(data[i].contractDate) + '</td>' +
                                    '<td>' + data[i].overdueType + '</td>' +
                                    '<td>' + cutOffData(data[i].time) + '</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<tr class="border-x-none">' +
                                '<td colspan="5" class="text-center">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table></div></div>';
                        win("逾期记录", html);
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<p class="sky-title text-center">逾期记录</p>' +
                            '<div class="box"><div class="tabBox"><table class="text-center record table">' +
                            '<tr class="border-x-none">' +
                            '<td colspan="5" class="text-center">暂无数据</td>' +
                            '</tr>' +
                            '</table></div></div>';
                        win("逾期记录", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //P2P借款记录
    var loanRecord = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data.data;
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="table td-4 text-left">';
                        if (data.length != 0) {
                            if (res.data.isHit == true) {
                                res.data.isHit = "是"
                            } else {
                                res.data.isHit = "否"
                            }
                            html += '<tr>' +
                                '<td colspan="2" class="title">是否命中行业风险名单</td>' +
                                '<td colspan="2"><span class="color-orange">' + res.data.isHit + '</span></td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">名单添加时间</td>' +
                                '<td>（开发中，暂无）</td>' +
                                '<td class="title">名单添加机构</td>' +
                                '<td>（开发中，暂无）</td>' +
                                '</tr>';
                            for (var i in data) {
                                if (data[i].borrowType == 0) {
                                    data[i].borrowType = "未知"
                                } else if (data[i].borrowType == 1) {
                                    data[i].borrowType = "个人信贷"
                                } else if (data[i].borrowType == 2) {
                                    data[i].borrowType = "个人抵押"
                                } else if (data[i].borrowType == 3) {
                                    data[i].borrowType = "企业信贷"
                                } else if (data[i].borrowType == 4) {
                                    data[i].borrowType = "企业抵押"
                                } else {
                                    data[i].borrowType = "未知"
                                }
                                
                                if (data[i].borrowState == 0) {
                                    data[i].borrowState = "未知"
                                } else if (data[i].borrowState == 1) {
                                    data[i].borrowState = "拒贷"
                                } else if (data[i].borrowState == 2) {
                                    data[i].borrowState = "批贷已放款"
                                } else if (data[i].borrowState == 4) {
                                    data[i].borrowState = "借款人放弃申请"
                                } else if (data[i].borrowState == 5) {
                                    data[i].borrowState = "审核中"
                                } else if (data[i].borrowState == 6) {
                                    data[i].borrowState = "待放款"
                                } else {
                                    data[i].borrowState = "未知"
                                }
                                
                                if (data[i].repayState == 0) {
                                    data[i].repayState = "未知"
                                } else if (data[i].repayState == 1) {
                                    data[i].repayState = "正常"
                                } else if (data[i].repayState == 2) {
                                    data[i].repayState = "M1"
                                } else if (data[i].repayState == 3) {
                                    data[i].repayState = "M2"
                                } else if (data[i].repayState == 4) {
                                    data[i].repayState = "M3"
                                } else if (data[i].repayState == 5) {
                                    data[i].repayState = "M4"
                                } else if (data[i].repayState == 6) {
                                    data[i].repayState = "M5"
                                } else if (data[i].repayState == 7) {
                                    data[i].repayState = "M6"
                                } else if (data[i].repayState == 8) {
                                    data[i].repayState = "M6+"
                                } else if (data[i].repayState == 9) {
                                    data[i].repayState = "已还清"
                                } else {
                                    data[i].repayState = "未知"
                                }
                                var borrowAmount = parseInt(data[i].borrowAmount);
                                if (borrowAmount == -7) {
                                    borrowAmount = "0~1000";
                                } else if (borrowAmount == -6) {
                                    borrowAmount = "1000~2000";
                                } else if (borrowAmount == -5) {
                                    borrowAmount = "2000~3000";
                                } else if (borrowAmount == -4) {
                                    borrowAmount = "3000~4000";
                                } else if (borrowAmount == -3) {
                                    borrowAmount = "4000~6000";
                                } else if (borrowAmount == -2) {
                                    borrowAmount = "6000~8000";
                                } else if (borrowAmount == -1) {
                                    borrowAmount = "8000~10000";
                                } else if (borrowAmount == 0) {
                                    borrowAmount = "未知";
                                } else if (borrowAmount == 1) {
                                    borrowAmount = "1~2万";
                                } else {
                                    borrowAmount = borrowAmount * 2 - 2 + "~" + borrowAmount * 2 + "万";
                                }
                                html += '<tr>' +
                                    '<td class="bg-color-lGreen text-center" colspan="4"><span class="icon icon-number">' + (parseInt(i) + 1) + '</span></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">借贷类型</td>' +
                                    '<td>' + data[i].borrowType + '</td>' +
                                    '<td class="title">借款日期</td>' +
                                    '<td>' + formatDateMonth(data[i].contractDate) + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">借款状态</td>' +
                                    '<td>' + data[i].borrowState + '</td>' +
                                    '<td class="title">借款金额</td>' +
                                    '<td>' + borrowAmount + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">借款期数</td>' +
                                    '<td>' + data[i].loanPeriod + '</td>' +
                                    '<td class="title">当前还款状态</td>' +
                                    '<td>' + data[i].repayState + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">欠款金额</td>' +
                                    '<td>' + (data[i].arrearsAmount / 100000) + '</td>' +
                                    '<td class="title">数据反馈商</td>' +
                                    '<td>' + data[i].companyCode + '</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<tr>' +
                                '<td colspan="4" class="text-center">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table></div>' +
                            '</div>';
                    } else {
                        sky.msg(res.retMsg);
                        html = '<p class="sky-title text-center">小贷记录明细（多重负债）</p>' +
                            '<div class="box">' +
                            '<div class="tabBox"><table class="table m-t-2 td-4 text-left">' +
                            '<tr>' +
                            '<td colspan="4" class="text-center">暂无信息</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div>';
                    }
                    win("小贷记录明细（多重负债）", html);
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //地址信息
    var addressInfo = function (id) {
        
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data;
                        var html = '<div class="box">' +
                            '<div class="tabBox">' +
                            '<table class="table td-4">';
                        if (data.length != 0) {
                            for (var i in data) {
                                html += '<tr>' +
                                    '<td class="title">地址类型</td>' +
                                    '<td><span class="icon-orange icon">居</span>居住地址</td>' +
                                    '<td class="title">数据获取年份</td>' +
                                    '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">地址位置</td>' +
                                    '<td colspan="3">' + data[i].homeAddress + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">地址类型</td>' +
                                    '<td><span class="icon-green icon">工</span>工作地址</td> ' +
                                    '<td class="title">数据获取年份</td>' +
                                    '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">地址位置</td>' +
                                    '<td colspan="3">' + data[i].companyAddress + '</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<tr>' +
                                '<td colspan="4" class="text-center">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table></div></div>'
                        '</div>';
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<p class="sky-title text-center">地址信息</p>' +
                            '<div class="box">' +
                            '<div class="tabBox">' +
                            '<table class="table td-4 m-t-2">' +
                            '<tr>' +
                            '<td colspan="4" class="text-center">暂无数据</td>' +
                            '</tr>' +
                            '</table></div></div>'
                        '</div>';
                    }
                    win("地址信息", html);
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //法院信息
    var courtInfo = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data;
                        var html = '<div class="box"><div class="tabBox"><table class="table td-4">' +
                            '<tr>';
                        if (data.jyPunishBreak.length != 0 || data.jyPunished.length != 0) {
                            for (var i in data.jyPunishBreak) {
                                html += '<td class="title">被执行人信息</td>' +
                                    '<td>' + data.jyPunished.length + '</td>' +
                                    '<td class="title">失信被执行人信息</td>' +
                                    '<td>' + data.jyPunishBreak.length + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">汇总</td>' +
                                    '<td colspan="3">' + (data.jyPunished.length + data.jyPunishBreak.length) + '</td>' +
                                    '</tr>' +
                                    '</table></div>'
                            }
                            html += '<p class="sky-title small text-center m-t-2">明细</p>' +
                                '<div class="stretch-box text-center">' +
                                '<div class="tabBox"><table class="table m-t-2">' +
                                '<tr>' +
                                '<th>类型</th>' +
                                '<th>执行法院</th>' +
                                '<th>立案时间</th>' +
                                '<th>案号</th>' +
                                '<th>标的金额或履行情况</th>' +
                                '<th>信息获取<br>时间</th>' +
                                '</tr>' +
                                '<tr>';
                            for (var i in data.jyPunished) {
                                html += '<td>被执行人信息</td>' +
                                    '<td>' + data.jyPunished[i].courtName + '</td>' +
                                    '<td>' + data.jyPunished[i].regDate + '</td>' +
                                    '<td>' + data.jyPunished[i].caseCode + '</td>' +
                                    '<td>' + data.jyPunished[i].execMoney + '</td>' +
                                    '<td></td>' +
                                    '</tr>';
                            }
                            for (var i in data.jyPunishBreak) {
                                html += '<td>失信被执行人信息</td>' +
                                    '<td>' + data.jyPunishBreak[i].courName + '</td>' +
                                    '<td>' + data.jyPunishBreak[i].regDate + '</td>' +
                                    '<td>' + data.jyPunishBreak[i].caseCode + '</td>' +
                                    '<td>' + data.jyPunishBreak[i].performance + '</td>' +
                                    '<td>' + data.jyPunishBreak[i].publishDate + '</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<td colspan="4" class="text-center">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table></div>' +
                            '</div></div>';
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<p class="sky-title text-center">失信及被执行信息汇总</p>' +
                            '<div class="box"><div class="tabBox"><table class="table td-4 m-t-2">' +
                            '<tr>' +
                            '<td colspan="4" class="text-center">暂无数据</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div></div>';
                    }
                    win("失信及被执行信息汇总", html);
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //犯罪在逃信息
    var criminalInfo = function (id, realName, idCard) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    var data = res.data;
                    var html = '<div class="box">' +
                        '<div class="tabBox"><table class="table td-4">';
                    if (res.retCode == "0000") {
                        if (data.message != null && data.message != "") {
                            html += '<tr>' +
                                '<td class="title">姓名</td>' +
                                '<td>' + realName + '</td>' +
                                '<td class="title">身份证号</td>' +
                                '<td>' + idCard + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="bg-color-lGreen color-red text-center" colspan="4">' + data.message + '</td>' +
                                '</tr>' +
                                '<table class="table td-3 m-t-2">' +
                                '<tr>' +
                                '<td colspan="2" class="title">案件时间</td>' +
                                '<td class="title">案件类型</td>' +
                                '<td class="title">案件类型描述</td>' +
                                '</tr>';
                            if (data.data != null) {
                                for (var i in data.data) {
                                    html += '<tr>' +
                                        '<td colspan="2">' + data.data[i].caseTime + '</td>' +
                                        '<td>' + data.data[i].caseType + '</td>' +
                                        '<td>' + data.data[i].caseSource + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="4">暂无相关数据</td>' +
                                    '</tr>';
                            }
                            html += '</table>';
                        } else {
                            html += '<tr>' +
                                '<td class="title">姓名</td>' +
                                '<td>' + realName + '</td>' +
                                '<td class="title">身份证号</td>' +
                                '<td>' + idCard + '</td>' +
                                '</tr>' +
                                '</table>' +
                                '<div class="searchResult m-t-2">' +
                                '<p class="result color-green text-center">比对结果：无犯罪在逃记录</p>' +
                                '</div>';
                        }
                        html += '</table>' +
                            '</div>' +
                            '</div>';
                    } else {
                        sky.msg(res.retMsg);
                        html += '<tr>' +
                            '<td class="text-center" colspan="4">暂无数据</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '</div>';
                    }
                    win("犯罪在逃信息查询", html);
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //工商信息
    var companyInfo = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data;
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="table td-4">';
                        if (data.corporateInfo.length != 0 || data.shareholderInfo.length != 0 || data.managerInfo.length != 0) {
                            if (data.corporateInfo.length != 0) {
                                for (var i in data.corporateInfo) {
                                    html += '<tr>' +
                                        '<td class="title">公司名称</td>' +
                                        '<td colspan="3">' + data.corporateInfo[i].entName + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册号</td>' +
                                        '<td>' + data.corporateInfo[i].regNo + '</td>' +
                                        '<td class="title">公司类型</td>' +
                                        '<td>' + data.corporateInfo[i].entType + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册资本</td>' +
                                        '<td>' + data.corporateInfo[i].regCap + '</td>' +
                                        '<td class="title">资本单位</td>' +
                                        '<td>' + data.corporateInfo[i].regCapCur + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">企业状态</td>' +
                                        '<td>' + data.corporateInfo[i].entStatus + '</td>' +
                                        '<td class="title">任职</td>' +
                                        '<td></td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">认缴金额</td>' +
                                        '<td></td>' +
                                        '<td class="title">股份比例</td>' +
                                        '<td></td>' +
                                        '</tr>';
                                }
                            }
                            if (data.shareholderInfo.length != 0) {
                                for (var i in data.shareholderInfo) {
                                    html += '<tr>' +
                                        '<td class="title">公司名称</td>' +
                                        '<td colspan="3">' + data.shareholderInfo[i].entName + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册号</td>' +
                                        '<td>' + data.shareholderInfo[i].regNo + '</td>' +
                                        '<td class="title">公司类型</td>' +
                                        '<td>' + data.shareholderInfo[i].entType + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册资本</td>' +
                                        '<td>' + data.shareholderInfo[i].regCap + '</td>' +
                                        '<td class="title">资本单位</td>' +
                                        '<td>' + data.shareholderInfo[i].regCapCur + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">企业状态</td>' +
                                        '<td>' + data.shareholderInfo[i].entStatus + '</td>' +
                                        '<td class="title">任职</td>' +
                                        '<td></td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">认缴金额</td>' +
                                        '<td>' + data.shareholderInfo[i].subConam + '</td>' +
                                        '<td class="title">股份比例</td>' +
                                        '<td>' + data.shareholderInfo[i].fundedRatio + '</td>' +
                                        '</tr>';
                                }
                            }
                            if (data.managerInfo.length != 0) {
                                for (var i in data.managerInfo) {
                                    html += '<tr>' +
                                        '<td class="title">公司名称</td>' +
                                        '<td colspan="3">' + data.managerInfo[i].entName + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册号</td>' +
                                        '<td>' + data.managerInfo[i].regNo + '</td>' +
                                        '<td class="title">公司类型</td>' +
                                        '<td>' + data.managerInfo[i].entType + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册资本</td>' +
                                        '<td>' + data.managerInfo[i].regCap + '</td>' +
                                        '<td class="title">资本单位</td>' +
                                        '<td>' + data.managerInfo[i].regCapCur + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">企业状态</td>' +
                                        '<td>' + data.managerInfo[i].entStatus + '</td>' +
                                        '<td class="title">任职</td>' +
                                        '<td>' + data.managerInfo[i].position + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">认缴金额</td>' +
                                        '<td></td>' +
                                        '<td class="title">股份比例</td>' +
                                        '<td></td>' +
                                        '</tr>';
                                }
                            }
                        } else {
                            html += '<tr>' +
                                '<td colspan="4" class="text-center">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table></div>' +
                            '</div>';
                        win("个人工商信息", html);
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<p class="sky-title text-center">个人工商信息</p>' +
                            '<div class="box">' +
                            '<div class="tabBox"><table class="table td-4 m-t-2">' +
                            '<tr>' +
                            '<td colspan="4" class="text-center">暂无数据</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div>';
                        win("个人工商信息", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //小贷记录统计
    var folkLoanRecord = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var html = '<div class="box">' +
                            '<div class="tabBox">' +
                            '<table class="table td-4">';
                        if (res.data.length > 0) {
                            for (var i in res.data) {
                                html += '<tr>' +
                                    '<td class="title">年份</td>' +
                                    '<td>' + res.data[i].reqYear + '</td>' +
                                    '<td class="title">受理机构数量</td>' +
                                    '<td>' + res.data[i].companyCount + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">受理申请次数</td>' +
                                    '<td>' + res.data[i].acceptCount + '</td>' +
                                    '<td class="title">完成借款次数</td>' +
                                    '<td>' + res.data[i].borrowCount + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">借款成功金额</td>' +
                                    '<td colspan="3">' + res.data[i].amountTotal + '万</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<tr>' +
                                '<td class="text-center" colspan="4">暂无数据</td>'
                            '</tr>';
                        }
                        html += '</table>' +
                            '</div>' +
                            '</div>';
                    } else {
                        sky.msg("查询失败！");
                        var html = '<p class="sky-title text-center">小贷记录统计值</p>' +
                            '<div class="box">' +
                            '<div class="tabBox">' +
                            '<table class="table m-t-2 td-4">' +
                            '<tr>' +
                            '<td class="text-center" colspan="4">暂无数据</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '</div>';
                    }
                    win("小贷记录统计值", html);
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //身份查询记录
    var identityRecord = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var companySearchInfo = res.data.companySearchInfo;
                        var userSearchInfo = res.data.userSearchInfo;
                        var html = '<div class="box">' +
                            '<p class="sky-title text-center"><span class="text-icon">机构</span></p>' +
                            '<div class="tabBox">' +
                            '<table class="table td-4 m-t-2">' +
                            '<tr>' +
                            '<td class="title">机构数</td>' +
                            '<td >' + res.data.companyCounts + '</td>' +
                            '<td class="title">机构查询次数</td>' +
                            '<td >' + res.data.companySearchs + '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '<div class="stretch-box">' +
                            '<div class="tabBox">' +
                            '<table class="table m-t-2 record">' +
                            '<tr>' +
                            '<th >序号</th>' +
                            '<th >查询项目</th>' +
                            '<th >查询时间</th>' +
                            '<th >机构名称</th>' +
                            '</tr>';
                        if (companySearchInfo.length != 0) {
                            for (var i in companySearchInfo) {
                                html += '<tr class="text-center">' +
                                    '<td>' + (parseInt(i) + 1) + '</td>' +
                                    '<td>' + companySearchInfo[i].searchType + '</td>' +
                                    '<td>' + formatDate(companySearchInfo[i].searchTime) + '</td>' +
                                    '<td>' + companySearchInfo[i].searchByName + '</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<tr>' +
                                '<td colspan="4" class="text-center">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table>' +
                            '</div>' +
                            '</div>';
                        html += '<p class="sky-title m-t-2 text-center"><span class="text-icon">个人</span></p>' +
                            '<div class="tabBox">' +
                            '<table class="table td-4 m-t-2 record">' +
                            '<tr>' +
                            '<td class="title">用户数</td>' +
                            '<td >' + res.data.userCounts + '</td>' +
                            '<td class="title">用户查询次数</td>' +
                            '<td >' + res.data.userSearchs + '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '<div class="stretch-box">' +
                            '<div class="tabBox">' +
                            '<table class="table m-t-2">' +
                            '<tr>' +
                            '<th >序号</th>' +
                            '<th >查询项目</th>' +
                            '<th >查询时间</th>' +
                            '<th >机构名称</th>' +
                            '</tr>';
                        if (userSearchInfo.length != 0) {
                            for (var i in userSearchInfo) {
                                html += '<tr class="text-center">' +
                                    '<td>' + (parseInt(i) + 1) + '</td>' +
                                    '<td>' + userSearchInfo[i].searchType + '</td>' +
                                    '<td>' + userSearchInfo[i].searchTime + '</td>' +
                                    '<td>' + userSearchInfo[i].searchByName + '</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<tr>' +
                                '<td colspan="4" class="text-center">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        win("身份查询记录", html);
                    } else {
                        sky.msg("查询失败！");
                        var html = '<div class="box">' +
                            '<p class="sky-title text-center"><span class="text-icon">机构</span></p>' +
                            '<div class="tabBox">' +
                            '<table class="table td-4 m-t-2">' +
                            '<tr>' +
                            '<td colspan="4" class="text-center">暂无数据</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '<p class="sky-title text-center"><span class="text-icon">个人</span></p>' +
                            '<div class="tabBox">' +
                            '<table class="table td-4 m-t-2">' +
                            '<tr>' +
                            '<td colspan="4" class="text-center">暂无数据</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '</div>';
                        win("身份查询记录", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //身份证相关-查询记录
    var idCardQueryRecord = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: urls.getSearchHistoryInfo,
            dataType: 'json',
            data: {
                id: id,
                service: "idcard_img"
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    var html = null;
                    if (res.code == 0) {
                        var data = res.result.data.result;
                        if (data.result.description == "一致") {
                            if (data.result.photo != null) {
                                html = '<div class="box">' +
                                    '<div class="tabBox"><table class="table">' +
                                    '<tr><td>姓名：' + data.result.name + '</td><td rowspan="2" class="text-center"><img class="photo" src="data:img/jpeg;base64,' + data.result.photo + '"></td></tr>' +
                                    '<tr><td>证件号码：' + data.result.idcard + '</td></tr>' +
                                    '</table></div>' +
                                    '</div>';
                            } else {
                                html = '<div class="box">' +
                                    '<p class="sky-title small text-center color-green">姓名身份证号一致，系统无照片返回</p>' +
                                    '<div class="tabBox"><table class="table m-t-2">' +
                                    '<tr><td>姓名：' + data.result.name + '</td><td rowspan="3" class="text-center"><img src="/static/img/icon_portrait_01.png"></td></tr>' +
                                    '<tr><td>证件号码：' + data.result.idcard + '</td></tr>' +
                                    '</table></div>' +
                                    '</div>';
                            }
                        } else {
                            html = '<div class="box">' +
                                '<div class="queryFails text-center">' +
                                '<img src="/static/img/icon_fails.png" class="img-responsive center-block">' +
                                '<p class="text color-red">姓名身份证号不一致！</p></div>' +
                                '</div>';
                        }
                    } else {
                        html = '<div class="box">' +
                            '<div class="queryFails text-center">' +
                            '<img src="/static/img/icon_fails.png" class="img-responsive">' +
                            '<p class="text">查询失败！</p>' +
                            '</div>' +
                            '</div>';
                    }
                    win("身份证照片查询", html);
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //同住址成员信息
    var memberInfo = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data;
                        var html = '<div class="box">';
                        if (data.identity != null) {
                            html += '<p class="small sky-title text-center bg-color-lGreen">基本信息</p>' +
                                '<div class="stretch-box">' +
                                '<div class="tabBox"><table class="table td-4 m-t-2">' +
                                '<tr>' +
                                '<td class="title">姓名</td>' +
                                '<td >' + data.identity.realName + '</td>' +
                                '<td class="title">生日</td>' +
                                '<td >' + data.identity.birthday + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">婚否</td>' +
                                '<td >' + data.identity.maritalStatus + '</td>' +
                                '<td class="title">民族</td>' +
                                '<td >' + data.identity.nation + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">证件号码</td>' +
                                '<td class="text-left" colspan="3">' + data.identity.idCard + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">户籍地址</td>' +
                                '<td class="text-left" colspan="3">' + data.identity.address + '</td>' +
                                '</tr>' +
                                '</table></div>' +
                                '</div>' +
                                '<p class="small sky-title bg-color-lGreen td-4 m-t-2 text-center">家庭成员信息</p>' +
                                '<div class="stretch-box">' +
                                '<div class=tabBox>';
                            html += '<table class="table td-4 m-t-2">';
                            if (data.data.length != 0) {
                                html += '<tr>' +
                                    '<td class="title">姓名</td>' +
                                    '<td class="title">性别</td>' +
                                    '<td class="title">民族</td>' +
                                    '<td class="title">生日</td>' +
                                    '</tr>';
                                for (var i in data.data) {
                                    html += '<tr>' +
                                        '<td>' + data.data[i].name + '</td>' +
                                        '<td>' + data.data[i].sex + '</td>' +
                                        '<td>' + data.data[i].nation + '</td>' +
                                        '<td>' + data.data[i].birthday + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td class="text-center" colspan="4">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table></div></div>';
                        } else {
                            html += '<div class="tabBox"><table class="table"><tr>' +
                                '<td class="text-center">暂无数据</td>' +
                                '</tr></table></div>';
                        }
                        html += '</div>';
                        win("同住址成员信息", html);
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="table"><tr>' +
                            '<td class="text-center">查询失败</td>' +
                            '</tr></table></div></div>';
                        win("同住址成员信息", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //手机实名查询记录
    var phoneSearchRecord = function () {
        var html = '<div class="box">' +
            '<div class="tabBox"><table class="table text-center min-width-500 m-t-2 record">' +
            '<tr><th>序号</th><th>被查手机号</th><th>查询用户</th><th>查询时间</th></tr>' +
            '<tr><td>企业状态</td><td>身份证照片</td><td>2016-08-22  10:12:12</td><td>P2P098712</td></tr>' +
            '<tr><td>企业状态</td><td>身份证照片</td><td>2016-08-22  10:12:12</td><td>P2P098712</td></tr>' +
            '<tr><td>企业状态</td><td>身份证照片</td><td>2016-08-22  10:12:12</td><td>P2P098712</td></tr>' +
            '<tr><td>企业状态</td><td>身份证照片</td><td>2016-08-22  10:12:12</td><td>P2P098712</td></tr>' +
            '<tr><td>企业状态</td><td>身份证照片</td><td>2016-08-22  10:12:12</td><td>P2P098712</td></tr>' +
            '</table></div>' +
            '</div>';
        win("手机实名历史", html);
    };
    //手机使用时间查询
    var phoneDate = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                if (returnCode(res.retCode)) {
                    var status = null;
                    var html = '<div class="box">' +
                        '<div class="tabBox"><table class="table">' +
                        '<tr>' +
                        '<td class="title">手机号</td>' +
                        '<td>' + res.data.mobile + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="title">入网时常</td>' +
                        '<td>' + res.data.onlineTime + '</td>' +
                        '</tr>' +
                        '</table></div>' +
                        '</div>';
                    win("手机在网时长", html);
                } else {
                    sky.msg(res.retMsg);
                    var html = '<div class="box">' +
                        '<div class="tabBox"><table class="table">' +
                        '<tr>' +
                        '<td>查询失败</td>' +
                        '</tr>' +
                        '</table></div>' +
                        '</div>';
                    win("手机在网时长", html);
                }
            },
            error: function (xhr, type) {
                sky.msg("服务器连接错误！");
            }
        })
    };
    //手机实名
    var phoneRealName = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: urls.getSearchHistoryInfo,
            dataType: 'json',
            data: {
                id: id,
                service: "Telecom_realname"
            },
            success: function (res) {
                try {
                    sky.lodingClose();
                    if (returnCode(res.code)) {
                        var status = null;
                        res.result.data = JSON.parse($.base64.atob(res.result.data, true));
                        status = res.result.data.MESSAGE;
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="td-4 table">' +
                            '<tr>' +
                            '<td class="title">姓名</td>' +
                            '<td>' + res.result.real_name + '</td>' +
                            '<td class="title">手机号</td>' +
                            '<td>' + res.result.mobile + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td class="title">运营商</td>' +
                            '<td>' + res.result.data.isp + '</td>' +
                            '<td class="title">实名检验</td>' +
                            '<td>' + status + '</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div>';
                        win("手机实名认证", html);
                    } else {
                        sky.msg(res.msg);
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="table">' +
                            '<tr>' +
                            '<td>查询失败</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div>';
                        win("手机实名认证", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        })
    };
    //身份证两要素
    var idCardRealName = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: urls.getSearchHistoryInfo,
            dataType: 'json',
            data: {
                id: id,
                service: "idcard_name"
            },
            success: function (res) {
                console.log(res)
                try {
                    sky.lodingClose();
                    if (returnCode(res.code)) {
                        var status;
                        if (res.result.data.result.result.isok) {
                            status = "匹配"
                        } else {
                            status = "不匹配"
                        }
                        let html = '<div class="box">' +
                            '<div class="tabBox"><table class="td-4 table">' +
                            '<tr>' +
                            '<td class="title">姓名</td>' +
                            '<td>' + res.result.data.result.result.realname + '</td>' +
                            '<td class="title">身份证号</td>' +
                            '<td>' + res.result.data.result.result.idcard + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td class="title">实名检验</td>' +
                            '<td colspan="3">' + status + '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div></div>';
                        win("身份证二要素认证", html);
                    } else {
                        sky.msg(res.msg);
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="table">' +
                            '<tr>' +
                            '<td>查询失败</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div>';
                        win("身份证二要素认证", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        })
    };
    //个人对外投资
    var financeInvestment = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: urls.getSearchHistoryInfo,
            dataType: 'json',
            data: {
                id: id,
                service: "Finance_investment"
            },
            success: function (res) {
                try {
                    sky.lodingClose();
                    if (returnCode(res.code)) {
                        res.result.data = JSON.parse($.base64.atob(res.result.data, true));
                        var status = res.result.data.MESSAGE;
                        if (res.result.data.RESULT === "1") {
                            let dataHtml = template('invest-table-template', res.result);
                            let html = '<div class="box">' +
                                '<div class="tabBox">' + dataHtml + '</div>' +
                                '</div>';
                            win("个人对外投资", html);
                            
                        } else {
                            let html = '<div class="box">' +
                                '<div class="tabBox"><table class="table">' +
                                '<tr>' +
                                '<td>' + status + '</td>' +
                                '</tr>' +
                                '</table></div>' +
                                '</div>';
                            win("个人对外投资", html);
                        }
                        
                        
                    } else {
                        sky.msg(res.msg);
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="table">' +
                            '<tr>' +
                            '<td>查询失败</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div>';
                        win("个人对外投资", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        })
    };
    //蜜罐数据
    var miguan = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: urls.getSearchHistoryInfo,
            dataType: 'json',
            data: {
                id: id,
                service: "Antifraud_miguan"
            },
            success: function (res) {
                try {
                    sky.lodingClose();
                    if (returnCode(res.code)) {
                        var status = res.result.data.message;
                        res.result.data = JSON.parse($.base64.atob(res.result.data, true));
                        let dataHtml = template('miguan-table-template', res.result.data);
                        let html = '<div class="box">' +
                            '<div class="tabBox">' + dataHtml + '</div>' +
                            '</div>';
                        win("个人反欺诈报告", html);
                        
                    } else {
                        sky.msg(res.msg);
                        var html = '<div class="box">' +
                            '<div class="tabBox"><table class="table">' +
                            '<tr>' +
                            '<td>查询失败</td>' +
                            '</tr>' +
                            '</table></div>' +
                            '</div>';
                        win("个人反欺诈报告", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        })
    };
    var notice = function (title, content) {
        var html = '<div class="box">' +
            '<div class="tabBox">' +
            content +
            '</div>' +
            '</div>';
        win(title, html);
    };
    //逾期详细信息记录
    var overdueInfoRecord = function () {
        var html = '<div class="box">' +
            '<div class="tabBox"><table class="table text-left td-4 m-t-2">' +
            '<tr><td class="sky-tab-title">序号</td><td>15312211122</td><td class="sky-tab-title">查询用户</td><td><span class="icon icon-orange">中</span></td></tr>' +
            '<tr><td class="sky-tab-title vertical-middle">说明</td><td colspan="3" class="text-left text-space"><div class="textarea"></div>强：逾期3个月以上欠款人本人手机号<br>中：逾期3个月以上欠款人朋友或亲属手机号<br>弱：与逾期3个月以上欠款人存在二度人脉关系（手机号交叠）<br>无：未检测到与逾期3个月以上欠款人存在关联</td></tr>' +
            '</table></div>' +
            '<p class="sky-title small text-center m-t-2 color-gray">详情</p>' +
            '<div class="tabBox">' +
            '<table class="table m-t-2 td-4">' +
            '<tr><td class="title">联系人姓名</td><td></td><td class="title">联系人号码</td><td></td></tr>' +
            '<tr><td class="title">与借款人关系</td><td></td><td class="title">借款人姓名</td><td></td></tr>' +
            '<tr><td class="title">借款金额</td><td></td><td class="title">合同年月</td><td></td></tr>' +
            '<tr><td class="title">逾期级别</td><td></td><td class="title">数据报送时间</td><td></td></tr>' +
            '</table>' +
            '</div>' +
            '</div>';
        win("逾期逾期记录查询", html);
    };
    //逾期记录
    var overdueRecord = function () {
        var html = '<div class="box">' +
            '<p class="sky-title text-center">逾期逾期记录查询<a class="right color-green">查看详情</a></p>' +
            '<div class="tabBox max-tab">' +
            '<table class="table text-left td-4 m-t-2">' +
            '<tr><td class="sky-tab-title">序号</td><td>15312211122</td><td class="tab-title">查询用户</td><td><span class="icon icon-orange">中</span></td></tr>' +
            '<tr><td class="sky-tab-title vertical-middle">说明</td><td colspan="3" class="text-left text-nowrap"><div class="textarea">强：逾期3个月以上欠款人本人手机号<br>中：逾期3个月以上欠款人朋友或亲属手机号<br>弱：与逾期3个月以上欠款人存在二度人脉关系（手机号交叠）<br>无：未检测到与逾期3个月以上欠款人存在关联</div></td></tr>' +
            '</table></div>' +
            '<div class="tabBox min-tab"><table class="table text-left td-4 m-t-2">' +
            '<tr><td class="sky-tab-title">序号</td><td>15312211122</td></tr><tr><td class="sky-tab-title">查询用户</td><td><span class="icon icon-orange">中</span></td></tr>' +
            '<tr><td class="sky-tab-title vertical-middle" colspan="2">说明</td></tr><tr><td colspan="2" class="text-left text-space"><div class="textarea">强：逾期3个月以上欠款人本人手机号<br>中：逾期3个月以上欠款人朋友或亲属手机号<br>弱：与逾期3个月以上欠款人存在二度人脉关系（手机号交叠）<br>无：未检测到与逾期3个月以上欠款人存在关联</div></td></tr>' +
            '</table></div>' +
            '</div>';
        win("详情", html);
    };
    //银行卡查询记录
    var bankCardQuery = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    var data = res.data;
                    if (returnCode(res.retCode)) {
                        var html = '<div class="box"><div class="tabBox"><table class="text-center table">' +
                            '<tr>' +
                            '<td class="sky-tab-title">银行卡</td>' +
                            '<td>' + data.bankNo + '</td>' +
                            '</tr>';
                        if (data.datas.length != 0) {
                            for (var i in data.datas) {
                                html += '<tr class="sky-tab-title">' +
                                    '<td>其他银行卡号</td>' +
                                    '<td>被查询时间</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>' + data.datas[i].bankNo + '</td>' +
                                    '<td>' + data.datas[i].searchTime + '</td>' +
                                    '</tr>';
                            }
                        } else {
                            html += '<tr>' +
                                '<td class="text-center" colspan="2">暂无数据</td>' +
                                '</tr>';
                        }
                        html += '</table></div></div>';
                        win("银行卡查询记录", html);
                    } else {
                        var html = '<div class="box"><div class="tabBox"><table class="text-center table">' +
                            '<tr>' +
                            '<td class="text-center" colspan="2">暂无数据</td>' +
                            '</tr>' +
                            '</table></div></div>';
                        sky.msg(res.retMsg);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    };
    //银行三要素四要素数据比对
    /*
     type = 3:三要素
     type = 4:四要素
     */
    var bankDataCompared = function (type, id) {
        type = type == 3 ? "银行卡三要素" : "银行卡四要素";
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id,
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var html = '<div class="box">' +
                            '<div class="searchResult text-center"><div class="result" style="padding-top: 20px">'
                        switch (res.data) {
                            case "SAME":
                                html += '<img src="img/icon_success.png" class="img-responsive">' +
                                    '<p class="color-green">数据比对一致</p>';
                                break;
                            case "DIFFERENT":
                                html += '<img src="img/icon_fails.png" class="img-responsive">' +
                                    '<p class="color-red">数据比对不一致</p>'
                                break;
                            default:
                                html += '<img src="img/icon_fails.png" class="img-responsive">' +
                                    '<p class="color-red">未查到相关数据</p>'
                                break;
                        }
                        
                        html += '</div>' +
                            '</div>' +
                            '</div>';
                        win(type, html);
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<div class="box">' +
                            '<div class="searchResult text-center">' +
                            '<div class="result" style="padding-top: 20px">' +
                            '<img src="img/icon_fails.png" class="img-responsive">' +
                            '<p class="color-red">未查到相关数据</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        win(type, html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        })
    };
    //银行画像分析
    var bankAnalysis = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data;
                        var html = '<div class="box">' +
                            '<p class="small sky-title bg-color-lGreen">基础信息</p>' +
                            '<div class="tabBox">';
                        if (data) {
                            html += '<table class="table m-t-2 text-left td-4">' +
                                '<tr>' +
                                '<td class="title">是否有房</td>' +
                                '<td>' + (data.assetIndex.hasRoom == true ? "有" : "无") + '</td>' +
                                '<td class="title">是否有车</td>' +
                                '<td>' + (data.assetIndex.hasCar == true ? "有" : "无") + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">房产预估购买时间</td>' +
                                '<td>' + (data.assetIndex.roomBuyTime == null ? "无" : data.assetIndex.roomBuyTime) + '</td>' +
                                '<td class="title">轿车预估购买时间</td>' +
                                '<td>' + (data.assetIndex.carBuyTime == null ? "无" : data.assetIndex.carBuyTime) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">房产预估价格</td>' +
                                '<td>' + (data.assetIndex.roomValue == null ? "无" : data.assetIndex.roomValue) + '</td>' +
                                '<td class="title">轿车预估价格</td>' +
                                '<td>' + (data.assetIndex.carValue == null ? "无" : data.assetIndex.carValue) + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">还款区间</td>' +
                                '<td colspan="3">' + data.assetIndex.repaymentAbility + '</td>' +
                                '</tr>' +
                                '</table>' +
                                '</div>' +
                                '<p class="small sky-title bg-color-lGreen m-t-2">交易行为特征</p>' +
                                '<div class="tabBox">' +
                                '<table class="text-left m-t-2 td-4">' +
                                '<tr>' +
                                '<td class="title">有无出差</td>' +
                                '<td>' + (data.tradingBehaviour.travelConsumption == true ? "有" : "无") + '</td>' +
                                '<td class="title">有无婚庆消费</td>' +
                                '<td>' + (data.tradingBehaviour.weddingConsumption == true ? "有" : "无") + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">是否就业状态</td>' +
                                '<td>' + (data.tradingBehaviour.employed == true ? "有" : "无") + '</td>' +
                                '<td class="title">常住城市</td>' +
                                '<td>' + data.tradingBehaviour.city + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">有无母婴/教育投资</td>' +
                                '<td>' + (data.tradingBehaviour.childInvest == true ? "有" : "无") + '</td>' +
                                '<td class="title">有无夜消费</td>' +
                                '<td>' + (data.tradingBehaviour.nightConsumption == true ? "有" : "无") + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">工作时间消费区</td>' +
                                '<td>' + data.tradingBehaviour.workingTimeConsumption + '</td>' +
                                '<td class="title">非工作时间消费区</td>' +
                                '<td>' + data.tradingBehaviour.noWorkingTimeConsumption + '</td>' +
                                '</tr>' +
                                '</table>' +
                                '</div>' +
                                '<p class="small sky-title bg-color-lGreen m-t-2">月消费统计</p>' +
                                '<div class="tabBox">' +
                                '<table class="table m-t-2">' +
                                '<tr>' +
                                '<td>月份</td>' +
                                '<td>消费笔数</td>' +
                                '<td>消费金额</td>' +
                                '<td>笔数本市排名</td>' +
                                '<td>金额本市排名</td>' +
                                '</tr>';
                            if (data.monthConsumption.length != 0) {
                                for (var i in data.monthConsumption) {
                                    html += '<tr>' +
                                        '<td>' + data.monthConsumption[i].month + '</td>' +
                                        '<td>' + data.monthConsumption[i].totalComsumptionTimes + '</td>' +
                                        '<td>' + data.monthConsumption[i].totalAmount + '</td>' +
                                        '<td>' + data.monthConsumption[i].consumptionTimesRanking + '</td>' +
                                        '<td>' + data.monthConsumption[i].consumptionAmountRanking + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td>1</td>' +
                                    '<td colspan="5">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table><p class="small sky-title bg-color-lGreen m-t-2">地域消费统计</p>' +
                                '<div class="tabBox">' +
                                '<table class="table m-t-2 td-3">' +
                                '<tr>' +
                                '<td>地域</td>' +
                                '<td>消费笔数</td>' +
                                '<td>消费金额</td>' +
                                '</tr>';
                            if (data.consumeCity.length != 0) {
                                for (var i in data.consumeCity) {
                                    html += '<tr>' +
                                        '<td>' + data.consumeCity[i].city + '</td>' +
                                        '<td>' + data.consumeCity[i].consumptionTimes + '</td>' +
                                        '<td>' + data.consumeCity[i].consumptionAmount + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="3">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table></div>' +
                                '</div>' +
                                '<p class="small sky-title bg-color-lGreen m-t-2">类别消费统计</p>' +
                                '<div class="tabBox">' +
                                '<table class="table m-t-2 td-3">' +
                                '<tr>' +
                                '<td>类别</td>' +
                                '<td>消费笔数</td>' +
                                '<td>消费金额</td>' +
                                '</tr>';
                            
                            if (data.consumeCategory.length != 0) {
                                html += '<tr>' +
                                    '<td>' + data.consumeCategory[i].categoryName + '</td>' +
                                    '<td>' + data.consumeCategory[i].consumptionTimes + '</td>' +
                                    '<td>' + data.consumeCategory[i].consumptionAmount + '</td>' +
                                    '</tr>';
                            } else {
                                html += '<tr>' +
                                    '<td colspan="3">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table>' +
                                '</div>' +
                                '<p class="small sky-title bg-color-lGreen m-t-2">信用消费统计</p>' +
                                '<div class="tabBox">' +
                                '<table class="table m-t-2 td-3">' +
                                '<tr>' +
                                '<td>类别</td>' +
                                '<td>消费笔数</td>' +
                                '<td>消费金额</td>' +
                                '</tr>';
                            if (data.creditTrading.length != 0) {
                                for (var i in data.creditTrading) {
                                    html += '<tr>' +
                                        '<td>' + data.creditTrading[i].name + '</td>' +
                                        '<td>' + data.creditTrading[i].consumptionTimes + '</td>' +
                                        '<td>' + data.creditTrading[i].consumptionAmount + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="3">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table>' +
                                '</div>' +
                                '</div>';
                        } else {
                            html += '<table class="table m-t-2 text-center"><tr><td>暂无数据</td></tr></table>' +
                                '</div>' +
                                '</div>';
                        }
                        win("银行卡画像", html);
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<div class="box">' +
                            '<p class="small sky-title bg-color-lGreen">基础信息</p>' +
                            '<div class="tabBox">' +
                            '<table class="table m-t-2 text-center"><tr><td>暂无数据</td></tr></table>' +
                            '</div>' +
                            '</div>';
                        win("银行卡画像", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.msg("服务器连接错误！");
            }
        });
    };
    //新银行画像分析
    var newBankAnalysis = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data;
                        var html = '<div class="box">' +
                            '<div class="tabBox">';
                        if (!$.isEmptyObject(data.centreConsumeIndex)) {
                            var centreConsumeIndex = data.centreConsumeIndex;
                            html += '<table class="table text-left td-4 base">' +
                                '<tr>' +
                                '	<td colspan="4" class="bg-color-lGreen text-center title"> 基础信息</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">银行卡类型</td>' +
                                '	<td>' + centreConsumeIndex.cardProperty + '</td>' +
                                '	<td class="title">取现总金额</td>' +
                                '	<td>' + centreConsumeIndex.cashTotalAmt + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">取现总笔数</td>' +
                                '	<td>' + centreConsumeIndex.cashTotalCnt + '</td>' +
                                '	<td class="title">首次交易日期</td>' +
                                '	<td>' + centreConsumeIndex.firstTransDate + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">常住城市</td>' +
                                '	<td>' + centreConsumeIndex.fromCity + '</td>' +
                                '	<td class="title">最大单月消费金额</td>' +
                                '	<td>' + centreConsumeIndex.monthCardLargeAmt + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">12月没有交易周数占比</td>' +
                                '	<td>' + centreConsumeIndex.noTransWeekPre + '</td>' +
                                '	<td class="title">还款总金额</td>' +
                                '	<td>' + centreConsumeIndex.refundTotalAmt + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">还款总笔数</td>' +
                                '	<td>' + centreConsumeIndex.refundTotalCnt + '</td>' +
                                '	<td class="title">刚需类消费占比</td>' +
                                '	<td>' + centreConsumeIndex.rigidTransAmtPre + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">消费总金额</td>' +
                                '	<td>' + centreConsumeIndex.transTotalAmt + '</td>' +
                                '	<td class="title">消费总笔数</td>' +
                                '	<td>' + centreConsumeIndex.transTotalCnt + '</td>' +
                                '</tr>' +
                                '</table>';
                        } else {
                            html += '<table class="table text-left td-4 base">' +
                                '<tr>' +
                                '	<td class="text-center"> 暂无数据</td>' +
                                '</tr>' +
                                '</table>';
                        }
                        if (!$.isEmptyObject(data.tradingBehaviour)) {
                            var tradingBehaviour = data.tradingBehaviour;
                            if (tradingBehaviour.ifHasFamily != "Na") tradingBehaviour.ifHasFamily = tradingBehaviour.ifHasFamily == 1 ? "有" : "无";
                            if (tradingBehaviour.ifHasLotteryTrans != "Na") tradingBehaviour.ifHasLotteryTrans = tradingBehaviour.ifHasLotteryTrans == 1 ? "有" : "无";
                            if (tradingBehaviour.ifHasOverseasTrans != "Na") tradingBehaviour.ifHasOverseasTrans = tradingBehaviour.ifHasOverseasTrans == 1 ? "有" : "无";
                            if (tradingBehaviour.ifHasUnemployed != "Na") tradingBehaviour.ifHasUnemployed = tradingBehaviour.ifHasUnemployed == 1 ? "有" : "无";
                            if (tradingBehaviour.nightConsumptions != "Na") tradingBehaviour.nightConsumptions = tradingBehaviour.nightConsumptions == 1 ? "有" : "无";
                            if (tradingBehaviour.travelConsumptions != "Na") tradingBehaviour.travelConsumptions = tradingBehaviour.travelConsumptions == 1 ? "有" : "无";
                            if (tradingBehaviour.weddingConsumptions != "Na") tradingBehaviour.weddingConsumptions = tradingBehaviour.weddingConsumptions == 1 ? "有" : "无";
                            html += '<table class="table m-t-2 text-left td-4 behavior">' +
                                '<tr>' +
                                '	<td colspan="4" class="bg-color-lGreen text-center title"> 交易行为</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">有无家庭特征</td>' +
                                '	<td>' + tradingBehaviour.ifHasFamily + '</td>' +
                                '	<td class="title">有无博彩业消费</td>' +
                                '	<td>' + tradingBehaviour.ifHasLotteryTrans + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">有无境外消费</td>' +
                                '	<td>' + tradingBehaviour.ifHasOverseasTrans + '</td>' +
                                '	<td class="title">有无无业特征</td>' +
                                '	<td>' + tradingBehaviour.ifHasUnemployed + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">有无夜消费</td>' +
                                '	<td>' + tradingBehaviour.nightConsumptions + '</td>' +
                                '	<td class="title">有无出差消费</td>' +
                                '	<td>' + tradingBehaviour.travelConsumptions + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">有无婚庆消费</td>' +
                                '	<td colspan="3">' + tradingBehaviour.weddingConsumptions + '</td>' +
                                '</tr>' +
                                '</table>';
                        } else {
                            html += '<table class="table text-left td-4 behavior">' +
                                '<tr>' +
                                '	<td class="text-center"> 暂无数据</td>' +
                                '</tr>' +
                                '</table>';
                        }
                        if (!$.isEmptyObject(data.consumeCitys)) {
                            html += '<table class="table m-t-2 td-2 area">' +
                                '<tr>' +
                                '	<td colspan="4" class="bg-color-lGreen text-center title"> 消费地域分布</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td colspan="2" class="title text-center">金额分布</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td>城市</td>' +
                                '	<td>占比</td>' +
                                '</tr>';
                            if (!$.isEmptyObject(data.consumeCitys.consumptionAmt)) {
                                var consumptionAmt = data.consumeCitys.consumptionAmt;
                                for (var i in consumptionAmt) {
                                    html += '<tr>' +
                                        '	<td>' + consumptionAmt[i].city + '</td>' +
                                        '	<td>' + consumptionAmt[i].per + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '	<td colspan="2">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '<tr>' +
                                '	<td colspan="2" class="title text-center">笔数分布</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td>城市</td>' +
                                '	<td>占比</td>' +
                                '</tr>';
                            if (!$.isEmptyObject(data.consumeCitys.consumptionTime)) {
                                var consumptionTime = data.consumeCitys.consumptionTime;
                                for (var i in consumptionTime) {
                                    html += '<tr>' +
                                        '	<td>' + consumptionTime[i].city + '</td>' +
                                        '	<td>' + consumptionTime[i].per + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '	<td colspan="2">暂无数据</td>' +
                                    '</tr>';
                            }
                            
                            html += '</table>';
                        } else {
                            html += '<table class="table text-left td-4 area">' +
                                '<tr>' +
                                '	<td class="text-center"> 暂无数据</td>' +
                                '</tr>' +
                                '</table>';
                        }
                        if (!$.isEmptyObject(data.monthConsumption)) {
                            html += '<table class="table m-t-2 text-left td-4 month">' +
                                '<tr>' +
                                '	<td colspan="4" class="bg-color-lGreen text-center title"> 每月消费情况</td>' +
                                '</tr>'
                            var monthConsumption = data.monthConsumption;
                            if (!$.isEmptyObject(monthConsumption)) {
                                for (var i in monthConsumption) {
                                    html += '<tr>' +
                                        '	<th colspan="4">' + (parseInt(i) + 1) + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '	<td class="title">消费金额</td>' +
                                        '	<td>' + monthConsumption[i].amount + '</td>' +
                                        '	<td class="title">消费笔数</td>' +
                                        '	<td>' + monthConsumption[i].totalTimes + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '	<td class="title">取现金额</td>' +
                                        '	<td>' + monthConsumption[i].cashAmt + '</td>' +
                                        '	<td class="title">取现笔数</td>' +
                                        '	<td>' + monthConsumption[i].cashCnt + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '	<td class="title">金额本市排名</td>' +
                                        '	<td>' + monthConsumption[i].amountRanking + '</td>' +
                                        '	<td class="title">笔数本市排名</td>' +
                                        '	<td>' + monthConsumption[i].timesRanking + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '	<td class="title">年月</td>' +
                                        '	<td colspan="3">' + monthConsumption[i].month + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '	<td class="text-center"> 暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table>';
                        } else {
                            html += '<table class="table text-left td-4 month">' +
                                '<tr>' +
                                '	<td class="text-center"> 暂无数据</td>' +
                                '</tr>' +
                                '</table>';
                        }
                        if (!$.isEmptyObject(data.specialTradeStatistics)) {
                            var specialTradeStatistics = data.specialTradeStatistics;
                            html += '<table class="table m-t-2 text-left td-4 special">' +
                                '<tr>' +
                                '	<td colspan="4" class="bg-color-lGreen text-center title"> 特殊交易统计</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">博彩业消费金额</td>' +
                                '	<td>' + specialTradeStatistics.lotteryTransAmt + '</td>' +
                                '	<td class="title">博彩业消费笔数</td>' +
                                '	<td>' + specialTradeStatistics.lotteryTransCnt + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">夜消费金额</td>' +
                                '	<td>' + specialTradeStatistics.nightTransAmt + '</td>' +
                                '	<td class="title">夜消费笔数</td>' +
                                '	<td>' + specialTradeStatistics.nightTransCnt + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">网上消费金额</td>' +
                                '	<td>' + specialTradeStatistics.onlineTransAmt + '</td>' +
                                '	<td class="title">网上消费笔数</td>' +
                                '	<td>' + specialTradeStatistics.onlineTransCnt + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">公共事业缴费笔数</td>' +
                                '	<td>' + specialTradeStatistics.publicPayAmt + '</td>' +
                                '	<td class="title">公共事业缴费金额</td>' +
                                '	<td>' + specialTradeStatistics.publicPayCnt + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">纳税金额</td>' +
                                '	<td>' + specialTradeStatistics.taxAmt + '</td>' +
                                '	<td class="title">纳税笔数</td>' +
                                '	<td>' + specialTradeStatistics.taxCnt + '</td>' +
                                '</tr>' +
                                '</table>';
                        } else {
                            html += '<table class="table text-left td-4 special">' +
                                '<tr>' +
                                '	<td class="text-center"> 暂无数据</td>' +
                                '</tr>' +
                                '</table>';
                        }
                        if (!$.isEmptyObject(data.strConsumeCategory)) {
                            html += '<table class="table m-t-2 td-2 type">' +
                                '<tr>' +
                                '	<td colspan="4" class="bg-color-lGreen text-center title"> 消费大类分布</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td colspan="4" class="title text-center">金额分布</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">行业</td>' +
                                '	<td class="title">比例</td>' +
                                '</tr>';
                            if (!$.isEmptyObject(data.strConsumeCategory.consumptionAmountDistribution)) {
                                var consumptionAmountDistribution = data.strConsumeCategory.consumptionAmountDistribution;
                                for (var i in consumptionAmountDistribution) {
                                    html += '<tr>' +
                                        '	<td>' + consumptionAmountDistribution[i].industry + '</td>' +
                                        '	<td>' + consumptionAmountDistribution[i].percentage + '</td>' +
                                        '</tr>';
                                }
                                
                            } else {
                                html += '<tr>' +
                                    '	<td colspan="2">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '<tr>' +
                                '	<td colspan="2" class="title text-center">笔数分布</td>' +
                                '</tr>' +
                                '<tr>' +
                                '	<td class="title">行业</td>' +
                                '	<td class="title">比例</td>' +
                                '</tr>';
                            if (!$.isEmptyObject(data.strConsumeCategory.consumptionTimesDistribution)) {
                                var consumptionTimesDistribution = data.strConsumeCategory.consumptionTimesDistribution;
                                for (var i in consumptionTimesDistribution) {
                                    html += '<tr>' +
                                        '	<td>' + consumptionTimesDistribution[i].industry + '</td>' +
                                        '	<td>' + consumptionTimesDistribution[i].percentage + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '	<td colspan="2">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table>';
                        } else {
                            html += '<table class="table text-left td-4 type">' +
                                '<tr>' +
                                '	<td class="text-center"> 暂无数据</td>' +
                                '</tr>' +
                                '</table>';
                        }
                        html += '</div></div>';
                        console.log(html);
                        win("银行卡画像", html);
                    } else {
                        sky.msg(res.retMsg);
                        var html = '<div class="box">' +
                            '<p class="small sky-title bg-color-lGreen">基础信息</p>' +
                            '<div class="tabBox">' +
                            '<table class="table m-t-2 text-center"><tr><td>暂无数据</td></tr></table>' +
                            '</div>' +
                            '</div>';
                        win("银行卡画像", html);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.msg("服务器连接错误！");
            }
        });
    };
    
    //反欺诈A类
    var antiFraudA = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var data = res.data.data;
                        var html = '<div class="box"><div class="tabBox">' +
                            '<div class="stretch-box"><table class="td-4 text-left table">';
                        if (res.data.hasData) {
                            if (res.data.operators == "CHINA_MOBILE") {
                                res.data.operators = "中国移动"
                            } else if (res.data.operators == "CHINA_UNION") {
                                res.data.operators = "中国联通"
                            } else if (res.data.operators == "CHINA_TELECOM") {
                                res.data.operators = "中国电信"
                            } else {
                                res.data.operators = "未知"
                            }
                            html += '<tr>' +
                                '<th colspan="4">基本信息</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">姓名</td>' +
                                '<td>' + res.data.realName + '</td>' +
                                '<td class="title">运营商</td>' +
                                '<td>' + res.data.operators + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">性别</td>' +
                                '<td>' + res.data.sex + '</td>' +
                                '<td class="title">年龄</td>' +
                                '<td>' + res.data.age + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title">身份证</td>' +
                                '<td colspan="3">' + res.data.idCard + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<th colspan="4">通讯录分析</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title" colspan="2">地域集中度</td>' +
                                '<td class="title" colspan="2">获取时间</td>' +
                                '</tr>';
                            if (data.siteContactInfo.length != 0) {
                                for (var i in data.siteContactInfo) {
                                    html += '<tr>' +
                                        '<td colspan="2">' + data.siteContactInfo[i].area + '</td>' +
                                        '<td colspan="2">' + formatDate(data.siteContactInfo[i].time) + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="4" class="text-center">暂无相关数据</td>' +
                                    '</tr>';
                            }
                            html += '<tr>' +
                                '<td class="title text-center" colspan="4">黑名单失联度</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<th colspan="4" class="title text-center">黑名单本人逾期记录</th>' +
                                '</tr>';
                            if (data.siteBlackSelf.length != 0) {
                                html += '<tr>' +
                                    '<td class="title">姓名</td>' +
                                    '<td class="title">逾期时间</td>' +
                                    '<td class="title">逾期级别</td>' +
                                    '<td class="title">信息获取时间</td>' +
                                    '</tr>';
                                for (var i in data.siteBlackSelf) {
                                    html += '<tr>' +
                                        '<td>' + data.siteBlackSelf[i].realName + '</td>' +
                                        '<td>' + data.siteBlackSelf[i].overDate + '</td>' +
                                        '<td>' + data.siteBlackSelf[i].overLevel + '</td>' +
                                        '<td>' + formatDate(data.siteBlackSelf[i].time) + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="4" class="text-center">暂无相关数据</td>' +
                                    '</tr>';
                            }
                            html += '<tr>' +
                                '<th colspan="4" class="title text-center">黑名单联系人信息</th>' +
                                '</tr>';
                            if (data.siteBlackSecond.length != 0) {
                                html += '<tr>' +
                                    '<td class="title">姓名</td>' +
                                    '<td class="title">手机号</td>' +
                                    '<td class="title">关系</td>' +
                                    '<td class="title">信息获取时间</td>' +
                                    '</tr>';
                                for (var i in data.siteBlackSecond) {
                                    html += '<tr>' +
                                        '<td>' + data.siteBlackSecond[i].realName + '</td>' +
                                        '<td>' + data.siteBlackSecond[i].phone + '</td>' +
                                        '<td>' + data.siteBlackSecond[i].relationship + '</td>' +
                                        '<td>' + formatDate(data.siteBlackSecond[i].time) + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="4" class="text-center">暂无相关数据</td>' +
                                    '</tr>';
                            }
                            html += '<tr>' +
                                '<th colspan="4" class="title text-center">黑名单二度人脉逾期记录</th>' +
                                '</tr>';
                            if (data.siteBlackThree.length != 0) {
                                html += '<tr>' +
                                    '<td class="title">姓名</td>' +
                                    '<td class="title">逾期时间</td>' +
                                    '<td class="title">逾期级别</td>' +
                                    '<td class="title">信息获取时间</td>' +
                                    '</tr>';
                                for (var i in data.siteBlackThree) {
                                    html += '<tr>' +
                                        '<td>' + data.siteBlackThree[i].realName + '</td>' +
                                        '<td>' + data.siteBlackThree[i].overDate + '</td>' +
                                        '<td>' + data.siteBlackThree[i].overLevel + '</td>' +
                                        '<td>' + formatDate(data.siteBlackThree[i].time) + '</td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="4" class="text-center">暂无相关数据</td>' +
                                    '</tr>';
                            }
                            html += '<tr>' +
                                '<th colspan="4">手机号码被查询次数</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title" colspan="2">过去7天被查询次数</td>' +
                                '<td colspan="2">' + res.data.weekCount + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title" colspan="2">过去15天被查询次数</td>' +
                                '<td colspan="2">' + res.data.halfMonthCount + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title" colspan="2">过去30天被查询次数</td>' +
                                '<td colspan="2">' + res.data.monthCount + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td class="title" colspan="2">过去3个月被查询次数</td>' +
                                '<td colspan="2">' + res.data.threeMonthCount + '</td>' +
                                '</tr>';
                        } else {
                            html += '<tr>' +
                                '<td colspan="4" class="text-center">暂无相关数据</td>' +
                                '</tr>';
                        }
                        html += '</table></div></div></div>';
                        
                        win("手机号反欺诈", html);
                    } else {
                        sky.msg(res.retMsg);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function () {
                sky.msg("服务器连接错误！");
            }
        });
    };
    
    //反欺诈B类
    var antiFraudB = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    if (returnCode(res.retCode)) {
                        var html = null;
                        var data = res.data.data;
                        if (res.data.apiComparedStatusEnum == "SAME") {
                            if (res.data.hasData == true) {
                                html = '<div class="box"><div class="tabBox">' +
                                    '<div class="stretch-box">' +
                                    '<table class="td-4 text-left table">' +
                                    '<tr>' +
                                    '<th colspan="4">相关联系方式</th>' +
                                    '</tr>';
                                if (data.siteLinkMobile.length != 0) {
                                    for (var i in data.siteLinkMobile) {
                                        html += '<tr>' +
                                            '<td>手机号码</td>' +
                                            '<td>' + data.siteLinkMobile[i].mobile + '</td>' +
                                            '<td>获取时间</td>' +
                                            '<td>' + formatDate(data.siteLinkMobile[i].time) + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td class="text-center" colspan="4">暂无相关数据</td>' +
                                        '</tr>'
                                }
                                html += '<tr>' +
                                    '<th colspan="4">地址信息</th>' +
                                    '</tr>';
                                if (data.addressData.length != 0) {
                                    for (var i in data.addressData) {
                                        html += '<tr>' +
                                            '<td class="title">地址类型</td>' +
                                            '<td colspan="3"><span class="icon-orange icon">居</span>居住地址</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">地址位置</td>' +
                                            '<td colspan="3">' + data.addressData[i].homeAddress + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">地址类型</td>' +
                                            '<td colspan="3"><span class="icon-green icon">工</span>工作地址</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">地址位置</td>' +
                                            '<td colspan="3">' + data.addressData[i].companyAddress + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td class="text-center" colspan="4">暂无相关数据</td>' +
                                        '</tr>';
                                }
                                html += '</table>' +
                                    '</div>' +
                                    '<p class="sky-title small text-center m-t-2 bg-color-lGreen">行业黑名单</p><table class="td-4 text-left m-t-2 table">';
                                if (data.siteBlackInfo.length != 0) {
                                    for (var i in data.siteBlackInfo) {
                                        html += '<tr><th class="tab-title-small" colspan="4"><span class="icon icon-number">' + (parseInt(i) + 1) + '</span></th></tr>' +
                                            '<tr>' +
                                            '<td class="title">借款日期</td>' +
                                            '<td>' + data.siteBlackInfo[i].borrowDate + '</td>' +
                                            '<td class="title">贷款区间</td>' +
                                            '<td>' + data.siteBlackInfo[i].balance + '万</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">逾期期数</td>' +
                                            '<td>' + data.siteBlackInfo[i].periods + '</td>' +
                                            '<td class="title">逾期时间</td>' +
                                            '<td>' + data.siteBlackInfo[i].overdueDate + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">逾期等级</td>' +
                                            '<td>' + data.siteBlackInfo[i].overdueLevel + '</td>' +
                                            '<td class="title">逾期金额</td>' +
                                            '<td>' + data.siteBlackInfo[i].overdueAmount + '万</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">公司名字</td>' +
                                            '<td>' + data.siteBlackInfo[i].companyName + '</td>' +
                                            '<td class="title">公司联系电话</td>' +
                                            '<td>' + data.siteBlackInfo[i].companyPhone + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">家庭联系电话</td>' +
                                            '<td>' + data.siteBlackInfo[i].familyPhone + '</td>' +
                                            '<td class="title">联系人姓名</td>' +
                                            '<td>' + data.siteBlackInfo[i].contactName + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">联系人电话</td>' +
                                            '<td>' + data.siteBlackInfo[i].contactPhone + '</td>' +
                                            '<td class="title">数据获取时间</td>' +
                                            '<td>' + formatDate(data.siteBlackInfo[i].recTime) + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td class="text-center">暂无数据</td>' +
                                        '</tr>';
                                }
                                html += '</table>';
                                html += '<table class="td-4 text-left m-t-2 table">' +
                                    '<tr>' +
                                    '<th colspan="4">法院失信被执行记录</th>' +
                                    '</tr>';
                                if (data.sitePunishData.jyPunishBreak.length != 0 || data.sitePunishData.jyPunished.length != 0) {
                                    html += '<tr>' +
                                        '<td class="title">被执行人信息</td>' +
                                        '<td>' + data.sitePunishData.jyPunished.length + '</td>' +
                                        '<td class="title">失信被执行人信息</td>' +
                                        '<td>' + data.sitePunishData.jyPunishBreak.length + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">汇总</td>' +
                                        '<td colspan="3">' + (data.sitePunishData.jyPunished.length + data.sitePunishData.jyPunishBreak.length) + '</td>' +
                                        '</tr>' +
                                        '</table>' +
                                        '<div class="stretch-box">' +
                                        '<table class="table m-t-2">' +
                                        '<th colspan="6">明细</th>' +
                                        '<tr>' +
                                        '<td class="title">类型</td>' +
                                        '<td class="title">执行法院</td>' +
                                        '<td class="title">立案时间</td>' +
                                        '<td class="title">案号</td>' +
                                        '<td class="title">标的金额或履行情况</td>' +
                                        '<td class="title">信息获取<br>时间</td>' +
                                        '</tr>';
                                    if (data.sitePunishData.jyPunished.length != 0) {
                                        for (var i in data.sitePunishData.jyPunished) {
                                            html += '<tr>' +
                                                '<td>被执行人信息</td>' +
                                                '<td>' + data.sitePunishData.jyPunished[i].courtName + '</td>' +
                                                '<td>' + formatDate(data.sitePunishData.jyPunished[i].regDate) + '</td>' +
                                                '<td>' + data.sitePunishData.jyPunished[i].caseCode + '</td>' +
                                                '<td>' + data.sitePunishData.jyPunished[i].execMoney + '</td>' +
                                                '<td></td>' +
                                                '</tr>';
                                        }
                                    } else {
                                        html += '<tr>' +
                                            '<td class="text-center" colspan="6">暂无相关数据</td>' +
                                            '</tr>';
                                    }
                                    if (data.sitePunishData.jyPunishBreak.length) {
                                        for (var i in data.sitePunishData.jyPunishBreak) {
                                            html += '<tr>' +
                                                '<td>失信被执行信息</td>' +
                                                '<td>' + data.sitePunishData.jyPunishBreak[i].courName + '</td>' +
                                                '<td>' + formatDate(data.sitePunishData.jyPunishBreak[i].regDate) + '</td>' +
                                                '<td>' + data.sitePunishData.jyPunishBreak[i].caseCode + '</td>' +
                                                '<td>' + data.sitePunishData.jyPunishBreak[i].performance + '</td>' +
                                                '<td>' + formatDate(data.sitePunishData.jyPunishBreak[i].publishDate) + '</td>' +
                                                '</tr>';
                                        }
                                    } else {
                                        html += '<tr>' +
                                            '<td class="text-center" colspan="6">暂无相关数据</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="4" class="text-center">暂无相关数据</td>' +
                                        '</tr>';
                                }
                                html += '</table>' +
                                    '</div>' +
                                    '<table class="td-4 text-left m-t-2 table">' +
                                    '<tr>' +
                                    '<th colspan="4">犯罪记录</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">姓名</td>' +
                                    '<td>' + res.data.realName + '</td>' +
                                    '<td class="title">身份证号</td>' +
                                    '<td>' + res.data.idCard + '</td>' +
                                    '</tr>' +
                                    '</table>';
                                if (data.negetiveMessage != "") {
                                    html += '<!--查询成功有结果-->' +
                                        '<div class="searchResult">' +
                                        '<p class="result color-red m-t-2 bg-color-lGreen" style="text-align:center">' + data.negetiveMessage + '</p>' +
                                        '<table class="text-left m-t-2 table">' +
                                        '<tr>' +
                                        '<td class="title">案件时间</td>' +
                                        '<td class="title">案件类型</td>' +
                                        '<td class="title">案件类型描述</td>' +
                                        '</tr>';
                                    if (data.hasCrimeData == true) {
                                        for (var i in data.crimeDetailIfs) {
                                            html += '<tr>' +
                                                '<td>' + data.crimeDetailIfs[i].caseTime + '</td>' +
                                                '<td>' + data.crimeDetailIfs[i].caseType + '</td>' +
                                                '<td>' + data.crimeDetailIfs[i].caseSource + '</td>' +
                                                '</tr>';
                                        }
                                    } else {
                                        html += '<tr>' +
                                            '<td colspan="3" class="text-center">暂无相关数据</td>' +
                                            '</tr>';
                                    }
                                    html += '</table>' +
                                        '</div>';
                                } else {
                                    html += '<div class="searchResult">' +
                                        '<p class="result color-red m-t-2 bg-color-lGreen" style="margin-bottom: 0px;text-align:center">比对结果：无犯罪在逃记录</p>' +
                                        '</div>';
                                }
                                html += '</div></div>';
                            } else {
                                html = '<div class="box"><div class="tabBox">' +
                                    '<div class="stretch-box">' +
                                    '<table class="td-4 text-left m-t-2 table">' +
                                    '<tr>' +
                                    '<td colspan="4" style="text-align:center;">暂无相关数据</td>' +
                                    '</tr>' +
                                    '</table>' +
                                    '</div></div></div>';
                            }
                        } else {
                            sky.msg("查询失败！");
                        }
                        win("身份反欺诈", html);
                    } else {
                        sky.msg(res.retMsg);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function () {
                sky.msg("服务器连接错误！");
            }
        });
    };
    
    //支付提示
    var payPrompt = function (orderNum) {
        var html = '<div class="box payPrompt">' +
            '<p class="payTitle">请您在新打开的页面上完成支付</p>' +
            '<p>付款完成前先不要关闭此窗口，如若不小心关闭，系统会在付款成功后半小时自动更新</p>' +
            '<a class="m-btn complete">完成付款</a><a class="m-btn cancel pull-right">支付遇到问题</a>' +
            '</div>';
        win("支付提示", html);
        $(".payPrompt .complete").click(function () {
            $.ajax({
                type: 'post',
                url: "pay/status.do",
                data: {
                    orderNum: orderNum
                },
                success: function (res) {
                    try {
                        if (returnCode(res.retCode)) {
                            location.href = "accRecharge2V.do";
                        } else {
                            sky.msg(res.retMsg);
                        }
                    } catch (e) {
                        sky.msg("发生异常：" + e);
                    }
                },
                error: function (xhr, type) {
                    sky.lodingClose();
                    sky.msg("服务器连接错误！");
                }
            });
        });
        $(".payPrompt .cancel").click(function () {
            $(".sky-win").remove();
            var clearfix = $(".clearfix");
        });
    }
    //微信支付
    var payWeChat = function (money) {
        $.ajax({
            type: 'post',
            url: "wx/pay.do",
            data: {amount: money},
            success: function (res) {
                try {
                    if (returnCode(res.retCode)) {
                        var html = '<div class="box payPrompt weChat">' +
                            '<p class="payTitle">请扫码已完成微信支付</p>' +
                            '<img src="data:image/png;base64,' + res.payStr + '">' +
                            '</div>';
                        win("支付提示", html);
                        isPay(res.orderNum);
                    } else {
                        sky.msg(res.retMsg);
                    }
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
        
        function isPay(num) {
            setTimeout(function () {
                $.ajax({
                    type: 'post',
                    url: "pay/status.do",
                    data: {
                        orderNum: num
                    },
                    success: function (res) {
                        try {
                            if (returnCode(res.retCode)) {
                                location.href = "accRecharge2V.do";
                            } else {
                                if (res.retCode == "9973") {
                                    isPay(num);
                                } else {
                                    sky.msg(res.retMsg);
                                }
                            }
                        } catch (e) {
                            sky.msg("发生异常：" + e);
                        }
                    },
                    error: function (xhr, type) {
                        sky.lodingClose();
                        sky.msg("服务器连接错误！");
                    }
                });
            }, 5000);
        }
    }
    //报告弹窗
    var report = function (id) {
        sky.loding();
        $.ajax({
            type: 'post',
            url: 'history/result.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function (res) {
                sky.lodingClose();
                try {
                    var html = "";
                    if (returnCode(res.retCode)) {
                        var res = res.data;
                        //身份证照片
                        if (res.apiComparedStatusEnum == "SAME") {
                            if (res.data.photo != null) {
                                html = '<div class="box"><div class="tabBox">' +
                                    '<p class="sky-title text-center">身份证照片查询</p><table class="table m-t-2">' +
                                    '<tr><td>姓名：' + res.realName + '</td><td>年龄：' + calculateAge(res.birthday) + '</td><td rowspan="3" class="text-center"><img class="photo" src="data:img/jpeg;base64,' + res.data.photo + '"></td></tr>' +
                                    '<tr><td>性别：' + res.sex + '</td><td>出生日期：' + res.birthday + '</td></tr>' +
                                    '<tr><td colspan="2">证件号码：' + res.idCard + '</td></tr>' +
                                    '</table></div>';
                            } else {
                                html = '<p class="sky-title text-center">身份证照片查询</p>' +
                                    '<div class="box">' +
                                    '<p class="sky-title small text-center color-green m-t-2">姓名身份证号一致，系统无照片返回</p>' +
                                    '<div class="tabBox"><table class="table m-t-2">' +
                                    '<tr><td>姓名：' + res.realName + '</td><td>年龄：' + calculateAge(res.birthday) + '</td><td rowspan="3" class="text-center"><img src="img/icon_portrait_01.png"></td></tr>' +
                                    '<tr><td>性别：' + res.sex + '</td><td>出生日期：' + res.birthday + '</td></tr>' +
                                    '<tr><td colspan="2">证件号码：' + res.idCard + '</td></tr>' +
                                    '</table></div>';
                            }
                            //身份查询记录
                            if (res.data.siteIdentityLog) {
                                var companySearchInfo = res.data.siteIdentityLog.companySearchInfo;
                                var userSearchInfo = res.data.siteIdentityLog.userSearchInfo;
                                html += '<p class="sky-title text-center m-t-2"><span class="text-icon">机构查询</span></p>' +
                                    '<div class="tabBox">' +
                                    '<table class="table td-4 m-t-2">' +
                                    '<tr>' +
                                    '<td class="title">机构数</td>' +
                                    '<td >' + res.data.siteIdentityLog.companyCounts + '</td>' +
                                    '<td class="title">机构查询次数</td>' +
                                    '<td >' + res.data.siteIdentityLog.companySearchs + '</td>' +
                                    '</tr>' +
                                    '</table>' +
                                    '</div>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2 record">' +
                                    '<tr>' +
                                    '<th >序号</th>' +
                                    '<th >查询项目</th>' +
                                    '<th >查询时间</th>' +
                                    '<th >机构名称</th>' +
                                    '</tr>';
                                if (companySearchInfo.length != 0) {
                                    for (var i in companySearchInfo) {
                                        html += '<tr class="text-center">' +
                                            '<td>' + (parseInt(i) + 1) + '</td>' +
                                            '<td>' + companySearchInfo[i].searchType + '</td>' +
                                            '<td>' + companySearchInfo[i].searchTime + '</td>' +
                                            '<td>' + companySearchInfo[i].searchByName + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="4" class="text-center">暂无数据</td>' +
                                        '</tr>';
                                }
                                html += '</table>' +
                                    '</div>' +
                                    '</div>';
                                html += '<p class="sky-title m-t-2 text-center"><span class="text-icon">个人查询</span></p>' +
                                    '<div class="tabBox">' +
                                    '<table class="table td-4 m-t-2">' +
                                    '<tr>' +
                                    '<td class="title">用户数</td>' +
                                    '<td >' + res.data.siteIdentityLog.userCounts + '</td>' +
                                    '<td class="title">用户查询次数</td>' +
                                    '<td >' + res.data.siteIdentityLog.userSearchs + '</td>' +
                                    '</tr>' +
                                    '</table>' +
                                    '</div>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2">' +
                                    '<tr>' +
                                    '<th >序号</th>' +
                                    '<th >查询项目</th>' +
                                    '<th >查询时间</th>' +
                                    '<th >机构名称</th>' +
                                    '</tr>';
                                if (userSearchInfo.length != 0) {
                                    for (var i in userSearchInfo) {
                                        html += '<tr class="text-center">' +
                                            '<td>' + (parseInt(i) + 1) + '</td>' +
                                            '<td>' + userSearchInfo[i].searchType + '</td>' +
                                            '<td>' + userSearchInfo[i].searchTime + '</td>' +
                                            '<td>' + userSearchInfo[i].searchByName + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="4" class="text-center">暂无数据</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            //小贷记录
                            if (res.data.personLoanInfoData) {
                                html += '<p class="sky-title text-center m-t-2">小贷记录</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2 record td-5">' +
                                    '<tr>' +
                                    '<th>年份</th>' +
                                    '<th>受理申请机构数</th>' +
                                    '<th>完成放款机构数</th>' +
                                    '<th>机构受理申请次数</th>' +
                                    '<th>借款成功金额</th>' +
                                    '</tr>';
                                if (res.data.personLoanInfoData.length != 0) {
                                    for (var i in res.data.personLoanInfoData) {
                                        html += '<tr class="text-center">' +
                                            '<td>' + res.data.personLoanInfoData[i].reqYear + '</td>' +
                                            '<td>' + res.data.personLoanInfoData[i].companyCount + '</td>' +
                                            '<td>' + res.data.personLoanInfoData[i].acceptCount + '</td>' +
                                            '<td>' + res.data.personLoanInfoData[i].borrowCount + '</td>' +
                                            '<td>' + res.data.personLoanInfoData[i].amountTotal + '（万）</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td class="text-center" colspan="5">暂无数据</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            //逾期记录
                            if (res.data.collectionData) {
                                html += '<p class="sky-title text-center m-t-2">逾期记录</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2 record">' +
                                    '<tr>' +
                                    '<th >借款类型</th>' +
                                    '<th >借款金额</th>' +
                                    '<th >合同年月</th>' +
                                    '<th >逾期级别</th>' +
                                    '<th >数据报送时间</th>' +
                                    '</tr>';
                                if (res.data.collectionData.length != 0) {
                                    for (var i in res.data.collectionData) {
                                        html += '<tr class="text-center">' +
                                            '<td>' + res.data.collectionData[i].borrowType + '</td>' +
                                            '<td>' + res.data.collectionData[i].borrowAmount + '</td>' +
                                            '<td>' + cutOffData(res.data.collectionData[i].contractDate) + '</td>' +
                                            '<td>' + res.data.collectionData[i].overdueType + '</td>' +
                                            '<td>' + cutOffData(res.data.collectionData[i].time) + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="5" class="text-center">暂无数据</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            html += '<p class="sky-title text-center m-t-2">法院失信及被执行信息查询</p>' +
                                '<div class="stretch-box">' +
                                '<div class="tabBox">';
                            if (res.data.gsDataInfo.caseInfoCount != 0 || res.data.gsDataInfo.punishBreakInfoCount != 0 || res.data.gsDataInfo.punishedInfoCount != 0) {
                                html += '<table class="table m-t-2 td-4"><tr>' +
                                    '<td class="title">被执行人信息</td>' +
                                    '<td>' + res.data.gsDataInfo.punishedInfoCount + '</td>' +
                                    '<td class="title">失信被执行人信息</td>' +
                                    '<td>' + res.data.gsDataInfo.punishBreakInfoCount + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">行政处罚</td>' +
                                    '<td>' + res.data.gsDataInfo.caseInfoCount + '</td>' +
                                    '<td class="title">汇总</td>' +
                                    '<td>' + (res.data.gsDataInfo.caseInfoCount + res.data.gsDataInfo.punishBreakInfoCount + res.data.gsDataInfo.punishedInfoCount) + '</td>' +
                                    '</tr></table>';
                                html += '<table class="table m-t-2"><tr>' +
                                    '<th>类型</th>' +
                                    '<th>执行法院</th>' +
                                    '<th>立案时间</th>' +
                                    '<th>案号</th>' +
                                    '<th>标的金额或履行情况</th>' +
                                    '<th>信息获取<br>时间</th>' +
                                    '</tr>';
                                if (res.data.gsDataInfo.caseInfoCount != 0) {
                                    for (var i = 0; i < res.data.gsDataInfo.caseInfo.length; i++) {
                                        html += '<tr>' +
                                            '<td>行政处罚</td>' +
                                            '<td>' + res.data.gsDataInfo.caseInfo[i].penAuth + '</td>' +
                                            '<td>' + res.data.gsDataInfo.caseInfo[i].caseTime + '</td>' +
                                            '<td>' + res.data.gsDataInfo.caseInfo[i].cardNo + '</td>' +
                                            '<td>' + res.data.gsDataInfo.caseInfo[i].penAm + '</td>' +
                                            '<td>2016-2-18</td>' +
                                            '</tr>';
                                    }
                                }
                                if (res.data.gsDataInfo.punishBreakInfoCount != 0) {
                                    for (var i = 0; i < res.data.gsDataInfo.punishBreakInfo.length; i++) {
                                        html += '<tr>' +
                                            '<td>失信被执行人信息</td>' +
                                            '<td>' + res.data.gsDataInfo.punishBreakInfo[i].courName + '</td>' +
                                            '<td>' + res.data.gsDataInfo.punishBreakInfo[i].regDate + '</td>' +
                                            '<td>' + res.data.gsDataInfo.punishBreakInfo[i].caseCode + '</td>' +
                                            '<td>' + res.data.gsDataInfo.punishBreakInfo[i].performance + '</td>' +
                                            '<td>2016-2-18</td>' +
                                            '</tr>';
                                    }
                                }
                                if (res.data.gsDataInfo.punishedInfoCount != 0) {
                                    for (var i = 0; i < res.data.gsDataInfo.punishedInfo.length; i++) {
                                        html += '<tr>' +
                                            '<td>被执行人信息</td>' +
                                            '<td>' + res.data.gsDataInfo.punishedInfo[i].courtName + '</td>' +
                                            '<td>' + res.data.gsDataInfo.punishedInfo[i].regDate + '</td>' +
                                            '<td>' + res.data.gsDataInfo.punishedInfo[i].caseCode + '</td>' +
                                            '<td>' + res.data.gsDataInfo.punishedInfo[i].execMoney + '</td>' +
                                            '<td>2016-2-18</td>' +
                                            '</tr>';
                                    }
                                }
                                html += '</table>';
                            } else {
                                html += '<table class="table m-t-2 td-4"><tr>' +
                                    '<td class="title">被执行人信息</td>' +
                                    '<td>0</td>' +
                                    '<td class="title">失信被执行人信息</td>' +
                                    '<td>0</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="title">行政处罚</td>' +
                                    '<td>0</td>' +
                                    '<td class="title">汇总</td>' +
                                    '<td>0</td>' +
                                    '</tr></table><table class="table m-t-2"><tr>' +
                                    '<th>类型</th>' +
                                    '<th>执行法院</th>' +
                                    '<th>立案时间</th>' +
                                    '<th>案号</th>' +
                                    '<th>标的金额或履行情况</th>' +
                                    '<th>信息获取<br>时间</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td colspan="6" class="text-center">暂无相关信息</td>' +
                                    '</tr></table>';
                            }
                            html += '</div></div>';
                            //工商信息
                            html += '<p class="sky-title text-center m-t-2">工商信息</p>' +
                                '<div class="stretch-box">' +
                                '<div class="tabBox">' +
                                '<table class="table m-t-2">';
                            if (res.data.gsDataInfo.corporateInfo.length != 0 || res.data.gsDataInfo.shareholderInfo.length != 0 || res.data.gsDataInfo.managerInfo.length != 0) {
                                for (var i = 0; i < res.data.gsDataInfo.corporateInfo.length; i++) {
                                    html += '<tr>' +
                                        '<td class="title">公司名称</td>' +
                                        '<td colspan="3">' + res.data.gsDataInfo.corporateInfo[i].entName + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册号</td>' +
                                        '<td class="title">' + res.data.gsDataInfo.corporateInfo[i].regNo + '</td>' +
                                        '<td class="title">公司类型</td>' +
                                        '<td class="title">' + res.data.gsDataInfo.corporateInfo[i].entType + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册资本</td>' +
                                        '<td>' + res.data.gsDataInfo.corporateInfo[i].regCap + '</td>' +
                                        '<td class="title">资本单位</td>' +
                                        '<td>' + res.data.gsDataInfo.corporateInfo[i].regCapCur + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">企业状态</td>' +
                                        '<td>' + res.data.gsDataInfo.corporateInfo[i].entStatus + '</td>' +
                                        '<td class="title">任职</td>' +
                                        '<td></td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">认缴金额</td>' +
                                        '<td></td>' +
                                        '<td class="title">股份比例</td>' +
                                        '<td></td>' +
                                        '</tr>';
                                }
                                for (var i = 0; i < res.data.gsDataInfo.shareholderInfo.length; i++) {
                                    html += '<tr>' +
                                        '<td class="title">公司名称</td>' +
                                        '<td colspan="3">' + res.data.gsDataInfo.shareholderInfo[i].entName + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册号</td>' +
                                        '<td class="title">' + res.data.gsDataInfo.shareholderInfo[i].regNo + '</td>' +
                                        '<td class="title">公司类型</td>' +
                                        '<td class="title">' + res.data.gsDataInfo.shareholderInfo[i].entType + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册资本</td>' +
                                        '<td>' + res.data.gsDataInfo.shareholderInfo[i].regCap + '</td>' +
                                        '<td class="title">资本单位</td>' +
                                        '<td>' + res.data.gsDataInfo.shareholderInfo[i].regCapCur + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">企业状态</td>' +
                                        '<td>' + res.data.gsDataInfo.shareholderInfo[i].entStatus + '</td>' +
                                        '<td class="title">任职</td>' +
                                        '<td></td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">认缴金额</td>' +
                                        '<td>' + res.data.gsDataInfo.shareholderInfo[i].subConam + '</td>' +
                                        '<td class="title">股份比例</td>' +
                                        '<td>' + res.data.gsDataInfo.shareholderInfo[i].fundedRatio + '</td>' +
                                        '</tr>';
                                }
                                for (var i = 0; i < res.data.gsDataInfo.managerInfo.length; i++) {
                                    html += '<tr>' +
                                        '<td class="title">公司名称</td>' +
                                        '<td colspan="3">' + res.data.gsDataInfo.managerInfo[i].entName + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册号</td>' +
                                        '<td class="title">' + res.data.gsDataInfo.managerInfo[i].regNo + '</td>' +
                                        '<td class="title">公司类型</td>' +
                                        '<td class="title">' + res.data.gsDataInfo.managerInfo[i].entType + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">注册资本</td>' +
                                        '<td>' + res.data.gsDataInfo.managerInfo[i].regCap + '</td>' +
                                        '<td class="title">资本单位</td>' +
                                        '<td>' + res.data.gsDataInfo.managerInfo[i].regCapCur + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">企业状态</td>' +
                                        '<td>' + res.data.gsDataInfo.managerInfo[i].entStatus + '</td>' +
                                        '<td class="title">任职</td>' +
                                        '<td>' + res.data.gsDataInfo.managerInfo[i].position + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">认缴金额</td>' +
                                        '<td></td>' +
                                        '<td class="title">股份比例</td>' +
                                        '<td></td>' +
                                        '</tr>';
                                }
                            } else {
                                html += '<tr>' +
                                    '<td colspan="4" class="text-center">暂无数据</td>' +
                                    '</tr>';
                            }
                            html += '</table></div></div>';
                            //手机在网时间
                            if (res.data.mobileData) {
                                html += '<p class="sky-title text-center m-t-2">手机实名认证及在网时长</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2">';
                                if (res.data.mobileData.status == "SAME") {
                                    res.data.mobileData.status = "相同"
                                } else if (res.data.mobileData.status == "DIFFERENT") {
                                    res.data.mobileData.status = "不相同"
                                } else {
                                    res.data.mobileData.status = "没有数据"
                                }
                                if (res.data.mobileData.status == "相同") {
                                    html += '<tr>' +
                                        '<td class="title">姓名</td>' +
                                        '<td>' + res.realName + '</td>' +
                                        '<td class="title">手机号</td>' +
                                        '<td>' + res.mobile + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">运营商</td>' +
                                        '<td>' + res.data.mobileData.operator + '</td>' +
                                        '<td class="title">实名检验</td>' +
                                        '<td>' + res.data.mobileData.status + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">入网时长</td>' +
                                        '<td colspan="3">' + res.data.mobileData.onlineTime + '</td>' +
                                        '</tr>';
                                } else if (res.data.mobileData.status == "不相同") {
                                    html += '<tr>' +
                                        '<td colspan="4" class="text-center">姓名手机号不一致</td>' +
                                        '</tr>'
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="4" class="text-center">暂无数据</td>' +
                                        '</tr>'
                                }
                                html += '</table></div></div>';
                            }
                            //同住址成员信息
                            if (res.data.jyIdCardInfo) {
                                html += '<p class="sky-title text-center m-t-2">同住址成员信息</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2">';
                                if (!$.isEmptyObject(res.data.jyIdCardInfo)) {
                                    html += '<tr>' +
                                        '<td class="title">姓名</td>' +
                                        '<td >' + res.data.jyIdCardInfo.realName + '</td>' +
                                        '<td class="title">生日</td>' +
                                        '<td >' + res.data.jyIdCardInfo.birthday + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">婚否</td>' +
                                        '<td >' + res.data.jyIdCardInfo.maritalStatus + '</td>' +
                                        '<td class="title">民族</td>' +
                                        '<td >' + res.data.jyIdCardInfo.nation + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">证件号码</td>' +
                                        '<td class="text-left" colspan="3">' + res.data.jyIdCardInfo.idCard + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">户籍地址</td>' +
                                        '<td class="text-left" colspan="3">' + res.data.jyIdCardInfo.address + '</td>' +
                                        '</tr>';
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="4">暂无相关信息</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            //小贷记录明细（多重负债）
                            if (res.data.siteLoanInfo) {
                                html += '<p class="sky-title text-center m-t-2">小贷记录明细（多重负债）</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2">';
                                if (res.data.siteLoanInfo.hit == true) {
                                    res.data.siteLoanInfo.hit = "是"
                                } else {
                                    res.data.siteLoanInfo.hit = "否"
                                }
                                if (res.data.siteLoanInfo.data.length != 0) {
                                    html += '<tr>' +
                                        '<td colspan="2" class="title">是否命中行业风险名单</td>' +
                                        '<td colspan="2">' + res.data.siteLoanInfo.hit + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">名单添加时间</td>' +
                                        '<td>（开发中，暂无）</td>' +
                                        '<td class="title">名单添加机构</td>' +
                                        '<td>（开发中，暂无）</td>' +
                                        '</tr>';
                                    for (var i in res.data.siteLoanInfo.data) {
                                        if (res.data.siteLoanInfo.data[i].borrowType == 0) {
                                            res.data.siteLoanInfo.data[i].borrowType = "未知"
                                        } else if (res.data.siteLoanInfo.data[i].borrowType == 1) {
                                            res.data.siteLoanInfo.data[i].borrowType = "个人信贷"
                                        } else if (res.data.siteLoanInfo.data[i].borrowType == 2) {
                                            res.data.siteLoanInfo.data[i].borrowType = "个人抵押"
                                        } else if (res.data.siteLoanInfo.data[i].borrowType == 3) {
                                            res.data.siteLoanInfo.data[i].borrowType = "企业信贷"
                                        } else {
                                            res.data.siteLoanInfo.data[i].borrowType = "企业抵押"
                                        }
                                        if (res.data.siteLoanInfo.data[i].borrowState == 0) {
                                            res.data.siteLoanInfo.data[i].borrowState = "未知"
                                        } else if (res.data.siteLoanInfo.data[i].borrowState == 1) {
                                            res.data.siteLoanInfo.data[i].borrowState = "拒贷"
                                        } else if (res.data.siteLoanInfo.data[i].borrowState == 2) {
                                            res.data.siteLoanInfo.data[i].borrowState = "批贷已放款"
                                        } else if (res.data.siteLoanInfo.data[i].borrowState == 3) {
                                            res.data.siteLoanInfo.data[i].borrowState = "批贷未放款"
                                        } else if (res.data.siteLoanInfo.data[i].borrowState == 4) {
                                            res.data.siteLoanInfo.data[i].borrowState = "借款人放弃申请"
                                        } else if (res.data.siteLoanInfo.data[i].borrowState == 5) {
                                            res.data.siteLoanInfo.data[i].borrowState = "审核中"
                                        } else {
                                            res.data.siteLoanInfo.data[i].borrowState = "待放款"
                                        }
                                        if (res.data.siteLoanInfo.data[i].repayState == 0) {
                                            res.data.siteLoanInfo.data[i].repayState = "未知"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 1) {
                                            res.data.siteLoanInfo.data[i].repayState = "正常"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 2) {
                                            res.data.siteLoanInfo.data[i].repayState = "M1"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 3) {
                                            res.data.siteLoanInfo.data[i].repayState = "M2"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 4) {
                                            res.data.siteLoanInfo.data[i].repayState = "M3"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 5) {
                                            res.data.siteLoanInfo.data[i].repayState = "M4"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 6) {
                                            res.data.siteLoanInfo.data[i].repayState = "M5"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 7) {
                                            res.data.siteLoanInfo.data[i].repayState = "M6"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 8) {
                                            res.data.siteLoanInfo.data[i].repayState = "M6+"
                                        } else if (res.data.siteLoanInfo.data[i].repayState == 9) {
                                            res.data.siteLoanInfo.data[i].repayState = "已还清"
                                        } else {
                                            res.data.siteLoanInfo.data[i].repayState = "未知"
                                        }
                                        
                                        res.data.siteLoanInfo.data[i].borrowAmount = parseInt(res.data.siteLoanInfo.data[i].borrowAmount);
                                        if (res.data.siteLoanInfo.data[i].borrowAmount == -7) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "0~1000";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == -6) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "1000~2000";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == -5) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "2000~3000";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == -4) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "3000~4000";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == -3) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "4000~6000";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == -2) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "6000~8000";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == -1) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "8000~10000";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == 0) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "未知";
                                        } else if (res.data.siteLoanInfo.data[i].borrowAmount == 1) {
                                            res.data.siteLoanInfo.data[i].borrowAmount = "1~2万";
                                        } else {
                                            res.data.siteLoanInfo.data[i].borrowAmount = res.data.siteLoanInfo.data[i].borrowAmount * 2 - 2 + "~" + res.data.siteLoanInfo.data[i].borrowAmount * 2 + "万";
                                        }
                                        
                                        html += '<tr>' +
                                            '<td class="bg-color-lGreen text-center" colspan="4"><span class="icon icon-number">' + (parseInt(i) + 1) + '</span></td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">借贷类型</td>' +
                                            '<td>' + res.data.siteLoanInfo.data[i].borrowType + '</td>' +
                                            '<td class="title">借款日期</td>' +
                                            '<td>' + formatDate(res.data.siteLoanInfo.data[i].contractDate) + '</td>' +
                                            '</tr>';
                                        
                                        html += '<tr>' +
                                            '<td class="title">借款状态</td>' +
                                            '<td>' + res.data.siteLoanInfo.data[i].borrowState + '</td>' +
                                            '<td class="title">借款金额</td>' +
                                            '<td>' + res.data.siteLoanInfo.data[i].borrowAmount + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">借款期数</td>' +
                                            '<td>' + res.data.siteLoanInfo.data[i].loanPeriod + '</td>' +
                                            '<td class="title">当前还款状态</td>' +
                                            '<td>' + res.data.siteLoanInfo.data[i].repayState + '</td>' +
                                            '</tr>';
                                        
                                        html += '<tr>' +
                                            '<td class="title">欠款金额</td>' +
                                            '<td>' + (res.data.siteLoanInfo.data[i].arrearsAmount / 100000) + '</td>' +
                                            '<td class="title">数据反馈商</td>' +
                                            '<td>' + res.data.siteLoanInfo.data[i].companyCode + '</td>' +
                                            '</tr>';
                                        
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="4" class="text-center">暂无信息</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            //犯罪在逃信息查询
                            if (res.data.message) {
                                html += '<p class="sky-title text-center m-t-2">犯罪在逃信息</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2">';
                                html += '<tr>' +
                                    '<td class="title">姓名</td>' +
                                    '<td>' + res.realName + '</td>' +
                                    '<td class="title">身份证号</td>' +
                                    '<td>' + res.idCard + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="bg-color-lGreen color-red text-center" colspan="4">' + res.data.message + '</td>' +
                                    '</tr>' +
                                    '</table></div>' +
                                    '<table class="text-left m-t-2">' +
                                    '<tr>' +
                                    '<td class="title">案件时间</td>' +
                                    '<td class="title">案件类型</td>' +
                                    '<td class="title">案件类型描述</td>' +
                                    '</tr>';
                                if (res.data.length != 0) {
                                    for (var i = 0; i < res.data.length; i++) {
                                        html += '<tr>' +
                                            '<td>' + res.data[i].caseTime + '</td>' +
                                            '<td>' + res.data[i].caseType + '</td>' +
                                            '<td>' + res.data[i].caseSource + '</td>' +
                                            '</tr>' +
                                            '</table>' +
                                            '</div>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td>暂无数据</td>' +
                                        '</tr>' +
                                        '</table>' +
                                        '</div>';
                                }
                                html += '</div>';
                            }
                            //地址信息
                            if (res.data.addressData) {
                                html += '<p class="sky-title text-center m-t-2">地址信息</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2">';
                                if (res.data.addressData.length != 0) {
                                    for (var i in res.data.addressData) {
                                        html += '<tr>' +
                                            '<td class="title">地址类型</td>' +
                                            '<td><span class="icon-orange icon">居</span>居住地址</td>' +
                                            '<td class="title">数据获取年份</td>' +
                                            '<td></td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">地址位置</td>' +
                                            '<td colspan="3">' + res.data.addressData[i].homeAddress + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">地址类型</td>' +
                                            '<td><span class="icon-green icon">工</span>工作地址</td> ' +
                                            '<td class="title">数据获取年份</td>' +
                                            '<td></td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">地址位置</td>' +
                                            '<td colspan="3">' + res.data.addressData[i].companyAddress + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td colspan="4" class="text-center">暂无数据</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            //银行卡画像
                            if (res.data.unionDataInfo) {
                                html += '<p class="sky-title text-center m-t-2">银行卡画像</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">';
                                if (res.data.unionDataInfo.assetIndex != "" || res.data.unionDataInfo.tradingBehaviour != "" || res.data.unionDataInfo.creditTrading != "" ||
                                    res.data.unionDataInfo.consumeCategory != "" || res.data.unionDataInfo.consumeCity != "" || res.data.unionDataInfo.monthConsumption != "") {
                                    html += '<table class="table m-t-2"><tr>' +
                                        '<td colspan="4" class="bg-color-lGreen text-center title">基础信息</td>' +
                                        '</tr>';
                                    if (res.data.unionDataInfo.assetIndex != "" && res.data.unionDataInfo.assetIndex != null) {
                                        html += '<tr>' +
                                            '<td class="title">是否有房</td>' +
                                            '<td>' + (res.data.unionDataInfo.assetIndex.hasRoom == true ? "有" : "无") + '</td>' +
                                            '<td class="title">是否有车</td>' +
                                            '<td>' + (res.data.unionDataInfo.assetIndex.hasCar == true ? "有" : "无") + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">房产预估购买时间</td>' +
                                            '<td>' + res.data.unionDataInfo.assetIndex.roomBuyTime + '</td>' +
                                            '<td class="title">轿车预估购买时间</td>' +
                                            '<td>' + res.data.unionDataInfo.assetIndex.carBuyTime + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">房产预估价格</td>' +
                                            '<td>' + res.data.unionDataInfo.assetIndex.roomValue + '</td>' +
                                            '<td class="title">轿车预估价格</td>' +
                                            '<td>' + res.data.unionDataInfo.assetIndex.carValue + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">还款区间</td>' +
                                            '<td colspan="3">' + res.data.unionDataInfo.assetIndex.repaymentAbility + '</td>' +
                                            '</tr>';
                                    } else {
                                        html += '<tr>' +
                                            '<td colspan="4" class="text-center">暂无数据</td>' +
                                            '</tr>';
                                    }
                                    if (res.data.unionDataInfo.tradingBehaviour != "" && res.data.unionDataInfo.tradingBehaviour != null) {
                                        html += '<tr>' +
                                            '<td colspan="4" class="bg-color-lGreen text-center title"> 交易行为特征</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">有无出差</td>' +
                                            '<td>' + (res.data.unionDataInfo.tradingBehaviour.travelConsumption == "true" ? "有" : "无") + '</td>' +
                                            '<td class="title">有无婚庆消费</td>' +
                                            '<td>' + (res.data.unionDataInfo.tradingBehaviour.weddingConsumption == "true" ? "有" : "无") + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">是否就业状态</td>' +
                                            '<td>' + (res.data.unionDataInfo.tradingBehaviour.employed == "true" ? "是" : "否") + '</td>' +
                                            '<td class="title">常住城市</td>' +
                                            '<td>' + res.data.unionDataInfo.tradingBehaviour.city + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">有无母婴/教育投资</td>' +
                                            '<td>' + (res.data.unionDataInfo.tradingBehaviour.childInvest == "true" ? "有" : "无") + '</td>' +
                                            '<td class="title">有无夜消费</td>' +
                                            '<td>' + (res.data.unionDataInfo.tradingBehaviour.nightConsumption == "true" ? "有" : "无") + '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td class="title">工作时间消费区</td>' +
                                            '<td>' + res.data.unionDataInfo.tradingBehaviour.workingTimeConsumption + '</td>' +
                                            '<td class="title">非工作时间消费区</td>' +
                                            '<td>' + res.data.unionDataInfo.tradingBehaviour.noWorkingTimeConsumption + '</td>' +
                                            '</tr>';
                                    }
                                    html += '</table>';
                                    
                                    html += '<table class="table m-t-2"><tr>' +
                                        '<td colspan="5" class="bg-color-lGreen text-center title">月消费统计</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">月份</td>' +
                                        '<td class="title">消费笔数</td>' +
                                        '<td class="title">消费金额</td>' +
                                        '<td class="title">笔数本市排名</td>' +
                                        '<td class="title">金额本市排名</td>' +
                                        '</tr>';
                                    if (res.data.unionDataInfo.monthConsumption != "" && res.data.unionDataInfo.monthConsumption != null) {
                                        for (var i in res.data.unionDataInfo.monthConsumption) {
                                            html += '<tr>' +
                                                '<td>' + res.data.unionDataInfo.monthConsumption[i].month + '</td>' +
                                                '<td>' + res.data.unionDataInfo.monthConsumption[i].totalComsumptionTimes + '</td>' +
                                                '<td>' + res.data.unionDataInfo.monthConsumption[i].totalAmount + '</td>' +
                                                '<td>' + res.data.unionDataInfo.monthConsumption[i].consumptionTimesRanking + '</td>' +
                                                '<td>' + res.data.unionDataInfo.monthConsumption[i].consumptionAmountRanking + '</td>' +
                                                '</tr>';
                                        }
                                    } else {
                                        html += '<tr>' +
                                            '<td colspan="5" class="text-center">暂无数据</td>' +
                                            '</tr>';
                                    }
                                    html += '</table>' +
                                        '<table class="table td-3 m-t-2"><tr>' +
                                        '<td colspan="3" class="bg-color-lGreen text-center title">地域消费统计</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">地域</td>' +
                                        '<td class="title">消费笔数</td>' +
                                        '<td class="title">消费金额</td>' +
                                        '</tr>';
                                    if (res.data.unionDataInfo.consumeCity != "" && res.data.unionDataInfo.consumeCity != null) {
                                        for (var i in res.data.unionDataInfo.consumeCity) {
                                            html += '<tr>' +
                                                '<td>' + res.data.unionDataInfo.consumeCity[i].city + '</td>' +
                                                '<td>' + res.data.unionDataInfo.consumeCity[i].consumptionTimes + '</td>' +
                                                '<td>' + res.data.unionDataInfo.consumeCity[i].consumptionAmount + '</td>' +
                                                '</tr>';
                                        }
                                    } else {
                                        html += '<tr>' +
                                            '<td colspan="3" class="text-center">暂无数据</td>' +
                                            '</tr>';
                                    }
                                    html += '<tr>' +
                                        '<td colspan="3" class="bg-color-lGreen text-center title">类别消费统计</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">类别</td>' +
                                        '<td class="title">消费笔数</td>' +
                                        '<td class="title">消费金额</td>' +
                                        '</tr>';
                                    if (res.data.unionDataInfo.consumeCategory != "") {
                                        for (var i in res.data.unionDataInfo.consumeCategory) {
                                            html += '<tr>' +
                                                '<td>' + res.data.unionDataInfo.consumeCategory[i].categoryName + '</td>' +
                                                '<td>' + res.data.unionDataInfo.consumeCategory[i].consumptionTimes + '</td>' +
                                                '<td>' + res.data.unionDataInfo.consumeCategory[i].consumptionAmount + '</td>' +
                                                '</tr>';
                                        }
                                    } else {
                                        html += '<tr>' +
                                            '<td colspan="3" class="text-center">暂无数据</td>' +
                                            '</tr>';
                                    }
                                    html += '<tr>' +
                                        '<td colspan="3" class="bg-color-lGreen text-center title">信用消费统计</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="title">类别</td>' +
                                        '<td class="title">消费笔数</td>' +
                                        '<td class="title">消费金额</td>' +
                                        '</tr>';
                                    if (res.data.unionDataInfo.creditTrading != "" && res.data.unionDataInfo.creditTrading != null) {
                                        for (var i in res.data.unionDataInfo.creditTrading) {
                                            html += '<tr>' +
                                                '<td>' + res.data.unionDataInfo.creditTrading[i].name + '</td>' +
                                                '<td>' + res.data.unionDataInfo.creditTrading[i].consumptionTimes + '</td>' +
                                                '<td>' + res.data.unionDataInfo.creditTrading[i].consumptionAmount + '</td>' +
                                                '</tr>';
                                        }
                                    } else {
                                        html += '<tr>' +
                                            '<td colspan="3" class="text-center">暂无数据</td>' +
                                            '</tr>';
                                    }
                                    html += '</table>';
                                } else {
                                    html += '<table class="table m-t-2"><tr>' +
                                        '<td class="bg-color-lGreen text-center title"> 基础信息</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="text-center">暂未查到相关数据</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="bg-color-lGreen text-center title">月消费统计</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="text-center">暂未查到相关数据</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="bg-color-lGreen text-center title">地域消费统计</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td class="text-center">暂无查到相关数据</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            //银行卡查询记录
                            if (res.data.siteOtherBankLog) {
                                html += '<p class="sky-title text-center m-t-2">银行卡查询记录</p>' +
                                    '<div class="stretch-box">' +
                                    '<div class="tabBox">' +
                                    '<table class="table m-t-2">';
                                html += '<tr>' +
                                    '<td class="title">银行卡号</td>' +
                                    '<td colspan="3">' + res.bankCard + '</td>' +
                                    '</tr>';
                                html += '<tr class="bg-color-lGreen">' +
                                    '<th>其他银行卡号</th>' +
                                    '<th>被查询时间</th>' +
                                    '</tr>';
                                if (res.data.siteOtherBankLog.datas != "") {
                                    for (var i in res.data.siteOtherBankLog.datas) {
                                        html += '<tr>' +
                                            '<td>' + res.data.siteOtherBankLog.datas[i].bankNo + '</td>' +
                                            '<td>' + res.data.siteOtherBankLog.datas[i].searchTime + '</td>' +
                                            '</tr>';
                                    }
                                } else {
                                    html += '<tr>' +
                                        '<td class="text-center" colspan="2">暂无信息</td>' +
                                        '</tr>';
                                }
                                html += '</table></div></div>';
                            }
                            html += '</div>';
                        } else if (res.apiComparedStatusEnum == "DIFFERENT") {
                            html = '<p class="sky-title text-center">身份证照片查询</p>' +
                                '<div class="box">' +
                                '<div class="queryFails text-center m-t-2">' +
                                '<img src="img/icon_fails.png" class="img-responsive center-block">' +
                                '<p class="text color-red">验证结果：信息验证结果不一致！</p></div></div>';
                        } else {
                            html = '<p class="sky-title text-center">身份证照片查询</p>' +
                                '<div class="box">' +
                                '<div class="queryFails text-center m-t-2">' +
                                '<img src="img/icon_fails.png" class="img-responsive center-block">' +
                                '<p class="text color-red">验证结果：暂无相关信息</p></div></div>';
                        }
                    } else {
                        sky.msg(res.retMsg);
                    }
                    win("报告记录", html);
                } catch (e) {
                    sky.msg("发生异常：" + e);
                }
                
            },
            error: function (xhr, type) {
                sky.lodingClose();
                sky.msg("服务器连接错误！");
            }
        });
    }
    return {
        isMobile: isMobile,
        msg: msg,
        loding: loding,
        lodingClose: lodingClose,
        authorize: authorize, //授权说明
        urgeMoneyRecord: urgeMoneyRecord, //逾期记录
        loanRecord: loanRecord, //P2P借款记录
        addressInfo: addressInfo, //地址信息
        courtInfo: courtInfo, //法院信息
        criminalInfo: criminalInfo, //犯罪在逃信息
        companyInfo: companyInfo, //工商信息
        folkLoanRecord: folkLoanRecord, //小贷记录统计
        identityRecord: identityRecord, //身份查询记录
        idCardQueryRecord: idCardQueryRecord, //身份证照片
        memberInfo: memberInfo, //同住址成员信息
        phoneSearchRecord: phoneSearchRecord, //手机实名查询记录
        phoneDate: phoneDate, //手机使用时间查询
        overdueInfoRecord: overdueInfoRecord, //逾期详细信息记录
        overdueRecord: overdueRecord, //逾期记录
        bankCardQuery: bankCardQuery, //银行卡查询记录
        bankDataCompared: bankDataCompared, //银行三要素四要素数据比对
        bankAnalysis: bankAnalysis, //银行卡画像
        newBankAnalysis: newBankAnalysis, //银行卡画像
        payPrompt: payPrompt, //支付提示
        payWeChat: payWeChat, //微信支付弹窗
        loginPrompt: loginPrompt, //企业用户登录
        permitPrompt: permitPrompt, //用户权限不足提示
        login: login, //登录
        forgetPwd: forgetPwd, //忘记密码
        phoneRealName: phoneRealName, //手机实名验证
        promptWin: promptWin, //提示弹窗
        report: report, //报告弹窗
        quit: quit, //退出
        declare: declare, //免责声明
        rechargeTips: rechargeTips, //充值提示
        antiFraudA: antiFraudA, //反欺诈A类
        antiFraudB: antiFraudB, //反欺诈B类
        financeInvestment: financeInvestment, //个人对外投资
        miguan: miguan, //蜜罐数据,
        idCardRealName: idCardRealName, //身份证两要素,
        notice: notice
    };
})();