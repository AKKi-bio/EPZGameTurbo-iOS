import os

pbxproj_content = """// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 54;
	objects = {
		1000001 /* EPZGameTurboApp.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = EPZGameTurboApp.swift; sourceTree = "<group>"; };
		1000002 /* LicenseManager.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = LicenseManager.swift; sourceTree = "<group>"; };
		1000003 /* SuperTouchPrefs.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = SuperTouchPrefs.swift; sourceTree = "<group>"; };
		1000004 /* SystemMonitor.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = SystemMonitor.swift; sourceTree = "<group>"; };
		1000005 /* LicenseView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = LicenseView.swift; sourceTree = "<group>"; };
		1000006 /* MainDashboardView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = MainDashboardView.swift; sourceTree = "<group>"; };
		1000007 /* FloatingOverlayView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = FloatingOverlayView.swift; sourceTree = "<group>"; };
		1000008 /* SensitivityOverlayView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = SensitivityOverlayView.swift; sourceTree = "<group>"; };

		2000001 /* EPZGameTurboApp.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000001; };
		2000002 /* LicenseManager.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000002; };
		2000003 /* SuperTouchPrefs.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000003; };
		2000004 /* SystemMonitor.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000004; };
		2000005 /* LicenseView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000005; };
		2000006 /* MainDashboardView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000006; };
		2000007 /* FloatingOverlayView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000007; };
		2000008 /* SensitivityOverlayView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1000008; };

		3000001 /* EPZGameTurbo.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = EPZGameTurbo.app; sourceTree = BUILT_PRODUCTS_DIR; };

		4000001 /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = ();
			runOnlyForDeploymentPostprocessing = 0;
		};

		5000001 /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				2000001,
				2000002,
				2000003,
				2000004,
				2000005,
				2000006,
				2000007,
				2000008,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};

		6000001 /* EPZGameTurbo Group */ = {
			isa = PBXGroup;
			children = (
				1000001,
				1000002,
				1000003,
				1000004,
				1000005,
				1000006,
				1000007,
				1000008,
			);
			path = EPZGameTurbo;
			sourceTree = "<group>";
		};

		6000002 /* Products Group */ = {
			isa = PBXGroup;
			children = (
				3000001,
			);
			name = Products;
			sourceTree = "<group>";
		};

		6000000 /* Main Root Group */ = {
			isa = PBXGroup;
			children = (
				6000001,
				6000002,
			);
			sourceTree = "<group>";
		};

		7000001 /* Native Target */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 9000001;
			buildPhases = (
				5000001,
				4000001,
			);
			buildRules = ();
			dependencies = ();
			name = EPZGameTurbo;
			productName = EPZGameTurbo;
			productReference = 3000001;
			productType = "com.apple.product-type.application";
		};

		8000001 /* Project Object */ = {
			isa = PBXProject;
			attributes = {
				LastSwiftUpdateCheck = 1400;
				LastUpgradeCheck = 1400;
			};
			buildConfigurationList = 9000002;
			compatibilityVersion = "Xcode 13.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (en, Base);
			mainGroup = 6000000;
			productRefGroup = 6000002;
			projectDirPath = "";
			projectRoot = "";
			targets = (7000001);
		};

		9000003 /* Target Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CODE_SIGNING_ALLOWED = NO;
				CODE_SIGNING_REQUIRED = NO;
				CODE_SIGN_IDENTITY = "";
				INFOPLIST_FILE = EPZGameTurbo/Info.plist;
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				PRODUCT_BUNDLE_IDENTIFIER = com.epz.gameturbo.ios;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SDKROOT = iphoneos;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Debug;
		};

		9000004 /* Target Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CODE_SIGNING_ALLOWED = NO;
				CODE_SIGNING_REQUIRED = NO;
				CODE_SIGN_IDENTITY = "";
				INFOPLIST_FILE = EPZGameTurbo/Info.plist;
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				PRODUCT_BUNDLE_IDENTIFIER = com.epz.gameturbo.ios;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SDKROOT = iphoneos;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Release;
		};

		9000005 /* Project Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CODE_SIGNING_ALLOWED = NO;
				CODE_SIGNING_REQUIRED = NO;
				CODE_SIGN_IDENTITY = "";
				SDKROOT = iphoneos;
			};
			name = Debug;
		};

		9000006 /* Project Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CODE_SIGNING_ALLOWED = NO;
				CODE_SIGNING_REQUIRED = NO;
				CODE_SIGN_IDENTITY = "";
				SDKROOT = iphoneos;
			};
			name = Release;
		};

		9000001 /* Target Config List */ = {
			isa = XCConfigurationList;
			buildConfigurations = (9000003, 9000004);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};

		9000002 /* Project Config List */ = {
			isa = XCConfigurationList;
			buildConfigurations = (9000005, 9000006);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
	};
	rootObject = 8000001;
}
"""

xcscheme_content = """<?xml version="1.0" encoding="UTF-8"?>
<Scheme
   LastUpgradeVersion = "1500"
   version = "1.7">
   <BuildAction
      parallelizeBuildables = "YES"
      buildImplicitDependencies = "YES">
      <BuildActionEntries>
         <BuildActionEntry
            buildForTesting = "YES"
            buildForRunning = "YES"
            buildForProfiling = "YES"
            buildForArchiving = "YES"
            buildForAnalyzing = "YES">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "7000001"
               BuildableName = "EPZGameTurbo.app"
               BlueprintName = "EPZGameTurbo"
               ReferencedContainer = "container:EPZGameTurbo.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <TestAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      shouldUseLaunchSchemeArgsEnv = "YES">
      <Testables>
      </Testables>
   </TestAction>
   <LaunchAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      launchStyle = "0"
      useCustomWorkingDirectory = "NO"
      ignoresPersistentStateOnLaunch = "NO"
      debugDocumentVersioning = "YES"
      debugServiceExtension = "internal"
      allowLocationSimulation = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "7000001"
            BuildableName = "EPZGameTurbo.app"
            BlueprintName = "EPZGameTurbo"
            ReferencedContainer = "container:EPZGameTurbo.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </LaunchAction>
   <ProfileAction
      buildConfiguration = "Release"
      shouldUseLaunchSchemeArgsEnv = "YES"
      savedToolIdentifier = ""
      useCustomWorkingDirectory = "NO"
      debugDocumentVersioning = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "7000001"
            BuildableName = "EPZGameTurbo.app"
            BlueprintName = "EPZGameTurbo"
            ReferencedContainer = "container:EPZGameTurbo.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </ProfileAction>
   <AnalyzeAction
      buildConfiguration = "Debug">
   </AnalyzeAction>
   <ArchiveAction
      buildConfiguration = "Release"
      revealArchiveInOrganizer = "YES">
   </ArchiveAction>
</Scheme>
"""

info_plist_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.82.0</string>
    <key>CFBundleVersion</key>
    <string>99</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
</dict>
</plist>
"""

os.makedirs("EPZGameTurbo.xcodeproj/xcshareddata/xcschemes", exist_ok=True)
os.makedirs("EPZGameTurbo", exist_ok=True)

with open("EPZGameTurbo.xcodeproj/project.pbxproj", "w", encoding="utf-8") as f:
    f.write(pbxproj_content)

with open("EPZGameTurbo.xcodeproj/xcshareddata/xcschemes/EPZGameTurbo.xcscheme", "w", encoding="utf-8") as f:
    f.write(xcscheme_content)

with open("EPZGameTurbo/Info.plist", "w", encoding="utf-8") as f:
    f.write(info_plist_content)
