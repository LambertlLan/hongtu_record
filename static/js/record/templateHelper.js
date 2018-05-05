/**
 * Created by Lambert.
 * User: landingyu@163.com
 * Date: 2018/4/25
 * Time: 15:09
 *
 */
template.helper("percent", function (k) {
    return (k * 100).toFixed(2)
});
template.helper("toLocalDate", function (date) {
    if (date) {
        return new Date(date).toLocaleDateString()
    } else {
        return "无"
    }
    
});

template.helper("fomateDateTime", function (val) {
    if (val != null) {
        var date = new Date(val);
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
});
template.helper("trueOrFalse", function (key) {
    if (key === 0) {
        return "是"
    }else if(key === null){
        return "未知"
    }
    else {
        return "否"
    }
    
});
template.helper("cheng", function (v) {
    return v * 2
});
template.helper("nu", function (v) {
    if (v){
        return v
    }else{
        return "无"
    }
    
    
});