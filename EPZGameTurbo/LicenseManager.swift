import Foundation
import UIKit

class LicenseManager: ObservableObject {
    static let shared = LicenseManager()
    
    private let validateURL = "http://78.154.103.8:15429/validate"
    private let keyPrefsKey = "epz_ios_license_key"
    private let validPrefsKey = "epz_ios_license_valid"
    
    enum ValidationResult {
        case valid
        case invalid(reason: String)
        case networkError
    }
    
    var deviceId: String {
        return UIDevice.current.identifierForVendor?.uuidString ?? "unknown-ios-device"
    }
    
    var deviceName: String {
        let name = UIDevice.current.name
        let version = UIDevice.current.systemVersion
        return "\(name) (iOS \(version))"
    }
    
    func getSavedKey() -> String? {
        return UserDefaults.standard.string(forKey: keyPrefsKey)?.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    }
    
    func isCachedAsValid() -> Bool {
        return UserDefaults.standard.bool(forKey: validPrefsKey)
    }
    
    private func saveResult(key: String, isValid: Bool) {
        let clean = key.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        UserDefaults.standard.set(clean, forKey: keyPrefsKey)
        UserDefaults.standard.set(isValid, forKey: validPrefsKey)
    }
    
    func validateKey(key: String, completion: @escaping (ValidationResult) -> Void) {
        let cleanKey = key.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        guard let url = URL(string: validateURL) else {
            completion(.networkError)
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 8.0
        
        let payload: [String: Any] = [
            "key": cleanKey,
            "deviceId": deviceId,
            "deviceName": deviceName
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: payload, options: [])
        } catch {
            completion(.networkError)
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let _ = error {
                if self.isCachedAsValid() {
                    completion(.valid)
                } else {
                    completion(.networkError)
                }
                return
            }
            
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                completion(.networkError)
                return
            }
            
            let isValid = json["valid"] as? Bool ?? false
            self.saveResult(key: cleanKey, isValid: isValid)
            
            if isValid {
                completion(.valid)
            } else {
                let reason = json["reason"] as? String ?? "unknown"
                completion(.invalid(reason: reason))
            }
        }.resume()
    }
}
