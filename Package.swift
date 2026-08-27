// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "EPZGameTurbo-iOS",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "EPZGameTurbo",
            targets: ["EPZGameTurbo"])
    ],
    dependencies: [],
    targets: [
        .target(
            name: "EPZGameTurbo",
            dependencies: [],
            path: "EPZGameTurbo")
    ]
)
