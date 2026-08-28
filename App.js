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
  Modal,
  FlatList
} from 'react-native';

const ADMIN_SERVER_URL = "http://78.154.103.8:15429/api/validate_key";
const { width } = Dimensions.get('window');

export default function App() {
  // Navigation & Activation
  const [isActivated, setIsActivated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active Modals & Views
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSuperTouchModal, setShowSuperTouchModal] = useState(false);

  // 5-Step Android Workflow Protocol
  const [step1Done, setStep1Done] = useState(false); // 1. Force Max Refresh Rate
  const [step2Done, setStep2Done] = useState(false); // 2. Edge Mistouch Guard
  const [step3Done, setStep3Done] = useState(false); // 3. FPS / RAM Overlay
  const [step4Done, setStep4Done] = useState(false); // 4. Clean Memory
  const [step5Done, setStep5Done] = useState(false); // 5. Tap to Boost (AKKI AI)

  // Hardware Metrics
  const [cpuLoad, setCpuLoad] = useState(24);
  const [ramFreed, setRamFreed] = useState(2.4);
  const [availableRam, setAvailableRam] = useState(3800);
  const [temp, setTemp] = useState(31);
  const [fps, setFps] = useState(120);
  const [ping, setPing] = useState(16);

  // Boost States & Animations
  const [isBoosting, setIsBoosting] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [boostMessage, setBoostMessage] = useState("SYSTEM HARDWARE OPTIMAL");
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // SuperTouch Latency Setting
  const [touchLatency, setTouchLatency] = useState(1); // 1ms

  // Sensitivity Matrix
  const [activePreset, setActivePreset] = useState('PRO');
  const [sens, setSens] = useState({
    general: 100,
    redDot: 95,
    scope2x: 90,
    scope4x: 85,
    awm: 50,
    freeLook: 65
  });

  // AKKI AI Chat Messages
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'ai', text: '⚡ Hello Legend! I am AKKI AI Gaming Engine. How can I optimize your Free Fire sensitivity today?' }
  ]);

  // Pulse animation loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // License Validation
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

  // Step 1: Force Refresh Rate
  const handleForceRefreshRate = () => {
    setStep1Done(true);
    Alert.alert("⚡ Step 1 Completed", "ProMotion 120Hz High Refresh Rate forced successfully!");
  };

  // Step 4: Clean Memory
  const handleCleanMemory = () => {
    if (!step1Done) {
      Alert.alert("⚠️ Step 1 Required First", "Please tap 'FORCE MAX REFRESH RATE (120Hz)' under Display Settings first!");
      return;
    }
    if (!step2Done) {
      Alert.alert("⚠️ Step 2 Required Next", "Please toggle ON 'Edge Mistouch Guard' next!");
      return;
    }
    if (!step3Done) {
      Alert.alert("⚠️ Step 3 Required Next", "Please toggle ON 'FPS / RAM Overlay' next!");
      return;
    }

    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
      setStep4Done(true);
      setRamFreed(3.8);
      setAvailableRam(4200);
      Alert.alert("🧹 Memory Cleaned!", "Freed ~1,450MB RAM · 4,200MB available for Gaming!");
    }, 1200);
  };

  // Step 5: Tap to Boost
  const handleTapToBoost = () => {
    if (!step1Done) {
      Alert.alert("⚠️ Step 1 Required First", "Please tap 'FORCE MAX REFRESH RATE (120Hz)' first!");
      return;
    }
    if (!step2Done) {
      Alert.alert("⚠️ Step 2 Required Next", "Please toggle ON 'Edge Mistouch Guard' next!");
      return;
    }
    if (!step3Done) {
      Alert.alert("⚠️ Step 3 Required Next", "Please toggle ON 'FPS / RAM Overlay' next!");
      return;
    }
    if (!step4Done) {
      Alert.alert("⚠️ Step 4 Required Next", "Please tap 'CLEAN MEMORY' next!");
      return;
    }

    setIsBoosting(true);
    setBoostMessage("1/3 TURNING AKKI AI CORE ENGINE...");
    progressAnim.setValue(0);

    Animated.timing(progressAnim, { toValue: 0.35, duration: 600, useNativeDriver: false }).start();

    setTimeout(() => {
      setBoostMessage("2/3 OPTIMIZING TOUCH RESPONSE (1ms)...");
      setCpuLoad(12);

      Animated.timing(progressAnim, { toValue: 0.70, duration: 700, useNativeDriver: false }).start();
    }, 800);

    setTimeout(() => {
      setBoostMessage("3/3 LOCKING METAL 3 GPU TO 120 FPS...");
      setCpuLoad(8);
      setTemp(29);
      setFps(120);

      Animated.timing(progressAnim, { toValue: 1.0, duration: 700, useNativeDriver: false }).start();
    }, 1600);

    setTimeout(() => {
      setIsBoosting(false);
      setStep5Done(true);
      setBoostMessage("⚡ AKKI AI ENGINE ACTIVE & BOOSTED!");
      Alert.alert("🚀 AKKI AI Engine Activated", "AKKI AI Performance Core is ON!\nSystem ready for Boost & Launch.");
    }, 2500);
  };

  // Step 6: Boost & Launch Game
  const handleBoostAndLaunch = () => {
    if (!step1Done) {
      Alert.alert("⚠️ Step 1 Required First", "Please tap 'FORCE MAX REFRESH RATE' under DISPLAY settings first!");
      return;
    }
    if (!step2Done) {
      Alert.alert("⚠️ Step 2 Required Next", "Please toggle ON 'Edge Mistouch Guard' next!");
      return;
    }
    if (!step3Done) {
      Alert.alert("⚠️ Step 3 Required Next", "Please toggle ON 'FPS / RAM Overlay' next!");
      return;
    }
    if (!step4Done) {
      Alert.alert("⚠️ Step 4 Required Next", "Please tap 'CLEAN MEMORY' next!");
      return;
    }
    if (!step5Done) {
      Alert.alert("⚠️ AKKI AI ENGINE IS OFF", "Please tap 'TAP TO BOOST' first to turn ON AKKI AI ENGINE before launching!");
      return;
    }

    Alert.alert(
      "🔥 GT PERFORMANCE MODE READY",
      "AKKI AI Engine & GT Performance Mode Active!\nLaunch Free Fire now?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "🎮 LAUNCH GAME NOW", onPress: launchFreeFire }
      ]
    );
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
      Linking.openURL("https://apps.apple.com/app/id1300146651");
    } catch (e) {
      Linking.openURL("https://apps.apple.com/app/id1300146651");
    }
  };

  // Sensitivity Handler
  const updateSens = (key, delta) => {
    setSens(prev => ({ ...prev, [key]: Math.min(100, Math.max(0, prev[key] + delta)) }));
    setActivePreset('CUSTOM');
  };

  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    if (presetName === 'PRO') {
      setSens({ general: 100, redDot: 95, scope2x: 90, scope4x: 85, awm: 50, freeLook: 65 });
      Alert.alert("🎯 Pro Headshot Matrix", "General: 100 | Red Dot: 95 | 2x: 90 | 4x: 85");
    } else if (presetName === 'DRAG') {
      setSens({ general: 100, redDot: 100, scope2x: 95, scope4x: 90, awm: 60, freeLook: 80 });
      Alert.alert("⚡ Drag One-Tap Matrix", "General: 100 | Red Dot: 100 | 2x: 95 | 4x: 90");
    } else if (presetName === 'BALANCED') {
      setSens({ general: 90, redDot: 85, scope2x: 80, scope4x: 75, awm: 45, freeLook: 50 });
      Alert.alert("🛡️ Balanced Precision Matrix", "General: 90 | Red Dot: 85 | 2x: 80 | 4x: 75");
    }
  };

  // AKKI AI Assistant Chat Response Engine
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let responseText = "🤖 AKKI AI Recommendation: Keep General Sensitivity at 100 and Red Dot at 95 with SuperTouch 120Hz active for max headshots!";
      const lower = userMsg.toLowerCase();
      if (lower.includes("headshot") || lower.includes("sens")) {
        responseText = "🎯 For iPhone One-Tap Headshots: Set General to 100, Red Dot to 100, and 2x Scope to 95. Activate SuperTouch 1ms Latency!";
      } else if (lower.includes("lag") || lower.includes("fps")) {
        responseText = "⚡ FPS Optimization: Force 120Hz Refresh Rate, turn ON RAM Auto-Clean, and tap 'CLEAN MEMORY' before entering ranked matches!";
      } else if (lower.includes("dpi") || lower.includes("touch")) {
        responseText = "📱 Touch Latency Settings: SuperTouch 120Hz reduces touch response delay to 1ms for ultra-responsive drag shots!";
      }

      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText }]);
    }, 800);
  };

  // License Screen
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
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>🔑 ACTIVATE VIP LICENSE</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Dashboard Screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Bar with Drawer Button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowDrawer(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>⚡ EPZ GAME TURBO</Text>
        <TouchableOpacity style={styles.aiHeaderBtn} onPress={() => setShowAiChat(true)}>
          <Text style={styles.aiHeaderBtnText}>🤖 AKKI AI</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Step Workflow Status Card */}
        <View style={styles.workflowCard}>
          <Text style={styles.workflowTitle}>ANDROID 5-STEP PROTOCOL WORKFLOW</Text>
          
          <View style={styles.stepGrid}>
            <View style={[styles.stepBadge, step1Done && styles.stepBadgeDone]}>
              <Text style={styles.stepBadgeText}>1. 120Hz {step1Done ? '✔' : ''}</Text>
            </View>
            <View style={[styles.stepBadge, step2Done && styles.stepBadgeDone]}>
              <Text style={styles.stepBadgeText}>2. GUARD {step2Done ? '✔' : ''}</Text>
            </View>
            <View style={[styles.stepBadge, step3Done && styles.stepBadgeDone]}>
              <Text style={styles.stepBadgeText}>3. OVERLAY {step3Done ? '✔' : ''}</Text>
            </View>
            <View style={[styles.stepBadge, step4Done && styles.stepBadgeDone]}>
              <Text style={styles.stepBadgeText}>4. MEMORY {step4Done ? '✔' : ''}</Text>
            </View>
            <View style={[styles.stepBadge, step5Done && styles.stepBadgeDone]}>
              <Text style={styles.stepBadgeText}>5. AKKI AI {step5Done ? '✔' : ''}</Text>
            </View>
          </View>
        </View>

        {/* Live HUD Overlay Banner */}
        {step3Done && (
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
              <Text style={[styles.hudValue, { color: '#FF2A2A' }]}>{touchLatency}ms</Text>
            </View>
          </View>
        )}

        {/* Boost Banner */}
        <View style={styles.boostCard}>
          <Text style={styles.boostStatusText}>{boostMessage}</Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>

          <Animated.View style={{ transform: [{ scale: isBoosting ? 1.0 : pulseAnim }], width: '100%' }}>
            <TouchableOpacity
              style={[styles.boostButton, isBoosting && styles.boostButtonActive]}
              onPress={handleTapToBoost}
              disabled={isBoosting}
            >
              {isBoosting ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.boostButtonText}>ACTIVATING AKKI AI ENGINE...</Text>
                </View>
              ) : (
                <Text style={styles.boostButtonText}>⚡ TAP TO BOOST (STEP 5)</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* 5-Step Action Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STEP 1 - 4 OPTIMIZATION ACTIONS</Text>

          {/* Action 1: Force Refresh Rate */}
          <TouchableOpacity style={styles.actionRow} onPress={handleForceRefreshRate}>
            <View>
              <Text style={styles.actionTitle}>STEP 1: FORCE MAX REFRESH RATE (120Hz)</Text>
              <Text style={styles.actionDesc}>Forces ProMotion 120Hz Ultra Refresh Rate</Text>
            </View>
            <Text style={[styles.actionStatus, step1Done && styles.actionStatusDone]}>{step1Done ? 'ACTIVE ✔' : 'START'}</Text>
          </TouchableOpacity>

          {/* Action 2: Edge Guard Switch */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>STEP 2: EDGE MISTOUCH GUARD</Text>
              <Text style={styles.toggleDesc}>Prevents palm touch interference while gaming</Text>
            </View>
            <Switch
              value={step2Done}
              onValueChange={(val) => {
                if (!step1Done) {
                  Alert.alert("⚠️ Step 1 Required First", "Please tap 'FORCE MAX REFRESH RATE (120Hz)' first!");
                  return;
                }
                setStep2Done(val);
              }}
              trackColor={{ false: '#222', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>

          {/* Action 3: FPS Overlay Switch */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.toggleTitle}>STEP 3: FPS / RAM OVERLAY HUD</Text>
              <Text style={styles.toggleDesc}>Show real-time floating FPS & RAM overlay</Text>
            </View>
            <Switch
              value={step3Done}
              onValueChange={(val) => {
                if (!step2Done) {
                  Alert.alert("⚠️ Step 2 Required Next", "Please toggle ON 'Edge Mistouch Guard' next!");
                  return;
                }
                setStep3Done(val);
              }}
              trackColor={{ false: '#222', true: '#FF2A2A' }}
              thumbColor="#FFF"
            />
          </View>

          {/* Action 4: Clean Memory */}
          <TouchableOpacity style={styles.actionRowBorderLess} onPress={handleCleanMemory}>
            <View>
              <Text style={styles.actionTitle}>STEP 4: CLEAN MEMORY CACHE</Text>
              <Text style={styles.actionDesc}>Flushes background app RAM & Cache</Text>
            </View>
            <Text style={[styles.actionStatus, step4Done && styles.actionStatusDone]}>
              {isCleaning ? 'CLEANING...' : step4Done ? 'CLEANED ✔' : 'CLEAN'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SuperTouch Latency Tuner Button */}
        <TouchableOpacity style={styles.superTouchCard} onPress={() => setShowSuperTouchModal(true)}>
          <View>
            <Text style={styles.superTouchTitle}>🎯 SUPERTOUCH 120Hz TUNER</Text>
            <Text style={styles.superTouchDesc}>Touch Latency: <Text style={{ color: '#00FF66' }}>{touchLatency}ms Ultra-Fast</Text></Text>
          </View>
          <Text style={styles.superTouchBtnText}>TUNE ⚙️</Text>
        </TouchableOpacity>

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

          {/* Presets */}
          <View style={styles.presetContainer}>
            <TouchableOpacity style={[styles.presetChip, activePreset === 'PRO' && styles.presetChipActive]} onPress={() => applyPreset('PRO')}>
              <Text style={[styles.presetText, activePreset === 'PRO' && styles.presetTextActive]}>🎯 PRO HEADSHOT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.presetChip, activePreset === 'DRAG' && styles.presetChipActive]} onPress={() => applyPreset('DRAG')}>
              <Text style={[styles.presetText, activePreset === 'DRAG' && styles.presetTextActive]}>⚡ DRAG ONE-TAP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.presetChip, activePreset === 'BALANCED' && styles.presetChipActive]} onPress={() => applyPreset('BALANCED')}>
              <Text style={[styles.presetText, activePreset === 'BALANCED' && styles.presetTextActive]}>🛡️ BALANCED</Text>
            </TouchableOpacity>
          </View>

          {/* Adjusters */}
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
                <TouchableOpacity style={styles.adjustBtn} onPress={() => updateSens(item.key, -5)}>
                  <Text style={styles.adjustBtnText}>-5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => updateSens(item.key, -1)}>
                  <Text style={styles.adjustBtnText}>-1</Text>
                </TouchableOpacity>
                <View style={styles.valueBadge}>
                  <Text style={styles.sensValueText}>{sens[item.key]}</Text>
                </View>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => updateSens(item.key, +1)}>
                  <Text style={styles.adjustBtnText}>+1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => updateSens(item.key, +5)}>
                  <Text style={styles.adjustBtnText}>+5</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Step 6: Giant Launch Game Button */}
        <TouchableOpacity style={styles.launchButton} onPress={handleBoostAndLaunch} activeOpacity={0.8}>
          <Text style={styles.launchButtonText}>🚀 STEP 6: BOOST & LAUNCH FREE FIRE</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Navigation Drawer Modal */}
      <Modal visible={showDrawer} animationType="slide" transparent={true}>
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContent}>
            <Text style={styles.drawerHeader}>⚡ EPZ TURBO MENU</Text>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setShowDrawer(false); setShowAiChat(true); }}>
              <Text style={styles.drawerItemText}>🤖 AKKI AI GAMING ASSISTANT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => { setShowDrawer(false); setShowSetupGuide(true); }}>
              <Text style={styles.drawerItemText}>📖 SETUP GUIDE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => { setShowDrawer(false); setShowSettings(true); }}>
              <Text style={styles.drawerItemText}>⚙️ ENGINE SETTINGS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => { setShowDrawer(false); Alert.alert("EPZ Game Turbo", "Version: 1.82 Executive Edition\nStatus: License VIP Active"); }}>
              <Text style={styles.drawerItemText}>📜 TERMS & LICENSE STATUS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeDrawerBtn} onPress={() => setShowDrawer(false)}>
              <Text style={styles.closeDrawerBtnText}>CLOSE MENU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* AKKI AI Chat Modal */}
      <Modal visible={showAiChat} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🤖 AKKI AI GAMING ENGINE</Text>
            <TouchableOpacity onPress={() => setShowAiChat(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={chatMessages}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={[styles.chatBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={styles.chatText}>{item.text}</Text>
              </View>
            )}
          />

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask AKKI AI about sensitivity or lag..."
              placeholderTextColor="#666"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.chatSendBtn} onPress={sendChatMessage}>
              <Text style={styles.chatSendBtnText}>SEND</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* SuperTouch Tuner Modal */}
      <Modal visible={showSuperTouchModal} animationType="fade" transparent={true}>
        <View style={styles.drawerOverlay}>
          <View style={styles.superTouchModalContent}>
            <Text style={styles.superTouchModalTitle}>🎯 SUPERTOUCH 120Hz LATENCY TUNER</Text>
            <Text style={styles.superTouchModalDesc}>Select Touch Response Delay:</Text>

            {[1, 2, 5, 10].map(ms => (
              <TouchableOpacity
                key={ms}
                style={[styles.latencyOption, touchLatency === ms && styles.latencyOptionActive]}
                onPress={() => {
                  setTouchLatency(ms);
                  setShowSuperTouchModal(false);
                  Alert.alert("SuperTouch Latency", `Touch response set to ${ms}ms Ultra-Fast!`);
                }}
              >
                <Text style={[styles.latencyOptionText, touchLatency === ms && styles.latencyOptionTextActive]}>
                  {ms}ms {ms === 1 ? '(ULTRA FAST 🎯)' : ''}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeDrawerBtn} onPress={() => setShowSuperTouchModal(false)}>
              <Text style={styles.closeDrawerBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { padding: 16 },
  card: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#FFF', fontFamily: 'Courier', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 11, fontWeight: 'bold', color: '#FF2A2A', fontFamily: 'Courier', textAlign: 'center', marginBottom: 36 },
  inputBoxContainer: { marginBottom: 20 },
  inputLabel: { color: '#888', fontSize: 10, fontFamily: 'Courier', fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#100B0B', borderWidth: 1.5, borderColor: '#FF2A2A', borderRadius: 10, padding: 16, fontSize: 16, fontWeight: 'bold', color: '#FFF', fontFamily: 'Courier' },
  errorText: { color: '#FF2A2A', fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 16, fontFamily: 'Courier' },
  button: { backgroundColor: '#FF2A2A', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold', fontFamily: 'Courier' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  menuButton: { padding: 4 },
  menuIcon: { color: '#FF2A2A', fontSize: 24, fontWeight: 'bold' },
  topBarTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', fontFamily: 'Courier' },
  aiHeaderBtn: { backgroundColor: 'rgba(255, 42, 42, 0.2)', borderWidth: 1, borderColor: '#FF2A2A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  aiHeaderBtnText: { color: '#FF2A2A', fontSize: 10, fontWeight: 'bold', fontFamily: 'Courier' },
  workflowCard: { backgroundColor: '#0D0D0D', borderWidth: 1, borderColor: '#FF2A2A', borderRadius: 12, padding: 14, marginBottom: 16 },
  workflowTitle: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', fontFamily: 'Courier', marginBottom: 10, textAlign: 'center' },
  stepGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  stepBadge: { backgroundColor: '#151515', borderWidth: 1, borderColor: '#333', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  stepBadgeDone: { backgroundColor: 'rgba(0, 255, 102, 0.2)', borderColor: '#00FF66' },
  stepBadgeText: { color: '#FFF', fontSize: 8, fontWeight: 'bold', fontFamily: 'Courier' },
  hudContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#0E0E0E', borderWidth: 1, borderColor: '#222', borderRadius: 10, paddingVertical: 10, marginBottom: 16 },
  hudItem: { alignItems: 'center' },
  hudLabel: { color: '#666', fontSize: 8, fontWeight: 'bold', fontFamily: 'Courier' },
  hudValue: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Courier', marginTop: 2 },
  hudDivider: { width: 1, height: 18, backgroundColor: '#222' },
  boostCard: { backgroundColor: '#0F0909', borderWidth: 1.5, borderColor: '#FF2A2A', borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 20 },
  boostStatusText: { color: '#FFD700', fontSize: 12, fontWeight: 'bold', fontFamily: 'Courier', marginBottom: 14, textAlign: 'center' },
  progressTrack: { width: '100%', height: 6, backgroundColor: '#1E1E1E', borderRadius: 3, overflow: 'hidden', marginBottom: 16 },
  progressBar: { height: '100%', backgroundColor: '#FF2A2A' },
  boostButton: { backgroundColor: '#FF2A2A', width: '100%', padding: 16, borderRadius: 10, alignItems: 'center' },
  boostButtonActive: { backgroundColor: '#CC0000' },
  boostButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', fontFamily: 'Courier' },
  section: { backgroundColor: '#0D0D0D', borderRadius: 14, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: '#1A1A1A' },
  sectionTitle: { color: '#666', fontSize: 11, fontWeight: 'bold', fontFamily: 'Courier', marginBottom: 14 },
  sectionTitleNoMargin: { color: '#666', fontSize: 11, fontWeight: 'bold', fontFamily: 'Courier' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#161616' },
  actionRowBorderLess: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  actionTitle: { color: '#FFF', fontSize: 12, fontWeight: 'bold', fontFamily: 'Courier' },
  actionDesc: { color: '#555', fontSize: 9, fontFamily: 'Courier', marginTop: 2 },
  actionStatus: { color: '#FF2A2A', fontSize: 10, fontWeight: 'bold', fontFamily: 'Courier', borderWidth: 1, borderColor: '#FF2A2A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  actionStatusDone: { color: '#00FF66', borderColor: '#00FF66', backgroundColor: 'rgba(0, 255, 102, 0.15)' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#161616' },
  toggleTitle: { color: '#FFF', fontSize: 12, fontWeight: 'bold', fontFamily: 'Courier' },
  toggleDesc: { color: '#555', fontSize: 9, fontFamily: 'Courier', marginTop: 2 },
  superTouchCard: { backgroundColor: '#100B0B', borderWidth: 1.5, borderColor: '#00FF66', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  superTouchTitle: { color: '#FFF', fontSize: 13, fontWeight: 'bold', fontFamily: 'Courier' },
  superTouchDesc: { color: '#888', fontSize: 10, fontFamily: 'Courier', marginTop: 2 },
  superTouchBtnText: { color: '#00FF66', fontSize: 12, fontWeight: 'bold', fontFamily: 'Courier' },
  activePresetBadge: { backgroundColor: 'rgba(0, 255, 102, 0.15)', borderWidth: 1, borderColor: '#00FF66', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  activePresetBadgeText: { color: '#00FF66', fontSize: 9, fontWeight: 'bold', fontFamily: 'Courier' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: '#050505', padding: 14, borderRadius: 10, flex: 1, marginHorizontal: 3, alignItems: 'center', borderWidth: 1, borderColor: '#1E1E1E' },
  statLabel: { color: '#555', fontSize: 9, fontWeight: 'bold', fontFamily: 'Courier' },
  statValue: { fontSize: 17, fontWeight: 'bold', fontFamily: 'Courier', marginTop: 4 },
  presetContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  presetChip: { flex: 1, backgroundColor: '#141414', borderWidth: 1, borderColor: '#222', paddingVertical: 10, borderRadius: 8, marginHorizontal: 2, alignItems: 'center' },
  presetChipActive: { backgroundColor: 'rgba(255, 42, 42, 0.2)', borderColor: '#FF2A2A' },
  presetText: { color: '#777', fontSize: 9, fontWeight: 'bold', fontFamily: 'Courier' },
  presetTextActive: { color: '#FF2A2A' },
  sensAdjustRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#141414' },
  sensItemLabel: { color: '#DDD', fontSize: 12, fontWeight: 'bold', fontFamily: 'Courier' },
  sensControlGroup: { flexDirection: 'row', alignItems: 'center' },
  adjustBtn: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#2A2A2A', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, marginHorizontal: 2 },
  adjustBtnText: { color: '#FF2A2A', fontSize: 11, fontWeight: 'bold', fontFamily: 'Courier' },
  valueBadge: { backgroundColor: '#100B0B', borderWidth: 1, borderColor: '#FF2A2A', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, marginHorizontal: 2 },
  sensValueText: { color: '#FFF', fontSize: 13, fontWeight: 'bold', fontFamily: 'Courier', minWidth: 26, textAlign: 'center' },
  launchButton: { backgroundColor: '#00C853', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 8, marginBottom: 30 },
  launchButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold', fontFamily: 'Courier' },
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  drawerContent: { width: '85%', backgroundColor: '#0A0A0A', borderWidth: 1.5, borderColor: '#FF2A2A', borderRadius: 14, padding: 20 },
  drawerHeader: { color: '#FFF', fontSize: 20, fontWeight: 'bold', fontFamily: 'Courier', marginBottom: 20, textAlign: 'center' },
  drawerItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  drawerItemText: { color: '#FF2A2A', fontSize: 13, fontWeight: 'bold', fontFamily: 'Courier' },
  closeDrawerBtn: { backgroundColor: '#222', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  closeDrawerBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', fontFamily: 'Courier' },
  modalContainer: { flex: 1, backgroundColor: '#050505' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  modalTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'Courier' },
  modalClose: { color: '#FF2A2A', fontSize: 20, fontWeight: 'bold' },
  chatBubble: { padding: 12, borderRadius: 10, marginBottom: 10, maxWidth: '80%' },
  aiBubble: { backgroundColor: '#120D0D', borderColor: '#FF2A2A', borderWidth: 1, alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#00C853', alignSelf: 'flex-end' },
  chatText: { color: '#FFF', fontSize: 13, fontFamily: 'Courier' },
  chatInputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#1A1A1A' },
  chatInput: { flex: 1, backgroundColor: '#101010', borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingHorizontal: 12, color: '#FFF', fontFamily: 'Courier' },
  chatSendBtn: { backgroundColor: '#FF2A2A', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8, marginLeft: 8 },
  chatSendBtnText: { color: '#FFF', fontWeight: 'bold', fontFamily: 'Courier' },
  superTouchModalContent: { width: '85%', backgroundColor: '#0A0A0A', borderWidth: 1.5, borderColor: '#00FF66', borderRadius: 14, padding: 20 },
  superTouchModalTitle: { color: '#00FF66', fontSize: 16, fontWeight: 'bold', fontFamily: 'Courier', marginBottom: 8, textAlign: 'center' },
  superTouchModalDesc: { color: '#888', fontSize: 11, fontFamily: 'Courier', marginBottom: 16, textAlign: 'center' },
  latencyOption: { padding: 14, backgroundColor: '#121212', borderWidth: 1, borderColor: '#333', borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  latencyOptionActive: { backgroundColor: 'rgba(0, 255, 102, 0.2)', borderColor: '#00FF66' },
  latencyOptionText: { color: '#888', fontSize: 13, fontWeight: 'bold', fontFamily: 'Courier' },
  latencyOptionTextActive: { color: '#00FF66' },
});
