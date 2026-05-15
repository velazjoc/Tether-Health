import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getOrCreateSession } from '@/services/session';
import { getProfile, saveProfile } from '@/services/db';

const pronounOptions = ['She/Her', 'He/Him', 'They/Them'];

export default function EditProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [age, setAge] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sessionId = await getOrCreateSession();
        const data = await getProfile(sessionId);
        if (data) {
          setFirstName(data.first_name ?? '');
          setLastName(data.last_name ?? '');
          setPronouns(data.pronouns ?? '');
          setAge(data.age != null ? String(data.age) : '');
        }
      } catch (_) {
        // leave defaults on error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const sessionId = await getOrCreateSession();
      await saveProfile(sessionId, {
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        pronouns: pronouns || null,
        age: age.trim() ? Number(age.trim()) : null,
      });
    } catch (_) {
      // non-blocking — navigate back regardless
    } finally {
      setSaving(false);
    }
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor="#FDFCFB" />
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#7A7570" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2E7D7D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FDFCFB" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={18} color="#7A7570" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase() || '?'}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* First Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>FIRST NAME</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFocused('firstName')}
            onBlur={() => setFocused(null)}
            style={[styles.input, focused === 'firstName' && styles.inputFocused]}
            placeholderTextColor="#B0A898"
          />
        </View>

        {/* Last Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>LAST NAME</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setFocused('lastName')}
            onBlur={() => setFocused(null)}
            style={[styles.input, focused === 'lastName' && styles.inputFocused]}
            placeholderTextColor="#B0A898"
          />
        </View>

        {/* Pronouns */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PRONOUNS</Text>
          <View style={styles.pillRow}>
            {pronounOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setPronouns(opt)}
                style={[styles.pill, pronouns === opt && styles.pillSelected]}
                activeOpacity={0.75}
              >
                {pronouns === opt && <Ionicons name="checkmark" size={10} color="#1E5C5C" style={{ marginRight: 4 }} />}
                <Text style={[styles.pillText, pronouns === opt && styles.pillTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Age */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>AGE</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            onFocus={() => setFocused('age')}
            onBlur={() => setFocused(null)}
            keyboardType="numeric"
            style={[styles.input, focused === 'age' && styles.inputFocused]}
            placeholderTextColor="#B0A898"
          />
        </View>

        {/* Save */}
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveButton} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: '#FDFCFB', borderBottomWidth: 1, borderBottomColor: '#EAE6E0' },
  headerRow: { marginBottom: 16 },
  backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(253,250,245,0.75)', borderWidth: 1, borderColor: 'rgba(200,190,175,0.5)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '400', color: '#1C1A17' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6A9E96', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 28, fontWeight: '400', color: '#FFFFFF' },
  changePhotoText: { fontSize: 13, fontWeight: '500', color: '#2E7D7D' },
  fieldGroup: { marginBottom: 24 },
  label: { fontSize: 11, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase', color: '#7A7570', marginBottom: 8 },
  input: { height: 48, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: '#D4CEC6', backgroundColor: '#FDFCFB', fontSize: 15, color: '#1A1816' },
  inputFocused: { borderColor: '#2E7D7D', borderWidth: 2 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 100, backgroundColor: '#EDE8DF' },
  pillSelected: { backgroundColor: '#E6F4F4', borderWidth: 1.5, borderColor: '#2E7D7D' },
  pillText: { fontSize: 13, fontWeight: '500', color: '#2A2520' },
  pillTextSelected: { color: '#1E5C5C' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 14, backgroundColor: '#2E7D7D', marginBottom: 12, shadowColor: '#2E7D7D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  saveButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  cancelButton: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontSize: 14, fontWeight: '500', color: '#7A7570' },
});
