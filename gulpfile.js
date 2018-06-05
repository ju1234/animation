const gulp = require('gulp'),
    path = require('path'),
    babel = require('gulp-babel'),
    less = require('gulp-less'),
    browserSync = require('browser-sync').create(),
    fs = require('fs'),
    glob = require('glob'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');


const outputPath = path.resolve(__dirname, './dist/');
const env = process.env.NODE_ENV || 'development',
    isProduction = env === 'production';


console.log('env', process.env.NODE_ENV);


gulp.task('compile:js', () => {
    gulp.src(['src/**/*.js'])
        .pipe(babel({
            presets: ['es2015', 'stage-1'],
            plugins: ['transform-runtime', 'transform-es2015-modules-commonjs']
        }))
        .pipe(browserify())
        .pipe(gulpIf(isProduction, uglify({
            compress: true
        })))
        .pipe(gulp.dest(outputPath));
});

gulp.task('compile:img', () => {
    return gulp.src(['src/**/*.{jpg,jpeg,png,gif}'])
        .pipe(gulp.dest(outputPath));
});

gulp.task('compile:less', () => {
    let processors = [autoprefixer({ browsers: ['Android >= 4', 'ChromeAndroid >= 46', 'iOS >= 8'] })];
    if (isProduction) processors.push(cssnano);
    gulp.src(['src/**/*.less', 'src/**/*.css'])
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(gulp.dest(outputPath));
});

gulp.task('compile:html', () => {
    gulp.src(['src/**/*.html'])
        .pipe(gulpIf(isProduction, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(outputPath));
});


gulp.task('dev', ['default'], () => {
    cataloguesProd('./dist/**/index.html').then(() => {
        browserSync.init({
            server: {
                baseDir: outputPath
            },
            port: 9080,
            startPath: '/routes.html'
        });
        gulp.watch("src/**/*", ['default', browserSync.reload]);
    });
});

gulp.task('default', ['compile:js', 'compile:less', 'compile:html', 'compile:img'],() => {
    cataloguesProd('./dist/**/index.html')
});


function cataloguesProd(pattern) {
    return new Promise(resolve => {
        const html = '<ul>' + glob.sync(pattern).reduce((prev, curr) => {
                const route = path.resolve(__dirname, curr).replace(outputPath, isProduction ? '/animation/dist' :'');
                return prev + `<li><a href="${route}">${route}</a></li>`;
            }, '') + '</ul>';

        fs.writeFile(path.resolve(outputPath, 'routes.html'), html, (err) => {
            if (err) return console.log(err);
            resolve();
        });
    });
}