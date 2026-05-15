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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getOrCreateSession } from '@/services/session';
import { getGoals, getHealthLogs } from '@/services/db';

// ─── Constants ────────────────────────────────────────────────────────────────
const TILE_SIZE = (Dimensions.get('window').width - 40 - 8) / 2; // 20px side padding, 8px gap

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

// ─── StatusTag ────────────────────────────────────────────────────────────────
type StatusVariant = 'needs-attention' | 'keep-going' | 'on-track';
const STATUS_CONFIGS = {
  'needs-attention': { bg: 'rgba(196,133,122,0.15)', border: 'rgba(196,133,122,0.3)', text: '#B05040', label: 'Needs attention' },
  'keep-going':      { bg: 'rgba(200,160,80,0.15)',  border: 'rgba(200,160,80,0.3)',  text: '#A07820', label: 'Keep going' },
  'on-track':        { bg: 'rgba(74,155,127,0.15)',  border: 'rgba(74,155,127,0.3)',  text: '#2E7D60', label: 'On track' },
};
function StatusTag({ variant }: { variant: StatusVariant }) {
  const c = STATUS_CONFIGS[variant];
  return (
    <View style={[tag.pill, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={[tag.dot, { backgroundColor: c.text }]} />
      <Text style={[tag.label, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}
const tag = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, borderWidth: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: '500' },
});

// ─── ProgressCircle (4-quadrant border approximation) ────────────────────────
function ProgressCircle({ percentage, size = 60, trackColor = 'rgba(46,125,125,0.12)' }: { percentage: number; size?: number; trackColor?: string }) {
  const p = percentage / 100;
  const teal = '#2E7D7D';
  return (
    <View style={{ width: size, height: size, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      {/* Track */}
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 4, borderColor: trackColor }} />
      {/* Arc — 4-quadrant: each side becomes teal once percentage passes that quarter */}
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 4,
        borderTopColor:    p > 0    ? teal : 'transparent',
        borderRightColor:  p > 0.25 ? teal : 'transparent',
        borderBottomColor: p > 0.5  ? teal : 'transparent',
        borderLeftColor:   p > 0.75 ? teal : 'transparent',
        transform: [{ rotate: '-45deg' }],
      }} />
    </View>
  );
}

// ─── SparklineChart (7-bar mini chart) ───────────────────────────────────────
function SparklineChart({ data, yMin, yMax }: { data: { day: string; value: number }[]; yMin: number; yMax: number }) {
  const range = yMax - yMin || 1;
  const maxH = 72;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: maxH + 16, gap: 4 }}>
      {data.map((point, i) => {
        const h = Math.max(4, ((point.value - yMin) / range) * maxH);
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
            <View style={{ width: '80%', height: h, backgroundColor: '#2E7D7D', borderRadius: 2, opacity: 0.7, marginBottom: 4 }} />
            <Text style={{ fontSize: 9, color: '#B0A898' }}>{point.day.charAt(0)}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── NotificationBanner ───────────────────────────────────────────────────────
function NotificationBanner({ title, body, icon, onDismiss, onTap }: {
  title: string; body: string; icon: React.ComponentProps<typeof Ionicons>['name'];
  onDismiss: () => void; onTap?: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(onDismiss);
    }, 4000);
    return () => clearTimeout(t);
  }, []);
  const dismiss = () => Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(onDismiss);
  return (
    <Animated.View style={[nb.wrap, { opacity }]}>
      <TouchableOpacity style={nb.card} onPress={onTap} activeOpacity={0.9}>
        <View style={nb.iconBox}><Ionicons name={icon} size={20} color="#2E7D7D" /></View>
        <View style={nb.text}>
          <Text style={nb.title} numberOfLines={1}>{title}</Text>
          <Text style={nb.body} numberOfLines={1}>{body}</Text>
        </View>
        <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={14} color="#B0A898" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}
const nb = StyleSheet.create({
  wrap: { position: 'absolute', top: 16, left: 16, right: 16, zIndex: 50 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 72, paddingHorizontal: 16, backgroundColor: 'rgba(253,250,245,0.97)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E6F4F4', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  text: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: '500', color: '#1C1A17' },
  body: { fontSize: 12, color: '#7A7570' },
});

// ─── Types & data helpers ─────────────────────────────────────────────────────
type MetricType = 'sleep' | 'steps' | 'hydration' | 'vitamin-d';

type Goal = {
  id: string; name: string; current: number; target: number; unit: string;
  status: StatusVariant; progress: number; actionText: string; actionRoute: string;
  chartData: { day: string; value: number }[]; yMin: number; yMax: number;
};

type WeekMetric = {
  name: string; current: string; goal: string;
  percentage: number; route: string; type: MetricType;
};

const KNOWN_TYPES = new Set<string>(['sleep', 'steps', 'hydration', 'vitamin-d']);

function mapGoal(g: any): Goal {
  const current = g.current_value ?? g.current ?? 0;
  const target = g.target_value ?? g.target ?? 1;
  const raw = g.progress ?? Math.round((current / (target || 1)) * 100);
  const progress = raw <= 1 ? Math.round(raw * 100) : raw;
  const status: StatusVariant =
    (['needs-attention', 'keep-going', 'on-track'] as string[]).includes(g.status)
      ? (g.status as StatusVariant)
      : progress >= 90 ? 'on-track' : progress >= 70 ? 'keep-going' : 'needs-attention';
  const metricType: string = g.metric_type ?? '';
  return {
    id: String(g.id),
    name: g.name ?? '',
    current,
    target,
    unit: g.unit ?? '',
    status,
    progress,
    actionText: g.action_text ?? "See what's helping →",
    actionRoute: g.action_route ?? (metricType ? `/metric/${metricType}` : '/progress'),
    chartData: Array.isArray(g.chart_data) ? g.chart_data : [],
    yMin: g.y_min ?? 0,
    yMax: g.y_max ?? Math.max(target * 1.5, 1),
  };
}

function buildWeekMetrics(logs: any[]): WeekMetric[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const recent = logs.filter((l) => new Date(l.created_at) >= cutoff);
  // logs are newest-first; first occurrence per type = latest value
  const seen = new Set<string>();
  const latest: any[] = [];
  for (const log of recent) {
    if (log.metric_type && !seen.has(log.metric_type)) {
      seen.add(log.metric_type);
      latest.push(log);
    }
  }
  return latest.map((log) => {
    const mt: string = log.metric_type ?? '';
    const value = log.value ?? 0;
    const unit = log.unit ?? '';
    const target = log.target ?? 0;
    const percentage = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
    return {
      name: mt.toUpperCase().replace(/-/g, ' '),
      current: `${value}${unit}`,
      goal: target > 0 ? `${target}${unit}` : '',
      percentage,
      route: `/metric/${mt}`,
      type: (KNOWN_TYPES.has(mt) ? mt : 'sleep') as MetricType,
    };
  });
}

const TILE_BG: Record<MetricType, string> = {
  'sleep':     '#F5F3FF',
  'steps':     '#F0F7F2',
  'hydration': '#F0F5FF',
  'vitamin-d': '#FFF9F0',
};

const TILE_ICON: Record<MetricType, React.ComponentProps<typeof Ionicons>['name']> = {
  'sleep':     'moon-outline',
  'steps':     'footsteps-outline',
  'hydration': 'water-outline',
  'vitamin-d': 'sunny-outline',
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function Progress() {
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weekMetrics, setWeekMetrics] = useState<WeekMetric[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const sessionId = await getOrCreateSession();
        const [rawGoals, rawLogs] = await Promise.all([
          getGoals(sessionId),
          getHealthLogs(sessionId),
        ]);
        setGoals((rawGoals ?? []).map(mapGoal));
        setWeekMetrics(buildWeekMetrics(rawLogs ?? []));
      } catch (_) {
        // leave empty arrays on error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />
        <View style={styles.header}>
          <TetherLogo size={32} />
          <Text style={styles.pageTitle}>Progress</Text>
          <Text style={styles.pageSubtitle}>Your goals and how you're tracking</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2E7D7D" />
        </View>
      </SafeAreaView>
    );
  }

  const onTrackCount = goals.filter((g) => g.status === 'on-track').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TetherLogo size={32} />
          <Text style={styles.pageTitle}>Progress</Text>
          <Text style={styles.pageSubtitle}>Your goals and how you're tracking</Text>
        </View>

        {/* ── Tether check-in strip ── */}
        <View style={styles.section}>
          <View style={styles.tetherStrip}>
            <Ionicons name="sparkles" size={16} color="#2E7D7D" />
            <Text style={styles.tetherStripText}>
              {goals.length > 0
                ? `You're on track with ${onTrackCount} of ${goals.length} goal${goals.length !== 1 ? 's' : ''} today.`
                : 'Add your first goal to start tracking progress.'}
            </Text>
            <TouchableOpacity onPress={() => router.push('/chat' as any)} activeOpacity={0.7}>
              <Text style={styles.askTetherLink}>Ask Tether →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Active Goals ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACTIVE GOALS</Text>

          <View style={styles.goalsList}>
            {goals.length === 0 && (
              <Text style={styles.emptyText}>No active goals yet.</Text>
            )}
            {goals.map((goal) => {
              const expanded = expandedGoal === goal.id;
              const accentColor = goal.status === 'on-track' ? '#2E7D7D' : '#C4857A';
              const trackColor = goal.status === 'on-track' ? 'rgba(46,125,125,0.12)' : 'rgba(196,133,122,0.12)';

              return (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => setExpandedGoal(expanded ? null : goal.id)}
                  style={[styles.goalCard, { borderLeftColor: accentColor }]}
                  activeOpacity={0.85}
                >
                  {/* Name + status tag */}
                  <View style={styles.goalCardTop}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <StatusTag variant={goal.status} />
                  </View>

                  {/* Progress bar */}
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${goal.progress}%` as any, backgroundColor: accentColor }]} />
                  </View>
                  <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>{goal.current} {goal.unit}</Text>
                    <Text style={styles.progressLabel}>Goal: {goal.target} {goal.unit}</Text>
                  </View>

                  {/* Action link + chevron */}
                  <View style={styles.goalCardBottom}>
                    <TouchableOpacity onPress={() => router.push(goal.actionRoute as any)} activeOpacity={0.7}>
                      <Text style={styles.actionLink}>{goal.actionText}</Text>
                    </TouchableOpacity>
                    <Ionicons name={expanded ? 'chevron-down' : 'chevron-forward'} size={20} color="#7A7570" />
                  </View>

                  {/* Expanded sparkline */}
                  {expanded && (
                    <View style={styles.sparklineWrap}>
                      <SparklineChart data={goal.chartData} yMin={goal.yMin} yMax={goal.yMax} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── This Week ── */}
        <View style={[styles.section, { paddingBottom: 32 }]}>
          <Text style={styles.sectionLabel}>THIS WEEK</Text>

          {weekMetrics.length === 0 && (
            <Text style={styles.emptyText}>No data logged this week.</Text>
          )}
          <View style={styles.tilesGrid}>
            {weekMetrics.map((metric, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => router.push(metric.route as any)}
                style={[styles.metricTile, { backgroundColor: TILE_BG[metric.type] }]}
                activeOpacity={0.85}
              >
                {/* Progress circle */}
                <View style={styles.tileCircleWrap}>
                  <ProgressCircle percentage={metric.percentage} size={60} />
                  {/* Icon behind (centered) */}
                  <View style={styles.tileIconCenter} pointerEvents="none">
                    <Ionicons name={TILE_ICON[metric.type]} size={18} color="rgba(46,125,125,0.3)" />
                  </View>
                  {/* Percentage on top */}
                  <View style={styles.tilePercentCenter} pointerEvents="none">
                    <Text style={styles.tilePercent}>{metric.percentage}%</Text>
                  </View>
                </View>

                <Text style={styles.tileName}>{metric.name}</Text>
                <Text style={styles.tileValue}>{metric.current} of {metric.goal}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* View all trends */}
          <TouchableOpacity
            onPress={() => router.push('/trends' as any)}
            style={styles.viewAllButton}
            activeOpacity={0.85}
          >
            <Text style={styles.viewAllText}>View all trends →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Notification Banner ── */}
      {showBanner && (
        <NotificationBanner
          title="Quick check-in"
          body="You're at 0.8L water — you usually feel better when you hit 1.5L by noon."
          icon="water-outline"
          onDismiss={() => setShowBanner(false)}
          onTap={() => { router.push('/metric/hydration' as any); setShowBanner(false); }}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  scrollContent: { paddingBottom: 16 },

  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, backgroundColor: 'rgba(46,125,125,0.07)' },
  pageTitle: { fontSize: 28, fontWeight: '500', color: '#1C1A17', marginTop: 12 },
  pageSubtitle: { fontSize: 14, color: '#7A7570', marginTop: 4 },

  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: '#7A7570', marginBottom: 12 },

  // Tether strip
  tetherStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 56, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(46,125,125,0.08)', borderWidth: 1, borderLeftWidth: 3, borderColor: 'rgba(46,125,125,0.15)', borderLeftColor: '#2E7D7D' },
  tetherStripText: { flex: 1, fontSize: 13, color: '#1C1A17' },
  askTetherLink: { fontSize: 12, fontWeight: '500', color: '#2E7D7D', flexShrink: 0 },

  // Goal cards
  goalsList: { gap: 12 },
  goalCard: { backgroundColor: '#FDFAF5', borderRadius: 16, padding: 20, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  goalCardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 8 },
  goalName: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1C1A17' },
  progressBarTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(46,125,125,0.12)', marginBottom: 8, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressLabel: { fontSize: 12, color: '#7A7570' },
  goalCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionLink: { fontSize: 12, fontWeight: '500', color: '#2E7D7D' },
  sparklineWrap: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#EAE6E0' },

  // Week metric tiles
  tilesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricTile: { width: TILE_SIZE, height: TILE_SIZE, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4 },
  tileCircleWrap: { width: 60, height: 60, marginBottom: 8 },
  tileIconCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  tilePercentCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  tilePercent: { fontSize: 16, fontWeight: '700', color: '#1C1A17' },
  tileName: { fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, color: '#2A2520', textAlign: 'center', marginBottom: 2 },
  tileValue: { fontSize: 11, color: '#7A7570', textAlign: 'center' },

  // View all button
  viewAllButton: { marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: '#FDFAF5', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  viewAllText: { fontSize: 15, fontWeight: '500', color: '#2E7D7D' },
  emptyText: { fontSize: 13, color: '#7A7570' },
});
