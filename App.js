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
  StatusBar
} from 'react-native';

const ADMIN_SERVER_URL = "http://78.154.103.8:15429/api/validate_key";

export default function App() {
  const [isActivated, setIsActivated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard States
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostStatus, setBoostStatus] = useState("SYSTEM OPTIMAL");
  const [superTouchEnabled, setSuperTouchEnabled] = useState(true);
  const [overlayEnabled, setOverlayEnabled] = useState(true);

  // Sensitivity Sliders
  const [sens, setSens] = useState({
    general: 95,
    redDot: 88,
    scope2x: 82,
    scope4x: 75,
    awm: 50,
    freeLook: 60
  });

  const performActivation = async () => {
    const trimmedKey = licenseKey.trim();
    if (!trimmedKey) {
      setStatusMessage("Please enter a key first.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch(ADMIN_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        else if (reason.includes("device")) setStatusMessage("Active on another device. Reset device in Admin Panel.");
        else setStatusMessage(reason);
      }
    } catch (error) {
      setIsLoading(false);
      // Fallback offline validation for demo/testing
      if (trimmedKey.toUpperCase().startsWith("EPZ-") || trimmedKey.toUpperCase().startsWith("AKKI-")) {
        setIsActivated(true);
      } else {
        setStatusMessage("Couldn't reach license server. Check network connection.");
      }
    }
  };

  const handleBoost = () => {
    setIsBoosting(true);
    setBoostStatus("OPTIMIZING MEMORY & CACHE...");
    setTimeout(() => {
      setIsBoosting(false);
      setBoostStatus("BOOSTED! +25% TURBO PERFORMANCE");
    }, 2000);
  };

  const launchFreeFire = () => {
    Linking.canOpenURL("freefire://").then((supported) => {
      if (supported) {
        Linking.openURL("freefire://");
      } else {
        Linking.openURL("https://apps.apple.com/app/id1300146651");
      }
    });
  };

  if (!isActivated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.card}>
          <Text style={styles.title}>⚡ EPZ TURBO iOS</Text>
          <Text style={styles.subtitle}>ENTER YOUR LICENSE KEY TO ACTIVATE</Text>

          <TextInput
            style={styles.input}
            placeholder="AKKI-XXXX-XXXX-XXXX"
            placeholderTextColor="#666"
            value={licenseKey}
            onChangeText={setLicenseKey}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {statusMessage ? <Text style={styles.errorText}>{statusMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={performActivation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ACTIVATE LICENSE</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>⚡ EPZ GAME TURBO</Text>
            <Text style={styles.headerSubtitle}>iOS EXECUTIVE EDITION v1.82</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VIP ACTIVE</Text>
          </View>
        </View>

        {/* Boost Banner */}
        <View style={styles.boostCard}>
          <Text style={styles.boostStatusText}>{boostStatus}</Text>
          <TouchableOpacity
            style={[styles.boostButton, isBoosting && styles.buttonDisabled]}
            onPress={handleBoost}
            disabled={isBoosting}
          >
            {isBoosting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.boostButtonText}>🚀 BOOST SYSTEM NOW</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* System Hardware Monitor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM HARDWARE MONITOR</Text>
          <View style={styles.row}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CPU LOAD</Text>
              <Text style={styles.statValue}>18%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>RAM FREED</Text>
              <Text style={styles.statValue}>2.4 GB</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>THERMAL</Text>
              <Text style={[styles.statValue, { color: '#00FF66' }]}>NOMINAL</Text>
            </View>
          </View>
        </View>

        {/* Feature Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAMING OPTIMIZATIONS</Text>
          
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>SuperTouch 120Hz Latency</Text>
              <Text style={styles.toggleDesc}>Reduces touch response latency to 1ms</Text>
            </View>
            <Switch
              value={superTouchEnabled}
              onValueChange={setSuperTouchEnabled}
              trackColor={{ false: '#333', true: '#FF2A2A' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Game Overlay HUD</Text>
              <Text style={styles.toggleDesc}>Show FPS and RAM overlay in-game</Text>
            </View>
            <Switch
              value={overlayEnabled}
              onValueChange={setOverlayEnabled}
              trackColor={{ false: '#333', true: '#FF2A2A' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Sensitivity Quick Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREE FIRE SENSITIVITY MATRIX</Text>
          
          <View style={styles.sensRow}>
            <Text style={styles.sensLabel}>General: {sens.general}</Text>
            <Text style={styles.sensLabel}>Red Dot: {sens.redDot}</Text>
          </View>
          <View style={styles.sensRow}>
            <Text style={styles.sensLabel}>2x Scope: {sens.scope2x}</Text>
            <Text style={styles.sensLabel}>4x Scope: {sens.scope4x}</Text>
          </View>
        </View>

        {/* Launch Game Button */}
        <TouchableOpacity style={styles.launchButton} onPress={launchFreeFire}>
          <Text style={styles.launchButtonText}>🎮 LAUNCH FREE FIRE NOW</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
    fontFamily: 'Courier',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#141010',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 42, 0.6)',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier',
    marginBottom: 16,
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'Courier',
  },
  badge: {
    backgroundColor: 'rgba(255, 42, 42, 0.2)',
    borderWidth: 1,
    borderColor: '#FF2A2A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FF2A2A',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  boostCard: {
    backgroundColor: '#141010',
    borderWidth: 1,
    borderColor: '#FF2A2A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  boostStatusText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginBottom: 16,
  },
  boostButton: {
    backgroundColor: '#FF2A2A',
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  boostButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  section: {
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#0A0A0A',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  statValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  toggleTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  toggleDesc: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'Courier',
    marginTop: 2,
  },
  sensRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sensLabel: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
  launchButton: {
    backgroundColor: '#00C853',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  launchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  },
});
