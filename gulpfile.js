var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    // watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    del = require('del'),
    wait = require('gulp-wait'),
    changed = require('gulp-changed'),
    sequence = require('run-sequence'),
    browserSync = require('browser-sync').create();

const path = {
    build: {
        root: 'build/',
        html: 'build/',
        css: 'build/css/',
        js: 'build/js/',
        img: 'build/images/',
        fonts: 'build/fonts/',
        assets: 'build/external/'
    },
    src: {
        pug: 'src/templates/**/*.pug',
        sass: 'src/sass/**/*.scss',
        js: 'src/js/*.js',
        img: 'src/images/**/*',
        fonts: 'src/fonts/**/*',
        assets: 'src/external/**/*',
    },
    watch: {
        pug: 'src/templates/**/*.pug',
        sass: 'src/sass/**/*.scss',
        js: 'src/js/*.js',
        img: 'src/images/**/*',
        fonts: 'src/fonts/**/*',
        assets: 'src/external/**/*'
    }
};

function swallowError(error) {
    console.log(error.toString())
    this.emit('end')
}


// SERVER
gulp.task('server', ['style:build'], () => {
    // browserSync.create();
    browserSync.init({
        notify: false,
        server: './build',
        open: 'local',
        ui: false
    });
    // gulp.watch(path.watch.pug, ['html:build']);
    gulp.watch(path.watch.sass, ['style:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
    gulp.watch(path.watch.fonts, ['font:build']);
    gulp.watch(path.watch.assets, ['asset:build']);
    // gulp.watch('build/*.html').on('change', browserSync.reload);
});


gulp.task('clean', () => {
    return del('./build');
});

gulp.task('clear-cache', () => {
    return cache.clearAll();
});

// HTML
gulp.task('html:build', () => {
    return gulp
        .src(path.watch.pug)
        .pipe(pug({
            pretty: true
        }))
        .on('error', swallowError)
        // .pipe(changed(path.build.html))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('style:build', () => {
    var processors = [
        autoprefixer({ browsers: ['last 15 versions'] })
    ];
    return gulp
        .src('src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(wait(100))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .on('error', sass.logError)
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

// JS
gulp.task('js:build', () => {
    return gulp
        .src(path.src.js)
        .on('error', swallowError)
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

// IMAGES
gulp.task('image:build', () => {
    return gulp
        .src('src/images/**/*.*')
        .pipe(cache(imagemin({
            use: [pngquant({ quality: '75' })]
        })))
        .on('error', swallowError)
        .pipe(changed(path.build.img))
        .pipe(gulp.dest(path.build.img))
});

// FONTS
gulp.task('font:build', () => {
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

// Assets
gulp.task('asset:build', () => {
    return gulp
        .src(path.src.assets)
        .pipe(gulp.dest(path.build.assets))
});

gulp.task('default', ['html:build', 'js:build', 'image:build', 'font:build', 'asset:build', 'server'], function() {
    gulp.watch(path.watch.pug, ['html:build']).on('change', browserSync.reload);
    // gulp.watch(path.watch.sass, ['style:build']).on('change', browserSync.reload);
    // gulp.watch(path.watch.js, ['js:build']).on('change', browserSync.reload);
    // gulp.watch(path.watch.img, ['image:build']).on('change', browserSync.reload);
    // gulp.watch(path.watch.fonts, ['font:build']).on('change', browserSync.reload);
    // gulp.watch(path.watch.assets, ['asset:build']).on('change', browserSync.reload);
});
