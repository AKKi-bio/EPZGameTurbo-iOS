import SwiftUI

struct LicenseView: View {
    @State private var licenseKey: String = ""
    @State private var statusMessage: String = ""
    @State private var isLoading: Bool = false
    @State private var isActivated: Bool = false
    
    var body: some View {
        if isActivated {
            MainDashboardView()
        } else {
            ZStack {
                Color(red: 10/255, green: 10/255, blue: 10/255)
                    .ignoresSafeArea()
                
                VStack(spacing: 24) {
                    Spacer()
                    
                    VStack(spacing: 8) {
                        Text("⚡ EPZ TURBO iOS")
                            .font(.system(size: 26, weight: .black, design: .monospaced))
                            .foregroundColor(.white)
                        
                        Text("ENTER YOUR LICENSE KEY TO ACTIVATE")
                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                            .foregroundColor(Color.gray)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        TextField("AKKI-XXXX-XXXX-XXXX", text: $licenseKey)
                            .font(.system(size: 16, weight: .bold, design: .monospaced))
                            .padding()
                            .background(Color(red: 20/255, green: 16/255, blue: 16/255))
                            .cornerRadius(8)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(Color.red.opacity(0.6), lineWidth: 1)
                            )
                            .foregroundColor(.white)
                            .autocapitalization(.allCharacters)
                            .disableAutocorrection(true)
                    }
                    .padding(.horizontal, 24)
                    
                    if !statusMessage.isEmpty {
                        Text(statusMessage)
                            .font(.system(size: 13, weight: .semibold, design: .monospaced))
                            .foregroundColor(.red)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                    }
                    
                    Button(action: performActivation) {
                        HStack {
                            if isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Text("ACTIVATE LICENSE")
                                    .font(.system(size: 16, weight: .bold, design: .monospaced))
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.red)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                    }
                    .disabled(isLoading)
                    .padding(.horizontal, 24)
                    
                    Spacer()
                }
            }
            .onAppear {
                checkSavedLicense()
            }
        }
    }
    
    private func checkSavedLicense() {
        if let saved = LicenseManager.shared.getSavedKey() {
            licenseKey = saved
            isLoading = true
            LicenseManager.shared.validateKey(key: saved) { result in
                DispatchQueue.main.async {
                    isLoading = false
                    switch result {
                    case .valid:
                        isActivated = true
                    case .invalid(let reason):
                        statusMessage = getErrorMessage(reason: reason)
                    case .networkError:
                        if LicenseManager.shared.isCachedAsValid() {
                            isActivated = true
                        } else {
                            statusMessage = "Couldn't reach license server. Check connection."
                        }
                    }
                }
            }
        }
    }
    
    private func performActivation() {
        guard !licenseKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            statusMessage = "Please enter a key first."
            return
        }
        
        isLoading = true
        statusMessage = ""
        
        LicenseManager.shared.validateKey(key: licenseKey) { result in
            DispatchQueue.main.async {
                isLoading = false
                switch result {
                case .valid:
                    isActivated = true
                case .invalid(let reason):
                    statusMessage = getErrorMessage(reason: reason)
                case .networkError:
                    statusMessage = "Couldn't reach license server. Check connection."
                }
            }
        }
    }
    
    private func getErrorMessage(reason: String) -> String {
        switch reason {
        case "key_not_found":
            return "Key not found. Check for typos."
        case "key_revoked":
            return "This key has been revoked."
        case "device_mismatch":
            return "This key is active on another device. Reset device in Admin Panel."
        default:
            return "Invalid license key."
        }
    }
}
