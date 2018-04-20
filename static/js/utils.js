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
        alert("不是正确的手机号格式");
        return false;
    } else {
        return true;
    }
    
}

//验证邮箱
function checkEmail(email) {
    let reg = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$");
    return (reg.test(email));
}

//验证中文
function checkChinese(str) {
    let reg = /^[\u4E00-\u9FA5]{1,5}$/;
    return (reg.test(str));
}

//验证验证码
function checkMsgCode(msgCode) {
    let msgCodeLen = msgCode.length;
    let msgCodeType = typeof msgCode;
    if (msgCodeLen === 4 && msgCodeType === "number") {
        return true;
    }
}

// 请求后台获取验证码
function getMsgCode(dom, phoneNumber) {
    if (!checkMobile(phoneNumber)) return false;
    $.get(urls.getMsgCode, {phone: phoneNumber}, function (data) {
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