(function($,root){
    // 面向对象 减少代码复杂度
    function controlManager(len) {
        this.len = len;
        this.index = 0;
    };
    controlManager.prototype = {
        pre : function () {//上一曲
            return this.getIndex(-1);
        },
        next : function () {//下一曲
            return this.getIndex(1);
        },
        // 获取切换之后的歌曲索引
        getIndex : function (val) {
            var index = this.index;
            var len = this.len;
            // 一个小算法 改变index值
            var curIndex = (index + val + len) % len;
            this.index = curIndex;
            return curIndex;
        },
        changeIndex : function (dex) {
            if(dex !== undefined && dex >= 0 && dex < this.len){
                this.index = dex;
            }
        }
    };
    root.controlManager = controlManager;
}(window.Zepto,window.player || (window.player = {})))