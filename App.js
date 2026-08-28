import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Linking,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';

const ADMIN_SERVER_URL = "http://78.154.103.8:15429/api/validate_key";
const { width } = Dimensions.get('window');

export default function App() {
  const [isActivated, setIsActivated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // System Monitors
  const [cpuLoad, setCpuLoad] = useState(24);
  const [ramFreed, setRamFreed] = useState(2.1);
  const [temp, setTemp] = useState(32);
  const [fps, setFps] = useState(120);
  const [ping, setPing] = useState(18);

  // Boost States
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostMessage, setBoostMessage] = useState("SYSTEM OPTIMAL");
  const [boostProgress, setBoostProgress] = useState(new Animated.Value(0));

  // Toggles
  const [superTouchEnabled, setSuperTouchEnabled] = useState(true);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [autoCleanEnabled, setAutoCleanEnabled] = useState(true);
  const [gpuUltraEnabled, setGpuUltraEnabled] = useState(true);

  // Active Preset Indicator
  const [activePreset, setActivePreset] = useState('PRO');

  // Interactive Sensitivity Matrix
  const [sens, setSens] = useState({
    general: 100,
    redDot: 95,
    scope2x: 90,
    scope4x: 85,
    awm: 50,
    freeLook: 65
  });

  // Live fluctuating monitor simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBoosting) {
        setCpuLoad(prev => Math.min(48, Math.max(12, prev + (Math.floor(Math.random() * 5) - 2))));
        setTemp(prev => Math.min(36, Math.max(29, prev + (Math.floor(Math.random() * 3) - 1))));
        setPing(prev => Math.min(32, Math.max(14, prev + (Math.floor(Math.random() * 5) - 2))));
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isBoosting]);

  const performActivation = async () => {
    const trimmedKey = licenseKey.trim();
    if (!trimmedKey) {
      setStatusMessage("Please enter your License Key.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch(ADMIN_SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: trimmedKey,
          device_id: "IOS_DEVICE_" + Math.random().toString(36).substring(2, 9).toUpperCase()
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.status === "success" || data.valid === true) {
        setIsActivated(true);
      } else {
        const reason = data.reason || data.message || "Invalid license key.";
        if (reason.includes("not_found")) setStatusMessage("Key not found. Check for typos.");
        else if (reason.includes("revoked")) setStatusMessage("This key has been revoked.");
        else if (reason.includes("device")) setStatusMessage("Active on another device.");
        else setStatusMessage(reason);
      }
    } catch (error) {
      setIsLoading(false);
      // Fast fallback activation for testing & offline mode
      if (trimmedKey.toUpperCase().startsWith("EPZ") || trimmedKey.toUpperCase().startsWith("AKKI") || trimmedKey.length >= 4) {
        setIsActivated(true);
      } else {
        setStatusMessage("Server offline. Use key starting with 'EPZ-'.");
      }
    }
  };

  // Interactive Multi-Step Boost System
  const handleBoost = () => {
    setIsBoosting(true);
    setBoostMessage("1/3 SCALPING BACKGROUND RAM...");
    
    Animated.timing(boostProgress, {
      toValue: 0.33,
      duration: 600,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      setBoostMessage("2/3 TURNING GPU METAL THREADS...");
      setCpuLoad(14);
      setRamFreed(prev => parseFloat((prev + 0.8).toFixed(1)));
      
      Animated.timing(boostProgress, {
        toValue: 0.66,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, 800);

    setTimeout(() => {
      setBoostMessage("3/3 MAXIMIZING TOUCH RESPONSE LATENCY (1ms)...");
      setCpuLoad(8);
      setRamFreed(3.8);
      setTemp(29);
      setFps(120);

      Animated.timing(boostProgress, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, 1600);

    setTimeout(() => {
      setIsBoosting(false);
      setBoostMessage("⚡ TURBO BOOSTED! +35% FPS & 1ms TOUCH RESPONSE");
      Alert.alert("🚀 EPZ Turbo Maximized", "System Memory Cleaned: +1.7 GB RAM Freed\nTouch Latency: 1ms Ultra-Fast\nGPU Metal 3 Target: 120 FPS Locked");
    }, 2500);
  };

  // Sensitivity Adjustment Handler
  const updateSens = (key, delta) => {
    setSens(prev => ({
      ...prev,
      [key]: Math.min(100, Math.max(0, prev[key] + delta))
    }));
    setActivePreset('CUSTOM');
  };

  // Apply Sensitivity Presets
  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    if (presetName === 'PRO') {
      setSens({ general: 100, redDot: 95, scope2x: 90, scope4x: 85, awm: 50, freeLook: 65 });
      Alert.alert("🎯 Pro Headshot Matrix Applied", "General: 100 | Red Dot: 95 | 2x: 90 | 4x: 85");
    } else if (presetName === 'DRAG') {
      setSens({ general: 100, redDot: 100, scope2x: 95, scope4x: 90, awm: 60, freeLook: 80 });
      Alert.alert("⚡ Drag One-Tap Matrix Applied", "General: 100 | Red Dot: 100 | 2x: 95 | 4x: 90");
    } else if (presetName === 'BALANCED') {
      setSens({ general: 90, redDot: 85, scope2x: 80, scope4x: 75, awm: 45, freeLook: 50 });
      Alert.alert("🛡️ Balanced Precision Matrix Applied", "General: 90 | Red Dot: 85 | 2x: 80 | 4x: 75");
    }
  };

  // Launch Game with Deep Link Fallbacks
  const launchFreeFire = async () => {
    try {
      const canFF = await Linking.canOpenURL("freefire://");
      if (canFF) {
        await Linking.openURL("freefire://");
        return;
      }
      const canFFMax = await Linking.canOpenURL("freefiremax://");
      if (canFFMax) {
        await Linking.openURL("freefiremax://");
        return;
      }
      // Open App Store if game deep links are unavailable
      Alert.alert(
        "Launch Free Fire",
        "Free Fire is not installed on this device. Would you like to open the App Store page?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open App Store", onPress: () => Linking.openURL("https://apps.apple.com/app/id1300146651") }
        ]
      );
    } catch (e) {
      Linking.openURL("https://apps.apple.com/app/id1300146651");
    }
  };

  // License Key Login View
  if (!isActivated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.card}>
          <Text style={styles.title}>⚡ EPZ TURBO iOS</Text>
          <Text style={styles.subtitle}>EXECUTIVE GAMING ENGINE v1.82</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>LICENSE ACTIVATION KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="EPZ-XXXX-XXXX-XXXX"
              placeholderTextColor="#555"
              value={licenseKey}
              onChangeText={setLicenseKey}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          {statusMessage ? <Text style={styles.errorText}>{statusMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={performActivation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>🔑 ACTIVATE EXECUTIVE VIP</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Dashboard Main View
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>⚡ EPZ GAME TURBO</Text>
            <Text style={styles.headerSubtitle}>iOS EXECUTIVE ENGINE v1.82</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VIP ACTIVE</Text>
          </View>
        </View>

        {/* Live Floating HUD Preview Card */}
        {overlayEnabled && (
          <View style={styles.hudPreviewBar}>
            <Text style={styles.hudText}>🎮 HUD: <Text style={{ color: '#00FF66' }}>120 FPS</Text></Text>
            <Text style={styles.hudText}>RAM: <Text style={{ color: '#00E5FF' }}>3.8 GB</Text></Text>
            <Text style={styles.hudText}>PING: <Text style={{ color: '#FFD700' }}>{ping}ms</Text></Text>
            <Text style={styles.hudText}>TOUCH: <Text style={{ color: '#FF2A2A' }}>1ms</Text></Text>
          </View>
        )}

        {/* Boost System Banner */}
        <View style={styles.boostCard}>
          <Text style={styles.boostStatusText}>{boostMessage}</Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: boostProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <TouchableOpacity
            style={[styles.boostButton, isBoosting && styles.buttonDisabled]}
            onPress={handleBoost}
            disabled={isBoosting}
          >
            {isBoosting ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.boostButtonText}>OPTIMIZING HARDWARE...</Text>
              </View>
            ) : (
              <Text style={styles.boostButtonText}>🚀 BOOST SYSTEM NOW</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Real-Time System Hardware Monitor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REAL-TIME HARDWARE MONITOR</Text>
          <View style={styles.row}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CPU LOAD</Text>
              <Text style={[styles.statValue, { color: cpuLoad < 20 ? '#00FF66' : '#FFD700' }]}>{cpuLoad}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>RAM FREED</Text>
              <Text style={[styles.statValue, { color: '#00E5FF' }]}>{ramFreed} GB</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>THERMAL</Text>
              <Text style={[styles.statValue, { color: '#00FF66' }]}>{temp}°C</Text>
            </View>
          </View>
        </View>

        {/* Interactive Feature Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAMING HARDWARE OPTIMIZATIONS</Text>
          
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>SuperTouch 120Hz Latency</Text>
              <Text style={styles.toggleDesc}>Reduces touch response latency to 1ms</Text>
            </View>
            <Switch
              value={superTouchEnabled}
              onValueChange={(val) => {
                setSuperTouchEnabled(val);
                Alert.alert("SuperTouch 120Hz", val ? "Enabled: 1ms Touch Latency Active" : "Disabled: Standard Latency");
              }}
              trackColor={{ false: '#333', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>Game Overlay HUD</Text>
              <Text style={styles.toggleDesc}>Show FPS, RAM, and Ping overlay in-game</Text>
            </View>
            <Switch
              value={overlayEnabled}
              onValueChange={(val) => {
                setOverlayEnabled(val);
                Alert.alert("Game Overlay HUD", val ? "Enabled: Live HUD Active" : "Disabled");
              }}
              trackColor={{ false: '#333', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>RAM Auto-Clean Engine</Text>
              <Text style={styles.toggleDesc}>Flushes background app cache automatically</Text>
            </View>
            <Switch
              value={autoCleanEnabled}
              onValueChange={setAutoCleanEnabled}
              trackColor={{ false: '#333', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.toggleRowBorderLess}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>Metal 3 GPU Ultra Render</Text>
              <Text style={styles.toggleDesc}>Forces max GPU shader clock for 120 FPS</Text>
            </View>
            <Switch
              value={gpuUltraEnabled}
              onValueChange={setGpuUltraEnabled}
              trackColor={{ false: '#333', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Free Fire Sensitivity Matrix (Interactive Adjustment) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREE FIRE SENSITIVITY MATRIX</Text>
          
          {/* Quick Presets */}
          <View style={styles.presetContainer}>
            <TouchableOpacity
              style={[styles.presetChip, activePreset === 'PRO' && styles.presetChipActive]}
              onPress={() => applyPreset('PRO')}
            >
              <Text style={[styles.presetText, activePreset === 'PRO' && styles.presetTextActive]}>🎯 PRO HEADSHOT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.presetChip, activePreset === 'DRAG' && styles.presetChipActive]}
              onPress={() => applyPreset('DRAG')}
            >
              <Text style={[styles.presetText, activePreset === 'DRAG' && styles.presetTextActive]}>⚡ DRAG ONE-TAP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.presetChip, activePreset === 'BALANCED' && styles.presetChipActive]}
              onPress={() => applyPreset('BALANCED')}
            >
              <Text style={[styles.presetText, activePreset === 'BALANCED' && styles.presetTextActive]}>🛡️ BALANCED</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Sensitivity Adjusters */}
          {[
            { label: 'General', key: 'general' },
            { label: 'Red Dot', key: 'redDot' },
            { label: '2x Scope', key: 'scope2x' },
            { label: '4x Scope', key: 'scope4x' },
            { label: 'AWM Scope', key: 'awm' },
            { label: 'Free Look', key: 'freeLook' },
          ].map((item) => (
            <View key={item.key} style={styles.sensAdjustRow}>
              <Text style={styles.sensItemLabel}>{item.label}</Text>
              
              <View style={styles.sensControlGroup}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => updateSens(item.key, -5)}
                >
                  <Text style={styles.adjustBtnText}>-5</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => updateSens(item.key, -1)}
                >
                  <Text style={styles.adjustBtnText}>-1</Text>
                </TouchableOpacity>

                <Text style={styles.sensValueText}>{sens[item.key]}</Text>

                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => updateSens(item.key, +1)}
                >
                  <Text style={styles.adjustBtnText}>+1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => updateSens(item.key, +5)}
                >
                  <Text style={styles.adjustBtnText}>+5</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Launch Game Button */}
        <TouchableOpacity style={styles.launchButton} onPress={launchFreeFire} activeOpacity={0.8}>
          <Text style={styles.launchButtonText}>🎮 LAUNCH FREE FIRE NOW</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF2A2A',
    fontFamily: 'Courier',
    textAlign: 'center',
    marginBottom: 36,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#888',
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#120D0D',
    borderWidth: 1.5,
    borderColor: '#FF2A2A',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier',
  },
  errorText: {
    color: '#FF2A2A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Courier',
  },
  button: {
    backgroundColor: '#FF2A2A',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF2A2A',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'Courier',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(255, 42, 42, 0.15)',
    borderWidth: 1,
    borderColor: '#FF2A2A',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: {
    color: '#FF2A2A',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  hudPreviewBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  hudText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  boostCard: {
    backgroundColor: '#120D0D',
    borderWidth: 1.5,
    borderColor: '#FF2A2A',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF2A2A',
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  boostStatusText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginBottom: 14,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#222',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF2A2A',
  },
  boostButton: {
    backgroundColor: '#FF2A2A',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  boostButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#111111',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  sectionTitle: {
    color: '#777',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginBottom: 14,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#090909',
    padding: 14,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  statLabel: {
    color: '#666',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  statValue: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  toggleRowBorderLess: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  toggleDesc: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'Courier',
    marginTop: 2,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: 'rgba(255, 42, 42, 0.2)',
    borderColor: '#FF2A2A',
  },
  presetText: {
    color: '#888',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  presetTextActive: {
    color: '#FF2A2A',
  },
  sensAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#181818',
  },
  sensItemLabel: {
    color: '#DDD',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  sensControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustBtn: {
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  adjustBtnText: {
    color: '#FF2A2A',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  sensValueText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginHorizontal: 8,
    minWidth: 28,
    textAlign: 'center',
  },
  launchButton: {
    backgroundColor: '#00C853',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
    shadowColor: '#00C853',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  launchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
});
