import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getOrCreateSession } from '@/services/session';
import { getProfile } from '@/services/db';

// ─── TetherLogo ───────────────────────────────────────────────────────────────
function TetherLogo({ size = 24 }: { size?: number }) {
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

// ─── Types ────────────────────────────────────────────────────────────────────
type Frequency = 'smart' | 'daily' | 'minimal';
type NotifTypes = {
  newInsights: boolean; goalNudges: boolean; weeklySummary: boolean;
  appointmentReminders: boolean; newData: boolean; streaks: boolean;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const connectedSources: {
  id: number; name: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string; status: string; statusColor: string; isConnected: boolean; route: string;
}[] = [
  { id: 1, name: 'Apple Health',  iconName: 'logo-apple',            iconColor: '#FF2D55', status: 'Connected',     statusColor: '#2E7D7D', isConnected: true,  route: '/apple-health-from-health' },
  { id: 2, name: 'Wearable',      iconName: 'watch-outline',          iconColor: '#7A7570', status: 'Not connected', statusColor: '#7A7570', isConnected: false, route: '/wearable-from-health' },
  { id: 3, name: 'Lab Results',   iconName: 'document-text-outline',  iconColor: '#7A7570', status: 'Connected',     statusColor: '#2E7D7D', isConnected: true,  route: '/lab-result/1' },
];

const frequencyOptions: { value: Frequency; label: string; description: string }[] = [
  { value: 'smart',   label: 'Smart',        description: 'Only when Tether notices something worth your attention' },
  { value: 'daily',   label: 'Daily digest', description: 'One summary notification each morning' },
  { value: 'minimal', label: 'Minimal',      description: 'Appointment reminders only' },
];

const notifTypeList: { key: keyof NotifTypes; label: string; sublabel: string }[] = [
  { key: 'newInsights',          label: 'New insights',          sublabel: 'When Tether notices something in your data' },
  { key: 'goalNudges',           label: 'Goal nudges',           sublabel: 'When a goal needs your attention today' },
  { key: 'weeklySummary',        label: 'Weekly summary',        sublabel: 'Your week in review every Sunday' },
  { key: 'appointmentReminders', label: 'Appointment reminders', sublabel: '24 hours before a logged visit' },
  { key: 'newData',              label: 'New data',              sublabel: 'When lab results or records are added' },
  { key: 'streaks',              label: 'Streaks',               sublabel: "Encouragement when you're on a roll" },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function Profile() {
  const [profileName, setProfileName] = useState('');
  const [profilePronouns, setProfilePronouns] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sessionId = await getOrCreateSession();
        const data = await getProfile(sessionId);
        if (data) {
          const first = data.first_name ?? '';
          const last = data.last_name ?? '';
          setProfileName([first, last].filter(Boolean).join(' '));
          setProfilePronouns(data.pronouns ?? '');
        }
      } catch (_) {
        // leave empty on error
      }
    })();
  }, []);
  const [notificationFrequency, setNotificationFrequency] = useState<Frequency>('smart');
  const [notificationTypes, setNotificationTypes] = useState<NotifTypes>({
    newInsights: true, goalNudges: true, weeklySummary: true,
    appointmentReminders: true, newData: true, streaks: false,
  });
  const [showFrequencySheet, setShowFrequencySheet] = useState(false);
  const [showTypesSheet, setShowTypesSheet] = useState(false);

  const frequencyLabel = { smart: 'Smart', daily: 'Daily digest', minimal: 'Minimal' }[notificationFrequency];

  const handleToggleType = (key: keyof NotifTypes) => {
    setNotificationTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFrequencySelect = (freq: Frequency) => {
    setNotificationFrequency(freq);
    setTimeout(() => setShowFrequencySheet(false), 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Profile header ── */}
        <View style={styles.profileHeader}>
          <TetherLogo size={24} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileName || 'Your Profile'}</Text>
            <Text style={styles.profileEmail}>{profilePronouns}</Text>
            <TouchableOpacity onPress={() => router.push('/edit-profile' as any)} activeOpacity={0.7}>
              <Text style={styles.editProfileLink}>Edit profile →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sections}>

          {/* ── Section 1: Preferences ── */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>PREFERENCES</Text>
            <View style={styles.sectionDivider} />
            <View style={[styles.card, styles.cardTealAccent]}>
              <TouchableOpacity
                onPress={() => setDataSharingEnabled((v) => !v)}
                style={styles.settingsRow}
                activeOpacity={0.85}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#7A7570" />
                  <Text style={styles.rowLabel}>Data sharing</Text>
                </View>
                <Switch
                  value={dataSharingEnabled}
                  onValueChange={setDataSharingEnabled}
                  trackColor={{ false: '#D4CFC7', true: '#2E7D7D' }}
                  thumbColor="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Section 2: Notifications ── */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
            <View style={styles.sectionDivider} />
            <View style={[styles.card, !notificationsEnabled && styles.cardDisabled]}>
              {/* Master toggle */}
              <TouchableOpacity
                onPress={() => setNotificationsEnabled((v) => !v)}
                style={styles.settingsRowTall}
                activeOpacity={0.85}
              >
                <View style={styles.rowLeftColumn}>
                  <Text style={styles.rowLabel}>Notifications</Text>
                  <Text style={styles.rowSublabel}>Tether notifies you only when it matters</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#D4CFC7', true: '#2E7D7D' }}
                  thumbColor="#FFFFFF"
                />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              {/* Frequency */}
              <TouchableOpacity
                onPress={() => setShowFrequencySheet(true)}
                disabled={!notificationsEnabled}
                style={styles.settingsRow}
                activeOpacity={0.85}
              >
                <Text style={styles.rowLabel}>How often</Text>
                <View style={styles.rowRight}>
                  <Text style={styles.rowValue}>{frequencyLabel}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#7A7570" />
                </View>
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              {/* Types */}
              <TouchableOpacity
                onPress={() => setShowTypesSheet(true)}
                disabled={!notificationsEnabled}
                style={styles.settingsRow}
                activeOpacity={0.85}
              >
                <Text style={styles.rowLabel}>What you'll hear about</Text>
                <View style={styles.rowRight}>
                  <Text style={[styles.rowValue, { maxWidth: 140 }]} numberOfLines={1}>
                    Insights, goals, appointments
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#7A7570" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Section 3: Connected Sources ── */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>CONNECTED SOURCES</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.card}>
              {connectedSources.map((source, i) => (
                <View key={source.id}>
                  <TouchableOpacity
                    onPress={() => router.push(source.route as any)}
                    style={styles.settingsRow}
                    activeOpacity={0.85}
                  >
                    <View style={styles.rowLeft}>
                      <Ionicons name={source.iconName} size={20} color={source.iconColor} />
                      <Text style={styles.rowLabel}>{source.name}</Text>
                    </View>
                    <View style={styles.rowRight}>
                      <Text style={[styles.rowValue, { color: source.statusColor }]}>
                        {source.isConnected ? source.status : '+ Connect'}
                      </Text>
                      {source.isConnected && (
                        <Ionicons name="chevron-forward" size={16} color="#7A7570" />
                      )}
                    </View>
                  </TouchableOpacity>
                  {i < connectedSources.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => router.push('/connected-sources' as any)}
              style={styles.manageAllWrap}
              activeOpacity={0.7}
            >
              <Text style={styles.manageAllText}>Manage all →</Text>
            </TouchableOpacity>
          </View>

          {/* ── Section 4: Data & Privacy ── */}
          <View style={[styles.sectionBlock, { marginBottom: 40 }]}>
            <Text style={styles.sectionLabel}>DATA & PRIVACY</Text>
            <View style={styles.sectionDivider} />

            <TouchableOpacity
              onPress={() => router.push('/edit-profile' as any)}
              style={styles.plainRow}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={16} color="#7A7570" />
              <Text style={styles.rowLabel}>Export my data</Text>
              <Ionicons name="chevron-forward" size={16} color="#7A7570" style={styles.rowChevron} />
            </TouchableOpacity>

            <View style={styles.plainRowDivider} />

            <TouchableOpacity
              onPress={() => router.push('/privacy-policy' as any)}
              style={styles.plainRow}
              activeOpacity={0.7}
            >
              <Ionicons name="lock-closed-outline" size={16} color="#7A7570" />
              <Text style={styles.rowLabel}>Privacy settings</Text>
              <Ionicons name="chevron-forward" size={16} color="#7A7570" style={styles.rowChevron} />
            </TouchableOpacity>

            <View style={styles.plainRowDivider} />

            <TouchableOpacity style={styles.plainRow} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={16} color="#C4857A" />
              <Text style={[styles.rowLabel, { color: '#C4857A' }]}>Delete account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Frequency bottom sheet ── */}
      <Modal
        visible={showFrequencySheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFrequencySheet(false)}
      >
        <View style={styles.sheetContainer}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowFrequencySheet(false)}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>How often should Tether reach out?</Text>

            <View style={[styles.card, { marginHorizontal: 20, marginBottom: 24 }]}>
              {frequencyOptions.map((opt, i) => (
                <View key={opt.value}>
                  {i > 0 && <View style={styles.rowDivider} />}
                  <TouchableOpacity
                    onPress={() => handleFrequencySelect(opt.value)}
                    style={styles.settingsRowTall}
                    activeOpacity={0.85}
                  >
                    <View style={styles.rowLeftColumn}>
                      <Text style={styles.rowLabel}>{opt.label}</Text>
                      <Text style={styles.rowSublabel}>{opt.description}</Text>
                    </View>
                    {notificationFrequency === opt.value && (
                      <Ionicons name="checkmark" size={20} color="#2E7D7D" />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowFrequencySheet(false)}
              style={styles.cancelButton}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Types bottom sheet ── */}
      <Modal
        visible={showTypesSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTypesSheet(false)}
      >
        <View style={styles.sheetContainer}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowTypesSheet(false)}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose what Tether tells you</Text>

            <View style={[styles.card, { marginHorizontal: 20, marginBottom: 24 }]}>
              {notifTypeList.map((type, i) => (
                <View key={type.key}>
                  {i > 0 && <View style={styles.rowDivider} />}
                  <TouchableOpacity
                    onPress={() => handleToggleType(type.key)}
                    style={styles.settingsRowTall}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.rowLeftColumn, { paddingRight: 16 }]}>
                      <Text style={styles.rowLabel}>{type.label}</Text>
                      <Text style={styles.rowSublabel}>{type.sublabel}</Text>
                    </View>
                    <Switch
                      value={notificationTypes[type.key]}
                      onValueChange={() => handleToggleType(type.key)}
                      trackColor={{ false: '#D4CFC7', true: '#2E7D7D' }}
                      thumbColor="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowTypesSheet(false)}
              style={styles.doneButton}
              activeOpacity={0.85}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  scrollContent: { paddingBottom: 0 },

  // Profile header
  profileHeader: {
    height: 200,
    paddingHorizontal: 20,
    paddingTop: 52,
    backgroundColor: 'rgba(46,125,125,0.07)',
    justifyContent: 'flex-start',
  },
  profileInfo: { marginTop: 20 },
  profileName: { fontSize: 28, fontWeight: '400', color: '#1C1A17', marginBottom: 4 },
  profileEmail: { fontSize: 13, color: '#7A7570', marginBottom: 8 },
  editProfileLink: { fontSize: 13, fontWeight: '500', color: '#2E7D7D' },

  // Section wrapper
  sections: { paddingHorizontal: 20, paddingTop: 32 },
  sectionBlock: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: '#7A7570', marginBottom: 4 },
  sectionDivider: { height: 1, backgroundColor: 'rgba(200,190,175,0.4)', marginBottom: 12 },

  // Card
  card: {
    borderRadius: 16, overflow: 'hidden',
    backgroundColor: '#FDFAF5',
    borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3,
  },
  cardTealAccent: { borderLeftWidth: 3, borderLeftColor: '#2E7D7D' },
  cardDisabled: { opacity: 0.4 },

  // Row types
  settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 52 },
  settingsRowTall: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, minHeight: 56 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLeftColumn: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '500', color: '#1C1A17' },
  rowSublabel: { fontSize: 12, color: '#7A7570', marginTop: 2 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowValue: { fontSize: 13, color: '#7A7570' },
  rowDivider: { height: 1, backgroundColor: 'rgba(200,190,175,0.5)', marginHorizontal: 20 },
  rowChevron: { marginLeft: 'auto' },

  // Plain rows (Data & Privacy — no card background)
  plainRow: { flexDirection: 'row', alignItems: 'center', height: 52, gap: 12 },
  plainRowDivider: { height: 1, backgroundColor: 'rgba(200,190,175,0.4)' },

  // Manage all
  manageAllWrap: { alignItems: 'flex-end', paddingRight: 0, marginTop: 8 },
  manageAllText: { fontSize: 13, fontWeight: '500', color: '#2E7D7D' },

  // Bottom sheets
  sheetContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FEFCF8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: 'rgba(200,190,175,0.5)',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 16,
  },
  sheetHandle: { width: 48, height: 6, borderRadius: 3, backgroundColor: '#EAE6E0', alignSelf: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 20, fontWeight: '400', color: '#1C1A17', textAlign: 'center', paddingHorizontal: 24, marginBottom: 16 },
  cancelButton: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { fontSize: 14, color: '#7A7570' },
  doneButton: { marginHorizontal: 20, height: 48, borderRadius: 100, backgroundColor: '#2E6A64', alignItems: 'center', justifyContent: 'center', shadowColor: '#2E6A64', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  doneText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
