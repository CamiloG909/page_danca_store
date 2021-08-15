/* eslint-disable no-console */
const gulp = require('gulp')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')(require('sass'))
const cleanCss = require('gulp-purgecss')
const cachebust = require('gulp-cache-bust')

// Tasks
// HTML
gulp.task('html-min', () =>
	gulp
		.src('./src/pages/*.html')
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true,
			})
		)
		.pipe(
			cachebust({
				type: 'timestamp',
			})
		)
		.pipe(gulp.dest('./public'))
)

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
)
// Clean CSS (PurgeCSS)
// Only use when finishing styles
gulp.task('clean-css', () =>
	gulp
		.src('./public/css/styles.css')
		.pipe(
			cleanCss({
				content: ['./public/*.html'],
			})
		)
		.pipe(gulp.dest('./public/css'))
)

// JavaScript
gulp.task('babel', () =>
	gulp
		.src('./src/js/**/*.js')
		.pipe(concat('scripts-min.js'))
		.pipe(babel())
		.pipe(terser())
		.pipe(gulp.dest('./public/js'))
)

// Defaul task
gulp.task('default', () => {
	gulp.watch('./src/pages/*.html', gulp.series('html-min'))
	gulp.watch('./src/sass/styles.sass', gulp.series('sass'))
	gulp.watch('./src/js/**/*.js', gulp.series('babel'))
})
