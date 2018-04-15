
$(function () {
    $(".tabs-nav li").click(function () {
        var e=$(this);
        var p=e.parent();
        if(e.hasClass("result")){
            p.find(".record").removeClass("active");
            e.addClass("active");
            $("#result").css("display","block");
            $("#record").css("display","none");
            return;
        }
        p.find(".result").removeClass("active");
        e.addClass("active");
        $("#record").css("display","block");
        $("#result").css("display","none");
    });
    $(".nav-left .title").click(function () {
        var t=$(this);
        var ul=t.parent();
        if(ul.hasClass("fold")){
            ul.removeClass("fold");
            ul.animate({
                height:ul.find("li").length*40+"px"
            },300);
        }else {
            ul.addClass("fold");
            ul.animate({
                height:"40px"
            },300);
        }
    });
    $(".nav-left li").hover(function () {
        var t=$(this);
        if(!t.hasClass("active")){
            t.addClass("hover");
        }
    },function () {
        var t=$(this);
        t.removeClass("hover");
    });
    /*
     *锚点点击跳转
     */
    $(".options-box .anchor").click(function () {
        var href = $(this).attr("href");
        var pos = $(href).offset().top;
        $("body").animate({ scrollTop: pos+$("body").scrollTop() +"px"}, 400);
    });
})
function sucPrompt() {
    //查询成功提示并打开结果Tabs
    sky.msg("查询成功！");
    var tabs=$(".tabs");
    var nav=tabs.find(".tabs-nav");
    if(!nav.find(".result").hasClass("active")){
        nav.find(".record").removeClass("active");
        nav.find(".result").addClass("active");
        tabs.find("#result").css("display","block");
        tabs.find("#record").css("display","none");
    }
}