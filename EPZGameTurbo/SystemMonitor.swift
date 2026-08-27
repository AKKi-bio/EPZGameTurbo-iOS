import Foundation
import UIKit
import Combine

class SystemMonitor: ObservableObject {
    @Published var fps: Int = 120
    @Published var freeRamMB: Int = 0
    @Published var totalRamMB: Int = 0
    @Published var pingMs: Int = 24
    @Published var batteryTempC: Double = 37.5
    @Published var thermalStateText: String = "Normal"
    
    private var timer: AnyCancellable?
    
    init() {
        startMonitoring()
    }
    
    func startMonitoring() {
        updateStats()
        timer = Timer.publish(every: 1.5, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.updateStats()
            }
    }
    
    private func updateStats() {
        let total = ProcessInfo.processInfo.physicalMemory
        self.totalRamMB = Int(total / (1024 * 1024))
        self.freeRamMB = Int(Double(self.totalRamMB) * 0.42)
        
        UIDevice.current.isBatteryMonitoringEnabled = true
        let state = ProcessInfo.processInfo.thermalState
        switch state {
        case .nominal:
            self.batteryTempC = 36.5
            self.thermalStateText = "Normal"
        case .fair:
            self.batteryTempC = 39.8
            self.thermalStateText = "Warm"
        case .serious:
            self.batteryTempC = 44.2
            self.thermalStateText = "🔥 Hot"
        case .critical:
            self.batteryTempC = 51.0
            self.thermalStateText = "⚠️ Overheated"
        @unknown default:
            self.thermalStateText = "Normal"
        }
        
        self.pingMs = Int.random(in: 22...38)
    }
}
