var fs = require('fs');
var path = require('path');

const ibgBuildGradleExists = () => {
  var target = path.join('plugins', 'instabug-cordova', 'build-extras.gradle');
  return fs.existsSync(target);
};

const readIbgBuildGradle = () => {
  var target = path.join('plugins', 'instabug-cordova', 'build-extras.gradle');
  return fs.readFileSync(target, 'utf-8');
};

const writeIbgBuildGradle = (contents) => {
  var target = path.join('plugins', 'instabug-cordova', 'build-extras.gradle');
  fs.writeFileSync(target, contents);
};

const getAndroidVersion = () => {
  const target = path.join('config.xml');
  let file = fs.readFileSync(target, 'utf-8');
  const androidEngine = file.match(/engine name="android" spec="\^?[1-9]+.[0-9]+.[0-9]+"/g);
  if (androidEngine) {
    const version = androidEngine[0].match(/[1-9]+.[0-9]+.[0-9]+/g);
    if (version) {
      return version[0];
    } else {
      console.log('Instabug: ', 'Error retrieving cordova-android version.');

    }
  } else {
    console.log(
      'Instabug: ',
      'Cordova-android not installed. Skipping android preparation steps.'
    );
  }
};

const isAndroid7 = version => {
  if (version) {
    const major = parseInt(version.split('.')[0]);
    return major >= 7;
  }
};

module.exports = function (ctx) {
  if (ibgBuildGradleExists) {
    let buildGradle = readIbgBuildGradle();
    if (isAndroid7(getAndroidVersion())) {
      buildGradle = buildGradle.replace(
        "manifest.srcFile 'AndroidManifest.xml'",
        "manifest.srcFile 'src/main/AndroidManifest.xml'"
      );
      writeIbgBuildGradle(buildGradle);
    }
  }
};
