var Utils = {

    //*************************常用验证函数*********************************
    //验证账号是否为字母或数字
    IsAccount: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^[A-Za-z0-9]{6,24}$/).test($.trim(value));
    },
    //验证银行卡
    IsBankCardNum: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^\d{16}|\d{19}$/).test($.trim(value));
    },
    //验证是否是中文
    IsChineseName: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^([\u4e00-\u9fa5]){2,15}$/).test($.trim(value));
    },
    //判断输入的是否为数字金额
    IsAmount: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^(([0-9]+\.[0-9]{2}))$/).test($.trim(value));
    },
    //邮箱
    IsEmail: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test($.trim(value));
    },
    //判断输入的是否有非法字符
    IsIllegal: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^[^%&',;=?$\x22]+$/).test($.trim(value));
    },
    //验证是否是中国手机号码
    IsMobile: function (value) {
        if(value==null||value==""){
            return false;
        }
        var mobile = (value+"").trim();
        return (/^1[3|5|8|4|7]\d{9}$/).test(mobile);
    },
    //验证码数字字母验证
    IsCode: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^[0-9A-Za-z]{4}$/).test($.trim(value));
    },
    //手机验证码四位数字
    IsPhoneCode: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^[0-9]{4}$/).test($.trim(value));
    },
    //验证字符串是否是二代18位身份证
    IsIdcard: function (value) {
        if(value==null||value==""){
            return false;
        }
        if (this.GetStringTrueLength(value) != 18)
        {
            return false;
        }

        var jqyz = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        var vcode = [ '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' ];

        var jssum = 0;
        for (var i = 0; i < this.GetStringTrueLength(value) - 1; i++)
        {
            jssum += new Number(value[i]) * jqyz[i];
        }

        return (value[17]) == (vcode[jssum % 11]);
    },
    //取得字符串真实长度
    GetStringTrueLength: function (str) {
        return str.replace(/[^\x00-\xff]/g, "xx").length;
    },
    //整数数字
    Isinteger: function (value) {
        if(value==null||value==""){
            return false;
        }
        return (/^[0-9]{1,19}$/).test($.trim(value));
    },
};