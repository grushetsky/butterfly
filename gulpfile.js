var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var path = require('path')
var del = require('del')
var mocha = require('gulp-mocha')

var options = {}

var paths = {
  build: 'build',
  es6: ['core/**/*.js', 'spec/**/*-spec.js']
}

gulp.task('babel', function () {
  return gulp.src(paths.es6)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build))
})

gulp.task('watch', function () {
  gulp.watch(paths.es6, ['test'])
})

gulp.task('clean', function () {
  del.sync([paths.build])
})

gulp.task('test', function () {
  return gulp.src('spec/**/*-spec.js')
    .pipe(mocha({
      compilers: {
        js: require('babel/register'),
      },
      reporter: 'spec'
    }))
})

gulp.task('default', ['test', 'watch'])