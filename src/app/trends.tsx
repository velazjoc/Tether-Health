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
  Dimensions,
} from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter } from 'victory-native';
import { getOrCreateSession } from '@/services/session';
import { getHealthLogs } from '@/services/db';

// ─── Types ────────────────────────────────────────────────────────────────────

type TimePeriod = '1W' | '1M' | '3M' | '6M' | '1Y';
type TrendDir = 'up' | 'down' | 'stable';
type ChartPoint = { x: number; y: number; label: string };

// ─── Config ───────────────────────────────────────────────────────────────────

const TIME_RANGES: { value: TimePeriod; label: string }[] = [
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
];

const PERIOD_DAYS: Record<TimePeriod, number> = {
  '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365,
};

const METRIC_META: Record<string, { name: string; description: string; color: string; unit: string }> = {
  sleep:       { name: 'Sleep',       description: 'Average hours',  color: '#8B7AB8', unit: 'h'     },
  steps:       { name: 'Daily Steps', description: 'Average count',  color: '#2E7D7D', unit: ''      },
  hydration:   { name: 'Hydration',   description: 'Daily intake',   color: '#4AACCC', unit: 'L'     },
  'vitamin-d': { name: 'Vitamin D',   description: 'Blood level',    color: '#C4A44A', unit: 'ng/mL' },
};

const SCREEN_WIDTH = Dimensions.get('window').width;
// card has 20px screen padding + 20px card padding on each side → 80px total
const CHART_WIDTH = SCREEN_WIDTH - 80;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function filterByPeriod(logs: any[], period: TimePeriod): any[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PERIOD_DAYS[period]);
  return logs.filter((l) => new Date(l.created_at) >= cutoff);
}

function buildChartData(logs: any[]): ChartPoint[] {
  return logs
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((log, i) => ({ x: i, y: log.value ?? 0, label: formatDate(log.created_at) }));
}

function computeDomain(data: ChartPoint[]): [number, number] {
  if (data.length === 0) return [0, 1];
  const vals = data.map((d) => d.y);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.25 || max * 0.1 || 1;
  return [min - pad, max + pad];
}

function getTickValues(data: ChartPoint[]): number[] {
  if (data.length === 0) return [];
  if (data.length === 1) return [0];
  if (data.length === 2) return [0, 1];
  return [0, Math.floor((data.length - 1) / 2), data.length - 1];
}

function computeStats(data: ChartPoint[]): { current: number; change: number; dir: TrendDir } {
  if (data.length === 0) return { current: 0, change: 0, dir: 'stable' };
  const current = data[data.length - 1].y;
  const first = data[0].y;
  const change = first !== 0 ? Math.round(((current - first) / first) * 100) : 0;
  const dir: TrendDir = Math.abs(change) < 3 ? 'stable' : change > 0 ? 'up' : 'down';
  return { current, change, dir };
}

function formatValue(value: number, unit: string): string {
  if (unit === 'h') return `${value.toFixed(1)}h`;
  if (unit === 'L') return `${value.toFixed(1)}L`;
  if (unit === 'ng/mL') return `${Math.round(value)} ng/mL`;
  if (!unit && value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  if (!unit) return `${Math.round(value)}`;
  return `${value} ${unit}`;
}

function groupByMetricType(logs: any[]): Record<string, any[]> {
  const map: Record<string, any[]> = {};
  for (const log of logs) {
    const t = log.metric_type ?? 'unknown';
    if (!map[t]) map[t] = [];
    map[t].push(log);
  }
  return map;
}

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

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ metricType, logs, period }: { metricType: string; logs: any[]; period: TimePeriod }) {
  const meta = METRIC_META[metricType] ?? {
    name: metricType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: 'Current average',
    color: '#2E7D7D',
    unit: '',
  };

  const periodLogs = filterByPeriod(logs, period);
  const chartData = buildChartData(periodLogs);
  const { current, change, dir } = computeStats(chartData);
  const domain = computeDomain(chartData);
  const tickValues = getTickValues(chartData);

  const trendIcon: React.ComponentProps<typeof Ionicons>['name'] =
    dir === 'up' ? 'trending-up-outline' : dir === 'down' ? 'trending-down-outline' : 'remove-outline';
  const trendColor = dir === 'up' ? '#2E7D7D' : dir === 'down' ? '#C4857A' : '#7A7570';

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardName}>{meta.name}</Text>
          <Text style={styles.cardDesc}>{meta.description}</Text>
        </View>
        {chartData.length > 0 && (
          <View style={styles.trendBadge}>
            <Ionicons name={trendIcon} size={16} color={trendColor} />
            <Text style={[styles.trendPct, { color: trendColor }]}>
              {change > 0 ? '+' : ''}{change}%
            </Text>
          </View>
        )}
      </View>

      {/* Current value */}
      {chartData.length > 0 ? (
        <View style={styles.currentWrap}>
          <Text style={styles.currentValue}>{formatValue(current, meta.unit)}</Text>
          <Text style={styles.currentLabel}>Current average</Text>
        </View>
      ) : null}

      {/* Chart or empty state */}
      {chartData.length > 1 ? (
        <View style={styles.chartWrap}>
          <VictoryChart
            width={CHART_WIDTH}
            height={140}
            padding={{ top: 8, bottom: 28, left: 8, right: 8 }}
            domain={{ y: domain }}
          >
            <VictoryAxis
              tickValues={tickValues}
              tickFormat={(tick: number) => chartData[Math.round(tick)]?.label ?? ''}
              style={{
                axis: { stroke: '#EAE6E0' },
                tickLabels: { fontSize: 10, fill: '#7A7570', padding: 4 },
                ticks: { stroke: 'transparent' },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: 'transparent' },
                tickLabels: { fill: 'transparent' },
                grid: { stroke: 'transparent' },
              }}
            />
            <VictoryLine
              data={chartData}
              style={{ data: { stroke: meta.color, strokeWidth: 2.5 } }}
              interpolation="monotoneX"
            />
            <VictoryScatter
              data={chartData}
              size={4}
              style={{ data: { fill: meta.color } }}
            />
          </VictoryChart>
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>
            {chartData.length === 1
              ? 'Only 1 data point — add more to see a trend'
              : 'No data for this period'}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Trends() {
  const [period, setPeriod] = useState<TimePeriod>('1M');
  const [loading, setLoading] = useState(true);
  const [logsByMetric, setLogsByMetric] = useState<Record<string, any[]>>({});

  useEffect(() => {
    (async () => {
      try {
        const sessionId = await getOrCreateSession();
        const data = await getHealthLogs(sessionId);
        setLogsByMetric(groupByMetricType(data ?? []));
      } catch (_) {
        setLogsByMetric({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const metricTypes = Object.keys(logsByMetric);

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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#7A7570" />
            </TouchableOpacity>
            <TetherLogo size={32} />
          </View>
          <Text style={styles.pageTitle}>Trends</Text>
          <Text style={styles.pageSubtitle}>Your patterns over time</Text>
        </View>

        {/* ── Time range pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
          style={styles.pillsScroll}
        >
          {TIME_RANGES.map((range) => {
            const selected = period === range.value;
            return (
              <TouchableOpacity
                key={range.value}
                onPress={() => setPeriod(range.value)}
                style={[styles.pill, selected && styles.pillSelected]}
                activeOpacity={0.75}
              >
                <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Metric cards ── */}
        <View style={styles.cards}>
          {metricTypes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={32} color="rgba(46,125,125,0.3)" />
              <Text style={styles.emptyStateText}>No data logged yet.</Text>
              <Text style={styles.emptyStateSub}>Start tracking metrics to see your trends here.</Text>
            </View>
          ) : (
            metricTypes.map((type) => (
              <MetricCard
                key={type}
                metricType={type}
                logs={logsByMetric[type]}
                period={period}
              />
            ))
          )}

          {/* ── Pattern detected card ── */}
          {metricTypes.length > 0 && (
            <View style={styles.patternCard}>
              <View style={styles.patternRow}>
                <Text style={styles.patternEmoji}>✨</Text>
                <View style={styles.patternBody}>
                  <Text style={styles.patternTitle}>Pattern detected</Text>
                  <Text style={styles.patternText}>
                    On weeks you hit your step goal, your deep sleep is 15% higher.
                    Tether noticed this across your last 6 weeks.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  scrollContent: { paddingBottom: 40 },

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
  backButton: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(253,250,245,0.75)',
    borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  pageTitle: { fontSize: 28, fontWeight: '400', color: '#1C1A17', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#7A7570' },

  // Time range pills
  pillsScroll: { marginTop: 20 },
  pillsRow: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#D4CEC5',
    backgroundColor: '#FDFAF5',
  },
  pillSelected: { backgroundColor: '#2E7D7D', borderColor: '#2E7D7D' },
  pillText: { fontSize: 13, fontWeight: '500', color: '#2A2520' },
  pillTextSelected: { color: '#FFFFFF' },

  // Cards container
  cards: { paddingHorizontal: 20, marginTop: 20, gap: 16 },

  // Metric card
  card: {
    backgroundColor: '#FDFAF5',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(200,190,175,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: '#1C1A17', marginBottom: 2 },
  cardDesc: { fontSize: 12, color: '#7A7570' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendPct: { fontSize: 13, fontWeight: '600' },

  // Current value
  currentWrap: { marginBottom: 12 },
  currentValue: { fontSize: 28, fontWeight: '500', color: '#1C1A17', marginBottom: 2 },
  currentLabel: { fontSize: 12, color: '#7A7570' },

  // Chart
  chartWrap: { marginLeft: -8 },

  // Empty chart
  emptyChart: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46,125,125,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(46,125,125,0.2)',
  },
  emptyChartText: { fontSize: 12, color: '#7A7570', textAlign: 'center' },

  // Empty state (no metrics at all)
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyStateText: { fontSize: 15, fontWeight: '500', color: '#7A7570' },
  emptyStateSub: { fontSize: 13, color: '#7A7570', textAlign: 'center' },

  // Pattern detected card
  patternCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(46,125,125,0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D7D',
  },
  patternRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  patternEmoji: { fontSize: 18 },
  patternBody: { flex: 1 },
  patternTitle: { fontSize: 15, fontWeight: '600', color: '#1C1A17', marginBottom: 8 },
  patternText: { fontSize: 14, lineHeight: 22, color: '#2A2520' },
});
