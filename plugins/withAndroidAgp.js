const { withProjectBuildGradle } = require('expo/config-plugins');

const ANDROID_GRADLE_PLUGIN_VERSION = '8.9.1';

/**
 * Config plugin for EAS Build: pins Android Gradle Plugin to 8.9.1+ so that
 * androidx.core:core-ktx:1.17.0 (requires compileSdk 36 and AGP 8.9.1) works.
 */
function withAndroidAgp(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;

    let contents = config.modResults.contents;

    // Pin AGP version (replace unresolved classpath with explicit version)
    contents = contents.replace(
      /classpath\s*\(\s*['"]com\.android\.tools\.build:gradle['"]\s*\)/,
      `classpath 'com.android.tools.build:gradle:${ANDROID_GRADLE_PLUGIN_VERSION}'`
    );

    // Ensure ext.compileSdkVersion, ext.minSdkVersion, ext.targetSdkVersion are set from gradle.properties
    // before expo-root-project runs (so androidx.core 1.17.0 requirements are met)
    const extBlock = `
          // Apply android.* from gradle.properties before expo-root-project (for compileSdk 36, minSdk 25, etc.)
          def minSdkProp = findProperty('android.minSdkVersion')
          if (minSdkProp != null) { 
            ext.minSdkVersion = Integer.parseInt(minSdkProp.toString()) 
          } else {
            ext.minSdkVersion = 25
          }
          def compileSdkProp = findProperty('android.compileSdkVersion')
          if (compileSdkProp != null) { 
            ext.compileSdkVersion = Integer.parseInt(compileSdkProp.toString()) 
          } else {
            ext.compileSdkVersion = 36
          }
          def targetSdkProp = findProperty('android.targetSdkVersion')
          if (targetSdkProp != null) { 
            ext.targetSdkVersion = Integer.parseInt(targetSdkProp.toString()) 
          } else {
            ext.targetSdkVersion = 35
          }
        `;

    if (!contents.includes('Apply android.* from gradle.properties')) {
      contents = contents.replace(
        /(\s*apply plugin:\s*["']expo-root-project["'])/,
        `${extBlock}$1`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withAndroidAgp;
