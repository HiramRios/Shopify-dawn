const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const del = require('del');

const fs = require('fs'),
  path = require('path'),
  readline = require('readline');

gulp.task('clean', () => {
  return del([
    'assets/main.css.liquid'
  ]);
});

gulp.task('remove-css', () => {
  return del([
    'assets/main.css'
  ]);
});

gulp.task('styles', () => {
  return gulp.src('stylesheets/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('stylesheets/'));
});
gulp.task('legacystyles1', () => {
  return gulp.src('assets/style_4.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('assets/'));
});
gulp.task('legacystyles2', () => {
  return gulp.src('assets/gift-card.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('assets/'));
});

gulp.task('rename', ()=>{
  return gulp.src("stylesheets/main.css")
    .pipe(rename("main.css.liquid"))
    .pipe(gulp.dest("assets/"));
});

// call the generate task to set up new directory and files ex: gulp generate -d 'sections/pdp-hero'
gulp.task('generate', () => {
  if(process.argv[4] == undefined){
    console.error('no directory specified...');
    return;
  }
  let dir = `${process.argv[4]}/`;
  fs.readFile('stylesheets/main.scss', function(err,data){
    if (err) {
      return console.log(err);
    }
    var result = data.toString().replace('/* mobile */', `/* mobile */\n@import \'${dir}mobile.scss\';`)
      .replace('/* tablet */', `/* tablet */\n\t@import '${dir}tablet.scss';`)
      .replace('/* desktop */', `/* desktop */\n\t@import '${dir}desktop.scss';`)

    fs.writeFile('stylesheets/main.scss', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
  return gulp.src('stylesheets/generate/mobile.scss')
    .pipe(gulp.dest(`stylesheets/${dir}`))
    .pipe(gulp.src('stylesheets/generate/tablet.scss'))
    .pipe(gulp.dest(`stylesheets/${dir}`))
    .pipe(gulp.src('stylesheets/generate/desktop.scss'))
    .pipe(gulp.dest(`stylesheets/${dir}`));
});

gulp.task('default', gulp.series(['clean', 'styles', 'rename']));