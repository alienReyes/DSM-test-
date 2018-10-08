const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const cache = require('gulp-cache');
const concat = require('gulp-concat');
const downloadStream=require('gulp-download-stream');
const minify = require('gulp-babel-minify');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const wait = require('gulp-wait');
const filter=require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');
const shorthand = require('gulp-shorthand');


var env,
    jsSources,
    jsonSources,
    sassSources,
    htmlSources,
    outputDir,
    cssFiles,
    sassStyle;

    sassSources='./src/scss/';
    outputDir='./dist/'



// download INVSION DSM FILE
// HTML MINIFICATION
gulp.task('download', function () {
    downloadStream("https://projects.invisionapp.com/dsm-export/vectorworks-web-team/vectorworks/_style-params.scss?key=H1dDT-xF7")
    .pipe(rename("dsm.scss"))
    .pipe(gulp.dest("./src/scss/")) 
    .on('end',function(){
      gulp.start('sass');
       console.log("download complete")
    }) 
    
    
});



// BROWSER-SYNC / LIVE RELOADING
gulp.task('browser-sync', () => {
    browserSync.init({
        browser: "google chrome",
        server: {
            baseDir: './dist'
        },
    })
});

// WATCHING FOR FILE CHANGES, THEN RELOADS
gulp.task('watch', ['browser-sync'], () => {   
    gulp.watch('src/scss/**/*.scss',['download'])
    gulp.watch('src/*.html', ['html'])
    gulp.watch('src/scripts/**/*.js', ['scripts'])
   
});

gulp.task('updateDSM', function () {
  // runSequence('download','sass'); 
});


// HTML MINIFICATION
gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'))
        .pipe(reload({ stream: true }))
});



// SASS INTO CSS THEN AUTOPREFIXING THEN MINIFY
gulp.task('sass', () => {
    return gulp.src(sassSources+'/styles.scss')
        .pipe(sourcemaps.init())        
        .pipe(sass().on('error', sass.logError)) 
        .pipe(shorthand())                 
         .pipe(autoprefixer('last 2 versions'))        
        .pipe(cleanCSS())    
        .pipe(sourcemaps.write('maps/'))                 
        .pipe(gulp.dest(outputDir+'css/'))
        .pipe(reload({ stream: true }))
});



// CONCAT ALL JS SCRIPTS INTO ALL.JS // CHANGE SRC PATHS TO REFLECT YOUR SCRIPTS
// ES6 TO ES5 VIA BABEL, THEN MINIFES
gulp.task('scripts', () => {
    gulp.src(['src/scripts/smooth-scroll.js', 'dev/scripts/script.js'])
        .pipe(concat('main.js'))       
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({ stream: true }))
});

// ALL TASKS INTO ONE INIT
// ACTIVATE BUT RUNNING 'GULP' IN THE TERMINAL
gulp.task('default', ['download','html', 'scripts', 'browser-sync','watch']);
// Create task for gulp deployment
