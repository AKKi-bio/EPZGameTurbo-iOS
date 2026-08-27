import SwiftUI

struct FloatingOverlayView: View {
    @ObservedObject var monitor: SystemMonitor
    @Binding var isOverlayVisible: Bool
    @State private var isSensitivityOpen: Bool = false
    @State private var offset: CGSize = .zero
    @State private var lastOffset: CGSize = .zero
    
    var body: some View {
        ZStack {
            if isOverlayVisible {
                VStack(spacing: 0) {
                    // Header Bar (Drag handle)
                    HStack {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(Color.green)
                                .frame(width: 8, height: 8)
                            Text("EPZ GAME TURBO")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        
                        Spacer()
                        
                        // Close button (✕)
                        Button(action: {
                            withAnimation { isOverlayVisible = false }
                        }) {
                            Text("✕")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.gray)
                                .padding(4)
                        }
                    }
                    .padding(.horizontal, 10)
                    .padding(.top, 8)
                    .padding(.bottom, 6)
                    
                    Divider().background(Color.white.opacity(0.1))
                    
                    // Hardware Metrics Row
                    HStack(spacing: 12) {
                        MetricItem(title: "FPS", value: "\(monitor.fps)", color: .cyan)
                        MetricItem(title: "RAM", value: "\(monitor.freeRamMB)MB", color: .yellow)
                        MetricItem(title: "PING", value: "\(monitor.pingMs)ms", color: .green)
                        MetricItem(title: "TEMP", value: String(format: "%.1f°C", monitor.batteryTempC), color: monitor.batteryTempC > 45 ? .red : .orange)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 8)
                    
                    // Sensitivity Button
                    Button(action: {
                        isSensitivityOpen = true
                    }) {
                        HStack {
                            Text("🎯 SENSITIVITY")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(.cyan)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 6)
                        .background(Color.cyan.opacity(0.15))
                        .cornerRadius(6)
                        .overlay(
                            RoundedRectangle(cornerRadius: 6)
                                .stroke(Color.cyan.opacity(0.5), lineWidth: 1)
                        )
                    }
                    .padding(.horizontal, 10)
                    .padding(.bottom, 8)
                }
                .frame(width: 270)
                .background(Color(red: 16/255, green: 18/255, blue: 24/255).opacity(0.92))
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
                )
                .shadow(color: .black.opacity(0.5), radius: 10, x: 0, y: 5)
                .offset(x: offset.width, y: offset.height)
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            offset = CGSize(
                                width: lastOffset.width + value.translation.width,
                                height: lastOffset.height + value.translation.height
                            )
                        }
                        .onEnded { _ in
                            lastOffset = offset
                        }
                )
            }
        }
        .sheet(isPresented: $isSensitivityOpen) {
            SensitivityOverlayView()
        }
    }
}

struct MetricItem: View {
    let title: String
    let value: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 2) {
            Text(title)
                .font(.system(size: 8, weight: .bold, design: .monospaced))
                .foregroundColor(.gray)
            Text(value)
                .font(.system(size: 11, weight: .bold, design: .monospaced))
                .foregroundColor(color)
        }
    }
}
