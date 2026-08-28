import os
import sys
import subprocess
import zipfile

print("==========================================")
print("  EPZ GAME TURBO REAL IPA BUILDER v5.0   ")
print("==========================================")

# Step 1: Clean and Create Directories
subprocess.run(["rm", "-rf", "build", ".build"], check=False)
os.makedirs("build/Payload/EPZGameTurbo.app", exist_ok=True)

# Step 2: Get iOS Simulator SDK Path
sdk_path = subprocess.check_output(["xcrun", "--sdk", "iphonesimulator", "--show-sdk-path"]).decode("utf-8").strip()
print("Found SDK Path:", sdk_path)

# Step 3: Compile Swift files with main.swift
swift_files = [
    "EPZGameTurbo/main.swift",
    "EPZGameTurbo/EPZGameTurboApp.swift",
    "EPZGameTurbo/LicenseManager.swift",
    "EPZGameTurbo/SuperTouchPrefs.swift",
    "EPZGameTurbo/SystemMonitor.swift",
    "EPZGameTurbo/LicenseView.swift",
    "EPZGameTurbo/MainDashboardView.swift",
    "EPZGameTurbo/FloatingOverlayView.swift",
    "EPZGameTurbo/SensitivityOverlayView.swift"
]

app_binary = "build/Payload/EPZGameTurbo.app/EPZGameTurbo"

swift_cmd = [
    "swiftc",
    "-sdk", sdk_path,
    "-target", "arm64-apple-ios15.0-simulator",
    "-module-name", "EPZGameTurbo",
] + swift_files + [
    "-o", app_binary
]

print("\n[1/4] Compiling Swift files into Native iOS Binary...")
print("Executing:", " ".join(swift_cmd))

res = subprocess.run(swift_cmd, capture_output=True, text=True)
print("--- STDOUT ---")
print(res.stdout)
print("--- STDERR ---")
print(res.stderr)

if res.returncode != 0 or not os.path.exists(app_binary):
    print("ERROR: Compilation failed with return code", res.returncode)
    sys.exit(res.returncode)

os.chmod(app_binary, 0o755)

# Step 4: Write Info.plist
print("\n[2/4] Creating Info.plist...")
info_plist_path = "build/Payload/EPZGameTurbo.app/Info.plist"
with open(info_plist_path, "w", encoding="utf-8") as f:
    f.write("""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>EPZGameTurbo</string>
    <key>CFBundleIdentifier</key>
    <string>com.epz.gameturbo.ios</string>
    <key>CFBundleName</key>
    <string>EPZ Game Turbo</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.82.0</string>
    <key>CFBundleVersion</key>
    <string>99</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
</dict>
</plist>""")

# Step 5: Package into IPA Archive
print("\n[3/4] Packaging Real IPA Archive...")
ipa_path = "build/EPZGameTurbo-iOS.ipa"
with zipfile.ZipFile(ipa_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("build/Payload"):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, "build")
            zipf.write(file_path, arcname)

size_mb = os.path.getsize(ipa_path) / (1024 * 1024)
print(f"\n[4/4] SUCCESS! Built real compiled IPA size: {size_mb:.2f} MB at {ipa_path}")
sys.exit(0)
