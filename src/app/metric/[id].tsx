import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getOrCreateSession } from '@/services/session';
import { getHealthLogsByMetric } from '@/services/db';

type TimePeriod = '1W' | '1M' | '3M';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const METRIC_NAMES: Record<string, string> = {
  sleep: 'Sleep',
  steps: 'Steps',
  hydration: 'Hydration',
  'vitamin-d': 'Vitamin D',
};

const PERIOD_DAYS: Record<TimePeriod, number> = { '1W': 7, '1M': 30, '3M': 90 };

function toMetricName(id: string): string {
  return (
    METRIC_NAMES[id] ??
    id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function computeTrend(logs: any[]): {
  direction: 'up' | 'down' | 'stable';
  deltaText: string;
} {
  if (logs.length < 2) return { direction: 'stable', deltaText: '— stable' };
  const recent = logs.slice(0, Math.min(7, logs.length));
  const older = logs.slice(7, Math.min(14, logs.length));
  if (older.length === 0) return { direction: 'stable', deltaText: '— stable' };
  const recentAvg = recent.reduce((s, l) => s + (l.value ?? 0), 0) / recent.length;
  const olderAvg = older.reduce((s, l) => s + (l.value ?? 0), 0) / older.length;
  const pct = olderAvg !== 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  if (Math.abs(pct) < 5) return { direction: 'stable', deltaText: '— stable this week' };
  if (pct > 0) return { direction: 'up', deltaText: `↑ ${Math.round(Math.abs(pct))}% this week` };
  return { direction: 'down', deltaText: `↓ ${Math.round(Math.abs(pct))}% this week` };
}

function computeInsight(name: string, direction: 'up' | 'down' | 'stable'): string {
  const n = name.toLowerCase();
  if (direction === 'up')
    return `Your ${n} is trending upward. Tether is watching for patterns that might explain the improvement.`;
  if (direction === 'down')
    return `Your ${n} has been lower recently. Tether is analyzing what may be contributing to the change.`;
  return `Your ${n} has been stable. Tether will notify you if a meaningful pattern emerges.`;
}

// ─── TetherLogo ──────────────────────────────────────────────────────────────

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

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function MetricDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1W');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const sessionId = await getOrCreateSession();
        const data = await getHealthLogsByMetric(sessionId, id);
        setLogs(data ?? []);
      } catch (_) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const metricName = toMetricName(id);
  const latestLog = logs[0];
  const currentValue = latestLog?.value ?? null;
  const unit = latestLog?.unit ?? '';
  const { direction, deltaText } = computeTrend(logs);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PERIOD_DAYS[selectedPeriod]);
  const periodLogs = logs.filter((l) => new Date(l.created_at) >= cutoff);

  const trendIcon: React.ComponentProps<typeof Ionicons>['name'] =
    direction === 'up' ? 'trending-up-outline' :
    direction === 'down' ? 'trending-down-outline' :
    'remove-outline';
  const trendColor =
    direction === 'up' ? '#2E7D60' :
    direction === 'down' ? '#B05040' :
    '#7A7570';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2E7D7D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backRow} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={16} color="#1C1A17" />
              <Text style={styles.backLabel}>Progress</Text>
            </TouchableOpacity>
            <TetherLogo size={32} />
          </View>

          <Text style={styles.metricName}>{metricName}</Text>

          <View style={styles.valueRow}>
            {currentValue !== null ? (
              <>
                <Text style={styles.currentValue}>{currentValue} {unit}</Text>
                <Text style={styles.dot}> · </Text>
                <Ionicons name={trendIcon} size={13} color={trendColor} />
                <Text style={[styles.deltaText, { color: trendColor }]}> {deltaText}</Text>
              </>
            ) : (
              <Text style={styles.currentValue}>No data logged yet</Text>
            )}
          </View>
        </View>

        {/* ── TREND ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TREND</Text>

          <View style={styles.chartCard}>
            {/* Time period pills */}
            <View style={styles.pillsRow}>
              {(['1W', '1M', '3M'] as TimePeriod[]).map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={[styles.periodPill, selectedPeriod === period && styles.periodPillSelected]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.periodPillText, selectedPeriod === period && styles.periodPillTextSelected]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chart placeholder — replace with VictoryArea once Victory Native is wired */}
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart-outline" size={32} color="rgba(46,125,125,0.25)" />
              <Text style={styles.chartPlaceholderLabel}>
                {periodLogs.length > 0
                  ? `${periodLogs.length} data point${periodLogs.length !== 1 ? 's' : ''}`
                  : 'No data for this period'}
              </Text>
              <Text style={styles.chartPlaceholderSub}>Chart coming soon</Text>
            </View>
          </View>
        </View>

        {/* ── WHAT TETHER NOTICED ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHAT TETHER NOTICED</Text>

          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              {computeInsight(metricName, direction)}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/chat' as any)}
              style={styles.askRow}
              activeOpacity={0.7}
            >
              <Text style={styles.askLink}>Ask Tether about this →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  scrollContent: { paddingBottom: 0 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(46,125,125,0.10)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backLabel: { fontSize: 15, fontWeight: '500', color: '#1C1A17' },
  metricName: { fontSize: 28, fontWeight: '400', color: '#1C1A17', marginBottom: 4 },
  valueRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  currentValue: { fontSize: 13, color: '#7A7570' },
  dot: { fontSize: 13, color: '#7A7570' },
  deltaText: { fontSize: 13 },

  // Sections
  section: { paddingHorizontal: 20, marginTop: 24, marginBottom: 8 },
  sectionLabel: {
    fontSize: 11, fontWeight: '500', letterSpacing: 0.8,
    textTransform: 'uppercase', color: '#7A7570', marginBottom: 12,
  },

  // Chart card
  chartCard: {
    height: 240,
    backgroundColor: '#FDFAF5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(200,190,175,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    height: 36,
    alignItems: 'center',
    marginBottom: 8,
  },
  periodPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  periodPillSelected: { backgroundColor: '#2E7D7D' },
  periodPillText: { fontSize: 13, fontWeight: '500', color: '#7A7570' },
  periodPillTextSelected: { color: '#FFFFFF' },
  chartPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chartPlaceholderLabel: { fontSize: 13, color: '#7A7570' },
  chartPlaceholderSub: { fontSize: 11, color: 'rgba(46,125,125,0.5)' },

  // Insight card
  insightCard: {
    backgroundColor: '#FDFAF5',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: 'rgba(200,190,175,0.5)',
    borderLeftColor: '#2E7D7D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  insightText: { fontSize: 15, lineHeight: 24, color: '#2A2520', marginBottom: 12 },
  askRow: { alignItems: 'flex-end' },
  askLink: { fontSize: 12, fontWeight: '500', color: '#2E7D7D' },
});
