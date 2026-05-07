import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const navigate = () => router.push('/setting-up-dashboard' as any);

export default function NotificationPermission() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6A64" />

      {/* Step dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i === 3 && styles.dotActive]} />
        ))}
      </View>

      {/* Centered content */}
      <View style={styles.content}>
        {/* Bell icon box */}
        <View style={styles.iconBox}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Stay on track with Tether</Text>

        <Text style={styles.description}>
          Tether will only notify you when something is worth your attention —
          no noise, no spam.
        </Text>

        {/* Benefit rows */}
        <View style={styles.benefits}>
          <View style={styles.benefitRow}>
            <Ionicons name="notifications-outline" size={16} color="#FFFFFF" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Daily insights when Tether notices something</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="locate-outline" size={16} color="#FFFFFF" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Gentle nudges when goals need attention</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="calendar-outline" size={16} color="#FFFFFF" style={styles.benefitIcon} />
            <Text style={styles.benefitText}>Appointment reminders before your visits</Text>
          </View>
        </View>

        {/* Turn on */}
        <TouchableOpacity onPress={navigate} style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Turn on notifications</Text>
        </TouchableOpacity>

        {/* Not now */}
        <TouchableOpacity onPress={navigate} style={styles.skipButton} activeOpacity={0.6}>
          <Text style={styles.skipText}>Not now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E6A64',
  },

  // Step dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 32,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },

  // Main content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 32,
  },

  // Benefits
  benefits: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },

  // Buttons
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2E6A64',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
});
