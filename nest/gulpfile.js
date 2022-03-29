const gulp = require("gulp");
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const gulpFile = require("gulp-file");
const uglify = require('gulp-uglify-es').default;
const shell = require('shelljs');
const GulpSSH = require('gulp-ssh');
const replace = require('gulp-replace');
const tar = require('gulp-tar');
const ecosystem = require("./ecosystem.config");

require("dotenv").config();

const project = ecosystem.apps[0].name;

if (!process.env[`${ project }_SSH_HOST`] || process.env.SSH_HOST) {
  throw new Error(`SSH_HOST or ${ project }_SSH_HOST environment variable is not set!`);
}

const dist = "../build/nest";
const sshDist = process.env[`${ project }_SSH_DIST`] || process.env.SSH_DIST;
if (!sshDist) {
  throw new Error("SSH_DIST environment variable is not set!");
}

const sshConfig = {
  host: process.env[`${ project }_SSH_HOST`] || process.env.SSH_HOST,
  port: process.env[`${ project }_SSH_PORT`] || process.env.SSH_PORT || 22,
  username: process.env[`${ project }_SSH_USERNAME`] || process.env.SSH_USERNAME,
  password: process.env[`${ project }_SSH_PASSWORD`] || process.env.SSH_PASSWORD,
};

console.log({ ...sshConfig, password: undefined });
console.log(`${ sshDist }${ project }`);

const version = Math.floor((Date.now() - (new Date("2019-06-10 00:00:00")).getTime())/(1000*60)).toString(36).split("").reverse().join("");

const gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig,
});
//----------------------------------------------------------------------------------------------------- nest
gulp.task("nest-config", function() {
  return gulp.src(["package.json", "Dockerfile"], { allowEmpty: true })
    .pipe(gulpFile("index.js", `
    require("source-map-support").install();
    require("./src/main");
    `))
    .pipe(gulp.dest(`${dist}`));
});
gulp.task("nest-ts", function() {
  const nestProject = ts.createProject('tsconfig.build.json', { sourceMap: false, inlineSources: false, inlineSourceMap: false });
  return nestProject.src()
    .pipe(sourcemaps.init())
    .pipe(nestProject()).js
    .pipe(uglify({ toplevel: false }))
    .on('error', function(err) {
      console.error(err);
    })
    .pipe(sourcemaps.write(`./`))
    .pipe(gulp.dest(`${dist}/src`));
});
gulp.task("nest-graphql", function() {
  return gulp.src(["src/**/*.graphql", "src/**/*.xlsx", "src/**/*.js", "src/**/*.js.map"])
    .pipe(gulp.dest(`${dist}/src`));
});
gulp.task("nest-tar", () => {
  return gulp.src(`${dist}/**/*.*`)
    .pipe(tar(`nest.tar`))
    .pipe(gulp.dest(`${dist}/../`));
});
gulp.task("ssh-copy-nest", () => {
  return gulp
    .src([ `${dist}/../nest.tar` ])
    .pipe(gulpSSH.dest(`${sshDist}${project}`));
});
gulp.task("ssh-npm-nest", () => {
  return gulpSSH
    .shell([
      `mkdir ${sshDist}${project}`,
      `cd ${sshDist}${project}`,
      "mkdir nest",
      "tar xvf ./nest.tar -C ./nest",
      "cd ./nest",
      "npm i -g pnpm",
      "pnpm i --prod",
      `pm2 start`,
    ]);
});
gulp.task("nest", gulp.series(
  "nest-config", "nest-ts", "nest-graphql", "nest-tar",
));
gulp.task("nest-ssh", gulp.series(
  "ssh-copy-nest", "ssh-npm-nest",
));
//----------------------------------------------------------------------------------------------------- nest

//----------------------------------------------------------------------------------------------------- pc
gulp.task("pc-vue", async() => {
  shell.cd("../pc");
  const rvObj = shell.exec("npx vite build --emptyOutDir", { silent: true });
  if (rvObj.code !== 0) {
    throw rvObj.stderr;
  }
});
gulp.task("pc-version", () => {
  return gulp.src([`${ dist }/../pc/index.html`])
    .pipe(replace('$__version__$', version))
    .pipe(gulp.dest(`${ dist }/../pc/`));
});
gulp.task("pc-tar", () => {
  return gulp.src(`${dist}/../pc/**/*.*`)
    .pipe(tar(`pc.tar`))
    .pipe(gulp.dest(`${dist}/../`));
});
gulp.task("pc", gulp.series(
  "pc-vue", "pc-version", "pc-tar",
));
gulp.task("ssh-copy-pc", () => {
  return gulp
    .src([`${dist}/../pc.tar`])
    .pipe(gulpSSH.dest(`${sshDist}${project}`));
});
gulp.task("ssh-tar-pc", () => {
  return gulpSSH.shell([
    `cd ${sshDist}${project}`,
    "rm -rf ./pc",
    "mkdir ./pc",
    "tar xvf ./pc.tar -C ./pc",
  ]);
});
gulp.task("pc-ssh", gulp.series(
  "ssh-copy-pc", "ssh-tar-pc",
));
//----------------------------------------------------------------------------------------------------- pc

gulp.task("default", gulp.series("nest", "pc", "nest-ssh", "pc-ssh"));

