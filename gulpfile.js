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

function copyBSScripts() {
  return gulp
    .src([
      "./node_modules/bootstrap/dist/js/bootstrap.bundle.js",
      "./node_modules/bootstrap/dist/js/bootstrap.bundle.js.map",
    ])
    .pipe(gulp.dest("dist/"));
}

function watchFiles() {
  gulp.watch("./src/**/*.scss", gulp.series(buildStyles));
}

exports.buildStyles = buildStyles;
exports.copyBSScripts = copyBSScripts;
exports.watch = gulp.series(buildStyles, copyBSScripts, watchFiles);
exports.default = gulp.series(buildStyles, copyBSScripts);
