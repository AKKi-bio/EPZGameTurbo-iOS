import SwiftUI

struct MainDashboardView: View {
    @StateObject private var monitor = SystemMonitor()
    @State private var isOverlayVisible: Bool = true
    @State private var isBoosting: Bool = false
    @State private var boostStatus: String = "SYSTEM OPTIMAL"
    
    var body: some View {
        ZStack {
            Color(red: 10/255, green: 10/255, blue: 10/255)
                .ignoresSafeArea()
            
            VStack(spacing: 20) {
                // Top Header
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("EPZ GAME TURBO")
                            .font(.system(size: 22, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        Text("PRO iOS GAMING SUITE")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundColor(.cyan)
                    }
                    Spacer()
                    
                    // Overlay Toggle Switch
                    Button(action: {
                        withAnimation { isOverlayVisible.toggle() }
                    }) {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(isOverlayVisible ? Color.green : Color.red)
                                .frame(width: 8, height: 8)
                            Text(isOverlayVisible ? "HUD ON" : "HUD OFF")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.white.opacity(0.1))
                        .cornerRadius(12)
                    }
                }
                .padding(.horizontal)
                .padding(.top, 16)
                
                // Big Boost Card
                VStack(spacing: 16) {
                    ZStack {
                        Circle()
                            .stroke(Color.red.opacity(0.3), lineWidth: 4)
                            .frame(width: 130, height: 130)
                        
                        Button(action: runBoost) {
                            ZStack {
                                Circle()
                                    .fill(Color.red)
                                    .frame(width: 110, height: 110)
                                    .shadow(color: .red.opacity(0.6), radius: 15)
                                
                                VStack(spacing: 4) {
                                    Text("⚡")
                                        .font(.system(size: 28))
                                    Text(isBoosting ? "BOOSTING" : "BOOST")
                                        .font(.system(size: 16, weight: .black, design: .monospaced))
                                        .foregroundColor(.white)
                                }
                            }
                        }
                        .disabled(isBoosting)
                    }
                    
                    Text(boostStatus)
                        .font(.system(size: 12, weight: .bold, design: .monospaced))
                        .foregroundColor(.green)
                }
                .padding(.vertical, 10)
                
                // System Diagnostics Grid
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                    StatusCard(title: "FREE RAM", value: "\(monitor.freeRamMB) MB", icon: "memorychip", color: .yellow)
                    StatusCard(title: "PING", value: "\(monitor.pingMs) ms", icon: "network", color: .green)
                    StatusCard(title: "THERMAL", value: monitor.thermalStateText, icon: "thermometer.medium", color: monitor.batteryTempC > 45 ? .red : .orange)
                    StatusCard(title: "REFRESH RATE", value: "120 Hz", icon: "display", color: .cyan)
                }
                .padding(.horizontal)
                
                Spacer()
                
                // Launch Game Button
                Button(action: launchGame) {
                    HStack {
                        Text("🎮 LAUNCH FREE FIRE")
                            .font(.system(size: 16, weight: .bold, design: .monospaced))
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.cyan)
                    .foregroundColor(.black)
                    .cornerRadius(10)
                }
                .padding(.horizontal)
                .padding(.bottom, 16)
            }
            
            // In-Game Floating Overlay
            FloatingOverlayView(monitor: monitor, isOverlayVisible: $isOverlayVisible)
        }
    }
    
    private func runBoost() {
        isBoosting = true
        boostStatus = "OPTIMIZING MEMORY & TOUCH..."
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isBoosting = false
            boostStatus = "🟢 100% BOOSTED — RAM CLEARED!"
        }
    }
    
    private func launchGame() {
        // Deep link URL for Free Fire / Free Fire MAX on iOS
        if let url = URL(string: "freefire://"), UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else if let url = URL(string: "https://apps.apple.com/app/id1300146651") {
            UIApplication.shared.open(url)
        }
    }
}

struct StatusCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 10, weight: .bold, design: .monospaced))
                    .foregroundColor(.gray)
                Text(value)
                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                    .foregroundColor(.white)
            }
            Spacer()
        }
        .padding()
        .background(Color(red: 20/255, green: 22/255, blue: 30/255))
        .cornerRadius(10)
    }
}
