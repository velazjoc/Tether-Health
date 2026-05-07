import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

type Zone = 'sources' | 'notes' | 'records';

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

// ─── Mock data ────────────────────────────────────────────────────────────────
type SourceIcon = 'pulse-outline' | 'flask-outline' | 'document-text-outline';

const dataSources: {
  name: string; connected: boolean; lastSync: string | null;
  icon: SourceIcon; route: string;
}[] = [
  { name: 'Apple Health',    connected: true,  lastSync: '2 min ago',  icon: 'pulse-outline',        route: '/apple-health-from-my-health' },
  { name: 'Quest Labs',      connected: true,  lastSync: '3 days ago', icon: 'flask-outline',         route: '/lab-results-from-my-health' },
  { name: 'Medical Records', connected: true,  lastSync: '1 week ago', icon: 'document-text-outline', route: '/lab-results-from-my-health' },
  { name: 'Fitbit',          connected: false, lastSync: null,         icon: 'pulse-outline',         route: '/wearable-from-my-health' },
];

const doctorNotes = [
  { id: 1, doctorName: 'Dr. Sarah Patel', specialty: 'Primary Care', date: 'Jan 15, 2026', excerpt: 'Reviewed cycle irregularity patterns. Recommended vitamin D supplementation at 2000 IU daily. Follow-up labs in 3 months to track improvement.', insightCount: 3 },
  { id: 2, doctorName: 'Dr. Emily Kim',   specialty: 'Dermatology',   date: 'Oct 12, 2025', excerpt: 'Discussed connection between PCOS and skin concerns. Prescribed topical treatment and suggested monitoring hormonal patterns through Tether.', insightCount: 1 },
];

const records = [
  { id: 1, name: 'Lab Results - Vitamin D Panel', date: 'Feb 28, 2026' },
  { id: 2, name: 'Ultrasound - Ovarian',          date: 'Jan 10, 2026' },
  { id: 3, name: 'Blood Work - Hormone Panel',    date: 'Dec 15, 2025' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MyHealth() {
  const [activeZone, setActiveZone] = useState<Zone>('sources');
  const [expandedSources, setExpandedSources] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(false);
  const [uploadingNote, setUploadingNote] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<Zone, number>>({ sources: 0, notes: 0, records: 0 });

  // Spinner animation for upload state
  const spinValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (uploadingNote) {
      Animated.loop(
        Animated.timing(spinValue, { toValue: 1, duration: 800, useNativeDriver: true })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [uploadingNote]);
  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const scrollToZone = (zone: Zone) => {
    setActiveZone(zone);
    scrollRef.current?.scrollTo({ y: offsets.current[zone], animated: true });
  };

  const handleUploadNote = () => {
    Alert.alert('Upload Doctor Note', 'Document picker coming soon.');
  };

  const displayedSources = expandedSources ? dataSources : dataSources.slice(0, 4);
  const displayedNotes = expandedNotes ? doctorNotes : doctorNotes.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TetherLogo size={32} />
        <Text style={styles.pageTitle}>My Health</Text>
        <Text style={styles.pageSubtitle}>Everything Tether uses to understand your health</Text>
      </View>

      {/* ── Pill selector — outside ScrollView so it stays visible ── */}
      <View style={styles.pillBar}>
        {(['sources', 'notes', 'records'] as Zone[]).map((zone) => {
          const labels: Record<Zone, string> = {
            sources: 'Data Sources',
            notes: 'Doctor Notes',
            records: 'Records',
          };
          const active = activeZone === zone;
          return (
            <TouchableOpacity
              key={zone}
              onPress={() => scrollToZone(zone)}
              style={[styles.pill, active && styles.pillActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {labels[zone]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tether message strip */}
        <View style={styles.tetherStrip}>
          <Ionicons name="sparkles" size={16} color="#2E7D7D" />
          <Text style={styles.tetherStripText}>
            Your Apple Health synced 2 minutes ago with 8 new data points.
          </Text>
        </View>

        {/* ── ZONE 1: Data Sources ── */}
        <View
          style={styles.zone}
          onLayout={(e) => { offsets.current.sources = e.nativeEvent.layout.y; }}
        >
          <Text style={styles.zoneLabel}>MY DATA SOURCES</Text>

          <View style={styles.sourcesGrid}>
            {displayedSources.map((source) => (
              <TouchableOpacity
                key={source.name}
                onPress={() => router.push(source.route as any)}
                style={[
                  styles.sourceCard,
                  source.connected && styles.sourceCardConnected,
                  !source.connected && styles.sourceCardDashed,
                  { opacity: source.connected ? 1 : 0.7 },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.sourceCardTop}>
                  <View style={styles.sourceIconWrap}>
                    <Ionicons name={source.icon} size={20} color="#3D6E68" />
                  </View>
                  {source.connected && <View style={styles.connectedDot} />}
                </View>
                <Text style={styles.sourceName}>{source.name}</Text>
                {source.connected ? (
                  <Text style={styles.sourceSync}>Last synced {source.lastSync}</Text>
                ) : (
                  <Text style={styles.sourceConnect}>+ Connect</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {dataSources.length > 4 && !expandedSources && (
            <TouchableOpacity
              onPress={() => setExpandedSources(true)}
              style={styles.showAllButton}
              activeOpacity={0.75}
            >
              <Text style={styles.showAllText}>Show all</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#2A2520" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── ZONE 2: Doctor Notes ── */}
        <View
          style={styles.zone}
          onLayout={(e) => { offsets.current.notes = e.nativeEvent.layout.y; }}
        >
          <Text style={styles.zoneLabel}>DOCTOR NOTES</Text>

          <View style={styles.notesList}>
            {displayedNotes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteCardHeader}>
                  <View style={styles.noteCardHeaderLeft}>
                    <Text style={styles.noteDoctorName}>{note.doctorName}</Text>
                    <Text style={styles.noteMeta}>{note.specialty} · {note.date}</Text>
                  </View>
                  <View style={styles.insightBadge}>
                    <Text style={styles.insightBadgeText}>
                      Used in {note.insightCount} insight{note.insightCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.noteExcerpt} numberOfLines={2}>{note.excerpt}</Text>
                <TouchableOpacity
                  onPress={() => router.push(`/doctor-note/${note.id}` as any)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.readMoreLink}>Read more →</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Upload doctor note */}
            <TouchableOpacity
              onPress={handleUploadNote}
              disabled={uploadingNote}
              style={styles.uploadNoteCard}
              activeOpacity={0.8}
            >
              <View style={styles.uploadIconCircle}>
                {uploadingNote ? (
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons name="sync-outline" size={20} color="#2E7D7D" />
                  </Animated.View>
                ) : (
                  <Ionicons name="add" size={20} color="#2E7D7D" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.uploadNoteTitle}>
                  {uploadingNote ? 'Uploading...' : 'Upload Doctor Note'}
                </Text>
                <Text style={styles.uploadNoteSubtitle}>PDF, photo, or text from your visit</Text>
              </View>
            </TouchableOpacity>
          </View>

          {doctorNotes.length > 2 && !expandedNotes && (
            <TouchableOpacity
              onPress={() => setExpandedNotes(true)}
              style={styles.showAllButton}
              activeOpacity={0.75}
            >
              <Text style={styles.showAllText}>Show all</Text>
              <Ionicons name="chevron-down-outline" size={16} color="#2A2520" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── ZONE 3: Records ── */}
        <View
          style={styles.zone}
          onLayout={(e) => { offsets.current.records = e.nativeEvent.layout.y; }}
        >
          <Text style={styles.zoneLabel}>MY RECORDS</Text>

          <View style={styles.recordsCard}>
            {records.map((record, i) => (
              <TouchableOpacity
                key={record.id}
                onPress={() => router.push(`/lab-result/${record.id}` as any)}
                style={[styles.recordRow, i < records.length - 1 && styles.recordRowBorder]}
                activeOpacity={0.75}
              >
                <View style={styles.recordIconWrap}>
                  <Ionicons name="document-text-outline" size={20} color="#7A7570" />
                </View>
                <View style={styles.recordText}>
                  <Text style={styles.recordName}>{record.name}</Text>
                  <Text style={styles.recordDate}>{record.date}</Text>
                </View>
                <Ionicons name="open-outline" size={20} color="#2E7D7D" />
              </TouchableOpacity>
            ))}

            {/* Upload record row */}
            <TouchableOpacity
              onPress={() => router.push('/upload-lab-results' as any)}
              style={[styles.recordRow, styles.recordRowUpload]}
              activeOpacity={0.75}
            >
              <View style={styles.uploadRecordIconWrap}>
                <Ionicons name="add" size={20} color="#2E7D7D" />
              </View>
              <Text style={styles.uploadRecordLabel}>Upload record</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: 'rgba(46,125,125,0.07)',
  },
  pageTitle: { fontSize: 28, fontWeight: '500', color: '#1C1A17', marginTop: 12 },
  pageSubtitle: { fontSize: 14, color: '#7A7570', marginTop: 4 },

  pillBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(245,240,232,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  pillActive: { backgroundColor: '#2E7D7D' },
  pillText: { fontSize: 13, fontWeight: '500', color: '#7A7570' },
  pillTextActive: { color: '#FFFFFF' },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  tetherStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 14,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(46,125,125,0.08)',
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: 'rgba(46,125,125,0.15)',
    borderLeftColor: '#2E7D7D',
  },
  tetherStripText: { flex: 1, fontSize: 13, color: '#1C1A17' },

  zone: { paddingHorizontal: 20, marginBottom: 32 },
  zoneLabel: {
    fontSize: 11, fontWeight: '600', letterSpacing: 0.8,
    textTransform: 'uppercase', color: '#7A7570', marginBottom: 16,
  },

  sourcesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sourceCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FDFAF5',
    borderWidth: 1,
    borderColor: 'rgba(234,230,224,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sourceCardConnected: { borderLeftWidth: 3, borderLeftColor: '#2E7D7D' },
  sourceCardDashed: { borderStyle: 'dashed' },
  sourceCardTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 12,
  },
  sourceIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#DFE9E6', alignItems: 'center', justifyContent: 'center',
  },
  connectedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D7D', marginTop: 4 },
  sourceName: { fontSize: 13, fontWeight: '500', color: '#1C1A17', marginBottom: 4 },
  sourceSync: { fontSize: 11, color: '#7A7570' },
  sourceConnect: { fontSize: 11, fontWeight: '500', color: '#2E7D7D' },

  showAllButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'center', marginTop: 12,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 100,
    backgroundColor: 'rgba(253,250,245,0.8)',
    borderWidth: 1, borderColor: 'rgba(200,190,175,0.4)',
  },
  showAllText: { fontSize: 12, color: '#2A2520' },

  notesList: { gap: 12 },
  noteCard: {
    padding: 20, borderRadius: 16, backgroundColor: '#FDFAF5',
    borderWidth: 1, borderColor: 'rgba(234,230,224,0.5)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  noteCardHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 12, gap: 8,
  },
  noteCardHeaderLeft: { flex: 1 },
  noteDoctorName: { fontSize: 14, fontWeight: '600', color: '#1C1A17', marginBottom: 2 },
  noteMeta: { fontSize: 12, color: '#7A7570' },
  insightBadge: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 100, backgroundColor: '#E6F4F4', flexShrink: 0,
  },
  insightBadgeText: { fontSize: 11, color: '#1E5C5C' },
  noteExcerpt: { fontSize: 14, lineHeight: 21, color: '#2A2520', marginBottom: 12 },
  readMoreLink: { fontSize: 13, fontWeight: '500', color: '#2E7D7D' },

  uploadNoteCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20,
    borderRadius: 16, backgroundColor: '#FDFAF5',
    borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(46,125,125,0.3)',
  },
  uploadIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(46,125,125,0.1)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  uploadNoteTitle: { fontSize: 13, fontWeight: '500', color: '#2E7D7D', marginBottom: 2 },
  uploadNoteSubtitle: { fontSize: 12, color: '#7A7570' },

  recordsCard: {
    borderRadius: 16, backgroundColor: '#FDFAF5',
    borderWidth: 1, borderColor: 'rgba(234,230,224,0.5)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden',
  },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  recordRowBorder: { borderBottomWidth: 1, borderBottomColor: '#EAE6E0' },
  recordIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#DFE9E6', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  recordText: { flex: 1 },
  recordName: { fontSize: 13, fontWeight: '500', color: '#1C1A17', marginBottom: 2 },
  recordDate: { fontSize: 11, color: '#7A7570' },
  recordRowUpload: {
    borderTopWidth: 2, borderTopColor: 'rgba(46,125,125,0.3)', borderStyle: 'dashed',
  },
  uploadRecordIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#2E7D7D',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  uploadRecordLabel: { fontSize: 13, fontWeight: '500', color: '#2E7D7D' },
});
