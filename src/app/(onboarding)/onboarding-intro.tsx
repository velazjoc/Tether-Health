import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

function TetherLogo({ size = 48 }: { size?: number }) {
  const s = size / 32;
  const color = '#2E7D7D';
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', left: 13 * s, top: 13 * s, width: 6 * s, height: 6 * s, borderRadius: 3 * s, backgroundColor: color }} />
      <View style={{ position: 'absolute', left: 4.5 * s, top: 9.5 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: color }} />
      <View style={{ position: 'absolute', right: 4.5 * s, top: 9.5 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: color }} />
    </View>
  );
}

export default function OnboardingIntro() {
  const [activeDot, setActiveDot] = useState(0);
  const shimmerX = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    // Staggered dot pulse via simple index cycling
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 300);

    // Looping shimmer bar
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: 500,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerX, {
          toValue: -80,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      {/* Background loading content — sits behind the scrim */}
      <View style={styles.bgContent} pointerEvents="none">
        <TetherLogo size={48} />
        <Text style={styles.loadingText}>Personalising your insights...</Text>

        {/* Pulsing dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeDot === i && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Shimmer progress bar */}
        <View style={styles.shimmerTrack}>
          <Animated.View
            style={[styles.shimmerBar, { transform: [{ translateX: shimmerX }] }]}
          />
        </View>
      </View>

      {/* Dark scrim */}
      <View style={styles.scrim} pointerEvents="none" />

      {/* Bottom sheet */}
      <SafeAreaView edges={['bottom'] as any} style={styles.sheet}>
        <View style={styles.sheetInner}>
          <Text style={styles.sheetTitle}>Here's how Tether works</Text>
          <Text style={styles.sheetSubtitle}>
            We'll show you around while your dashboard loads.
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/tutorial' as any)}
            style={styles.primaryButton}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Show me around</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)' as any)}
            style={styles.skipButton}
            activeOpacity={0.6}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    justifyContent: 'flex-end',
  },

  // Background centered content
  bgContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: '#2A2520',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(46,125,125,0.3)',
  },
  dotActive: {
    backgroundColor: '#2E7D7D',
    transform: [{ scale: 1.4 }],
  },
  shimmerTrack: {
    width: 200,
    height: 3,
    borderRadius: 100,
    backgroundColor: 'rgba(46,125,125,0.2)',
    overflow: 'hidden',
  },
  shimmerBar: {
    width: 80,
    height: 3,
    borderRadius: 100,
    backgroundColor: '#2E7D7D',
  },

  // Dark scrim
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Bottom sheet
  sheet: {
    backgroundColor: '#FEFCF8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,190,175,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 16,
  },
  sheetInner: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sheetTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '400',
    color: '#1C1A17',
    textAlign: 'center',
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#7A7570',
    textAlign: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2E6A64',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2E6A64',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 13,
    color: '#7A7570',
  },
});
