#!/usr/bin/env bash
set -euo pipefail
ROOT=/tmp/readshift-build
rm -rf "$ROOT"
mkdir -p "$ROOT/app/src/main/java/com/readshift/app" "$ROOT/app/src/main/assets"
cat > "$ROOT/settings.gradle" <<'EOF'
pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name='ReadShift'
include ':app'
EOF
cat > "$ROOT/build.gradle" <<'EOF'
plugins { id 'com.android.application' version '8.7.3' apply false }
EOF
cat > "$ROOT/app/build.gradle" <<'EOF'
plugins { id 'com.android.application' }
android {
 namespace 'com.readshift.app'
 compileSdk 35
 defaultConfig { applicationId 'com.readshift.app'; minSdk 24; targetSdk 35; versionCode 1; versionName '1.0.0' }
 buildTypes { release { minifyEnabled false; proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro' } }
 compileOptions { sourceCompatibility JavaVersion.VERSION_17; targetCompatibility JavaVersion.VERSION_17 }
}
EOF
touch "$ROOT/app/proguard-rules.pro"
cat > "$ROOT/app/src/main/AndroidManifest.xml" <<'EOF'
<manifest xmlns:android="http://schemas.android.com/apk/res/android"><uses-permission android:name="android.permission.VIBRATE"/><application android:allowBackup="true" android:hardwareAccelerated="true" android:label="ReadShift" android:supportsRtl="true" android:theme="@android:style/Theme.Material.NoActionBar"><activity android:name=".MainActivity" android:exported="true" android:screenOrientation="portrait"><intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter></activity></application></manifest>
EOF
cat > "$ROOT/app/src/main/java/com/readshift/app/MainActivity.java" <<'EOF'
package com.readshift.app;
import android.app.Activity;import android.content.Context;import android.graphics.Color;import android.os.Build;import android.os.Bundle;import android.os.VibrationEffect;import android.os.Vibrator;import android.webkit.JavascriptInterface;import android.webkit.WebSettings;import android.webkit.WebView;import android.webkit.WebViewClient;
public class MainActivity extends Activity {private WebView w;@Override public void onCreate(Bundle b){super.onCreate(b);getWindow().setStatusBarColor(Color.rgb(11,10,18));getWindow().setNavigationBarColor(Color.rgb(11,10,18));w=new WebView(this);WebSettings s=w.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(true);s.setAllowContentAccess(false);s.setSupportZoom(false);w.setWebViewClient(new WebViewClient());w.setBackgroundColor(Color.rgb(11,10,18));w.addJavascriptInterface(new N(this),"ReadShiftNative");setContentView(w);w.loadUrl("file:///android_asset/index.html");}@Override public void onBackPressed(){if(w!=null&&w.canGoBack())w.goBack();else super.onBackPressed();}static class N{private final Context c;N(Context c){this.c=c;}@JavascriptInterface public void haptic(){Vibrator v=(Vibrator)c.getSystemService(Context.VIBRATOR_SERVICE);if(v==null)return;if(Build.VERSION.SDK_INT>=26)v.vibrate(VibrationEffect.createOneShot(18,VibrationEffect.DEFAULT_AMPLITUDE));else v.vibrate(18);}}}
EOF
cp readshift-ci/index.html "$ROOT/app/src/main/assets/index.html"
if command -v sdkmanager >/dev/null 2>&1; then yes | sdkmanager --licenses >/dev/null 2>&1 || true; sdkmanager "platforms;android-35" "build-tools;35.0.0" >/dev/null 2>&1 || true; fi
chmod +x android/gradlew
android/gradlew -p "$ROOT" assembleDebug --no-daemon -q
APK="$ROOT/app/build/outputs/apk/debug/app-debug.apk"
test -s "$APK"
B64=$(base64 -w0 "$APK")
echo "READSHIFT_APK_SIZE=$(stat -c%s "$APK")"
echo "READSHIFT_APK_SHA256=$(sha256sum "$APK" | cut -d' ' -f1)"
echo "READSHIFT_B64_LENGTH=${#B64}"
idx=0
for ((i=0; i<${#B64}; i+=2048)); do printf 'READSHIFT_CHUNK_%02d=%s\n' "$idx" "${B64:i:2048}"; idx=$((idx+1)); done
