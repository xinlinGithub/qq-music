
// 请求歌词
(function($, root) {
    // 专门负责向服务器请求歌词 请求到了之后就赋值给全局的player对象；
    function getLrc(fn, paramsData) {
        $.ajax({
            type: "GET",
            url: "../mock/lrc.json",
            success: function (data) {
                // 请求完歌词以后再让其他功能执行
                root.lrcs = data;
                fn(paramsData);
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
    root.getLrc = getLrc;
    
})(window.Zepto, window.player || (window.player = {}));