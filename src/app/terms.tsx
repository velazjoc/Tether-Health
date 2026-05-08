import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing and using Tether, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.' },
  { title: '2. Medical Disclaimer', body: 'Tether provides health insights and pattern recognition but is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.' },
  { title: '3. Data Privacy', body: 'Your health data is encrypted and stored securely. We do not sell your personal health information to third parties. You maintain full control over what data you share and with whom.' },
  { title: '4. User Responsibilities', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.' },
  { title: '5. Accuracy of Information', body: "While we strive to provide accurate health insights, Tether's pattern recognition is based on the data you provide. We cannot guarantee the accuracy, completeness, or usefulness of any information displayed." },
  { title: '6. Changes to Terms', body: 'We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page and updating the "Last updated" date.' },
];

export default function Terms() {
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
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subtitle}>Last updated: March 2026</Text>

        <View style={styles.card}>
          {sections.map((s, i) => (
            <View key={i} style={[styles.sectionBlock, i < sections.length - 1 && styles.sectionBorder]}>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionBody}>{s.body}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/privacy-policy' as any)} activeOpacity={0.7} style={styles.link}>
          <Text style={styles.linkText}>View Privacy Policy →</Text>
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
  card: { backgroundColor: '#FDFAF5', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', overflow: 'hidden', marginBottom: 8 },
  sectionBlock: { padding: 20 },
  sectionBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(200,190,175,0.4)' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1816', marginBottom: 8 },
  sectionBody: { fontSize: 14, lineHeight: 22, color: '#7E7670' },
  link: { alignItems: 'center', paddingVertical: 16 },
  linkText: { fontSize: 14, fontWeight: '600', color: '#2E7D7D' },
});
