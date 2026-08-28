// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "EPZGameTurbo",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "EPZGameTurbo",
            targets: ["EPZGameTurbo"])
    ],
    targets: [
        .target(
            name: "EPZGameTurbo",
            path: "EPZGameTurbo")
    ]
)
