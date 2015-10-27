var gulp = require('gulp');
var Server = require('karma').Server;
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/tktest/tests/my.conf.js',
    singleRun: true,
    autoWatch: false
  }, done).start();
});