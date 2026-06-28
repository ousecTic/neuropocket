#!/usr/bin/env bash
# Smoke test the debug APK on the booted emulator: install, launch, and assert the
# web UI actually rendered (catches white-screens / JS load failures), then check
# logcat for fatal or uncaught JS errors. Captures a screenshot artifact either way.
set -uo pipefail

PKG=com.neuropocket.app
APK=android/app/build/outputs/apk/debug/app-debug.apk

echo "Installing APK..."
adb install -r "$APK"

echo "Launching app..."
adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1 >/dev/null

echo "Waiting for the web UI to render..."
FOUND=
for _ in $(seq 1 40); do
  adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1 || true
  if adb shell cat /sdcard/ui.xml 2>/dev/null | grep -qi "Create"; then
    FOUND=1
    break
  fi
  sleep 3
done

adb exec-out screencap -p > smoke.png 2>/dev/null || true

if [ -z "$FOUND" ]; then
  echo "::error::App did not render expected home-screen content (possible white screen)."
  echo "--- last 120 logcat lines ---"
  adb logcat -d | tail -120 || true
  exit 1
fi

echo "Checking logcat for fatal / uncaught JS errors..."
if adb logcat -d | grep -iE "FATAL EXCEPTION|Uncaught (TypeError|ReferenceError|SyntaxError)"; then
  echo "::error::Fatal or uncaught JS error detected in logcat."
  exit 1
fi

echo "Android smoke test passed."
