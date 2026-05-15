import { useState, useRef } from 'react';
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
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getOrCreateSession } from '@/services/session';
import { saveConditions } from '@/services/db';

type Condition = { name: string; description: string };

const healthConditions: Condition[] = [
  { name: 'Hypertension', description: 'High blood pressure - when the force of blood against artery walls is consistently too high' },
  { name: 'Type 2 Diabetes', description: "A condition where the body doesn't use insulin properly, leading to high blood sugar levels" },
  { name: 'Type 1 Diabetes', description: 'An autoimmune condition where the pancreas produces little or no insulin' },
  { name: 'Hypothyroidism', description: "Underactive thyroid - when the thyroid gland doesn't produce enough thyroid hormones" },
  { name: 'Hyperthyroidism', description: 'Overactive thyroid - when the thyroid gland produces too much thyroid hormone' },
  { name: 'PCOS', description: 'Polycystic Ovary Syndrome - a hormonal disorder causing enlarged ovaries with small cysts' },
  { name: 'High Cholesterol', description: 'Elevated levels of cholesterol in the blood, which can increase heart disease risk' },
  { name: 'Anxiety', description: 'A mental health condition characterized by persistent worry, nervousness, or fear' },
  { name: 'Depression', description: 'A mental health condition causing persistent sadness and loss of interest in activities' },
  { name: 'Asthma', description: 'A respiratory condition causing difficulty breathing due to inflamed airways' },
  { name: 'Arthritis', description: 'Inflammation of joints causing pain, stiffness, and reduced mobility' },
  { name: 'Endometriosis', description: 'A condition where tissue similar to the uterine lining grows outside the uterus' },
  { name: 'Fibromyalgia', description: 'A chronic condition causing widespread musculoskeletal pain and fatigue' },
  { name: 'IBS', description: 'Irritable Bowel Syndrome - a digestive disorder causing cramping, bloating, and irregular bowel movements' },
  { name: "Crohn's Disease", description: 'A type of inflammatory bowel disease that can affect any part of the digestive tract' },
  { name: 'Ulcerative Colitis', description: 'An inflammatory bowel disease causing inflammation and ulcers in the colon and rectum' },
  { name: 'Celiac Disease', description: 'An autoimmune disorder where gluten triggers damage to the small intestine' },
  { name: 'Migraine', description: 'A neurological condition causing intense headaches, often with nausea and light sensitivity' },
  { name: 'Eczema', description: 'A skin condition causing dry, itchy, and inflamed patches of skin' },
  { name: 'Psoriasis', description: 'An autoimmune condition causing rapid skin cell buildup, forming scaly patches' },
  { name: 'Lupus', description: 'An autoimmune disease where the immune system attacks healthy tissue throughout the body' },
  { name: 'Multiple Sclerosis', description: 'An autoimmune disease affecting the central nervous system, disrupting nerve signals' },
  { name: 'Rheumatoid Arthritis', description: 'An autoimmune condition causing painful inflammation in the joints' },
  { name: 'Sleep Apnea', description: 'A sleep disorder where breathing repeatedly stops and starts during sleep' },
  { name: 'GERD', description: 'Gastroesophageal Reflux Disease - chronic acid reflux causing heartburn and irritation' },
  { name: 'Anemia', description: 'A condition where you lack enough healthy red blood cells to carry adequate oxygen' },
  { name: 'Osteoporosis', description: 'A condition where bones become weak and brittle, increasing fracture risk' },
  { name: 'Heart Disease', description: 'Various conditions affecting the heart, including coronary artery disease' },
  { name: 'COPD', description: 'Chronic Obstructive Pulmonary Disease - a group of lung diseases blocking airflow' },
  { name: 'Kidney Disease', description: 'Chronic condition where kidneys gradually lose their ability to filter waste' },
];

export default function Conditions() {
  const [inputValue, setInputValue] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const suggestions = healthConditions.filter(
    (c) =>
      c.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedConditions.some((s) => s.name === c.name)
  );

  const addCondition = (condition: Condition) => {
    setSelectedConditions((prev) => [...prev, condition]);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Fires when user presses the return key — mirrors web handleKeyDown Enter logic
  const handleSubmitEditing = () => {
    if (!inputValue.trim()) return;
    const exactMatch = healthConditions.find(
      (c) => c.name.toLowerCase() === inputValue.toLowerCase().trim()
    );
    if (exactMatch && !selectedConditions.some((s) => s.name === exactMatch.name)) {
      addCondition(exactMatch);
    } else if (!selectedConditions.some((s) => s.name === inputValue.trim())) {
      addCondition({ name: inputValue.trim(), description: '' });
    }
  };

  const removeCondition = (conditionName: string) => {
    setSelectedConditions((prev) => prev.filter((c) => c.name !== conditionName));
    if (activeTooltip === conditionName) setActiveTooltip(null);
  };

  const toggleTooltip = (conditionName: string, hasDescription: boolean) => {
    if (!hasDescription) return;
    setActiveTooltip(activeTooltip === conditionName ? null : conditionName);
  };

  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const sessionId = await getOrCreateSession();
      await saveConditions(sessionId, selectedConditions.map((c) => c.name));
    } catch (_) {
      // non-blocking — proceed even if save fails
    } finally {
      setSaving(false);
    }
    router.push('/goals');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E6A64" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step indicator */}
        <Text style={styles.stepLabel}>STEP 2 OF 4</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Any diagnosed conditions?</Text>

        {/* Hint */}
        <Text style={styles.hint}>
          Tether uses this to customise your experience and personalise insights
          based on your unique health profile.
        </Text>

        {/* Selected condition pills */}
        {selectedConditions.length > 0 && (
          <View style={styles.pillsContainer}>
            {selectedConditions.map((condition) => (
              <View key={condition.name}>
                <View style={styles.selectedPill}>
                  {/* Checkmark + name */}
                  <View style={styles.selectedPillLeft}>
                    <Ionicons name="checkmark" size={10} color="#2E7D7D" style={styles.pillCheckmark} />
                    <Text style={styles.selectedPillText}>{condition.name}</Text>
                  </View>
                  {/* Info + remove */}
                  <View style={styles.selectedPillActions}>
                    {condition.description ? (
                      <TouchableOpacity
                        onPress={() => toggleTooltip(condition.name, !!condition.description)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Ionicons name="information-circle-outline" size={14} color="#2E7D7D" />
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => removeCondition(condition.name)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="close" size={14} color="#2E7D7D" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Inline tooltip — shown below the active pill */}
                {activeTooltip === condition.name && condition.description ? (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{condition.description}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Search input */}
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              setShowSuggestions(text.length > 0);
            }}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="done"
            placeholder="Type a condition (e.g., PCOS, Diabetes)..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />

          {/* Autocomplete suggestions — inline below input */}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestions}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 240 }}
              >
                {suggestions.slice(0, 6).map((condition, index) => (
                  <TouchableOpacity
                    key={condition.name}
                    onPress={() => addCondition(condition)}
                    style={[
                      styles.suggestionItem,
                      index < Math.min(suggestions.length, 6) - 1 && styles.suggestionItemBorder,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionName}>{condition.name}</Text>
                    <Text style={styles.suggestionDescription}>{condition.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Helper text */}
        <Text style={styles.helperText}>
          Start typing and select from suggestions, or press Return to add a
          custom condition. Tap the info icon on any pill to learn more.
        </Text>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={saving}
          style={styles.continueButton}
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
    flexGrow: 1,
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

  // Selected pills
  pillsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: '#FDFAF5',
    borderWidth: 1,
    borderColor: 'rgba(46,125,125,0.25)',
    gap: 8,
  },
  selectedPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillCheckmark: {
    marginRight: 2,
  },
  selectedPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D7D',
  },
  selectedPillActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Inline tooltip
  tooltip: {
    marginTop: 6,
    marginBottom: 4,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FDFAF5',
    borderWidth: 1,
    borderColor: 'rgba(46,125,125,0.2)',
  },
  tooltipText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1C1A17',
  },

  // Input + suggestions
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#FFFFFF',
    fontSize: 15,
  },
  suggestions: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#FDFAF5',
    borderWidth: 1,
    borderColor: 'rgba(46,125,125,0.15)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8DCC8',
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1A17',
    marginBottom: 2,
  },
  suggestionDescription: {
    fontSize: 12,
    lineHeight: 16,
    color: '#5C5852',
  },

  // Helper text
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },

  spacer: {
    flex: 1,
    minHeight: 24,
  },

  // Continue button
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
