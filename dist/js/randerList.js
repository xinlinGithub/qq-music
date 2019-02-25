(function($,root){
    var $scope = $(document.body);
    var len;
    // 动态渲染歌曲列表
    function randerList(songList) {
        len = songList.length;
        conManage = new root.controlManager(len);
        var $playList = $('<div class = "play-list">'+
            '<div class = "list">播放列表</div>'+
            '<ul class = "list-wrapper"></ul>'+
            '<div class = "close-btn">关闭</div>'+
        '</div>');
        $scope.append($playList);
        var html = '';
        for(var i = 0; i < songList.length; i++) {
            html += '<li><h3>'+songList[i].song+'</h3><span>-'+songList[i].singer+'</span>'+'</li>'
        }
        $scope.find('.list-wrapper').html(html);
    }
    // 为正在播放的歌曲添加一个标志颜色
    function randerColor(index) {
        for(var i = 0; i < len; i++){
            // 先为每一个歌曲名去掉播放颜色标志
            $scope.find('.play-list').find('li').eq(i).removeClass('sign')
        }
        // 再给正在播放的歌曲加上标志的class类名
        $('li','.play-list').eq(index).addClass('sign');
    }
    // 监听底部列表的点击事件
    function listBindEvent(col) {
        $('li','.play-list').on('click',function(){
            var index = $(this).index();//获取所点击class的索引
            col.changeIndex(index);//切换歌曲
            $scope.trigger('play:change',[index,true]);// 触发事件 切换后立即播放歌曲
            $('.play-list').removeClass('show');//隐藏底部列表
            $scope.find('.play-btn').addClass('playing');//改变播放按钮
        })
    }
    root.playList = {
        randerList : randerList,
        randerColor : randerColor,
        listBindEvent : listBindEvent
    }
}(window.Zepto, window.player || (window.player = {})))