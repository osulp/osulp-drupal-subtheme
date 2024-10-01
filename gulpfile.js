"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var sourcemaps = require("gulp-sourcemaps");

function buildStyles() {
  return gulp
    .src("./src/osulp.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist"));
}

function watchFiles() {
  gulp.watch("./src/**/*.scss", gulp.series(buildStyles));
}

exports.buildStyles = buildStyles;
exports.watch = gulp.series(buildStyles, watchFiles);
exports.default = gulp.series(buildStyles);
