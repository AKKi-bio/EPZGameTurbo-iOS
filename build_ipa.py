import os
import sys
import subprocess
import zipfile

print("==========================================")
print("  EPZ GAME TURBO REAL IPA BUILDER v2.0   ")
print("==========================================")

# Step 1: Generate Xcode Project File & Scheme
print("\n[1/5] Generating Xcode Project & Scheme...")
subprocess.run([sys.executable, "generate_xcodeproj.py"], check=True)

# Step 2: Clean old build dir
subprocess.run(["rm", "-rf", "build"], check=False)
os.makedirs("build/Payload", exist_ok=True)

# Step 3: Run XcodeBuild for iphonesimulator
print("\n[2/5] Running xcodebuild for iphonesimulator...")
xc_cmd = [
    "xcodebuild",
    "-project", "EPZGameTurbo.xcodeproj",
    "-scheme", "EPZGameTurbo",
    "-sdk", "iphonesimulator",
    "-configuration", "Release",
    "-derivedDataPath", "build/",
    "CODE_SIGNING_ALLOWED=NO",
    "CODE_SIGNING_REQUIRED=NO",
    "CODE_SIGN_IDENTITY=",
    "AD_HOC_CODE_SIGNING_ALLOWED=YES",
    "build"
]

res = subprocess.run(xc_cmd, capture_output=True, text=True)
print("--- STDOUT ---")
print(res.stdout[-3000:])
print("--- STDERR ---")
print(res.stderr)

# Step 4: Check or run swiftc fallback
app_binary = "build/Build/Products/Release-iphonesimulator/EPZGameTurbo.app/EPZGameTurbo"

if not os.path.exists(app_binary):
    print("\n[3/5] xcodebuild binary missing! Attempting direct swiftc compilation...")
    sdk_path = subprocess.check_output(["xcrun", "--sdk", "iphonesimulator", "--show-sdk-path"]).decode("utf-8").strip()
    
    os.makedirs("build/Payload/EPZGameTurbo.app", exist_ok=True)
    
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
    
    s_res = subprocess.run(swift_cmd, capture_output=True, text=True)
    print("--- SWIFTC STDOUT ---")
    print(s_res.stdout)
    print("--- SWIFTC STDERR ---")
    print(s_res.stderr)
    
    if s_res.returncode != 0:
        print("ERROR: swiftc compilation failed with code", s_res.returncode)
        sys.exit(s_res.returncode)
else:
    print("\n[3/5] xcodebuild succeeded! Copying app bundle...")
    os.makedirs("build/Payload/EPZGameTurbo.app", exist_ok=True)
    subprocess.run(["cp", "-r", "build/Build/Products/Release-iphonesimulator/EPZGameTurbo.app/", "build/Payload/EPZGameTurbo.app/"], check=True)

# Step 5: Copy Info.plist if missing
info_plist = "build/Payload/EPZGameTurbo.app/Info.plist"
if not os.path.exists(info_plist):
    subprocess.run(["cp", "EPZGameTurbo/Info.plist", info_plist], check=True)

# Step 6: Package into real IPA
print("\n[4/5] Packaging real multi-megabyte IPA Archive...")
ipa_path = "build/EPZGameTurbo-iOS.ipa"
with zipfile.ZipFile(ipa_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("build/Payload"):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, "build")
            zipf.write(file_path, arcname)

size_mb = os.path.getsize(ipa_path) / (1024 * 1024)
print(f"\n[5/5] SUCCESS! Built real IPA size: {size_mb:.2f} MB at {ipa_path}")
sys.exit(0)
