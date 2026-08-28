import os
import sys
import subprocess
import zipfile

print("==========================================")
print("  EPZ GAME TURBO REAL IPA BUILDER v3.0   ")
print("==========================================")

# Step 1: Create Directories
os.makedirs("build/Payload/EPZGameTurbo.app", exist_ok=True)

# Step 2: Get SDK Path
sdk_path = subprocess.check_output(["xcrun", "--sdk", "iphonesimulator", "--show-sdk-path"]).decode("utf-8").strip()
print("Found SDK Path:", sdk_path)

# Step 3: Compile Swift files
swift_files = [
    "EPZGameTurbo/EPZGameTurboApp.swift",
    "EPZGameTurbo/LicenseManager.swift",
    "EPZGameTurbo/SuperTouchPrefs.swift",
    "EPZGameTurbo/SystemMonitor.swift",
    "EPZGameTurbo/LicenseView.swift",
    "EPZGameTurbo/MainDashboardView.swift",
    "EPZGameTurbo/FloatingOverlayView.swift",
    "EPZGameTurbo/SensitivityOverlayView.swift"
]

swift_cmd = [
    "swiftc",
    "-sdk", sdk_path,
    "-target", "arm64-apple-ios15.0-simulator",
    "-module-name", "EPZGameTurbo",
    "-parse-as-library",
    "-framework", "SwiftUI",
    "-framework", "UIKit",
    "-framework", "Foundation",
] + swift_files + [
    "-o", "build/Payload/EPZGameTurbo.app/EPZGameTurbo"
]

print("Executing compile command:", " ".join(swift_cmd))
s_res = subprocess.run(swift_cmd, capture_output=True, text=True)
print("--- SWIFTC STDOUT ---")
print(s_res.stdout)
print("--- SWIFTC STDERR ---")
print(s_res.stderr)

exec_path = "build/Payload/EPZGameTurbo.app/EPZGameTurbo"
if s_res.returncode != 0 or not os.path.exists(exec_path):
    print("ERROR: swiftc compilation failed with code", s_res.returncode)
    sys.exit(1)

os.chmod(exec_path, 0o755)

# Step 4: Ensure Info.plist exists
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

# Step 5: Package into real IPA Archive
ipa_path = "build/EPZGameTurbo-iOS.ipa"
with zipfile.ZipFile(ipa_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("build/Payload"):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, "build")
            zipf.write(file_path, arcname)

size_mb = os.path.getsize(ipa_path) / (1024 * 1024)
print(f"\nSUCCESS! Built real compiled IPA size: {size_mb:.2f} MB at {ipa_path}")
sys.exit(0)
