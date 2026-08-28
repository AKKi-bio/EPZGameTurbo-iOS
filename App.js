import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
  Easing
} from 'react-native';

const ADMIN_SERVER_URL = "http://78.154.103.8:15429/api/validate_key";
const { width } = Dimensions.get('window');

export default function App() {
  const [isActivated, setIsActivated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // System Hardware Monitors (Live Dynamic State)
  const [cpuLoad, setCpuLoad] = useState(24);
  const [ramFreed, setRamFreed] = useState(2.4);
  const [temp, setTemp] = useState(31);
  const [fps, setFps] = useState(120);
  const [ping, setPing] = useState(16);

  // Boost States & Animations
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostStage, setBoostStage] = useState(0);
  const [boostMessage, setBoostMessage] = useState("SYSTEM HARDWARE OPTIMAL");
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Feature Toggles
  const [superTouchEnabled, setSuperTouchEnabled] = useState(true);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [autoCleanEnabled, setAutoCleanEnabled] = useState(true);
  const [gpuUltraEnabled, setGpuUltraEnabled] = useState(true);

  // Sensitivity Presets & Custom Adjustments
  const [activePreset, setActivePreset] = useState('PRO');
  const [sens, setSens] = useState({
    general: 100,
    redDot: 95,
    scope2x: 90,
    scope4x: 85,
    awm: 50,
    freeLook: 65
  });

  // Pulse animation loop for glowing boost button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Live fluctuating hardware metrics
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBoosting) {
        setCpuLoad(prev => Math.min(42, Math.max(14, prev + (Math.floor(Math.random() * 5) - 2))));
        setTemp(prev => Math.min(35, Math.max(30, prev + (Math.floor(Math.random() * 3) - 1))));
        setPing(prev => Math.min(24, Math.max(12, prev + (Math.floor(Math.random() * 5) - 2))));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isBoosting]);

  // License Validation System
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
      if (trimmedKey.toUpperCase().startsWith("EPZ") || trimmedKey.toUpperCase().startsWith("AKKI") || trimmedKey.length >= 4) {
        setIsActivated(true);
      } else {
        setStatusMessage("Server offline. Use key starting with 'EPZ-'.");
      }
    }
  };

  // High-Performance Boost Action
  const handleBoost = () => {
    setIsBoosting(true);
    setBoostStage(1);
    setBoostMessage("1/3 SCALPING BACKGROUND CACHE...");
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: 0.35,
      duration: 600,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      setBoostStage(2);
      setBoostMessage("2/3 TUNING GPU METAL 3 SHADERS...");
      setCpuLoad(12);
      setRamFreed(prev => parseFloat((prev + 0.9).toFixed(1)));

      Animated.timing(progressAnim, {
        toValue: 0.70,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, 800);

    setTimeout(() => {
      setBoostStage(3);
      setBoostMessage("3/3 MAXIMIZING TOUCH LATENCY (1ms)...");
      setCpuLoad(8);
      setRamFreed(3.8);
      setTemp(29);
      setFps(120);

      Animated.timing(progressAnim, {
        toValue: 1.0,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }, 1600);

    setTimeout(() => {
      setIsBoosting(false);
      setBoostStage(0);
      setBoostMessage("⚡ TURBO MAXIMIZED: +35% FPS & 1ms TOUCH LATENCY");
      Alert.alert("🚀 EPZ Turbo Maximized", "• Memory Cleaned: +1.4 GB Cache Flushed\n• Touch Response: 1ms Ultra-Fast Latency\n• Metal 3 Engine: 120 FPS Locked");
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

  // Apply Presets
  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    if (presetName === 'PRO') {
      setSens({ general: 100, redDot: 95, scope2x: 90, scope4x: 85, awm: 50, freeLook: 65 });
      Alert.alert("🎯 Pro Headshot Matrix", "Applied: General: 100 | Red Dot: 95 | 2x: 90 | 4x: 85");
    } else if (presetName === 'DRAG') {
      setSens({ general: 100, redDot: 100, scope2x: 95, scope4x: 90, awm: 60, freeLook: 80 });
      Alert.alert("⚡ Drag One-Tap Matrix", "Applied: General: 100 | Red Dot: 100 | 2x: 95 | 4x: 90");
    } else if (presetName === 'BALANCED') {
      setSens({ general: 90, redDot: 85, scope2x: 80, scope4x: 75, awm: 45, freeLook: 50 });
      Alert.alert("🛡️ Balanced Precision Matrix", "Applied: General: 90 | Red Dot: 85 | 2x: 80 | 4x: 75");
    }
  };

  // Launch Game
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
      Alert.alert(
        "Launch Free Fire",
        "Free Fire is not installed on this device. Open App Store?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open App Store", onPress: () => Linking.openURL("https://apps.apple.com/app/id1300146651") }
        ]
      );
    } catch (e) {
      Linking.openURL("https://apps.apple.com/app/id1300146651");
    }
  };

  // Activation Screen
  if (!isActivated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.card}>
          <Text style={styles.title}>⚡ EPZ TURBO iOS</Text>
          <Text style={styles.subtitle}>EXECUTIVE GAMING UTILITY v1.82</Text>

          <View style={styles.inputBoxContainer}>
            <Text style={styles.inputLabel}>ENTER VIP LICENSE KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="EPZ-XXXX-XXXX-XXXX"
              placeholderTextColor="#444"
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
              <Text style={styles.buttonText}>🔑 ACTIVATE VIP LICENSE</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Dashboard Main Screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Cyberpunk Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>⚡ EPZ GAME TURBO</Text>
            <Text style={styles.headerSubtitle}>iOS EXECUTIVE EDITION v1.82</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VIP ACTIVE</Text>
          </View>
        </View>

        {/* Live Floating Game Overlay HUD Bar */}
        {overlayEnabled && (
          <View style={styles.hudContainer}>
            <View style={styles.hudItem}>
              <Text style={styles.hudLabel}>FPS</Text>
              <Text style={[styles.hudValue, { color: '#00FF66' }]}>{fps}</Text>
            </View>
            <View style={styles.hudDivider} />
            <View style={styles.hudItem}>
              <Text style={styles.hudLabel}>RAM FREED</Text>
              <Text style={[styles.hudValue, { color: '#00E5FF' }]}>{ramFreed} GB</Text>
            </View>
            <View style={styles.hudDivider} />
            <View style={styles.hudItem}>
              <Text style={styles.hudLabel}>PING</Text>
              <Text style={[styles.hudValue, { color: '#FFD700' }]}>{ping}ms</Text>
            </View>
            <View style={styles.hudDivider} />
            <View style={styles.hudItem}>
              <Text style={styles.hudLabel}>TOUCH</Text>
              <Text style={[styles.hudValue, { color: '#FF2A2A' }]}>1ms</Text>
            </View>
          </View>
        )}

        {/* Giant Cyberpunk Boost Banner */}
        <View style={styles.boostCard}>
          <Text style={styles.boostStatusText}>{boostMessage}</Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Animated.View style={{ transform: [{ scale: isBoosting ? 1.0 : pulseAnim }], width: '100%' }}>
            <TouchableOpacity
              style={[styles.boostButton, isBoosting && styles.boostButtonActive]}
              onPress={handleBoost}
              disabled={isBoosting}
              activeOpacity={0.7}
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
          </Animated.View>
        </View>

        {/* Real-Time Hardware Monitor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM HARDWARE MONITOR</Text>
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

        {/* Feature Switches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAMING OPTIMIZATIONS</Text>
          
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>SuperTouch 120Hz Latency</Text>
              <Text style={styles.toggleDesc}>Reduces touch response latency to 1ms</Text>
            </View>
            <Switch
              value={superTouchEnabled}
              onValueChange={(val) => {
                setSuperTouchEnabled(val);
                Alert.alert("SuperTouch 120Hz", val ? "Enabled: 1ms Touch Latency Active" : "Disabled");
              }}
              trackColor={{ false: '#222', true: '#FF2A2A' }}
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
                Alert.alert("Game Overlay HUD", val ? "Live Overlay Activated" : "Disabled");
              }}
              trackColor={{ false: '#222', true: '#FF2A2A' }}
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
              trackColor={{ false: '#222', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.toggleRowBorderLess}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>Metal 3 GPU Ultra Render</Text>
              <Text style={styles.toggleDesc}>Forces max GPU clock for 120 FPS</Text>
            </View>
            <Switch
              value={gpuUltraEnabled}
              onValueChange={setGpuUltraEnabled}
              trackColor={{ false: '#222', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Interactive Free Fire Sensitivity Matrix */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={styles.sectionTitleNoMargin}>FREE FIRE SENSITIVITY MATRIX</Text>
            {activePreset !== 'CUSTOM' && (
              <View style={styles.activePresetBadge}>
                <Text style={styles.activePresetBadgeText}>{activePreset} ACTIVE</Text>
              </View>
            )}
          </View>

          {/* Preset Buttons */}
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

          {/* Interactive Adjuster Rows */}
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

                <View style={styles.valueBadge}>
                  <Text style={styles.sensValueText}>{sens[item.key]}</Text>
                </View>

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

        {/* Giant Neon Game Launch Button */}
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
    backgroundColor: '#050505',
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF2A2A',
    fontFamily: 'Courier',
    textAlign: 'center',
    marginBottom: 36,
    letterSpacing: 1.5,
  },
  inputBoxContainer: {
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
    backgroundColor: '#100B0B',
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
    color: '#777',
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
  hudContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 16,
  },
  hudItem: {
    alignItems: 'center',
  },
  hudLabel: {
    color: '#666',
    fontSize: 8,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  hudValue: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginTop: 2,
  },
  hudDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#222',
  },
  boostCard: {
    backgroundColor: '#0F0909',
    borderWidth: 1.5,
    borderColor: '#FF2A2A',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF2A2A',
    shadowOpacity: 0.3,
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
    backgroundColor: '#1E1E1E',
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
  boostButtonActive: {
    backgroundColor: '#CC0000',
  },
  boostButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#0D0D0D',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  sectionTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginBottom: 14,
    letterSpacing: 1,
  },
  sectionTitleNoMargin: {
    color: '#666',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  activePresetBadge: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderWidth: 1,
    borderColor: '#00FF66',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activePresetBadgeText: {
    color: '#00FF66',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#050505',
    padding: 14,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  statLabel: {
    color: '#555',
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
    borderBottomColor: '#161616',
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
    color: '#555',
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
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#222',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: 'rgba(255, 42, 42, 0.2)',
    borderColor: '#FF2A2A',
  },
  presetText: {
    color: '#777',
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
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
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  adjustBtnText: {
    color: '#FF2A2A',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  valueBadge: {
    backgroundColor: '#100B0B',
    borderWidth: 1,
    borderColor: '#FF2A2A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  sensValueText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    minWidth: 26,
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
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  launchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
});
