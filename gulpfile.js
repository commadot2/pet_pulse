// первое, что нужно сделать - сказать, что gulp будет использовать 
// тот или иной пакет это можно сделать, импортировав кусочки этого
//  пакета внутрь этого файла иначе говоря, можно представить, что
// из всех пакетов, что установлены в проекте, собираем один большой файл настройки


const gulp        = require("gulp");
const browserSync = require("browser-sync");
const sass        = require("gulp-sass")(require("sass"));
const rename      = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleancss    = require("gulp-clean-css");

// "server" значит то название, которое мы даем задаче
gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });
});

gulp.task("styles", function () {
    return gulp.src("src/sass/**/*.+(scss|sass)") // получаем все файлы по указанному критерию
        // внутри pipe процесс, что мы хотим выполнять
        // в нашем случае это sass()
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError)) 
        // переименовать styles.css в styles.min.css, так как мы его закомпресили
        .pipe(rename({
            prefix: "",
            suffix: ".min"
        }))
        // поставить автопрефиксы
        .pipe(autoprefixer())
        .pipe(cleancss({compatibility: 'ie8'}))
    // положить по нужному адресу то, что получилось
        .pipe(gulp.dest("src/css"))
    // после компиляции заново запускать browsersync
        .pipe(browserSync.stream());
})

gulp.task("watch", function () {
    // в кавычках пишется путь к файлу, а вторым аргументом будет то, что нужно делать после его изменений
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel("styles"));
    // на каждый change выполнять встроенную функцию с browserSync
    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/js/*.js").on("change", browserSync.reload);
});

// "default" - зарезервированное имя той задачи, что запускается по умолчанию через команду "gulp"
gulp.task("default", gulp.parallel("watch", "server", "styles"));


// что бы запустить и проверить работает ли, нужно написать "gulp". 
// Если какую-то специфическую, то gulp <task_name>