import SwiftUI

struct SensitivityOverlayView: View {
    @Environment(\.presentationMode) var presentationMode
    
    @State private var isSuperTouchEnabled: Bool = SuperTouchPrefs.isEnabled
    @State private var tapSens: Double = Double(SuperTouchPrefs.tapSensitivity)
    @State private var swipeResp: Double = Double(SuperTouchPrefs.swipeResponsiveness)
    @State private var microAcc: Double = Double(SuperTouchPrefs.microControlAccuracy)
    @State private var toastMessage: String = ""
    
    private let levelNames = ["Lowest", "Low", "Medium", "High", "Highest"]
    
    var body: some View {
        ZStack {
            Color(red: 14/255, green: 16/255, blue: 22/255)
                .ignoresSafeArea()
            
            VStack(spacing: 20) {
                HStack {
                    Text("Control settings")
                        .font(.system(size: 20, weight: .bold, design: .monospaced))
                        .foregroundColor(.white)
                    Spacer()
                    Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.yellow)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color.white.opacity(0.1))
                    .cornerRadius(8)
                }
                .padding(.horizontal)
                .padding(.top, 20)
                
                Divider().background(Color.white.opacity(0.1))
                
                Toggle(isOn: $isSuperTouchEnabled) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Super Touch Control")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                        Text("Lowers touch response latency across all games")
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                    }
                }
                .toggleStyle(SwitchToggleStyle())
                .tint(.yellow)
                .onChange(of: isSuperTouchEnabled, perform: { newValue in
                    SuperTouchPrefs.isEnabled = newValue
                })
                .padding(.horizontal)
                
                VStack(spacing: 24) {
                    SensitivitySliderRow(
                        title: "Tap sensitivity ⓘ",
                        value: $tapSens,
                        levelName: levelNames[Int(tapSens)],
                        onEditingEnded: {
                            SuperTouchPrefs.tapSensitivity = Int(tapSens)
                            showToast("⚡ Tap Sensitivity: \(levelNames[Int(tapSens)]) Applied!")
                        }
                    )
                    
                    SensitivitySliderRow(
                        title: "Swipe responsiveness ⓘ",
                        value: $swipeResp,
                        levelName: levelNames[Int(swipeResp)],
                        onEditingEnded: {
                            SuperTouchPrefs.swipeResponsiveness = Int(swipeResp)
                            showToast("🚀 Swipe Responsiveness: \(levelNames[Int(swipeResp)]) Applied!")
                        }
                    )
                    
                    SensitivitySliderRow(
                        title: "Micro control accuracy ⓘ",
                        value: $microAcc,
                        levelName: levelNames[Int(microAcc)],
                        onEditingEnded: {
                            SuperTouchPrefs.microControlAccuracy = Int(microAcc)
                            showToast("🎯 Micro Control Accuracy: \(levelNames[Int(microAcc)]) Applied!")
                        }
                    )
                }
                .padding()
                .background(Color.white.opacity(0.04))
                .cornerRadius(12)
                .padding(.horizontal)
                
                Spacer()
                
                if !toastMessage.isEmpty {
                    Text(toastMessage)
                        .font(.system(size: 13, weight: .bold, design: .monospaced))
                        .foregroundColor(.black)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color.yellow)
                        .cornerRadius(20)
                        .transition(.opacity)
                        .padding(.bottom, 20)
                }
            }
        }
    }
    
    private func showToast(_ msg: String) {
        withAnimation {
            toastMessage = msg
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            withAnimation {
                toastMessage = ""
            }
        }
    }
}
