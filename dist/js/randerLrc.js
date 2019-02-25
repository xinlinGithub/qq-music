(function($,root){
    var $scope = $(document.body);
    var len ;//当前歌词的长度
    var duration;
    var lrcs;// 所有歌曲的歌词
    var lrcsLen;// 所有歌词的总长度
    var arrLrc = [];// 播放歌曲的歌词
    var data;// 传过来的将要播放的歌词信息
    var flag = true;
    // 把歌词加载到页面上
    function writeLrc(songList) {
        data = songList;
        lrcs = root.lrcs;
        lrcsLen = lrcs.length;
        for(var i = 0; i < lrcsLen; i++) {
            if(lrcs[i].id === songList.id) {
                arrLrc = lrcs[i].content;
                break;
            }
        }
        len = arrLrc.length;
        var str = '';//先把歌词添加到dom上
        // 每次切换歌曲后都重新渲染
        for(var i = 0; i < len; i++){
            str += '<li>'+ arrLrc[i][1] +'</li>';
        }
        $scope.find('.lrc').html(str);
        duration = transferTime(arrLrc[len-1][0]);
    }
    // 把时间转化成统一格式
    function transferTime(time) {
        return parseInt(time.split(':')[0]) * 6000 + parseInt(time.split(':')[1].split('.')[0]) * 100 + parseInt(time.split(':')[1].split('.')[1])
    }
    // requestAnimationFrame 每执行一次就检查一下歌词是不是需要更新
    function randerLrc(precent) {
        var allTime = data.duration;//歌曲总时间
        var newTime = Math.round(precent*allTime*100);// 当前歌词播放时间点 转化成100 * s的形式 与歌词对应
        for(var i = 0; i < len; i++){
            // 换成统一的格式
            curTime = transferTime(arrLrc[i][0]);
            var lastTime = 0;
            if(i+1<len){
                lastTime = transferTime(arrLrc[i+1][0]);
            }
            if(newTime >= curTime && newTime < lastTime){
                // 一行歌曲的高度为50px  每唱完一句就让歌词向上移动50px 显示当前歌词
                // 100是初始的y轴移动距离
                var num = 100 - (i+1)*50;
                $scope.find('.lrc').css({
                    transform : 'translateY('+num+'px'+')'
                })
                i - 1 >= 0 ? $scope.find('li','.lrc').eq(i - 1).removeClass('changeColor') : null;
                // 给指定的添加上标记；
                $scope.find('li','.lrc').eq(i).addClass('changeColor')
                return false;
            }else if(newTime >= duration){
                duration = Infinity; //保证结束后 就不让他再多次执行里面这个功能了
                var num = 100 - len*50;
                $scope.find('.lrc').css({
                    transform : 'translateY('+num+'px'+')'
                })
                len - 2 >= 0 ? $scope.find('li','.lrc').eq(len - 2).removeClass('changeColor') : null;
                $scope.find('li','.lrc').eq(len-1).addClass('changeColor');
            }   
        }
    }
    root.randerLrc = randerLrc;
    root.writeLrc = writeLrc;
}(window.Zepto, window.player || (window.player = {})))