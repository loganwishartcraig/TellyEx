var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('scripts', function() {
  gulp.src('./source/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    // .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
})

gulp.task('styles', function() {

  gulp.src('./source/css/*.sass')
    .pipe(sass({
      outputStyle: 'compressed', 
      indentedSyntax: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/css'))

})

gulp.task('images', function() {

  gulp.src('./source/images/**')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./public/images'))

})

gulp.task('watch', function() {

  gulp.watch('./source/js/*.js', ['scripts']);
  gulp.watch('./source/css/*.sass', ['styles']);
  gulp.watch('./source/images/*', ['images']);

})

gulp.task('default', ['scripts', 'styles', 'images', 'watch']);