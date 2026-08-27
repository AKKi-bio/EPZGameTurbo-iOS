// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "EPZGameTurbo",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .executable(
            name: "EPZGameTurbo",
            targets: ["EPZGameTurbo"])
    ],
    targets: [
        .executableTarget(
            name: "EPZGameTurbo",
            path: "EPZGameTurbo")
    ]
)
