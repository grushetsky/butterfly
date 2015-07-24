var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var path = require('path')
var del = require('del')
var mocha = require('gulp-mocha')

var options = {}

var paths = {
  build: 'build',
  watch: ['core/**/*.js', 'spec/**/*-spec.js', 'mock/**/*.json', 'mock/**/*.js'],
  babel: ['core/**/*.js', 'dev/**/*.js'],
  spec: 'spec/**/*-spec.js'
}

gulp.task('build', function () {
  return gulp.src(paths.babel)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build))
})

gulp.task('watch', function () {
  gulp.watch(paths.watch, ['test'])
})

gulp.task('clean', function () {
  del.sync([paths.build])
})

gulp.task('test', function () {
  return gulp.src(paths.spec)
    .pipe(mocha({
      compilers: {
        js: require('babel/register')
      },
      reporter: 'spec'
    }))
})

gulp.task('default', ['test', 'watch'])
