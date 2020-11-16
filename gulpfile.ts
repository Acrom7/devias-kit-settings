const {series, parallel, dest, src, watch} = require('gulp')
const browserify = require('browserify')
const tsify = require('tsify')
const browserSync = require('browser-sync').create()
const source = require('vinyl-source-stream')
const fancyLog = require('fancy-log')
const pug = require('gulp-pug')
const del = require('del')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const argv = require('yargs').argv
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const streamify = require('gulp-streamify')
const htmlmin = require('gulp-htmlmin')

const productionEnvironment = argv.production

const paths = {
	pugEntry: './src/index.pug',
	tsEntry: 'src/main.ts',
	sassEntry: 'src/styles.sass',
	publicDir: './dist',
	assets: 'src/assets',
}

const browserifyInstance = browserify({
	basedir: '.',
	debug: !productionEnvironment,
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

	watch('src/**/*.ts').on('change', series(bundleJs, browserSync.reload))
	watch('src/**/*.pug').on('change', series(buildPug, browserSync.reload))
	watch('src/**/*.sass').on('change', buildSass)
	watch('src/assets/**/*').on('change', series(copyAssets, browserSync.reload))
}

function buildPug() {
	return src(paths.pugEntry)
	.pipe(pug({
		compileDebug: true,
	}))
	.pipe(gulpif(productionEnvironment, htmlmin({collapseWhitespace: true})))
	.pipe(dest(paths.publicDir))
}

function bundleJs() {
	return browserifyInstance
	.bundle()
	.on('error', fancyLog)
	.pipe(source('bundle.js'))
	.pipe(gulpif(productionEnvironment, streamify(uglify())))
	.pipe(dest(paths.publicDir))
}

function buildSass() {
	if (productionEnvironment) {
		return src(paths.sassEntry)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(['cover 99.5%']))
		.pipe(cleanCSS())
		.pipe(dest(paths.publicDir))
	}

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
