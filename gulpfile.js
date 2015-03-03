var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
// FTP
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');

var buildPath = 'build';



/******************************
 * Default task
 ******************************/
gulp.task('default', [
	'browser-sync',
	'deploy',
	'watch'
]);

/******************************
 * Build task
 ******************************/
gulp.task('build', [
	'less-min',
]);

/******************************
 * Deploy task
 ******************************/
gulp.task('deploy', function () {
	gulp.run('less');
	setTimeout(function () {
		gulp.run('ftp');
	}, 500)
});

/******************************
 * FTP task
 ******************************/
gulp.task('ftp', function () {
	return gulp.src([
		'css/style.css',
		'css/style.css.map'
	])
		.pipe(ftp({
			host: '89.111.179.80',
			user: 'less@u2957646.cpnl.hc.ru',
			pass: '6-)E%J%kGcst'
		}))
	// you need to have some kind of stream after gulp-ftp to make sure it's flushed
	// this can be a gulp plugin, gulp.dest, or any kind of stream
	// here we use a passthrough stream
	.pipe(gutil.noop());
});


/******************************
 * Browser sync
 ******************************/
gulp.task('browser-sync', function () {
	var files = [
		'css/*.css'
	];

	browserSync.init(files, {
		proxy: "http://natd.wickedblog.ru/?page_id=16",
		open: false
	});
});

/******************************
 * Watch
 ******************************/
gulp.task('watch', function () {
	gulp.watch('less/*.less', ['deploy']);
});

/******************************
 * Less
 ******************************/
gulp.task('less', function () {
	gulp.src('less/style.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 20 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('css'));
});

/******************************
 * Less min
 ******************************/
gulp.task('less-min', function () {
	gulp.src('less/style.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(minifyCSS({
			keepBreaks: false,
			keepSpecialComments: true,
			benchmark: false,
			debug: true
		}))
		.pipe(gulp.dest('css'));
});
