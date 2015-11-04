var gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    scsslint = require('gulp-scss-lint'),
    minifycss = require('gulp-minify-css'),
    util = require('util'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    gls = require('gulp-live-server');

/* Helper functions */
function throwSassError(sassError) {
    throw new gutil.PluginError({
        plugin: 'sass',
        message: util.format(
            "Sass error: '%s' on line %s of %s",
            sassError.message,
            sassError.line,
            sassError.file
        )
    });
}

gulp.task('help', function() {
    console.log('sass - Generate the min and unminified css from sass');
    console.log('build - Generate css and docs');
    console.log('watch - Watch sass files and generate unminified css');
    console.log('test - Lints Sass');
    console.log('html - Moves html files into build');
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('sasslint', function() {
    var path = (gutil.env.file)? gutil.env.file : '**/*.scss';
    return gulp.src('src/' + path)
        .pipe(scsslint())
        .pipe(scsslint.failReporter());
});

gulp.task('sass', function() {
    return gulp.src('src/**/*.scss')
        .pipe(sass({
            style: 'expanded',
            onError: throwSassError
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('build/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('build/'));
});

gulp.task('babel', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build/'));
});

gulp.task('jslint', function() {
    return gulp.src('src/**/*.js')
      .pipe(eslint({
        useEslintrc: true
      }))
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});

gulp.task('build', ['html', 'sasslint', 'sass', 'babel']);

gulp.task('serve', function() {
    var server = gls.static('build', '8888');
    server.start();
});

gulp.task('watch', function() {
    gulp.watch(['src/*.html', 'src/**/*.scss', 'src/**/*.js'], ['build']);
});

gulp.task('run', ['build', 'serve', 'watch']);

gulp.task('test', ['sasslint']);

gulp.task('default', ['help']);
