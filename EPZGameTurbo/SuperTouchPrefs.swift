import Foundation

class SuperTouchPrefs {
    private static let keyEnabled = "epz_super_touch_enabled"
    private static let keyTapSens = "epz_tap_sensitivity"
    private static let keySwipeResp = "epz_swipe_responsiveness"
    private static let keyMicroAcc = "epz_micro_control_accuracy"
    
    static var isEnabled: Bool {
        get { UserDefaults.standard.object(forKey: keyEnabled) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: keyEnabled) }
    }
    
    static var tapSensitivity: Int {
        get { UserDefaults.standard.object(forKey: keyTapSens) as? Int ?? 4 }
        set { UserDefaults.standard.set(min(max(newValue, 0), 4), forKey: keyTapSens) }
    }
    
    static var swipeResponsiveness: Int {
        get { UserDefaults.standard.object(forKey: keySwipeResp) as? Int ?? 3 }
        set { UserDefaults.standard.set(min(max(newValue, 0), 4), forKey: keySwipeResp) }
    }
    
    static var microControlAccuracy: Int {
        get { UserDefaults.standard.object(forKey: keyMicroAcc) as? Int ?? 4 }
        set { UserDefaults.standard.set(min(max(newValue, 0), 4), forKey: keyMicroAcc) }
    }
}
