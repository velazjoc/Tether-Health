import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';

// ─── Inline StatusTag ─────────────────────────────────────────────────────────
type StatusVariant = 'needs-attention' | 'keep-going' | 'on-track';
const STATUS = {
  'needs-attention': { bg: 'rgba(196,133,122,0.15)', border: 'rgba(196,133,122,0.3)', text: '#B05040', label: 'Needs attention' },
  'keep-going':      { bg: 'rgba(200,160,80,0.15)',  border: 'rgba(200,160,80,0.3)',  text: '#A07820', label: 'Keep going' },
  'on-track':        { bg: 'rgba(74,155,127,0.15)',  border: 'rgba(74,155,127,0.3)',  text: '#2E7D60', label: 'On track' },
};
function StatusTag({ variant }: { variant: StatusVariant }) {
  const c = STATUS[variant];
  return (
    <View style={[t.pill, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={[t.dot, { backgroundColor: c.text }]} />
      <Text style={[t.label, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}
const t = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, borderWidth: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: '500' },
});

// ─── Mock data ────────────────────────────────────────────────────────────────
const labResults = {
  '1': {
    name: 'Lab Results — Vitamin D Panel', date: 'Feb 28, 2026', uploadDate: 'Uploaded Feb 28, 2026',
    results: [
      { test: 'Vitamin D (25-OH)', value: '29 ng/mL', status: 'needs-attention' as StatusVariant },
      { test: 'Calcium', value: '9.2 mg/dL', status: 'on-track' as StatusVariant },
    ],
    insights: [
      { text: 'Your vitamin D levels are below the optimal range (30–50 ng/mL). This could be affecting your energy and mood, especially during winter months.' },
      { text: 'Consider increasing your vitamin D3 supplement to 2000–4000 IU daily and getting 15–20 minutes of direct sunlight when possible.' },
    ],
  },
  '2': {
    name: 'Ultrasound — Ovarian', date: 'Jan 10, 2026', uploadDate: 'Uploaded Jan 10, 2026',
    results: [
      { test: 'Ovarian Volume (Right)', value: '12.5 mL', status: 'on-track' as StatusVariant },
      { test: 'Ovarian Volume (Left)', value: '11.8 mL', status: 'on-track' as StatusVariant },
      { test: 'Follicle Count', value: '14 per ovary', status: 'keep-going' as StatusVariant },
    ],
    insights: [{ text: 'Your ovarian morphology is consistent with PCOS patterns. The follicle count and volumes are within expected range for your condition.' }],
  },
  '3': {
    name: 'Blood Work — Hormone Panel', date: 'Dec 15, 2025', uploadDate: 'Uploaded Dec 15, 2025',
    results: [
      { test: 'FSH', value: '6.2 mIU/mL', status: 'on-track' as StatusVariant },
      { test: 'LH', value: '5.8 mIU/mL', status: 'on-track' as StatusVariant },
      { test: 'Estradiol', value: '142 pg/mL', status: 'on-track' as StatusVariant },
      { test: 'Testosterone', value: '52 ng/dL', status: 'keep-going' as StatusVariant },
    ],
    insights: [{ text: 'Your hormone levels show good overall balance. The slightly elevated testosterone is common with PCOS but within manageable range.' }],
  },
};

export default function LabResultDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const result = labResults[id as keyof typeof labResults] ?? labResults['1'];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink} activeOpacity={0.7}>
            <Text style={styles.backLinkText}>‹ My Health</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{result.name}</Text>
          <Text style={styles.meta}>{result.uploadDate}</Text>
        </View>

        <View style={styles.body}>
          {/* Results */}
          <Text style={styles.sectionLabel}>RESULTS</Text>
          <View style={[styles.card, { padding: 0 }]}>
            {result.results.map((item, i) => (
              <View key={i}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultTest}>{item.test}</Text>
                  <Text style={styles.resultValue}>{item.value}</Text>
                  <StatusTag variant={item.status} />
                </View>
                {i < result.results.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>

          {/* Insights */}
          <Text style={styles.sectionLabel}>WHAT TETHER NOTICED</Text>
          <View style={{ gap: 12 }}>
            {result.insights.map((insight, i) => (
              <View key={i} style={[styles.insightCard, { borderLeftColor: '#2E7D7D', borderLeftWidth: 3 }]}>
                <Text style={styles.insightText}>{insight.text}</Text>
                <TouchableOpacity onPress={() => router.push('/chat' as any)} activeOpacity={0.7}>
                  <Text style={styles.insightLink}>Ask Tether about this →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Delete */}
          <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8}>
            <Text style={styles.deleteText}>Delete this result</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  scrollContent: { paddingBottom: 32 },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, backgroundColor: 'rgba(46,125,125,0.07)' },
  backLink: { marginBottom: 16 },
  backLinkText: { fontSize: 15, fontWeight: '500', color: '#2E7D7D' },
  title: { fontSize: 28, fontWeight: '400', color: '#1C1A17', marginBottom: 4 },
  meta: { fontSize: 13, color: '#7A7570' },
  body: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: '#7A7570', marginTop: 12 },
  card: { backgroundColor: '#FDFAF5', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  resultRow: { flexDirection: 'row', alignItems: 'center', height: 52, paddingHorizontal: 20, gap: 12 },
  resultTest: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1C1A17' },
  resultValue: { fontSize: 15, fontWeight: '500', color: '#1C1A17', marginRight: 8 },
  rowDivider: { height: 1, backgroundColor: 'rgba(200,190,175,0.5)', marginHorizontal: 20 },
  insightCard: { backgroundColor: '#FDFAF5', borderRadius: 16, padding: 16 },
  insightText: { fontSize: 15, lineHeight: 24, color: '#1C1A17', marginBottom: 12 },
  insightLink: { fontSize: 14, fontWeight: '500', color: '#2E7D7D' },
  deleteButton: { height: 48, borderRadius: 100, borderWidth: 1.5, borderColor: 'rgba(196,133,122,0.4)', backgroundColor: 'rgba(196,133,122,0.08)', alignItems: 'center', justifyContent: 'center' },
  deleteText: { fontSize: 15, fontWeight: '500', color: '#B05040' },
});
