#!/usr/bin/env bash
set -euo pipefail

rm -rf /tmp/readshift-build
mkdir -p /tmp/readshift-build
unzip -q ReadShift-source.zip -d /tmp/readshift-build

chmod +x android/gradlew

if command -v sdkmanager >/dev/null 2>&1; then
  yes | sdkmanager --licenses >/dev/null 2>&1 || true
  sdkmanager "platforms;android-35" "build-tools;35.0.0" >/dev/null 2>&1 || true
fi

./android/gradlew -p /tmp/readshift-build assembleDebug --no-daemon --stacktrace

APK=/tmp/readshift-build/app/build/outputs/apk/debug/app-debug.apk
test -f "$APK"

echo "READSHIFT_APK_SIZE=$(stat -c%s "$APK")"
echo "READSHIFT_APK_SHA256=$(sha256sum "$APK" | cut -d' ' -f1)"
echo "READSHIFT_APK_BASE64_BEGIN"
base64 -w 76 "$APK"
echo "READSHIFT_APK_BASE64_END"
