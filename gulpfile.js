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
const less= require('gulp-less');


var env,
    sourceDir,
    jsSources,
    jsonSources,
    sassSources,
    htmlSources,
    outputDir,
    cssFiles,
    cssPreprocessor,
    dsmURL,   
    sassStyle;
    // set environment development or production
    env='development'
    // path for scss or less files
    sourceDir='./src/';
    // choose css preprocesosr less or scss
    cssPreprocessor='less';
    //output folder for the css
    outputDir='./dist/';
    cssSources=sourceDir+cssPreprocessor; 

    if (cssPreprocessor==='less'){
        dsmURL='https://projects.invisionapp.com/dsm-export/vectorworks-web-team/vectorworks/style-params.less?key=H1dDT-xF7';

    }
    else {
        dsmURL='https://projects.invisionapp.com/dsm-export/vectorworks-web-team/vectorworks/_style-params.scss?key=H1dDT-xF7'
        
    }



// download INVSION DSM FILE
// HTML MINIFICATION
gulp.task('download', function () {
    downloadStream(dsmURL)
    .pipe(rename('dsm.'+cssPreprocessor))
    .pipe(gulp.dest(cssSources)) 
    .on('end',function(){
    if (cssPreprocessor==='scss'){
      gulp.start('sass');    
        }
      else {
        console.log('less');
    }  
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




// SASS INTO CSS THEN AUTOPREFIXING THEN MINIFY
gulp.task('sass', () => {
    return gulp.src(cssSources+'/styles.scss')
        .pipe(sourcemaps.init())        
        .pipe(sass().on('error', sass.logError)) 
        .pipe(shorthand())                 
         .pipe(autoprefixer('last 2 versions'))        
        .pipe(cleanCSS())    
        .pipe(sourcemaps.write('maps/'))                 
        .pipe(gulp.dest(outputDir+'css/'))
        .pipe(reload({ stream: true }))
});


// LESS TASK
gulp.task('less', function () {
    return gulp.src(cssSources+'/styles.less')     
    .pipe(sourcemaps.init()) 
    .pipe(less())
    //.pipe(shorthand())                 
    //.pipe(autoprefixer('last 2 versions'))        
    //.pipe(cleanCSS())    
    .pipe(sourcemaps.write('maps/'))                 
    .pipe(gulp.dest(outputDir+'css/'))
    .pipe(reload({ stream: true }))
  });




// ALL TASKS INTO ONE INIT
// ACTIVATE BUT RUNNING 'GULP' IN THE TERMINAL
gulp.task('default', ['download', 'browser-sync','watch']);
// Create task for gulp deployment
