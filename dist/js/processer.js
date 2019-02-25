(function($,root){
    var $scope = $(document.body);
    var frameId;// requestAnimationFrame()事件的名称
    var curDuration; // 总时间间隔
    var startTime;//每次开始时间
    var parcentage = 0;//进度条百分比 一开始为0
    // 把总时间换算成分秒的形式
    function formatTime(duration) {
        var duration = Math.round(duration);
        var minite = ('0' + Math.floor(duration / 60)).slice(-2);
        var second = ('0' + duration % 60).slice(-2);
        return minite + ':' + second;
    }
    // 更新进度条百分比
    function upDate(parcent) {
        // 一开始让left为-100%; 随着百分比的增加逐渐移动 知道left为0；
        var proParcent = (parcent - 1) * 100 + '%';
        var parcent = parcent * curDuration;
        var html = formatTime(parcent);
        $scope.find('.pro-top').css({
            transform: 'translateX('+ proParcent+ ')'
        })
        $scope.find('.star-time').html(html);
    }
    function stop() {
        // 每次停止时都要记录一下与起始点距离 占总宽度的百分比；
        var stopTime = new Date().getTime();
        // 每次停止都要加上上次的间隔
        parcentage = parcentage + (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);//清除动画
    }
    // 进度条开始移动
    function start(precent) {
        // 拖拽之后会让进度条再次移动 需要把脱欧拽之后的那个点传进来 从那个点开始移动
        parcentage = precent === undefined ? parcentage : precent;
        // 每次重新开始时都要清除一下上次的 requestAnimationFrame 防止多次触发此动画
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();//开始的时间
        // 相当于一个闭包函数
        function frame() {
            var curTime = new Date().getTime();
            // 补上暂停后的那个点与起始点的间隔
            var parcent = parcentage + (curTime - startTime) / (curDuration * 1000);
            // 由百分比去渲染歌词
            root.randerLrc(parcent);
            if(parcent < 1){
                frameId = requestAnimationFrame(frame);
                upDate(parcent);//百分比一变化就更新视图
            }else{
                cancelAnimationFrame(frameId);
                // 播放完了以后自动切换下一首
                // 也可以监听audio的ended事件
                $scope.find('.next-btn').trigger('click');
            }
        }
        frame();
    }
    // 渲染总时间
    function randerAllTime(data) {
        root.writeLrc(data);
        var duration = data.duration;
        parcentage = 0;
        curDuration = duration;
        var html = formatTime(duration);
        $scope.find('.all-time').html(html);
    };
    root.processer = {
        randerAllTime : randerAllTime,
        start : start,
        stop : stop,
        upDate : upDate
    }
}(window.Zepto,window.player || (window.player = {})))