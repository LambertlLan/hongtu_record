/**
 * Created by Lambert.
 * User: landingyu@163.com
 * Date: 2018/4/19
 * Time: 15:48
 *
 */
baseUrl = "";
urls = {
    getMsgCode:         baseUrl + "/getMsgCode/",       //获取验证码
    checkMsgCode:       baseUrl + "/checkMsgCode/",     //检查验证码
    register:           baseUrl + "/register/",         //注册
    login:              baseUrl + "/login/",            //登录
    logout:             baseUrl + "/logout/",           //注销
    reset_pwd:          baseUrl + "/reset_pwd/",        //忘记密码
    modify_pwd:         baseUrl + "/modify_pwd/",       //修改密码
    recharge:           baseUrl + "/record/recharge/",  //充值
    recharge_record:    baseUrl + "/record/recharge/records/",  //充值记录
    checkTelRealName:   baseUrl + "/record/public_data/check_data/",  //运营商三要素,蜜罐,个人反欺诈报告
    getSearchHistory:   baseUrl + "/record/public_data/history/",  //运营商三要素,蜜罐,个人反欺诈报告 查询记录
    getSearchHistoryInfo:   baseUrl + "/record/public_data/history_info/",  //运营商三要素,蜜罐,个人反欺诈报告 查询 详情
};
services = {

}