(function($,root){
    var $scope = $(document.body);
    // 渲染图片
    function randerImages(src) {
        var img = new Image();
        img.onload = function(){
            // 高斯模糊处理图片 处理高斯模糊图片 1为图片 2为图片所在元素；
            // 直接把模糊之后的图片 放到body背景上
            root.blurImg(img, $scope); 
            // 把真实的图片 放到歌曲页面中
            $scope.find('.song-img img').attr("src",src);
        }
        img.src = src;  
    }
    // 渲染歌曲信息
    function randerInfor(data) {//动态渲染歌曲的基本信息
        var html = '<div class="song-name">'+ data.song+'</div>'+
        '<div class="singer-name">'+ data.singer+'</div>'+
        '<div class="album-name">'+ data.album+'</div>';
        $scope.find('.song-infor').html(html);
    }
    // 看是否喜欢 如果想操作是否喜欢的话得从数据库中拿到数据后 复制一份 进行更改 更改完了以后再写入数据库
    // 下次打开时还是这样 这里由于是假数据 就不模拟了
    function randerIsLike(isLike) {
        // 会事先增加一个标记喜欢的class类名 单击后直接操作此类名
        if(isLike){
            $scope.find('.like-btn').addClass('liking')
        }else{
            $scope.find('.like-btn').removeClass('liking')
        }
    }
    root.rander = function(data) {
        randerImages(data.image);
        randerInfor(data);
        randerIsLike(data.isLike);
    }
}(window.Zepto,window.player || (window.player = {})))