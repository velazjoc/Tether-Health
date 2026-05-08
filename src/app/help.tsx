import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const faqs = [
  { question: 'How does Tether connect my health patterns?', answer: 'Tether analyzes data from multiple sources (labs, cycle tracking, symptoms) to identify correlations you might miss. It looks for timing patterns, trends, and connections between different health metrics.' },
  { question: 'Is my health data secure and private?', answer: "Yes. All data is encrypted and stored securely. You control what you share and with whom. We never sell your data to third parties." },
  { question: 'How do I add lab results?', answer: 'Connect your lab portal directly (like Quest or LabCorp) or manually enter results. Tether will track trends over time and flag patterns.' },
  { question: 'Can I export my data for my doctor?', answer: 'Absolutely. Go to Profile → Export Health Summary to create a PDF with your key patterns, trends, and questions for your provider.' },
  { question: 'What should I track for PCOS management?', answer: 'Focus on cycle length, LH surges, vitamin D levels, energy patterns, and any symptoms. Tether will help connect these to identify what matters most for you.' },
];

export default function Help() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3F0" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={16} color="#7A7570" />
          <Text style={styles.backText}>Back to Profile</Text>
        </TouchableOpacity>
        <Text style={styles.eyebrow}>SUPPORT</Text>
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>Common questions and support resources</Text>

        {/* Quick support */}
        <View style={styles.card}>
          <View style={styles.supportHeader}>
            <View style={styles.supportIconBox}>
              <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.supportTitle}>Can't find what you need?</Text>
              <Text style={styles.supportSubtitle}>Ask Tether or contact support</Text>
            </View>
          </View>
          <View style={styles.supportActions}>
            <TouchableOpacity onPress={() => router.push('/chat' as any)} style={styles.primaryButton} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Ask Tether</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Email Support', 'support@tether.health')} style={styles.secondaryButton} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>Email support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQs */}
        <Text style={styles.faqLabel}>FREQUENTLY ASKED QUESTIONS</Text>
        <View style={{ gap: 12, marginBottom: 24 }}>
          {faqs.map((faq, i) => (
            <TouchableOpacity key={i} onPress={() => setExpanded(expanded === i ? null : i)} style={styles.faqCard} activeOpacity={0.85}>
              <View style={styles.faqRow}>
                <View style={styles.faqIconBox}>
                  <Ionicons name="help-circle-outline" size={16} color="#3D6E68" />
                </View>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={16} color="#7A7570" />
              </View>
              {expanded === i && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tutorial */}
        <View style={styles.card}>
          <Text style={styles.tutorialTitle}>See how Tether works</Text>
          <Text style={styles.tutorialBody}>Replay the interactive tutorial from your first visit</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/tutorial', params: { from: 'home' } } as any)} style={styles.tutorialButton} activeOpacity={0.8}>
            <Text style={styles.tutorialButtonText}>Restart tutorial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 13, color: '#7A7570' },
  eyebrow: { fontSize: 10, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: '#9A9088', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '400', color: '#1A1816', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#7E7670', marginBottom: 24 },
  card: { backgroundColor: '#FDFAF5', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', padding: 20, marginBottom: 24 },
  supportHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  supportIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#2E7D7D', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  supportTitle: { fontSize: 16, fontWeight: '600', color: '#1A1816' },
  supportSubtitle: { fontSize: 12, color: '#7E7670' },
  supportActions: { flexDirection: 'row', gap: 8 },
  primaryButton: { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#2E7D7D', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  secondaryButton: { flex: 1, height: 44, borderRadius: 12, backgroundColor: 'rgba(237,232,223,0.6)', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#2E7D7D' },
  faqLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: '#1C1A17', marginBottom: 16 },
  faqCard: { backgroundColor: '#FDFAF5', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', padding: 16 },
  faqRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  faqIconBox: { width: 24, height: 24, borderRadius: 8, backgroundColor: '#DFE9E6', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1816' },
  faqAnswer: { fontSize: 13, lineHeight: 20, color: '#7E7670', marginTop: 12, paddingLeft: 36 },
  tutorialTitle: { fontSize: 15, fontWeight: '600', color: '#1A1816', marginBottom: 8 },
  tutorialBody: { fontSize: 13, color: '#7A7570', marginBottom: 16 },
  tutorialButton: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12, backgroundColor: 'rgba(237,232,223,0.6)', alignSelf: 'flex-start' },
  tutorialButtonText: { fontSize: 14, fontWeight: '600', color: '#2E7D7D' },
});
