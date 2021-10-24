const gulp = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));

// Tasks

// CSS - SASS
gulp.task('sass', () =>
	gulp
		.src('./src/sass/styles.sass')
		.pipe(
			sass({
				outputStyle: 'compressed',
			})
		)
		.pipe(gulp.dest('./public/css'))
);

// JavaScript || Babel
gulp.task('babel', () =>
	gulp
		.src('./src/app.js')
		.pipe(concat('bundle.js'))
		.pipe(babel())
		.pipe(terser())
		.pipe(gulp.dest('./public/js'))
);

// Defaul task
gulp.task('default', () => {
	gulp.watch('./src/sass/**/*.sass', gulp.series('sass'));
	gulp.watch('./src/app.js', gulp.series('babel'));
});
