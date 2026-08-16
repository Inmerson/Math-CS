#!/usr/bin/env bash
set -euo pipefail

ROOT=/tmp/readshift-build
rm -rf "$ROOT"
mkdir -p "$ROOT/app/src/main/java/com/readshift/app" "$ROOT/app/src/main/assets"

cat > "$ROOT/settings.gradle" <<'EOF'
pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
rootProject.name = 'ReadShift'
include ':app'
EOF

cat > "$ROOT/build.gradle" <<'EOF'
plugins {
    id 'com.android.application' version '8.7.3' apply false
}
EOF

cat > "$ROOT/app/build.gradle" <<'EOF'
plugins { id 'com.android.application' }
android {
    namespace 'com.readshift.app'
    compileSdk 35
    defaultConfig {
        applicationId 'com.readshift.app'
        minSdk 24
        targetSdk 35
        versionCode 1
        versionName '1.0.0'
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}
EOF

touch "$ROOT/app/proguard-rules.pro"
cat > "$ROOT/app/src/main/AndroidManifest.xml" <<'EOF'
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.VIBRATE" />
    <application android:allowBackup="true" android:hardwareAccelerated="true" android:label="ReadShift" android:supportsRtl="true" android:theme="@android:style/Theme.Material.NoActionBar">
        <activity android:name=".MainActivity" android:exported="true" android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

cat > "$ROOT/app/src/main/java/com/readshift/app/MainActivity.java" <<'EOF'
package com.readshift.app;
import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
public class MainActivity extends Activity {
    private WebView webView;
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(11,10,18));
        getWindow().setNavigationBarColor(Color.rgb(11,10,18));
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        webView.setWebViewClient(new WebViewClient());
        webView.setBackgroundColor(Color.rgb(11,10,18));
        webView.addJavascriptInterface(new NativeBridge(this), "ReadShiftNative");
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }
    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed();
    }
    static class NativeBridge {
        private final Context context;
        NativeBridge(Context context) { this.context = context; }
        @JavascriptInterface public void haptic() {
            Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator == null) return;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) vibrator.vibrate(VibrationEffect.createOneShot(18, VibrationEffect.DEFAULT_AMPLITUDE));
            else vibrator.vibrate(18);
        }
    }
}
EOF

cp readshift-ci/index.html "$ROOT/app/src/main/assets/index.html"
if command -v sdkmanager >/dev/null 2>&1; then
    yes | sdkmanager --licenses >/dev/null 2>&1 || true
    sdkmanager "platforms;android-35" "build-tools;35.0.0" >/dev/null 2>&1 || true
fi
chmod +x android/gradlew
android/gradlew -p "$ROOT" assembleDebug --no-daemon --stacktrace
APK="$ROOT/app/build/outputs/apk/debug/app-debug.apk"
test -s "$APK"
echo "READSHIFT_APK_SIZE=$(stat -c%s "$APK")"
echo "READSHIFT_APK_SHA256=$(sha256sum "$APK" | cut -d' ' -f1)"

npm install --no-save --ignore-scripts @actions/artifact@2.3.2 >/dev/null
node <<'NODE'
const { DefaultArtifactClient } = require('@actions/artifact');
(async () => {
  const client = new DefaultArtifactClient();
  const result = await client.uploadArtifact(
    'ReadShift-APK',
    ['/tmp/readshift-build/app/build/outputs/apk/debug/app-debug.apk'],
    '/tmp/readshift-build'
  );
  console.log(`READSHIFT_ARTIFACT_ID=${result.id}`);
  console.log(`READSHIFT_ARTIFACT_SIZE=${result.size}`);
})().catch(err => { console.error(err); process.exit(1); });
NODE
