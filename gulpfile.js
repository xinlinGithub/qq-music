// 本模拟qq音乐项目是用的面向对象的思想 将一些方法和属性都放到一个大的对象中
// 然后把这个对象暴露到window上 其余的都以闭包的形式操作 有效的防止了污染全局变量
// 思想有点类似jquery

// 一下是一系列gulp插件 gulp主要的api就四个 gulp.tesk() gulp.src() gulp.dest() gulp.watch()
// 其他的都是靠插件去实现的 3000多个插件 完全够用
var gulp = require("gulp");
// 用于压缩html
var htmlclean = require('gulp-htmlclean');
// 用于压缩图片
var imagemin = require('gulp-imagemin');
// 用于压缩js
var uglify = require("gulp-uglify");
// 用于将多个js文件合并成一个 在本项目中没用 因为本项目比较小 没必要 而是在html中引入来做的
var concat = require("gulp-concat");
// 用于去掉代码中调试的语句如：console.log() debbger
var stripDebug = require("gulp-strip-debug");
// 将js文件压缩到一个js文件上时可以决定他们的压缩顺序 不让默认按首字母排序压缩
var deporder = require("gulp-deporder");
// 解析less语法
var less = require("gulp-less");
// 他是一系列处理css插件的集合 可以更好的使用css 如自动补全前缀 解决了兼容性问题
var postcss = require("gulp-postcss");
// postcss 中一个插件 自动补全前缀
var autoprefixer = require("autoprefixer");
// 压缩css
var cssnano = require("cssnano");
// 连接本地服务器
var connect = require("gulp-connect");
// 判断当前node环境是开发模式 还是生产模式 若是开发模式就不用压缩文件了 
// 因为运行在服务器上的文件是经过gulp处理之后的文件 压缩后如果出错就不好找了
// 所以在这做一步判断
// 这是说明是不是生产模式  如果！就证明是生产模式 需要压缩
var devMode = process.env.NODE_ENV !== "production";
var floder = {
    src : 'src/',// 原来开发的文件夹
    dist : 'dist/'// gulp 处理之后代码存入的文件夹
}
// gulp: text runner 
// 将不同模块的文件读取到特定的文进行流操作 转化成文件流然后
// 每一个任务读取一个模块的文件 生成一个文件流(将文件夹里的多个文件转化成文件流 二进制形式)
// 这样就比较快 以前有个grunt是一个一个文件转化的 比较慢 gulp在这升级了一下
// gulp只有4个api task src  dest watch 
// 只用四个api坑定是不够的 所以gulp给提供了大量的插件供给使用

gulp.task("html",function(){
    // 创建一个任务 将src中的html文件夹下的所有html文件读取到dist的html文件夹下
    var html = gulp.src(floder.src + 'html/*')
                    .pipe(connect.reload())//自动更新页面
        if(!devMode){// 生产模式在让他压缩
            html.pipe(htmlclean())
        }
        // 生成文件流 把文件流到dist文件夹下
        html.pipe(gulp.dest(floder.dist + 'html/'))
})
gulp.task("image",function(){
    var image = gulp.src(floder.src + 'image/*')
                    .pipe(connect.reload())
        if(!devMode){
            image.pipe(imagemin())
        }
        image.pipe(gulp.dest(floder.dist + 'image/'))
})
gulp.task("js",function(){
    var js = gulp.src(floder.src + 'js/*')
                .pipe(connect.reload())
    if(!devMode){
        js.pipe(uglify())
          .pipe(stripDebug())
    }
    js.pipe(gulp.dest(floder.dist + 'js/'))
})
gulp.task("css",function(){
    var css = gulp.src(floder.src + 'css/*')
                    .pipe(connect.reload())
                    .pipe(less())
    // 自动添加前缀
    var options = [autoprefixer()];
    if(!devMode){//压缩css
        options.push(cssnano());
    }
        
    css.pipe(postcss(options))
       .pipe(gulp.dest(floder.dist + 'css/'))
})
//监听 只要一下文件有一个改变 就热更新 就是自动gulp运行服务器
// 这要就不用每次编辑后就gulp运行了 更方便自动运行
gulp.task("watch",function(){
    gulp.watch(floder.src + 'html/*',["html"]);
    gulp.watch(floder.src + 'image/*',["image"]);
    gulp.watch(floder.src + 'js/*',["js"]);
    gulp.watch(floder.src + 'css/*',["css"]);
})
// 启动一个服务器 更好的模拟线上浏览器上的运行
gulp.task("server",function(){
    connect.server({
        port : "8080",//端口号
        livereload : true// 改后页面自动刷新
    });
})
// 直接在命令行输入gulp 直接会执行这些默认的任务 不用单个执行了
// 还可以；有第三个参数 ；是一个函数用来在执行任务时进行额外的操作
gulp.task("default",["html","image","js","css","watch","server"])