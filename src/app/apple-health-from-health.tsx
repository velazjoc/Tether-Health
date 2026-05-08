import { View, Text, StyleSheet } from 'react-native';

export default function AppleHealthFromHealth() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Apple Health Detail (from My Health) — placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F0E8' },
  label: { fontSize: 16, color: '#7A7570' },
});
