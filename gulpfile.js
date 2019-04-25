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
  scss: 'src/scss/**/*.scss',
  image: 'src/images/**/*',
  js: 'src/js/**/*.js',
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
    .pipe(browserSync.stream());
}

function image() {
  return src(path.image)
    .pipe(imagemin([]))
    .pipe(dest('dist/imgs'))
    .pipe(browserSync.stream());
}

function js() {
  return src(path.js, { sourcemaps: true })
    .pipe(plumber())
    .pipe(concat('app.min.js'))
    .pipe(dest('dist/js', { sourcemaps: true }))
    .pipe(browserSync.stream());
}

function server() {
  browserSync.init({
    server: './dist'
  })
}

function watchFiles() {
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

  watch([path.image], function(cb) {
    image();
    cb();
  });

  watch(['./dist/**/*.html'], function(cb) {
    browserSync.reload()
    cb();
  });
}

const build = parallel(html, css, js, image);

exports.build = build;
exports.watchFiles = watchFiles;
exports.server = server;
exports.default = series(
  build,
  parallel(server, watchFiles)
);
