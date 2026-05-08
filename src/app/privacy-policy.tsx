import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const sections = [
  { title: '1. Information We Collect', body: 'We collect health data you choose to share, including lab results, cycle tracking, activity, sleep, hydration, symptoms, and data from connected sources (Apple Health, lab portals).' },
  { title: '2. How We Use Your Information', body: "We use your health data solely to provide personalized insights, identify patterns, and help you understand your health better. We analyze trends, correlations, and timing patterns to surface what matters most for you." },
  { title: '3. Data Security', body: 'All health data is encrypted in transit and at rest using industry-standard encryption. We employ multiple layers of security to protect your information from unauthorized access, disclosure, or destruction.' },
  { title: '4. Data Sharing', body: 'We do not sell your personal health information to third parties. You may choose to share specific health summaries with your healthcare providers. If you opt into anonymous health research, only de-identified data is shared with approved research institutions.' },
  { title: '5. Your Control and Consent', body: "Nothing is shared without your explicit consent. Ever. You decide what Tether can see, and you can change that any time in Settings. Your data stays yours—Tether works with what you give it." },
  { title: '6. Contact Us', body: 'If you have questions about our privacy practices, please contact us at privacy@tether.health' },
];

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3F0" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={16} color="#7A7570" />
          <Text style={styles.backText}>Back to Profile</Text>
        </TouchableOpacity>
        <Text style={styles.eyebrow}>LEGAL</Text>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>Last updated: March 2026</Text>

        {/* Promise card */}
        <View style={styles.promiseCard}>
          <View style={styles.promiseIconBox}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.promiseTitle}>Your health data is yours</Text>
            <Text style={styles.promiseBody}>We never sell your personal health information. You control what you share and with whom.</Text>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.card}>
          {sections.map((s, i) => (
            <View key={i} style={[styles.sectionBlock, i < sections.length - 1 && styles.sectionBorder]}>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionBody}>{s.body}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/terms' as any)} activeOpacity={0.7} style={styles.link}>
          <Text style={styles.linkText}>View Terms of Service →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 13, color: '#7A7570' },
  eyebrow: { fontSize: 10, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: '#9A9088', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '400', color: '#1A1816', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#7E7670', marginBottom: 24 },
  promiseCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#FDFAF5', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)' },
  promiseIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#2E7D7D', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  promiseTitle: { fontSize: 16, fontWeight: '600', color: '#1A1816', marginBottom: 4 },
  promiseBody: { fontSize: 13, lineHeight: 21, color: '#7E7670' },
  card: { backgroundColor: '#FDFAF5', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', overflow: 'hidden', marginBottom: 8 },
  sectionBlock: { padding: 20 },
  sectionBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(200,190,175,0.4)' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1816', marginBottom: 8 },
  sectionBody: { fontSize: 14, lineHeight: 22, color: '#7E7670' },
  link: { alignItems: 'center', paddingVertical: 16 },
  linkText: { fontSize: 14, fontWeight: '600', color: '#2E7D7D' },
});
