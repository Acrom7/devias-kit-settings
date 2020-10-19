const {series, parallel, dest, src, watch} = require('gulp')
const browserify = require('browserify')
const tsify = require('tsify')
const browserSync = require('browser-sync').create()
const source = require('vinyl-source-stream')
const fancy_log = require('fancy-log')
const pug = require('gulp-pug')
const del = require('del')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

const paths = {
	pugEntry: './src/views/index.pug',
	tsEntry: 'src/main.ts',
	sassEntry: 'src/sass/styles.sass',
	publicDir: './dist',
	assets: 'src/assets',
}

const browserifyInstance = browserify({
	basedir: '.',
	debug: true,
	entries: [paths.tsEntry],
	plugin: [tsify],
})

function serve() {
	browserSync.init({
		server: {
			baseDir: paths.publicDir,
		},
		open: false,
		notify: false,
	})

	watch('src/*.ts').on('change', series(bundleJs, browserSync.reload))
	watch('src/views/*.pug').on('change', series(buildPug, browserSync.reload))
	watch('src/sass/**/*.sass').on('change', buildSass)
}

function buildPug() {
	return src(paths.pugEntry)
	.pipe(pug({
		compileDebug: true,
	}))
	.pipe(dest(paths.publicDir))
}

function bundleJs() {
	return browserifyInstance
	.bundle()
	.on('error', fancy_log)
	.pipe(source('bundle.js'))
	.pipe(dest(paths.publicDir))
}

function buildSass() {
	return src(paths.sassEntry)
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(dest(paths.publicDir))
	.pipe(browserSync.stream())
}

function copyAssets() {
	return src(paths.assets + '/*').pipe(dest(paths.publicDir + '/assets'))
}

function clean() {
	return del(`${paths.publicDir}/*`)
}

exports.build = series(clean, parallel(bundleJs, buildPug, buildSass, copyAssets))
exports.default = series(exports.build, serve)

