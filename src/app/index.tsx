import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Splash() {
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);

  const navigateAfterDismiss = (href: string) => {
    setShowPrivacySheet(false);
    setTimeout(() => router.push(href as any), 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6A64" />

      <View style={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.brand}>Tether</Text>

          <Text style={styles.hook}>
            Your labs just came back.{'\n'}
            <Text style={styles.hookItalic}>Now what?</Text>
          </Text>

          <Text style={styles.description}>
            Tether reads your health data and tells you what it means, what to
            watch, and what to ask your doctor.
          </Text>

          {/* Example insight card */}
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>• EXAMPLE INSIGHT</Text>
            <Text style={styles.insightTitle}>
              Your Vitamin D has been low for 3 months in a row
            </Text>
            <Text style={styles.insightBody}>
              This pattern is common in your region during winter, but it can
              explain the fatigue you've been logging. Similar patients improved
              in 6 weeks with a daily supplement.
            </Text>

            <View style={styles.askDoctorRow}>
              <View style={styles.askDoctorIconWrap}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.askDoctorBody}>
                <Text style={styles.askDoctorTitle}>Ask your doctor</Text>
                <Text style={styles.askDoctorText}>
                  "Should I start taking Vitamin D3? What dosage do you recommend?"
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <TouchableOpacity
            onPress={() => setShowPrivacySheet(true)}
            style={styles.getStartedButton}
            activeOpacity={0.9}
          >
            <Text style={styles.getStartedText}>Get started</Text>
          </TouchableOpacity>

          <Text style={styles.signInRow}>
            Already have an account?{' '}
            <Text
              style={styles.signInLink}
              onPress={() => router.push('/(tabs)' as any)}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </View>

      {/* Privacy bottom sheet */}
      <Modal
        visible={showPrivacySheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacySheet(false)}
      >
        <View style={styles.modalContainer}>
          {/* Dimmed backdrop — tap to dismiss */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowPrivacySheet(false)}
          />

          {/* Sheet */}
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sheetTitle}>Your data stays yours</Text>
              <Text style={styles.sheetSubtitle}>
                One quick overview, then we'll get started.
              </Text>

              <View style={styles.privacyList}>
                <View style={styles.privacyItem}>
                  <View style={[styles.privacyIconWrap, { backgroundColor: '#F5EDDF' }]}>
                    <Ionicons name="lock-closed-outline" size={16} color="#B89B6A" />
                  </View>
                  <View style={styles.privacyItemBody}>
                    <Text style={styles.privacyItemTitle}>Stored only on your device</Text>
                    <Text style={styles.privacyItemText}>
                      Your health data never leaves your phone. You control what
                      gets shared, and when.
                    </Text>
                  </View>
                </View>

                <View style={styles.privacyItem}>
                  <View style={[styles.privacyIconWrap, { backgroundColor: '#DFE9E6' }]}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#3D6E68" />
                  </View>
                  <View style={styles.privacyItemBody}>
                    <Text style={styles.privacyItemTitle}>Anonymized comparisons only</Text>
                    <Text style={styles.privacyItemText}>
                      Population insights use de-identified, aggregated data. No
                      personal info is ever used.
                    </Text>
                  </View>
                </View>

                <View style={styles.privacyItem}>
                  <View style={[styles.privacyIconWrap, { backgroundColor: '#DFE9E6' }]}>
                    <Ionicons name="people-outline" size={16} color="#3D6E68" />
                  </View>
                  <View style={styles.privacyItemBody}>
                    <Text style={styles.privacyItemTitle}>You control sharing</Text>
                    <Text style={styles.privacyItemText}>
                      Doctors only see what you explicitly choose to share with them.
                    </Text>
                  </View>
                </View>

                <View style={styles.privacyItem}>
                  <View style={[styles.privacyIconWrap, { backgroundColor: '#F2E8E6' }]}>
                    <Ionicons name="document-text-outline" size={16} color="#A8706A" />
                  </View>
                  <View style={styles.privacyItemBody}>
                    <Text style={styles.privacyItemTitle}>Your data stays yours</Text>
                    <Text style={styles.privacyItemText}>
                      Tether only accesses what you choose to share. You decide
                      what we can see—and you can change that any time.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Got it — let's start */}
              <TouchableOpacity
                onPress={() => navigateAfterDismiss('/welcome')}
                style={styles.sheetPrimaryButton}
                activeOpacity={0.85}
              >
                <Text style={styles.sheetPrimaryButtonText}>Got it — let's start</Text>
              </TouchableOpacity>

              {/* Try without account */}
              <TouchableOpacity
                onPress={() => navigateAfterDismiss('/guest-chat')}
                style={styles.sheetSecondaryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.sheetSecondaryButtonText}>
                  Try it without an account first →
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowPrivacySheet(false)}
                style={styles.sheetTertiaryButton}
                activeOpacity={0.6}
              >
                <Text style={styles.sheetTertiaryButtonText}>
                  Read full privacy policy
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E6A64',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },

  // Hero
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  hook: {
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  hookItalic: {
    fontStyle: 'italic',
    fontWeight: '300',
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 40,
  },

  // Insight card
  insightCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 20,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  insightBody: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  askDoctorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 14,
  },
  askDoctorIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  askDoctorBody: {
    flex: 1,
  },
  askDoctorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  askDoctorText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.7)',
  },

  // CTA
  cta: {
    paddingTop: 32,
  },
  getStartedButton: {
    height: 56,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  getStartedText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1A17',
  },
  signInRow: {
    textAlign: 'center',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
  },
  signInLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'underline',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FEFCF8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
  sheetHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EAE6E0',
    alignSelf: 'center',
    marginBottom: 32,
  },
  sheetTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400',
    color: '#1A1816',
    marginBottom: 12,
  },
  sheetSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#7A7570',
    marginBottom: 32,
  },

  // Privacy list
  privacyList: {
    gap: 24,
    marginBottom: 40,
  },
  privacyItem: {
    flexDirection: 'row',
    gap: 16,
  },
  privacyIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  privacyItemBody: {
    flex: 1,
  },
  privacyItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1816',
    marginBottom: 4,
    lineHeight: 20,
  },
  privacyItemText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#2A2520',
  },

  // Sheet buttons
  sheetPrimaryButton: {
    height: 56,
    borderRadius: 100,
    backgroundColor: '#2E6A64',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2E6A64',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  sheetPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sheetSecondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: 'rgba(46,125,125,0.08)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetSecondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D7D',
  },
  sheetTertiaryButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sheetTertiaryButtonText: {
    fontSize: 14,
    color: '#7A7570',
    textAlign: 'center',
  },
});
