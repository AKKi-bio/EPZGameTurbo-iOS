# ⚡ EPZ Game Turbo iOS — Official Pro Gaming Suite

![Platform](https://img.shields.io/badge/Platform-iOS%2015.0%2B-blue.svg)
![Language](https://img.shields.io/badge/Swift-5.9-orange.svg)
![UI Framework](https://img.shields.io/badge/SwiftUI-Pro-red.svg)
![License Backend](https://img.shields.io/badge/License%20Server-Wispbyte-green.svg)

**EPZ Game Turbo iOS** is an elite mobile gaming companion app for iPhone and iPad, featuring real-time system monitoring, touch sensitivity tuning, floating in-game overlays, and hardware-locked license key protection.

---

## 🌟 Key Features

- **🔑 Cloud License Authentication:** Connects to your Wispbyte License Server (`http://78.154.103.8:15429/validate`).
- **📱 Hardware HWID Locking:** Uses `UIDevice.current.identifierForVendor` to lock keys to specific iOS devices.
- **📊 Real-Time Floating System Overlay:** Displays FPS, RAM (via `mach_host_basic_info`), Ping (ms), and Battery Temperature (°C).
- **🎯 In-Game Sensitivity Adjustment:** Sliders for **Tap Sensitivity**, **Swipe Responsiveness**, and **Micro Control Accuracy** with instant visual toast feedback.
- **⚡ Pro Gaming Hub:** One-tap Memory Cleaner & Free Fire deep-linking shortcut.

---

## 🛠️ GitHub Build & Deployment Guide

### Option 1: Push to GitHub via Terminal / Command Prompt

Run the following commands from your terminal inside `EPZGameTurbo-iOS`:

```bash
cd c:\Users\AKKi\Downloads\EPZ-Turbo-Full-Project\EPZGameTurbo-iOS

# Initialize git repository
git init
git add .
git commit -m "Initial commit of EPZ Game Turbo iOS v1.82.0"

# Connect to your GitHub repo and push
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/EPZGameTurbo-iOS.git
git branch -M main
git push -u origin main
```

### Option 2: Open & Build in Xcode

1. Open **Xcode** on your Mac.
2. Choose **File ➔ Open** and select the `EPZGameTurbo-iOS` directory (or double click `Package.swift`).
3. Select your target device (e.g. `iPhone 15 Pro`).
4. Press `Cmd + R` to build and run!

---

## 📡 License API Specification

- **Endpoint:** `http://78.154.103.8:15429/validate`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "key": "AKKI-XXXX-XXXX-XXXX",
    "deviceId": "VENDOR_UUID",
    "deviceName": "iPhone 15 Pro (iOS 17.4)"
  }
  ```
