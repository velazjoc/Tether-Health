import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

function TetherLogo({ size = 40, color = '#FFFFFF' }: { size?: number; color?: string }) {
  const s = size / 32;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute', left: 13 * s, top: 13 * s,
        width: 6 * s, height: 6 * s, borderRadius: 3 * s, backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute', left: 4.5 * s, top: 9.5 * s,
        width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute', right: 4.5 * s, top: 9.5 * s,
        width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: color,
      }} />
    </View>
  );
}

export default function Welcome() {
  const { fromGuest } = useLocalSearchParams<{ fromGuest?: string }>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [customPronoun, setCustomPronoun] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [biologicalSex, setBiologicalSex] = useState('');
  const [bioSexExpanded, setBioSexExpanded] = useState(false);
  const [showWhyWeAsk, setShowWhyWeAsk] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const pronounOptions = ['She/Her', 'He/Him', 'They/Them', 'Add my own'];
  const biologicalSexOptions = ['Female', 'Male', 'Intersex'];

  const handleContinue = () => {
    if (firstName.trim()) {
      // TODO: persist with AsyncStorage once @react-native-async-storage/async-storage is installed
      router.push('/conditions');
    }
  };

  const canContinue = firstName.trim().length > 0;
  const hasAnyInput = !!(firstName || lastName || pronouns || dateOfBirth || biologicalSex);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6A64" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button — only shown when arriving from guest chat */}
        {fromGuest && (
          <TouchableOpacity
            onPress={() => router.push('/guest-chat' as any)}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.backButtonText}>Back to guest chat</Text>
          </TouchableOpacity>
        )}

        {/* Guest session banner */}
        {fromGuest && (
          <View style={styles.guestBanner}>
            <Ionicons name="sparkles" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.guestBannerText}>Your chat history will carry over</Text>
          </View>
        )}

        {/* Logo */}
        <View style={styles.logoContainer}>
          <TetherLogo size={40} color="#FFFFFF" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to Tether</Text>

        {/* Subtitle */}
        <Text style={styles.hint}>
          Tell us about yourself to personalize your health journey
        </Text>

        {/* First Name — required */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>FIRST NAME</Text>
            <Text style={styles.required}> *</Text>
          </View>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFocusedField('firstName')}
            onBlur={() => setFocusedField(null)}
            style={[styles.input, focusedField === 'firstName' && styles.inputFocused]}
            placeholder="First name"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        {/* Last Name — optional */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>LAST NAME</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setFocusedField('lastName')}
            onBlur={() => setFocusedField(null)}
            style={[styles.input, focusedField === 'lastName' && styles.inputFocused]}
            placeholder="Last name"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        {/* Pronouns */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, styles.labelMb]}>PRONOUNS</Text>
          <View style={styles.pillRow}>
            {pronounOptions.map((option) => {
              const isSelected = pronouns === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setPronouns(option);
                    if (option !== 'Add my own') setCustomPronoun('');
                  }}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  activeOpacity={0.75}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={10} color="#2E6A64" style={styles.pillCheck} />
                  )}
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {pronouns === 'Add my own' && (
            <TextInput
              value={customPronoun}
              onChangeText={setCustomPronoun}
              onFocus={() => setFocusedField('customPronoun')}
              onBlur={() => setFocusedField(null)}
              style={[styles.input, styles.inputMt, focusedField === 'customPronoun' && styles.inputFocused]}
              placeholder="Enter your pronouns"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          )}
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>DATE OF BIRTH</Text>
          <TextInput
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            onFocus={() => setFocusedField('dateOfBirth')}
            onBlur={() => setFocusedField(null)}
            style={[styles.input, focusedField === 'dateOfBirth' && styles.inputFocused]}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
          />
        </View>

        {/* Biological Sex */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>BIOLOGICAL SEX</Text>
            <TouchableOpacity
              onPress={() => setBioSexExpanded(!bioSexExpanded)}
              style={styles.infoButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>

          {bioSexExpanded && (
            <View style={styles.infoCard}>
              <Text style={styles.infoCardText}>
                We ask about biological sex to provide personalized health insights based on
                physiological factors. This information helps us understand hormone patterns,
                reproductive health, and other biological markers relevant to your care.
              </Text>
            </View>
          )}

          <View style={styles.pillRow}>
            {biologicalSexOptions.map((option) => {
              const isSelected = biologicalSex === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => setBiologicalSex(option)}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  activeOpacity={0.75}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={10} color="#2E6A64" style={styles.pillCheck} />
                  )}
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Privacy notice */}
        <View style={styles.privacyCard}>
          <Ionicons name="sparkles" size={20} color="#FFFFFF" style={styles.privacyIcon} />
          <View style={styles.privacyCardBody}>
            <Text style={styles.privacyCardTitle}>Your data is private and secure</Text>
            <Text style={styles.privacyCardText}>
              We use this information to personalize your insights. You can update or delete
              your data anytime in settings.
            </Text>
          </View>
        </View>

        {/* "Why we ask" — appears once the user starts filling anything in */}
        {showWhyWeAsk && hasAnyInput && (
          <View style={styles.whyCard}>
            <View style={styles.whyCardHeader}>
              <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.whyCardLabel}>WHY WE ASK</Text>
            </View>
            <Text style={styles.whyCardText}>
              Tether is designed around you—your age, biological factors, and health goals help
              us identify patterns and provide insights that are actually relevant to your body
              and your life.
            </Text>
            <View style={styles.whyCardDivider} />
            <TouchableOpacity onPress={() => setShowWhyWeAsk(false)}>
              <Text style={styles.whyCardDismiss}>Got it</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!canContinue}
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E6A64',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoContainer: {
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  guestBannerText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  labelMb: {
    marginBottom: 8,
  },
  required: {
    fontSize: 11,
    fontWeight: '500',
    color: '#C4857A',
  },
  infoButton: {
    marginLeft: 8,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#FFFFFF',
    fontSize: 15,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  inputMt: {
    marginTop: 8,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  pillSelected: {
    borderColor: 'rgba(255,255,255,0.95)',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  pillCheck: {
    marginRight: 4,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  pillTextSelected: {
    color: '#2E6A64',
  },
  infoCard: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  infoCardText: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  privacyIcon: {
    marginTop: 2,
  },
  privacyCardBody: {
    flex: 1,
  },
  privacyCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  privacyCardText: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  whyCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: 20,
  },
  whyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  whyCardLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  whyCardText: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  whyCardDivider: {
    marginTop: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  whyCardDismiss: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButton: {
    height: 48,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E6A64',
  },
});
