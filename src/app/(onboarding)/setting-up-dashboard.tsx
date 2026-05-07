import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

// Primary-color logo (cream background screen)
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

export default function SettingUpDashboard() {
  // Fills from left: bar starts fully off-screen left (-200) and slides to 0
  const translateX = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding-intro' as any);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <View style={styles.content}>
        <TetherLogo size={48} />
        <Text style={styles.title}>Setting up your dashboard</Text>
        <Text style={styles.description}>
          Just a moment while Tether gets everything ready.
        </Text>

        {/* Animated fill-from-left progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressBar, { transform: [{ translateX }] }]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '400',
    color: '#1C1A17',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#7A7570',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 240,
  },
  progressTrack: {
    width: 200,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(46,125,125,0.2)',
    overflow: 'hidden',
  },
  progressBar: {
    width: 200,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2E7D7D',
  },
});
