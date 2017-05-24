'use strict';
var server          = require('gulp-server-livereload'), // Webserver
    gulp            = require('gulp'), // Сообственно Gulp JS
    jade            = require('gulp-jade'), // Плагин для Jade
    sass            = require('gulp-sass'), // Плагин для Sass
    csso            = require('gulp-csso'), // Минификация CSS
    imagemin        = require('gulp-imagemin'), // Минификация изображений
    pngquant        = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache           = require('gulp-cache'), // Подключаем библиотеку кеширования
    uglify          = require('gulp-uglify'), // Минификация JS
    concat          = require('gulp-concat'), // Склейка файлов
    gulp_livereload = require('gulp-livereload'), // Перезагрузка
    autoprefixer    = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    rename          = require('gulp-rename'); // Подключаем библиотеку для переименования файлов



// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src('./build/img/**/*')
        // .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
        //     interlaced: true,
        //     progressive: true,
        //     svgoPlugins: [{removeViewBox: false}],
        //     use: [pngquant()]
        // })))
        .pipe(imagemin()) // Минимизируем изображения
        .pipe(gulp.dest('./public/img')); // Записываем собранные файлы
});


// Собираем Sass
gulp.task('sass', function() {
    gulp.src('./build/sass/style.scss')
        .pipe(sass({outputStyle: 'compressed'})) // собираем sass
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('./public/css/')); // Записываем собранные файлы
    gulp.run('images');
});


// Собираем html из Jade
gulp.task('jade', function() {
    gulp.src(['./build/*.jade', '!./build/_*.jade']) // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .pipe(jade({pretty: true}))  // pretty что бы html не склеивался
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(gulp.dest('./public/')); // Записываем собранные файлы
}); 


// Собираем JS
gulp.task('js', function() {
    gulp.src(['./build/js/**/*.js', '!./build/js/vendor/**/*.js'])
        .pipe(concat('main.js')) // Собираем все JS, кроме тех которые находятся в ./build/js/vendor/**
        .pipe(uglify()) // Минификация JS
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('./public/js')); // Записываем собранные файлы
}); 


// Веб сервер
gulp.task('webserver', function() {
  gulp.src('./public/')
    .pipe(server({
		// host: '0.0.0.0',
		// defaultFile: 'index.html',
		// directoryListing: false,
		// open: true,
		livereload: {
			enable: true,
			port: 35729
		}
    }));
});



// Запуск сервера разработки gulp watch
gulp.task('start', function() {
    // Запуск сервера
    gulp.run('webserver');

    // Слежение за файлами сборки
    gulp.watch('./build/sass/**/*.scss', function() {
    	// gulp.run('images');
        gulp.run('sass');
    });
    gulp.watch('./build/**/*.jade', function() {
    	// gulp.run('images');
        gulp.run('jade');
    });
    gulp.watch('./build/js/**/*', function() {
        gulp.run('js');
    });

    // Слежение за файлами публикации
    gulp.watch('./public/css/**/*.css', function() {
    	gulp_livereload();
    });
    gulp.watch('./public/**/*.html', function() {
    	gulp_livereload();
    });
    gulp.watch('./public/js/**/*', function() {
    	gulp_livereload();
    });
});