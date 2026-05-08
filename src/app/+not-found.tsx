import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NotFound() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.inner}>
        <View style={styles.iconBox}>
          <Ionicons name="home-outline" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.body}>
          We couldn't find the page you're looking for. Let's get you back on track.
        </Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)' as any)} style={styles.button} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#6A9E96', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '400', color: '#1A1816', textAlign: 'center', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 26, color: '#45403C', textAlign: 'center', marginBottom: 32 },
  button: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 100, backgroundColor: '#6A9E96' },
  buttonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});
