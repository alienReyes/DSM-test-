const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const cache = require('gulp-cache');
const concat = require('gulp-concat');

// BROWSER-SYNC / LIVE RELOADING
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
    })
});

// WATCHING FOR FILE CHANGES, THEN RELOADS
gulp.task('watch', ['browser-sync'], () => {
    gulp.watch('src/scss/**/*.scss', ['sass'])
    gulp.watch('src/*.html', reload)
    gulp.watch('src/scripts/**/*.js', ['scripts'])
});

// HTML MINIFICATION
gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public/'))
});



// SASS INTO CSS THEN AUTOPREFIXING THEN MINIFY
gulp.task('sass', () => {
    return gulp.src('src/scss/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css/'))
        .pipe(reload({ stream: true }))
});



// CONCAT ALL JS SCRIPTS INTO ALL.JS // CHANGE SRC PATHS TO REFLECT YOUR SCRIPTS
// ES6 TO ES5 VIA BABEL, THEN MINIFES
gulp.task('scripts', () => {
    gulp.src(['src/scripts/smooth-scroll.js', 'dev/scripts/script.js'])
        .pipe(concat('main.js'))        
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({ stream: true }))
});

// ALL TASKS INTO ONE INIT
// ACTIVATE BUT RUNNING 'GULP' IN THE TERMINAL
gulp.task('default', ['browser-sync', 'html', 'sass', 'scripts', 'watch']);