import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── TetherLogo ───────────────────────────────────────────────────────────────
function TetherLogo({ size = 32 }: { size?: number }) {
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

const sleepBreakdown = [
  { label: 'Deep',  value: 38, color: '#B89B6A' },
  { label: 'REM',   value: 22, color: '#6A9E96' },
  { label: 'Light', value: 40, color: '#B8B0A6' },
];

const askQuestions = [
  'What exactly is deep sleep and why does it matter?',
  'What lifestyle changes can improve my deep sleep?',
  'How does my sleep affect my other health conditions?',
];

export default function InsightDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const askTether = (question: string) => {
    router.push({ pathname: '/chat', params: { initialQuestion: question } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#7A7570" />
            </TouchableOpacity>
            <TetherLogo size={32} />
          </View>

          <View style={styles.categoryRow}>
            <View style={styles.categoryIcon}>
              <Ionicons name="moon-outline" size={16} color="#3D6E68" />
            </View>
            <Text style={styles.categoryLabel}>TETHER · SLEEP</Text>
          </View>

          <Text style={styles.title}>
            Your deep sleep has been dropping for two weeks
          </Text>

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#7E7670" />
            <Text style={styles.dateText}>Spotted Feb 15–27 · Updated 2h ago</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* ── Ask Tether card ── */}
          <View style={styles.askCard}>
            <View style={styles.askCardHeader}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.askCardTitle}>Ask Tether about this insight</Text>
            </View>
            <Text style={styles.askCardSubtitle}>
              Get personalized explanations and actionable advice in simple terms.
            </Text>
            <View style={styles.askQuestions}>
              {askQuestions.map((q) => (
                <TouchableOpacity
                  key={q}
                  onPress={() => askTether(q)}
                  style={styles.askQuestionButton}
                  activeOpacity={0.75}
                >
                  <Text style={styles.askQuestionText}>→ {q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Section divider ── */}
          <View style={styles.divider} />

          {/* ── What this means ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WHAT THIS MEANS</Text>
            <Text style={styles.bodyText}>
              Deep sleep is when your body does most of its repair work — immune
              function, memory, energy restoration. You're normally getting close
              to 5 hours. These past two weeks it's been closer to 3.8.
            </Text>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightText}>
                <Text style={styles.highlightBold}>68% of people</Text>
                {' '}with this pattern improve within 2 weeks of a consistent wind-down routine.
              </Text>
            </View>
          </View>

          {/* ── Your breakdown ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>YOUR BREAKDOWN</Text>
            <View style={styles.card}>
              {sleepBreakdown.map((item) => (
                <View key={item.label} style={styles.barRow}>
                  <Text style={styles.barLabel}>{item.label}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${item.value}%` as any, backgroundColor: item.color }]} />
                  </View>
                  <Text style={styles.barValue}>{item.value}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Questions for your doctor ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>QUESTIONS FOR YOUR DOCTOR</Text>
            <View style={styles.card}>
              <View style={styles.doctorCardHeader}>
                <View style={styles.doctorCardIcon}>
                  <Ionicons name="chatbubble-outline" size={16} color="#3D6E68" />
                </View>
                <Text style={styles.doctorCardTitle}>From this insight</Text>
              </View>
              <Text style={styles.doctorQuestion}>
                • Could my blood pressure medication be affecting my sleep quality?
              </Text>
              <Text style={styles.doctorQuestion}>
                • Should I consider a sleep study given this 2-week pattern?
              </Text>
            </View>
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  scrollContent: { paddingBottom: 0 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(46,125,125,0.07)',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(253,250,245,0.75)', borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', alignItems: 'center', justifyContent: 'center' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  categoryIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#DFE9E6', alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { fontSize: 12, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase', color: '#7E7670' },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '400', color: '#1A1816', marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 13, color: '#7E7670' },

  body: { paddingHorizontal: 20, paddingTop: 16 },

  // Ask Tether card
  askCard: { backgroundColor: '#2E7D7D', borderRadius: 24, padding: 22, marginBottom: 16, shadowColor: '#2E7D7D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6 },
  askCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  askCardTitle: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  askCardSubtitle: { fontSize: 14, lineHeight: 21, color: 'rgba(255,255,255,0.9)', marginBottom: 16 },
  askQuestions: { gap: 8 },
  askQuestionButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  askQuestionText: { fontSize: 14, color: '#FFFFFF', lineHeight: 20 },

  divider: { height: 1, backgroundColor: '#EAE6E0', marginVertical: 24 },

  // Sections
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase', color: '#7E7670', marginBottom: 12 },
  bodyText: { fontSize: 15, lineHeight: 24, color: '#1A1816', marginBottom: 16 },

  // Highlight card
  highlightCard: { backgroundColor: '#DFE9E6', borderLeftWidth: 3, borderLeftColor: '#6A9E96', borderRadius: 14, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, padding: 16 },
  highlightText: { fontSize: 14, lineHeight: 21, color: '#1A1816' },
  highlightBold: { fontWeight: '600' },

  // White card
  card: { backgroundColor: '#FDFCFB', borderRadius: 24, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },

  // Sleep breakdown bars
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  barLabel: { fontSize: 14, fontWeight: '600', color: '#1A1816', width: 48 },
  barTrack: { flex: 1, height: 12, backgroundColor: '#EAE6E0', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  barValue: { fontSize: 14, fontWeight: '600', color: '#1A1816', width: 40, textAlign: 'right' },

  // Doctor questions card
  doctorCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  doctorCardIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#DFE9E6', alignItems: 'center', justifyContent: 'center' },
  doctorCardTitle: { fontSize: 15, fontWeight: '600', color: '#1A1816' },
  doctorQuestion: { fontSize: 14, lineHeight: 22, color: '#45403C', marginBottom: 12 },
});
