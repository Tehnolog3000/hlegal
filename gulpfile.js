const gulp = require('gulp');
const Sass = require('sass');
const gulpSass = require('gulp-sass')(Sass);
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');



const isProduction = true;

const paths = {
  styles: {
    src: 'styles/**/*.{scss,css}',
    dest: 'dist/css'
  },
  scripts: {
    src: 'js/**/*.js',
    dest: 'dist/js'
  },
  images: {
    src: 'images/**/*',
    dest: 'dist/images'
  },
  sprite: {
    src: './sprite.svg',
    dest: 'dist'
  },
  pages: {
    src: ['pages/**/*.html', 'index.html'],
    dest: 'dist'
  }
};

// Compile and minify SCSS
function copyCSS() {
  return gulp.src('styles/**/*.css') // Берем все CSS-файлы
    .pipe(gulp.dest(paths.styles.dest)) // Копируем их в папку dist/css
    .pipe(browserSync.stream());
};

async function styles() {
  const autoprefixer = (await import('gulp-autoprefixer')).default;

  return gulp.src(paths.styles.src)
    .pipe(gulpSass({ outputStyle: 'compressed' }).on('error', gulpSass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions'], // Adjust according to your project requirements
      cascade: false
    }))
    .pipe(gulpIf(isProduction, cleanCSS()))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
}

// Minify JavaScript
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
}

// Copy sprite.svg to dist
function sprite() {
  return gulp.src(paths.sprite.src)
    .pipe(gulp.dest(paths.sprite.dest)); // Copy sprite.svg to dist folder
}

// Optimize images
async function images() {
  const imagemin = (await import('gulp-imagemin')).default;
  return gulp.src(paths.images.src)
    .pipe(gulpIf(isProduction, imagemin())) // Optimize images if in production mode
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
}

// Minify HTML and update paths for CSS files
async function pages() {
  const htmlmin = (await import('gulp-htmlmin')).default;

  return gulp.src(paths.pages.src, { base: './' })
    .pipe(replace(/xlink:href="\.\//g, 'xlink:href="./')) // Fix paths for SVG sprites
    .pipe(replace(/href="(\.\/|\.\.\/)styles\/([^"]+)"/g, (match, prefix, cssFile) => {
      if (prefix === '../') {
        return `href="../css/${cssFile}"`; // Adjust CSS paths for production build
      } else {
        return `href="./css/${cssFile}"`; // Adjust CSS paths for development build
      }
    }))
    .pipe(gulpIf(isProduction, htmlmin({ collapseWhitespace: true }))) // Minify HTML if in production mode
    .pipe(gulp.dest(paths.pages.dest))
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
}

// Watch files for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist' // Путь к папке для сервера
    },
    startPath: '/index.html', // Файл, который открывается по умолчанию
    middleware: [
      function (req, res, next) {
        if (req.url.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css'); // Установка MIME-типа
        }
        next();
      }
    ]
  });

  // Отслеживание изменений
  gulp.watch(paths.styles.src, styles); // SCSS
  gulp.watch(paths.scripts.src, scripts); // JS
  gulp.watch(paths.images.src, images); // Изображения
  gulp.watch(paths.pages.src, pages).on('change', browserSync.reload); // HTML
}



// Define complex tasks
const build = gulp.series(gulp.parallel(styles, scripts, images, sprite, pages, copyCSS)); // Добавили copyCSS
const dev = gulp.series(build, watch); // Development task with watch mode

exports.default = gulp.series(build, watch);
// Deploy task
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
browserSync.init({
  server: {
    baseDir: './dist' // Указывает папку для запуска сервера
  },
  startPath: '/index.html', // Указывает стартовую страницу
});

const deploy = gulp.series(build, 'deploy');

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.sprite = sprite;
exports.pages = pages;
exports.watch = watch;
exports.build = build;
exports.deploy = deploy;
exports.default = dev;
