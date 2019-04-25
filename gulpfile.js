const { src, dest, parallel, series, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const sassGlob = require('gulp-sass-glob');
const browserSync = require("browser-sync").create();
const imagemin = require('gulp-imagemin');

const path = {
  pug: 'src/pug/**/*.pug',
  js: 'src/scripts/**/*.js',
  scss: 'src/scss/**/*.scss',
  image: 'src/images/**/*'
}

function html() {
  return src([path.pug, '!**/*_*'])
    .pipe(plumber())
    .pipe(pug({
      basedir: './src/pug'
    }))
    .pipe(dest('dist'))
}

function css() {
  return src(path.scss)
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest('dist'))
}

function image() {
  return src(path.image)
    .pipe(imagemin())
    .pipe(dest('dist/imgs'))
}

function js() {
  return src([path.js, '!**/*_*'], { sourcemaps: true })
    .pipe(plumber())
    .pipe(concat('app.min.js'))
    .pipe(dest('dist/js', { sourcemaps: true }))
}

function server() {
  browserSync.init({
    server: './dist'
  })
}

watch([path.pug], function(cb) {
  html();
  cb();
});

watch([path.scss], function(cb) {
  css();
  cb();
});

watch([path.js], function(cb) {
  js();
  cb();
});

watch(['./dist/**'], function(cb) {
  browserSync.reload({stream: true})
  cb();
});

exports.server = server;
exports.default = series(
  parallel(html, css, js, image),
  server
);
