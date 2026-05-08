import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const doctorNotes: Record<string, { doctorName: string; specialty: string; date: string; fullNote: string; usedInInsights: { id: string; title: string }[] }> = {
  '1': {
    doctorName: 'Dr. Sarah Patel', specialty: 'Primary Care', date: 'Jan 15, 2026',
    fullNote: 'Continue monitoring sleep patterns and cycle irregularity. Vitamin D supplementation at 2000 IU daily is recommended based on recent lab results showing deficiency. Patient reports improvement in energy levels. Follow-up labs scheduled in 3 months to track Vitamin D levels and reassess supplementation needs. Consider tracking basal body temperature if trying to conceive.',
    usedInInsights: [
      { id: '1', title: 'Your cycle is shortening — here\'s what it might mean' },
      { id: '2', title: 'Vitamin D and hormone balance' },
      { id: '3', title: 'Sleep quality trends this month' },
    ],
  },
  '2': {
    doctorName: 'Dr. Emily Kim', specialty: 'Dermatology', date: 'Oct 12, 2025',
    fullNote: 'Discussed connection between PCOS and skin concerns, particularly hormonal acne patterns. Prescribed topical treatment (tretinoin 0.025%) for evening use. Patient should continue monitoring hormonal patterns through Tether app to identify flare-up triggers. Consider dietary modifications to support hormonal balance. Follow-up in 6 weeks to assess treatment response.',
    usedInInsights: [
      { id: '4', title: 'Hormonal patterns and skin health' },
    ],
  },
};

export default function DoctorNoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const note = id ? doctorNotes[id] : null;

  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Note not found</Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.emptyLink}>‹ Back to My Health</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink} activeOpacity={0.7}>
            <Text style={styles.backLinkText}>‹ My Health</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{note.doctorName}</Text>
          <Text style={styles.meta}>{note.specialty} · {note.date}</Text>
        </View>

        <View style={styles.body}>
          {/* The note */}
          <Text style={styles.sectionLabel}>THE NOTE</Text>
          <View style={styles.card}>
            <Text style={styles.noteText}>{note.fullNote}</Text>
          </View>

          {/* Used in insights */}
          <Text style={styles.sectionLabel}>USED IN THESE INSIGHTS</Text>
          <View style={[styles.card, { padding: 0 }]}>
            {note.usedInInsights.map((insight, i) => (
              <View key={insight.id}>
                <TouchableOpacity
                  onPress={() => router.push(`/insight/${insight.id}` as any)}
                  style={[styles.insightRow, { borderLeftWidth: 3, borderLeftColor: '#2E7D7D' }]}
                  activeOpacity={0.75}
                >
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightLink}>View insight →</Text>
                </TouchableOpacity>
                {i < note.usedInInsights.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>

          {/* About this doctor */}
          <Text style={styles.sectionLabel}>ABOUT THIS DOCTOR</Text>
          <View style={styles.card}>
            <Text style={styles.doctorName}>{note.doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{note.specialty}</Text>
            <TouchableOpacity onPress={() => router.push('/appointment-prep' as any)} activeOpacity={0.7}>
              <Text style={styles.addApptLink}>+ Add appointment</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity style={styles.tealOutlineButton} activeOpacity={0.8}>
              <Text style={styles.tealOutlineText}>Add a follow-up note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.roseOutlineButton} activeOpacity={0.8}>
              <Text style={styles.roseOutlineText}>Remove this note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 22, fontWeight: '400', color: '#1C1A17', marginBottom: 12 },
  emptyLink: { fontSize: 15, fontWeight: '500', color: '#2E7D7D' },
  scrollContent: { paddingBottom: 32 },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, backgroundColor: 'rgba(46,125,125,0.07)' },
  backLink: { marginBottom: 16 },
  backLinkText: { fontSize: 15, fontWeight: '500', color: '#2E7D7D' },
  title: { fontSize: 28, fontWeight: '400', color: '#1C1A17', marginBottom: 4 },
  meta: { fontSize: 12, color: '#7A7570' },
  body: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: '#7A7570', marginTop: 12 },
  card: { backgroundColor: '#FDFAF5', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  noteText: { fontSize: 15, lineHeight: 24, color: '#2A2520' },
  insightRow: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 20, gap: 8 },
  insightTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1C1A17' },
  insightLink: { fontSize: 12, fontWeight: '500', color: '#2E7D7D' },
  rowDivider: { height: 1, backgroundColor: 'rgba(200,190,175,0.5)', marginHorizontal: 20 },
  doctorName: { fontSize: 17, fontWeight: '500', color: '#1C1A17', marginBottom: 4 },
  doctorSpecialty: { fontSize: 12, color: '#7A7570', marginBottom: 12 },
  addApptLink: { fontSize: 13, fontWeight: '500', color: '#2E7D7D' },
  tealOutlineButton: { height: 48, borderRadius: 100, borderWidth: 1.5, borderColor: '#2E7D7D', alignItems: 'center', justifyContent: 'center' },
  tealOutlineText: { fontSize: 15, fontWeight: '500', color: '#2E7D7D' },
  roseOutlineButton: { height: 48, borderRadius: 100, borderWidth: 1.5, borderColor: '#C4857A', alignItems: 'center', justifyContent: 'center' },
  roseOutlineText: { fontSize: 15, fontWeight: '500', color: '#C4857A' },
});
