import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface StandaloneTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
  isFromHome?: boolean;
}

export default function StandaloneTutorial({
  onComplete,
  onSkip,
  isFromHome = false,
}: StandaloneTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const isLastStep = currentStep === totalSteps - 1;

  // Animate forward button width: circle (44) → pill (130) on last step
  const forwardWidth = useRef(new Animated.Value(44)).current;
  const chevronOpacity = useRef(new Animated.Value(1)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(forwardWidth, {
      toValue: isLastStep ? 130 : 44,
      duration: 300,
      easing: Easing.out(Easing.back(1.3)),
      useNativeDriver: false,
    }).start();
    Animated.parallel([
      Animated.timing(chevronOpacity, { toValue: isLastStep ? 0 : 1, duration: 150, useNativeDriver: true }),
      Animated.timing(labelOpacity, { toValue: isLastStep ? 1 : 0, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [isLastStep]);

  const handleNext = () => {
    if (isLastStep) onComplete();
    else setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card */}
        <View style={styles.card}>
          {/* Close button */}
          <TouchableOpacity onPress={onSkip} style={styles.closeButton} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#7A7570" />
          </TouchableOpacity>

          {/* Step dots */}
          <View style={styles.dotsRow}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentStep && styles.dotActive]}
              />
            ))}
          </View>

          {/* Demo zone */}
          <View style={styles.demoZone}>
            {currentStep === 0 && <Step1Demo />}
            {currentStep === 1 && <Step2Demo />}
            {currentStep === 2 && <Step3Demo />}
            {currentStep === 3 && <Step4Demo />}
          </View>

          {/* Explanation */}
          <View style={styles.explanation}>
            {currentStep === 0 && (
              <>
                <Text style={styles.stepTitle}>Your daily insight</Text>
                <Text style={styles.stepBody}>
                  Every day Tether reads your data and tells you what it noticed — in plain language, not numbers.
                </Text>
                <View style={styles.hintPill}>
                  <Text style={styles.hintText}>Tap 'See what's behind this' to explore</Text>
                </View>
              </>
            )}
            {currentStep === 1 && (
              <>
                <Text style={styles.stepTitle}>Your health data</Text>
                <Text style={styles.stepBody}>
                  Connect your sources and upload records. The more context Tether has, the sharper your insights.
                </Text>
                <View style={styles.hintPill}>
                  <Text style={styles.hintText}>Everything Tether uses lives here</Text>
                </View>
              </>
            )}
            {currentStep === 2 && (
              <>
                <Text style={styles.stepTitle}>Your goals</Text>
                <Text style={styles.stepBody}>
                  Each goal traces back to your data or what your doctor said. Tether tracks them so you don't have to.
                </Text>
                <View style={styles.hintPill}>
                  <Text style={styles.hintText}>Tap a goal card to see the full trend</Text>
                </View>
              </>
            )}
            {currentStep === 3 && (
              <>
                <Text style={styles.stepTitle}>Ask Tether anything</Text>
                <Text style={styles.stepBody}>
                  Get help understanding your patterns, preparing for appointments, or exploring your data.
                </Text>
                <View style={styles.hintPill}>
                  <Text style={styles.hintText}>Available any time from the nav bar</Text>
                </View>
              </>
            )}
          </View>

          {/* Navigation row */}
          <View style={styles.navRow}>
            {/* Back */}
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentStep === 0}
              style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Forward / Get started */}
            <Animated.View style={[styles.navButton, styles.navButtonForward, { width: forwardWidth }]}>
              <TouchableOpacity
                onPress={handleNext}
                style={styles.navButtonInner}
                activeOpacity={0.8}
              >
                <Animated.View style={{ opacity: chevronOpacity, position: 'absolute' }}>
                  <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                </Animated.View>
                <Animated.Text style={[styles.forwardLabel, { opacity: labelOpacity }]}>
                  {isFromHome ? 'Back to home' : 'Get started'}
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Step demos ────────────────────────────────────────────────────────────────

function Step1Demo() {
  return (
    <View style={demo.insightCard}>
      {/* Teal header */}
      <View style={demo.insightHeader}>
        <View style={demo.needsAttentionBadge}>
          <Text style={demo.needsAttentionText}>Needs attention</Text>
        </View>
        <Text style={demo.insightHeadline}>
          Your deep sleep has dropped 31% this week
        </Text>
      </View>
      {/* Body */}
      <View style={demo.insightBody}>
        <Text style={demo.insightBodyText}>
          You've had less than 1hr of deep sleep for 5 nights running.
        </Text>
        <View style={demo.insightActions}>
          <View style={[demo.insightActionButton, demo.insightActionPrimary]}>
            <Text style={demo.insightActionPrimaryText}>See what's behind this →</Text>
          </View>
          <View style={[demo.insightActionButton, demo.insightActionSecondary]}>
            <Text style={demo.insightActionSecondaryText}>Ask Tether</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Step2Demo() {
  return (
    <View style={demo.listCard}>
      {/* Apple Health */}
      <View style={[demo.listRow, demo.listRowConnected, demo.listRowBorder]}>
        <Ionicons name="pulse-outline" size={16} color="#2E7D7D" style={demo.listRowIcon} />
        <Text style={demo.listRowLabel}>Apple Health</Text>
        <Text style={demo.listRowStatusConnected}>Connected</Text>
        <Ionicons name="chevron-forward" size={16} color="#7A7570" />
      </View>
      {/* Lab Results */}
      <View style={[demo.listRow, demo.listRowBorder]}>
        <Ionicons name="document-text-outline" size={16} color="#7A7570" style={demo.listRowIcon} />
        <Text style={demo.listRowLabel}>Lab Results</Text>
        <Text style={demo.listRowStatus}>2 files</Text>
        <Ionicons name="chevron-forward" size={16} color="#7A7570" />
      </View>
      {/* Wearable */}
      <View style={demo.listRow}>
        <Ionicons name="heart-outline" size={16} color="#7A7570" style={demo.listRowIcon} />
        <Text style={demo.listRowLabel}>Wearable</Text>
        <Text style={demo.listRowStatusConnect}>+ Connect</Text>
      </View>
    </View>
  );
}

function Step3Demo() {
  return (
    <View style={{ gap: 10, width: '100%' }}>
      {/* On track */}
      <View style={[demo.goalCard, { borderLeftColor: '#2E7D7D' }]}>
        <View style={demo.goalCardHeader}>
          <Text style={demo.goalCardTitle}>Wind-down Routine</Text>
          <View style={[demo.goalBadge, { backgroundColor: '#E6F4F4' }]}>
            <Text style={[demo.goalBadgeText, { color: '#2E7D7D' }]}>On track</Text>
          </View>
        </View>
        <View style={demo.progressTrack}>
          <View style={[demo.progressFill, { width: '57%', backgroundColor: '#2E7D7D' }]} />
        </View>
        <View style={demo.goalCardFooter}>
          <Text style={demo.goalCardFooterText}>4 of 7 nights</Text>
          <Text style={demo.goalCardFooterText}>Goal: 7</Text>
        </View>
      </View>
      {/* Needs attention */}
      <View style={[demo.goalCard, { borderLeftColor: '#C4857A' }]}>
        <View style={demo.goalCardHeader}>
          <Text style={demo.goalCardTitle}>Hydration</Text>
          <View style={[demo.goalBadge, { backgroundColor: 'rgba(196,133,122,0.15)' }]}>
            <Text style={[demo.goalBadgeText, { color: '#C4857A' }]}>Needs attention</Text>
          </View>
        </View>
        <View style={demo.progressTrack}>
          <View style={[demo.progressFill, { width: '38%', backgroundColor: '#C4857A' }]} />
        </View>
        <View style={demo.goalCardFooter}>
          <Text style={demo.goalCardFooterText}>0.9L</Text>
          <Text style={demo.goalCardFooterText}>Goal: 2L</Text>
        </View>
      </View>
    </View>
  );
}

function Step4Demo() {
  return (
    <View style={{ gap: 10, width: '100%' }}>
      <View style={demo.chatCard}>
        {/* Tether msg 1 */}
        <View style={demo.chatRow}>
          <Ionicons name="sparkles" size={14} color="#2E7D7D" style={demo.chatIcon} />
          <View style={demo.chatBubbleTether}>
            <Text style={demo.chatText}>
              Your deep sleep has been low. Want me to explain what might be causing it?
            </Text>
          </View>
        </View>
        {/* User msg */}
        <View style={demo.chatRowUser}>
          <View style={demo.chatBubbleUser}>
            <Text style={demo.chatText}>Yes, what's going on?</Text>
          </View>
        </View>
        {/* Tether msg 2 */}
        <View style={demo.chatRow}>
          <Ionicons name="sparkles" size={14} color="#2E7D7D" style={demo.chatIcon} />
          <View style={demo.chatBubbleTether}>
            <Text style={demo.chatText}>
              Your wind-down routine has slipped. Late screen time is the likely trigger.
            </Text>
          </View>
        </View>
      </View>
      {/* Input bar */}
      <View style={demo.chatInputBar}>
        <Text style={demo.chatInputPlaceholder}>Ask anything...</Text>
        <View style={demo.chatSendButton}>
          <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    minHeight: 480,
    backgroundColor: '#FDFAF5',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(200,190,175,0.3)',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 64,
    elevation: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(46,125,125,0.25)',
  },
  dotActive: {
    backgroundColor: '#2E7D7D',
  },
  demoZone: {
    minHeight: 240,
    justifyContent: 'center',
    marginBottom: 16,
  },
  explanation: {
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  stepTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '400',
    color: '#1C1A17',
    textAlign: 'center',
    marginBottom: 6,
  },
  stepBody: {
    fontSize: 13,
    lineHeight: 20,
    color: '#7A7570',
    textAlign: 'center',
    marginBottom: 12,
  },
  hintPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: '#EDE8DF',
  },
  hintText: {
    fontSize: 11,
    color: '#7A7570',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: '#2E6A64',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E6A64',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  navButtonForward: {
    width: 44, // controlled by Animated.Value
  },
  navButtonInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  forwardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    position: 'absolute',
    whiteSpace: 'nowrap',
  } as any,
});

const demo = StyleSheet.create({
  // Step 1
  insightCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  insightHeader: {
    backgroundColor: '#2E7D7D',
    padding: 16,
  },
  needsAttentionBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(196,133,122,0.9)',
    marginBottom: 8,
  },
  needsAttentionText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightHeadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  insightBody: {
    backgroundColor: '#FDFAF5',
    padding: 16,
  },
  insightBodyText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#2A2520',
    marginBottom: 12,
  },
  insightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  insightActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  insightActionPrimary: {
    backgroundColor: '#2E6A64',
  },
  insightActionPrimaryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  insightActionSecondary: {
    backgroundColor: '#FDFAF5',
    borderWidth: 1,
    borderColor: 'rgba(200,190,175,0.3)',
  },
  insightActionSecondaryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#2E7D7D',
  },

  // Step 2
  listCard: {
    width: '100%',
    backgroundColor: '#FDFAF5',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  listRowConnected: {
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D7D',
  },
  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,232,223,0.5)',
  },
  listRowIcon: {
    marginRight: 8,
  },
  listRowLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1A17',
  },
  listRowStatus: {
    fontSize: 11,
    color: '#7A7570',
    marginRight: 4,
  },
  listRowStatusConnected: {
    fontSize: 11,
    color: '#2E7D7D',
    marginRight: 4,
  },
  listRowStatusConnect: {
    fontSize: 11,
    fontWeight: '500',
    color: '#2E7D7D',
  },

  // Step 3
  goalCard: {
    backgroundColor: '#FDFAF5',
    borderRadius: 16,
    padding: 12,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalCardTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1A17',
  },
  goalBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  goalBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(46,125,125,0.12)',
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCardFooterText: {
    fontSize: 11,
    color: '#7A7570',
  },

  // Step 4
  chatCard: {
    backgroundColor: '#FDFAF5',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  chatRowUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chatIcon: {
    marginTop: 2,
  },
  chatBubbleTether: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(46,125,125,0.08)',
  },
  chatBubbleUser: {
    maxWidth: '75%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EDE8DF',
  },
  chatText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#1C1A17',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEFCF8',
    borderWidth: 1,
    borderColor: 'rgba(200,190,175,0.4)',
    gap: 8,
  },
  chatInputPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: '#B0A898',
  },
  chatSendButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#2E7D7D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
