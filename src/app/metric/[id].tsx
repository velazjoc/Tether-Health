import { View, Text, StyleSheet } from 'react-native';

export default function MetricDetail() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Metric Detail — placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F0E8' },
  label: { fontSize: 16, color: '#7A7570' },
});
