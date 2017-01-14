let gulp  = require('gulp');
let nodemon    = require('gulp-nodemon');

gulp.task('default', function () {
  return nodemon({
    script: './index.js',
    ext: 'js json',
    legacyWatch: true
  });
});
