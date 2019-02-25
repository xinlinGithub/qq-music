var $ = window.Zepto;
var $scope = $(document.body);
// 拿到全局的功能对象
var root = window.player;
// 单独的一个对象 切换歌曲时去操作歌曲对应的index值
var controlmanager;
var audio;
// 当向双击放大时会阻止这个变化 防止300ms延迟的出现
$(function() {    
    FastClick.attach(document.body);    
}); 
function bandEvent(data) {
    // 自定义事件 切换歌曲时直接触发自定义事件 单独抽离出来 代码更整洁
    // 相当于订阅事件
    $scope.on('play:change',function(event,index,flag){
        // controlmanager = new root.controlManager(data.length);
        // 更新歌曲资源 更新时会进行相关初始化操作
        audio.setAudioSource(data[index].audio);
        $scope.find('.song-img').removeClass('turn');
        // 点击歌曲列表 切换歌曲时 或 切换歌曲时此歌曲正在播放 切换歌曲后就让他继续播放
        if(audio.status === 'play' || flag == true){
            audio.play();
            // 进度条重新开始动
            root.processer.start(0);
            setTimeout(function(){
                $scope.find('.song-img').addClass('turn');
                // 设置animation动画的状态 让图片重新转动
                $scope.find('.turn').css({
                    animationPlayState : 'running'
                })
            },20)
        }
        root.rander(data[index]);//渲染对应歌曲信息
        root.processer.randerAllTime(data[index]);//渲染对应歌曲总时间
        root.processer.upDate(0);// 把进度条初始为0
        root.playList.randerColor(index);//渲染歌曲列表中此歌曲的颜色
    });
    $scope.on('click','.pre-btn',function(){
        var index = controlmanager.pre();
        // 触发自定义事件 改变歌曲索引 换到上一首
        // 相当于发布事件
        $scope.trigger('play:change',index);
    });
    $scope.on('click','.next-btn',function(){
        var index = controlmanager.next();
        $scope.trigger('play:change',index);
    });
    $scope.on('click','.play-btn',function(){
        if(audio.status === 'play'){//点击时歌曲播放则暂停
            audio.pause();
            $scope.find('.turn').css({//图片停止转动
                animationPlayState : 'paused'
            })
            root.processer.stop();//进度条停止运动
        }else{
            audio.play();
            $scope.find('.song-img').addClass('turn');
            $scope.find('.turn').css({
                animationPlayState : 'running'
            })
            root.processer.start();
        }
        // 有次类名就删除 没有就添加
        $(this).toggleClass('playing');
    })
    // 展示或隐藏在底部的歌曲列表
    $scope.on('click','.list-btn',function(){
        $scope.find('.play-list').addClass('show');
    })
    $scope.on('click','.close-btn',function(){
        $scope.find('.play-list').removeClass('show');
    })
}
function bindTouch(data) {
    function restart(precent) {
        root.processer.start(precent);
        // 更新时间 让当前音乐在当前时间播放
        var time = precent * data[controlmanager.index].duration
        audio.jumpToPlay(time);
        $scope.find('.play-btn').toggleClass('playing');
    }
    // 开始拖拽时 要先暂停进度条 再让歌曲暂停播放
    $scope.find('.pro-pointer').on('touchstart',function(){
        if(audio.status === 'play'){
            root.processer.stop();
            audio.pause();
            $scope.find('.play-btn').toggleClass('playing');
        }
    }).on('touchmove',function(e){
        // 移动时要让进度条跟着动 所以要获取他移动过程距离最左侧的距离
        // 减去进度条起点距最左侧距离
        var clientX = e.changedTouches[0].clientX;
        var offset = $scope.find('.pro').offset();
        var left = offset.left;
        var width = offset.width;
        var precent = (clientX - left) / width;
        // 兼容性处理 防止拖到外面去
        if(precent < 0 || precent >1){
            precent = 0;
        }
        root.processer.upDate(precent);        
    }).on('touchend',function(e){
        var clientX = e.changedTouches[0].clientX;
        var offset = $scope.find('.pro').offset();
        var left = offset.left;
        var width = offset.width;
        var precent = (clientX - left) / width;
        if(precent < 0 || precent >1){
            precent = 0;
        }
        // 拖拽结束后 要重新开始音乐 且进度条运动
        restart(precent);
    })

    // 点击进度槽 让进度条直接跳转到指定位置
    $scope.find(".pro").on("click",function (e) {
        var clientX = e.clientX;
        var left = this.offsetLeft;
        var width = this.offsetWidth;
        var precent = (clientX - left) / width;
        if(precent < 0 || precent >1){
            precent = 0;
        }
        // 点击进度槽后 要重新开始音乐 且进度条运动
        restart(precent);
    })
}
function requestSuccess (data) {
    // 请求假数据成功后 把歌曲总数传进去 用来切换歌曲 
    controlmanager = new root.controlManager(data.length);
    // 处理每首歌的播放和暂停的  用h5 的audio
    audio = new root.audioManage();
    // 绑定底部按钮点击事件
    bandEvent(data);
    bindTouch(data);
    // 渲染底部列表
    root.playList.randerList(data);
    // 监听底部列表的点击事件
    root.playList.listBindEvent(controlmanager);
    // 触发自定义事件 默认唱第一首歌
    $scope.trigger('play:change',0);
    console.log(data[0]);
}
function getData(url) {
    $.ajax({
        type : "GET",
        url : url,
        success : function(data){
            root.getLrc(requestSuccess, data)
        },
        error : function () {
            console.log("error")
        }
    })
}
// 这个也是在数据库中去拿 这里直接写到本地
getData("../mock/data.json")