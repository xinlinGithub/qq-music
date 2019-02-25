(function($,root){
    // 面向对象
    function audioManage() {
        // 创建一个audio对象
        this.audio = new Audio(); 
        this.status = 'pause';
    }
    audioManage.prototype = {
        // 拖拽后继续播放
        jumpToPlay : function (time) {
            // 设置播放器当前播放时间
            this.audio.currentTime = time;
            this.play();
        },
        // 播放
        play : function () {
            this.audio.play();
            this.status = 'play';
        },
        // 暂停
        pause : function(){
            this.audio.pause();
            this.status = 'pause';
        },
        // 播放资源 即指定播放的歌曲
        setAudioSource : function(src){
            this.audio.src = src;
        }
    }
    root.audioManage = audioManage;
}(window.Zepto, window.player || (window.player = {})))