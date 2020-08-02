const gulp = require('gulp'); //подключение GULP
const uglify = require('gulp-uglify'); // минифицирование js файлов
const concat = require('gulp-concat'); // склеивает файлы
const minifyCss = require('gulp-minify-css'); // минифицирование css файлов
const imagemin = require('gulp-imagemin'); // оптимизация изображений
const clean = require('gulp-clean'); //удаляет файл или папку
const shell = require('gulp-shell'); // оболочка для последовательной отработки тасков
const browserSync = require('browser-sync'); // сервер
const reload = browserSync.reload; // перезагрузка сервера
// const watch = require('gulp-watch'); // следит за изменениями в указанных файлах
const runSequence = require('run-sequence'); // запускает задачи по очереди

const path = {
    src: {
        html: 'app/index.html',
        styles: [
            'app/css/vendors/*.css',
            'app/css/fonts.css',
            'app/css/style.css'
        ],
        js: [
            'app/js/libs/*.js', // *.js - означает взять ВСЕ файлы с расширением .js | /**/*.js собрать все файлы идущие после этой папки (независимо от вложенности)
            'app/js/bootstrap.js'
        ],
        fonts: ['app/fonts/**/*'],
        images: 'app/images/**/*'
    },
    build: {
        html: 'build/',
        styles: 'build/css/',
        js: 'build/js/',
        fonts: 'build/fonts/',
        images: 'build/images/'
    }
};


gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
});

gulp.task('css', function() {
    return gulp.src(path.src.styles)
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(path.build.styles))
        .pipe(reload({stream: true}))
});

gulp.task('html', function() {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
});

gulp.task('fonts', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('images', function (){
    return gulp.src(path.src.images)
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ], {
        verbose: true
    }))
    .pipe(gulp.dest(path.build.images))
});

gulp.task('clean', function (){
    return gulp.src('build').pipe(clean());
});

gulp.task('build', shell.task([
    'gulp clean',
    'gulp images',
    'gulp html',
    'gulp fonts',
    'gulp css',
    'gulp js'
]));

gulp.task('browser-sync', function () {
    browserSync({
        startPath: '/',
        server: {
            baseDir: 'build'
        },
        notify: false
    })
});


// GULP v3 -------------------------------------------
// gulp.task('server', function () {
   // runSequence
//     gulp.series('build', 'browser-sync', 'watch');
// });
// ---------------------------------------------------

gulp.task('watch', function () {
    gulp.watch('app/*.html', gulp.parallel ('html'));
    gulp.watch('app/css/**/*.css', gulp.parallel ('css'));
    gulp.watch('app/js/**/*.js', gulp.parallel ('js'));
});

gulp.task('server', gulp.series('build', gulp.parallel('browser-sync', 'watch'), function () {}));


// GULP v3 ---------------------------
// gulp.task('watch', function () {
//     gulp.watch('app/*.html', ['html']);
//     gulp.watch('app/css/**/*.css', css);
//     gulp.watch('app/js/**/*.js', js);
// });
// -----------------------------------

gulp.task('default', gulp.series('server'), function () {});
