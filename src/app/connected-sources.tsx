import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ConnectedSources() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3F0" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={16} color="#7A7570" />
          <Text style={styles.backText}>Back to Profile</Text>
        </TouchableOpacity>
        <Text style={styles.eyebrow}>DATA SOURCES</Text>
        <Text style={styles.title}>Connected Sources</Text>
        <Text style={styles.subtitle}>Manage how Tether syncs your health data</Text>

        {/* Apple Health */}
        <View style={styles.sourceCard}>
          <View style={styles.sourceHeader}>
            <View style={styles.sourceIconBox}>
              <Ionicons name="pulse-outline" size={24} color="#3D6E68" />
            </View>
            <View style={styles.sourceInfo}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceName}>Apple Health</Text>
                <View style={styles.connectedBadge}>
                  <View style={styles.connectedDot} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
              <Text style={styles.sourceDesc}>Sleep, activity, cycle tracking, hydration</Text>
              <Text style={styles.sourceSync}>Last synced: 2 minutes ago</Text>
            </View>
          </View>
          <View style={styles.sourceActions}>
            <TouchableOpacity style={styles.actionButtonPrimary} activeOpacity={0.8}>
              <Text style={styles.actionButtonPrimaryText}>Manage permissions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonDestructive} activeOpacity={0.8}>
              <Text style={styles.actionButtonDestructiveText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quest Labs */}
        <View style={styles.sourceCard}>
          <View style={styles.sourceHeader}>
            <View style={styles.sourceIconBox}>
              <Ionicons name="flask-outline" size={24} color="#3D6E68" />
            </View>
            <View style={styles.sourceInfo}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceName}>Quest Lab Portal</Text>
                <View style={styles.connectedBadge}>
                  <View style={styles.connectedDot} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
              <Text style={styles.sourceDesc}>Lab results, vitamin levels, hormone tests</Text>
              <Text style={styles.sourceSync}>Last synced: 2 days ago</Text>
            </View>
          </View>
          <View style={styles.sourceActions}>
            <TouchableOpacity style={styles.actionButtonPrimary} activeOpacity={0.8}>
              <Text style={styles.actionButtonPrimaryText}>Sync now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonDestructive} activeOpacity={0.8}>
              <Text style={styles.actionButtonDestructiveText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Entry */}
        <View style={styles.sourceCard}>
          <View style={styles.sourceHeader}>
            <View style={styles.sourceIconBox}>
              <Ionicons name="water-outline" size={24} color="#3D6E68" />
            </View>
            <View style={styles.sourceInfo}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceName}>Manual Entry</Text>
                <View style={styles.connectedBadge}>
                  <View style={styles.connectedDot} />
                  <Text style={styles.connectedText}>Active</Text>
                </View>
              </View>
              <Text style={styles.sourceDesc}>Symptoms, medications, custom notes</Text>
              <Text style={styles.sourceSync}>Track anything not captured automatically</Text>
            </View>
          </View>
        </View>

        {/* Add new */}
        <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Additional data sources will be added in a future update.')} style={styles.addCard} activeOpacity={0.8}>
          <Text style={styles.addTitle}>+ Add new source</Text>
          <Text style={styles.addSubtitle}>Connect more data sources to improve insights</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 16 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 13, color: '#7A7570' },
  eyebrow: { fontSize: 10, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: '#9A9088' },
  title: { fontSize: 26, fontWeight: '400', color: '#1A1816' },
  subtitle: { fontSize: 13, color: '#7E7670', marginBottom: 8 },
  sourceCard: { backgroundColor: '#FDFAF5', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', padding: 20 },
  sourceHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 16 },
  sourceIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#DFE9E6', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sourceInfo: { flex: 1 },
  sourceTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sourceName: { fontSize: 17, fontWeight: '600', color: '#1A1816' },
  connectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  connectedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6A9E96' },
  connectedText: { fontSize: 11, fontWeight: '600', color: '#6A9E96' },
  sourceDesc: { fontSize: 13, color: '#7E7670', marginBottom: 4 },
  sourceSync: { fontSize: 11, color: '#B8B0A6' },
  sourceActions: { flexDirection: 'row', gap: 8 },
  actionButtonPrimary: { flex: 1, height: 44, borderRadius: 12, backgroundColor: 'rgba(237,232,223,0.6)', alignItems: 'center', justifyContent: 'center' },
  actionButtonPrimaryText: { fontSize: 14, fontWeight: '600', color: '#2E7D7D' },
  actionButtonDestructive: { paddingHorizontal: 16, height: 44, borderRadius: 12, backgroundColor: 'rgba(237,232,223,0.6)', alignItems: 'center', justifyContent: 'center' },
  actionButtonDestructiveText: { fontSize: 14, fontWeight: '600', color: '#C4857A' },
  addCard: { backgroundColor: '#FDFAF5', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', padding: 20, alignItems: 'center' },
  addTitle: { fontSize: 15, fontWeight: '600', color: '#2E7D7D', marginBottom: 4 },
  addSubtitle: { fontSize: 12, color: '#7E7670' },
});
