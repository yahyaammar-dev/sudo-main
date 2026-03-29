const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { withAppBuildGradle } = require('expo/config-plugins');

const KEYS = [
  'MYAPP_UPLOAD_STORE_FILE',
  'MYAPP_UPLOAD_STORE_PASSWORD',
  'MYAPP_UPLOAD_KEY_ALIAS',
  'MYAPP_UPLOAD_KEY_PASSWORD',
  'VERSION_CODE',
  'VERSION_NAME',
];

function writeGradleProperties(projectRoot, props) {
  const gradlePath = path.join(projectRoot, 'android', 'gradle.properties');
  let contents = '';
  try {
    contents = fs.readFileSync(gradlePath, 'utf8');
  } catch (e) {
    contents = '';
  }

  Object.entries(props).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(contents)) {
      contents = contents.replace(regex, `${key}=${value}`);
    } else {
      if (contents.length && !contents.endsWith('\n')) contents += '\n';
      contents += `${key}=${value}\n`;
    }
  });

  fs.mkdirSync(path.dirname(gradlePath), { recursive: true });
  fs.writeFileSync(gradlePath, contents);
}

function patchAppBuildGradleContents(contents, props) {
  let gradleApp = contents;

  // Fix deprecated space-separated syntax to assignment syntax (handles 0, 1, or multiple = signs)
  gradleApp = gradleApp.replace(/^(\s*)ndkVersion(?:\s*=)*\s*/m, '$1ndkVersion = ');
  gradleApp = gradleApp.replace(/^(\s*)buildToolsVersion(?:\s*=)*\s*/m, '$1buildToolsVersion = ');
  gradleApp = gradleApp.replace(/^(\s*)compileSdk(?:\s*=)*\s*/m, '$1compileSdk = ');
  // NOTE: namespace and applicationId must keep space-separated syntax (no =) for expo CLI parser compatibility
  gradleApp = gradleApp.replace(/^(\s*)namespace(?:\s*=)+\s*/m, '$1namespace ');
  gradleApp = gradleApp.replace(/^(\s*)applicationId(?:\s*=)+\s*/m, '$1applicationId ');
  gradleApp = gradleApp.replace(/^(\s*)minSdkVersion(?:\s*=)*\s*/m, '$1minSdkVersion = ');
  gradleApp = gradleApp.replace(/^(\s*)targetSdkVersion(?:\s*=)*\s*/m, '$1targetSdkVersion = ');
  gradleApp = gradleApp.replace(/^(\s*)versionCode(?:\s*=)*\s*/m, '$1versionCode = ');
  gradleApp = gradleApp.replace(/^(\s*)versionName(?:\s*=)*\s*/m, '$1versionName = ');
  gradleApp = gradleApp.replace(/^(\s*)signingConfig\b(?:\s*=)*\s*/m, '$1signingConfig = ');
  gradleApp = gradleApp.replace(/^(\s*)shrinkResources(?:\s*=)*\s*/m, '$1shrinkResources = ');
  gradleApp = gradleApp.replace(/^(\s*)minifyEnabled(?:\s*=)*\s*/m, '$1minifyEnabled = ');
  gradleApp = gradleApp.replace(/^(\s*)crunchPngs(?:\s*=)*\s*/m, '$1crunchPngs = ');
  gradleApp = gradleApp.replace(/^(\s*)useLegacyPackaging(?:\s*=)*\s*/m, '$1useLegacyPackaging = ');
  gradleApp = gradleApp.replace(/^(\s*)ignoreAssetsPattern(?:\s*=)*\s*/m, '$1ignoreAssetsPattern = ');
  gradleApp = gradleApp.replace(/^(\s*)canBePublished(?:\s*=)*\s*/m, '$1canBePublished = ');
  gradleApp = gradleApp.replace(/^(\s*)buildConfig(?:\s*=)*\s*/m, '$1buildConfig = ');
  gradleApp = gradleApp.replace(/^(\s*)viewBinding(?:\s*=)*\s*/m, '$1viewBinding = ');
  gradleApp = gradleApp.replace(/^(\s*)prefab(?:\s*=)*\s*/m, '$1prefab = ');

  if (props.VERSION_CODE != null) {
    if (/versionCode\s*=\s*\d+/m.test(gradleApp)) {
      gradleApp = gradleApp.replace(/versionCode\s*=\s*\d+/m, `versionCode = ${props.VERSION_CODE}`);
    } else {
      gradleApp = gradleApp.replace(/defaultConfig\s*\{/, `defaultConfig {\n        versionCode = ${props.VERSION_CODE}`);
    }
  }

  if (props.VERSION_NAME != null) {
    if (/versionName\s*=\s*"[^"]+"/m.test(gradleApp)) {
      gradleApp = gradleApp.replace(/versionName\s*=\s*"[^"]+"/m, `versionName = \"${props.VERSION_NAME}\"`);
    } else {
      gradleApp = gradleApp.replace(/defaultConfig\s*\{/, `defaultConfig {\n        versionName = \"${props.VERSION_NAME}\"`);
    }
  }

  // Replace entire signingConfigs block with new structure (release first with conditional)
  const newSigningConfigs = `signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`;

  // Find and replace the entire signingConfigs block
  const scIndex = gradleApp.search(/signingConfigs\s*\{/m);
  if (scIndex !== -1) {
    const openBraceIndex = gradleApp.indexOf('{', scIndex);
    let depth = 0;
    let i = openBraceIndex;
    let endIndex = -1;
    for (; i < gradleApp.length; i++) {
      const ch = gradleApp[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { endIndex = i; break; }
      }
    }
    if (endIndex !== -1) {
      gradleApp = gradleApp.slice(0, scIndex) + newSigningConfigs + gradleApp.slice(endIndex + 1);
    }
  }

  // Fix buildTypes: ensure debug uses signingConfigs.debug and release uses signingConfigs.release
  // Fix debug block - ensure it uses assignment syntax with debug config
  gradleApp = gradleApp.replace(
    /debug\s*\{[^}]*?signingConfig[^}]*?\}/s,
    (match) => match.replace(/signingConfig\s*=?\s*signingConfigs\.[a-z]+/, 'signingConfig = signingConfigs.debug')
  );
  
  // Fix release block - ensure it uses space-separated syntax with release config
  gradleApp = gradleApp.replace(
    /release\s*\{[^}]*?signingConfig[^}]*?\}/s,
    (match) => match.replace(/signingConfig\s*=?\s*signingConfigs\.[a-z]+/, 'signingConfig signingConfigs.release')
  );

  return gradleApp;
}

module.exports = function withEnvToGradle(config) {
  return withAppBuildGradle(config, (c) => {
    const projectRoot = c.modRequest.projectRoot;
    const env = dotenv.config({ path: path.resolve(projectRoot, '.env') }).parsed || {};
    const props = {};

    KEYS.forEach((key) => {
      if (env[key] != null) props[key] = env[key];
    });

    const appJsonPath = path.join(projectRoot, 'app.json');
    let appJson = null;
    try {
      appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    } catch (e) {
      appJson = null;
    }

    let currentVc = null;
    if (props.VERSION_CODE) currentVc = parseInt(props.VERSION_CODE, 10);
    else if (env.VERSION_CODE) currentVc = parseInt(env.VERSION_CODE, 10);
    else if (appJson && appJson.expo && appJson.expo.android && appJson.expo.android.versionCode) currentVc = parseInt(appJson.expo.android.versionCode, 10);
    else {
      try {
        const gp = fs.readFileSync(path.join(projectRoot, 'android', 'gradle.properties'), 'utf8');
        const m = gp.match(/^VERSION_CODE=(\d+)$/m);
        if (m) currentVc = parseInt(m[1], 10);
      } catch (e) {}
    }

    if (currentVc == null) {
      try {
        const appBuild = fs.readFileSync(path.join(projectRoot, 'android', 'app', 'build.gradle'), 'utf8');
        const m = appBuild.match(/versionCode\s+(\d+)/);
        if (m) currentVc = parseInt(m[1], 10);
      } catch (e) {}
    }

    if (currentVc == null || Number.isNaN(currentVc)) currentVc = 10008;

    const newVc = currentVc + 1;

    try {
      if (!appJson) appJson = {};
      if (!appJson.expo) appJson.expo = {};
      if (!appJson.expo.android) appJson.expo.android = {};
      appJson.expo.android.versionCode = newVc;
      // Also sync VERSION_NAME from env or use app.json version
      if (props.VERSION_NAME) {
        appJson.version = props.VERSION_NAME;
      } else if (appJson.expo.version) {
        props.VERSION_NAME = appJson.expo.version;
      }
      fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
    } catch (e) {
      console.warn('withEnvToGradle: failed to update app.json', e);
    }

    props.VERSION_CODE = String(newVc);

    if (Object.keys(props).length > 0) writeGradleProperties(projectRoot, props);

    try {
      const requestedStore = props.MYAPP_UPLOAD_STORE_FILE || env.MYAPP_UPLOAD_STORE_FILE || 'keystore.jks';
      const candidatePaths = [
        path.join(projectRoot, requestedStore),
        path.join(projectRoot, 'android', requestedStore),
        path.isAbsolute(requestedStore) ? requestedStore : path.join(projectRoot, requestedStore),
      ];
      let found = null;
      for (const p of candidatePaths) if (p && fs.existsSync(p)) { found = p; break; }
      if (found) {
        const dest = path.join(projectRoot, 'android', 'app', path.basename(found));
        if (!fs.existsSync(dest) || fs.statSync(found).mtimeMs > fs.statSync(dest).mtimeMs) fs.copyFileSync(found, dest);
        props.MYAPP_UPLOAD_STORE_FILE = path.basename(found);
        writeGradleProperties(projectRoot, { MYAPP_UPLOAD_STORE_FILE: props.MYAPP_UPLOAD_STORE_FILE });
      }
    } catch (e) {
      console.warn('withEnvToGradle: failed to copy keystore into android/app', e);
    }

    try {
      const contents = c.modResults.contents;
      c.modResults.contents = patchAppBuildGradleContents(contents, props);
    } catch (e) {
      console.warn('withEnvToGradle: failed to patch modResults.contents', e);
    }

    return c;
  });
};
