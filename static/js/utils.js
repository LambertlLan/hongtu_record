/**
 * Created by Lambert.
 * User: landingyu@163.com
 * Date: 2018/4/19
 * Time: 15:57
 *
 */
//正则验证手机号
function checkMobile(phoneNum) {
    if (!(/^1[3|4|5|7|8|9][0-9]\d{5,8}$/.test(phoneNum))) {
        alert("不是完整的11位手机号或者正确的手机号前七位");
        return false;
    } else {
        return true;
    }
    
}

//验证验证码
function checkMsgCode(msgCode) {
    msgCodeLen = msgCode.length;
    msgCodeType = typeof msgCode;
    if (msgCodeLen === 4 || msgCodeType === "number") {
        return true;
    }
}

// 请求后台获取验证码
function getMsgCode(dom, phoneNumber) {
    if (!checkMobile(phoneNumber)) return false;
    $.get(urls.getMsgCode, {csrfmiddlewaretoken: csrfmiddlewaretoken, phone: phoneNumber}, function (data) {
        console.log(data);
        //获取完成后进行倒计时
        dom.attr("disabled", true);
        let restTime = 60;
        dom.html(restTime + "s");
        let timer = setInterval(function () {
            if (restTime > 0) {
                restTime--;
                dom.html(restTime + "s");
            } else {
                clearInterval(timer);
                dom.attr("disabled", false);
                dom.html("获取验证码")
            }
        }, 1000)
    })
}