import { useState } from 'react';
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

type GoalId = 'heart' | 'bp' | 'sleep' | 'movement';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const goals: {
  id: GoalId;
  icon: IoniconName;
  label: string;
  description: string;
  badge?: string;
}[] = [
  {
    id: 'heart',
    icon: 'heart-outline',
    label: 'Heart health & cholesterol',
    description: 'Linked to your conditions',
    badge: 'Suggested',
  },
  {
    id: 'bp',
    icon: 'pulse-outline',
    label: 'Blood pressure',
    description: 'Linked to your conditions',
    badge: 'Suggested',
  },
  {
    id: 'sleep',
    icon: 'moon-outline',
    label: 'Sleep quality',
    description: 'Affects both conditions',
  },
  {
    id: 'movement',
    icon: 'trending-up-outline',
    label: 'Daily movement',
    description: 'Optional',
  },
];

export default function Goals() {
  const [selectedGoals, setSelectedGoals] = useState<GoalId[]>(['sleep']);

  const toggleGoal = (id: GoalId) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // TODO: persist with AsyncStorage once installed
    router.push('/notification-permission');
  };

  const handleSkip = () => {
    router.push('/notification-permission');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6A64" />

      <View style={styles.content}>
        {/* Step indicator */}
        <Text style={styles.stepLabel}>STEP 3 OF 4</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>What would you like to track?</Text>

        {/* Hint */}
        <Text style={styles.hint}>
          Pre-selected based on your conditions. Change anytime.
        </Text>

        {/* Goals list */}
        <View style={styles.goalsList}>
          {goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => toggleGoal(goal.id)}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                activeOpacity={0.8}
              >
                {/* Icon */}
                <View style={styles.goalIconWrap}>
                  <Ionicons name={goal.icon} size={20} color="#3D6E68" />
                </View>

                {/* Text */}
                <View style={styles.goalBody}>
                  <Text style={styles.goalLabel}>{goal.label}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>

                {/* Badge (only when not selected) */}
                {goal.badge && !isSelected && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{goal.badge}</Text>
                  </View>
                )}

                {/* Checkmark (only when selected) */}
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color="#3D8078" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Skip */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.6}>
          <Text style={styles.skipText}>I'll set this later</Text>
        </TouchableOpacity>

        {/* Continue */}
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.continueButton}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Let's go →</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },

  // Step + progress
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },

  // Title + hint
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  hint: {
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 24,
  },

  // Goals
  goalsList: {
    gap: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 68,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FDFCFB',
    borderWidth: 2,
    borderColor: '#D4CEC6',
  },
  goalCardSelected: {
    backgroundColor: '#DFE9E6',
    borderColor: '#3D8078',
    shadowColor: '#3D8078',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  goalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DFE9E6',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  goalBody: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1816',
    marginBottom: 2,
  },
  goalDescription: {
    fontSize: 13,
    color: '#7E7670',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: '#3D8078',
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  spacer: {
    flex: 1,
    minHeight: 24,
  },

  // Buttons
  skipButton: {
    alignItems: 'center',
    marginBottom: 12,
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  continueButton: {
    height: 48,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E6A64',
  },
});
