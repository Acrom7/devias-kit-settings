const {series, parallel, dest, src, watch} = require('gulp')
const browserify = require('browserify')
const tsify = require('tsify')
const browserSync = require('browser-sync').create()
const source = require('vinyl-source-stream')
const fancy_log = require('fancy-log')
const pug = require('gulp-pug')
const del = require('del')

const paths = {
	pugEntry: './src/views/index.pug',
	tsEntry: 'src/main.ts',
	publicDir: './dist',
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
	})

	watch('src/*.ts').on('change', series(bundleJs, browserSync.reload))
	watch('src/views/*.pug').on('change', series(buildPug, browserSync.reload))
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

function clean() {
	return del(`${paths.publicDir}/*`)
}

exports.build = series(clean, parallel(bundleJs, buildPug))
exports.default = series(exports.build, serve)

