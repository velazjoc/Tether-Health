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
} from 'react-native';
import { router } from 'expo-router';
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

// ─── StatusTag ────────────────────────────────────────────────────────────────
type StatusVariant = 'needs-attention' | 'keep-going' | 'on-track';

const STATUS_CONFIGS: Record<StatusVariant, { bg: string; border: string; text: string; label: string }> = {
  'needs-attention': { bg: 'rgba(196,133,122,0.15)', border: 'rgba(196,133,122,0.3)', text: '#B05040', label: 'Needs attention' },
  'keep-going':      { bg: 'rgba(200,160,80,0.15)',  border: 'rgba(200,160,80,0.3)',  text: '#A07820', label: 'Keep going' },
  'on-track':        { bg: 'rgba(74,155,127,0.15)',  border: 'rgba(74,155,127,0.3)',  text: '#2E7D60', label: 'On track' },
};

const STATUS_CONFIGS_ON_TEAL: Partial<Record<StatusVariant, { bg: string; border: string; text: string; label: string }>> = {
  'needs-attention': { bg: 'rgba(220,60,50,0.25)', border: 'rgba(220,60,50,0.5)', text: '#FF6B5B', label: 'Needs attention' },
};

function StatusTag({ variant, onTeal = false }: { variant: StatusVariant; onTeal?: boolean }) {
  const config = (onTeal && STATUS_CONFIGS_ON_TEAL[variant]) || STATUS_CONFIGS[variant];
  return (
    <View style={[tag.pill, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={[tag.dot, { backgroundColor: config.text }]} />
      <Text style={[tag.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const tag = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, borderWidth: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: '500' },
});

// ─── NotificationHistory ──────────────────────────────────────────────────────
type NotifIcon = 'sparkles' | 'droplet' | 'calendar' | 'file' | 'trending' | 'bell';
type NotifType = 'insight' | 'goal' | 'summary' | 'appointment' | 'data' | 'streak';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  icon?: NotifIcon;
}

const NOTIF_ICON_MAP: Record<NotifIcon, React.ComponentProps<typeof Ionicons>['name']> = {
  sparkles:  'sparkles',
  droplet:   'water-outline',
  calendar:  'calendar-outline',
  file:      'document-text-outline',
  trending:  'trending-up-outline',
  bell:      'notifications-outline',
};

function NotificationHistory({
  notifications,
  onNotificationClick,
  onSeeAll,
}: {
  notifications: Notification[];
  onNotificationClick: (id: string) => void;
  onSeeAll: () => void;
}) {
  const displayed = notifications.slice(0, 3);

  return (
    <View style={nh.container}>
      <Text style={nh.sectionLabel}>RECENT NOTIFICATIONS</Text>

      <View style={nh.list}>
        {displayed.map((n) => {
          const iconName = NOTIF_ICON_MAP[n.icon ?? 'bell'];
          const showStatusTag = n.type === 'goal' || n.type === 'streak' || n.type === 'summary';
          const tagVariant: StatusVariant =
            n.type === 'streak' ? 'on-track' : n.type === 'goal' ? 'keep-going' : 'on-track';

          return (
            <TouchableOpacity
              key={n.id}
              onPress={() => onNotificationClick(n.id)}
              style={nh.card}
              activeOpacity={0.75}
            >
              {/* Unread dot */}
              {!n.isRead && <View style={nh.unreadDot} />}

              {/* Icon */}
              <View style={nh.iconCircle}>
                <Ionicons name={iconName} size={18} color="#2E7D7D" />
              </View>

              {/* Text */}
              <View style={nh.textWrap}>
                <Text style={[nh.title, { color: n.isRead ? '#7A7570' : '#1C1A17' }]} numberOfLines={1}>
                  {n.title}
                </Text>
                <Text style={[nh.body, { color: n.isRead ? '#B0A898' : '#7A7570' }]} numberOfLines={1}>
                  {n.body}
                </Text>
              </View>

              {/* Right side */}
              <View style={nh.right}>
                {showStatusTag ? (
                  <StatusTag variant={tagVariant} />
                ) : (
                  <Text style={nh.timestamp}>{n.timestamp}</Text>
                )}
                <Ionicons name="chevron-forward" size={16} color="#7A7570" style={{ marginTop: 4 }} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {notifications.length > 3 && (
        <TouchableOpacity onPress={onSeeAll} style={nh.seeAll} activeOpacity={0.7}>
          <Text style={nh.seeAllText}>See all →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const nh = StyleSheet.create({
  container: { marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: '#7A7570', marginBottom: 12 },
  list: { gap: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 56, paddingHorizontal: 12, backgroundColor: '#FDFAF5', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E7D7D', flexShrink: 0 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E6F4F4', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  textWrap: { flex: 1, minWidth: 0 },
  title: { fontSize: 13, fontWeight: '500' },
  body: { fontSize: 12 },
  right: { flexShrink: 0, alignItems: 'flex-end', justifyContent: 'space-between', height: 40 },
  timestamp: { fontSize: 11, color: '#B0A898' },
  seeAll: { alignItems: 'flex-end', marginTop: 12 },
  seeAllText: { fontSize: 13, fontWeight: '500', color: '#2E7D7D' },
});

// ─── NotificationBanner ───────────────────────────────────────────────────────
function NotificationBanner({
  title,
  body,
  onDismiss,
  onTap,
}: {
  title: string;
  body: string;
  onDismiss: () => void;
  onTap?: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();

    // Auto-dismiss after 4s
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => onDismiss());
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => onDismiss());
  };

  return (
    <Animated.View style={[nb.container, { opacity }]}>
      <TouchableOpacity style={nb.card} onPress={onTap} activeOpacity={0.9}>
        <View style={nb.iconBox}>
          <Ionicons name="notifications-outline" size={20} color="#2E7D7D" />
        </View>
        <View style={nb.textWrap}>
          <Text style={nb.title} numberOfLines={1}>{title}</Text>
          <Text style={nb.body} numberOfLines={1}>{body}</Text>
        </View>
        <TouchableOpacity onPress={handleDismiss} style={nb.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={14} color="#B0A898" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const nb = StyleSheet.create({
  container: { position: 'absolute', top: 16, left: 16, right: 16, zIndex: 50 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 72, paddingHorizontal: 16, backgroundColor: 'rgba(253,250,245,0.97)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E6F4F4', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  textWrap: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: '500', color: '#1C1A17' },
  body: { fontSize: 12, color: '#7A7570' },
  closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});

// ─── Snapshot items ───────────────────────────────────────────────────────────
const snapshotItems = [
  { icon: 'trending-up-outline' as const, title: 'Movement — 7-day streak', subtitle: 'Top 30% of similar users this month' },
  { icon: 'water-outline' as const,       title: 'Hydration below goal',    subtitle: 'Averaging 1.4L — linked to afternoon energy dips' },
  { icon: 'sunny-outline' as const,       title: 'Vitamin D still low — 3rd month', subtitle: 'Ask Dr. Patel at next visit' },
];

// ─── Mock notifications ───────────────────────────────────────────────────────
const mockNotifications: Notification[] = [
  { id: '1', type: 'insight', title: 'Tether noticed something',   body: "Your deep sleep has been dropping — here's what might help.", timestamp: '2h', isRead: false, icon: 'sparkles' },
  { id: '2', type: 'streak',  title: '5 days in a row',            body: "You've hit your wind-down routine 5 nights running.",          timestamp: '1d', isRead: true,  icon: 'trending' },
  { id: '3', type: 'goal',    title: 'Quick check-in',             body: "You're at 0.8L water — you usually feel better at 1.5L by noon.", timestamp: '2d', isRead: true,  icon: 'droplet' },
];

// ─── Home screen ─────────────────────────────────────────────────────────────
export default function Home() {
  const [showBanner, setShowBanner] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  const handleHelpClick = () => {
    router.push({ pathname: '/tutorial', params: { from: 'home' } } as any);
  };

  const handleNotificationClick = (id: string) => {
    const n = mockNotifications.find((n) => n.id === id);
    if (!n) return;
    switch (n.type) {
      case 'insight':
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        break;
      case 'goal':
      case 'streak':
      case 'summary':
        router.push('/progress' as any);
        break;
      case 'appointment':
        router.push('/appointment-prep' as any);
        break;
      case 'data':
        router.push('/my-health' as any);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TetherLogo size={32} />
            <TouchableOpacity onPress={handleHelpClick} style={styles.helpButton} activeOpacity={0.7}>
              <Text style={styles.helpButtonText}>?</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.greeting}>GOOD MORNING, SARAH</Text>
          <Text style={styles.pageTitle}>Your insights</Text>
        </View>

        {/* ── Hero insight card ── */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => router.push('/insight/sleep-improvement' as any)}
            style={styles.insightCard}
            activeOpacity={0.92}
          >
            <View style={styles.insightCardTop}>
              <View style={styles.insightCardTopLeft}>
                <View style={styles.insightIconWrap}>
                  <Ionicons name="moon-outline" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.insightCardLabel}>TETHER · SLEEP</Text>
              </View>
              <View style={styles.insightStatusTag}>
                <StatusTag variant="needs-attention" onTeal />
              </View>
            </View>

            <Text style={styles.insightCardBody}>
              Your sleep dipped after your February 14 UTI — first time this pattern has appeared in 6 months of tracking
            </Text>

            <Text style={styles.insightCardCta}>See what's behind this →</Text>

            <View style={styles.insightCardDivider} />
            <Text style={styles.insightCardSource}>
              Source: Apple Health · Sleep data from Feb 24–27
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Appointment banner ── */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => router.push('/appointment-prep' as any)}
            style={styles.appointmentCard}
            activeOpacity={0.85}
          >
            <View style={styles.appointmentIconWrap}>
              <Ionicons name="calendar-outline" size={20} color="#3D6E68" />
            </View>
            <View style={styles.appointmentText}>
              <Text style={styles.appointmentTitle}>Upcoming appointment?</Text>
              <Text style={styles.appointmentSubtitle}>
                Build your insights + questions for Dr. Patel.
              </Text>
            </View>
            <Text style={styles.appointmentChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── Today's Snapshot ── */}
        <View style={[styles.section, styles.snapshotSection]}>
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>TODAY'S SNAPSHOT</Text>
          <View style={styles.snapshotList}>
            {snapshotItems.map((item, i) => (
              <View key={i} style={styles.snapshotRow}>
                <View style={styles.snapshotIconWrap}>
                  <Ionicons name={item.icon} size={20} color="#3D6E68" />
                </View>
                <View style={styles.snapshotText}>
                  <Text style={styles.snapshotTitle}>{item.title}</Text>
                  <Text style={styles.snapshotSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Notification History ── */}
        <View style={styles.section}>
          <NotificationHistory
            notifications={mockNotifications}
            onNotificationClick={handleNotificationClick}
            onSeeAll={() => console.log('See all notifications')}
          />
        </View>
      </ScrollView>

      {/* ── Notification Banner (overlay) ── */}
      {showBanner && (
        <NotificationBanner
          title="Tether noticed something"
          body="Your deep sleep has been dropping — here's what might help."
          onDismiss={() => setShowBanner(false)}
          onTap={() => {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            setShowBanner(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(46,125,125,0.07)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  helpButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(253,250,245,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(200,190,175,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7A7570',
  },
  greeting: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#7A7570',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: '#1C1A17',
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  // Hero insight card
  insightCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#2E7D7D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#2E7D7D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 8,
  },
  insightCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  insightCardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
  },
  insightStatusTag: {
    marginLeft: 8,
  },
  insightCardBody: {
    fontSize: 15,
    lineHeight: 23,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  insightCardCta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  insightCardDivider: {
    marginTop: 20,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  insightCardSource: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },

  // Appointment card
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(253,252,251,0.6)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(234,230,224,0.5)',
  },
  appointmentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(223,233,230,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  appointmentText: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1A17',
    marginBottom: 2,
  },
  appointmentSubtitle: {
    fontSize: 13,
    color: '#7A7570',
  },
  appointmentChevron: {
    fontSize: 20,
    color: '#7A7570',
  },

  // Snapshot
  snapshotSection: {
    paddingTop: 4,
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.07)',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#7A7570',
    marginBottom: 16,
  },
  snapshotList: {
    gap: 16,
  },
  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  snapshotIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DFE9E6',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  snapshotText: {
    flex: 1,
  },
  snapshotTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1A17',
    marginBottom: 2,
  },
  snapshotSubtitle: {
    fontSize: 13,
    color: '#7A7570',
  },
});
