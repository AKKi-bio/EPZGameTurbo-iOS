import os
import sys
import subprocess
import zipfile

print("==========================================")
print("  EPZ GAME TURBO REAL IPA BUILDER v4.0   ")
print("==========================================")

# Step 1: Clean build dir
subprocess.run(["rm", "-rf", "build", ".build"], check=False)
os.makedirs("build/Payload/EPZGameTurbo.app", exist_ok=True)

# Step 2: Build Executable Binary via SPM (swift build -c release)
print("\n[1/4] Compiling Native Release Binary via Swift Package Manager...")
spm_cmd = ["swift", "build", "-c", "release"]
res = subprocess.run(spm_cmd, capture_output=True, text=True)
print("--- STDOUT ---")
print(res.stdout)
print("--- STDERR ---")
print(res.stderr)

spm_binary = ".build/release/EPZGameTurbo"
if res.returncode != 0 or not os.path.exists(spm_binary):
    print("ERROR: SPM compilation failed with exit code", res.returncode)
    sys.exit(res.returncode)

print("\n[2/4] SPM Compilation Succeeded! Copying binary to app bundle...")
app_binary = "build/Payload/EPZGameTurbo.app/EPZGameTurbo"
subprocess.run(["cp", spm_binary, app_binary], check=True)
os.chmod(app_binary, 0o755)

# Step 3: Write Info.plist
print("\n[3/4] Creating Info.plist...")
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

# Step 4: Package into IPA Archive
print("\n[4/4] Packaging Real IPA Archive...")
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
