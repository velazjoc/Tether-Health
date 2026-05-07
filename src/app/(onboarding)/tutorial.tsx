import { router, useLocalSearchParams } from 'expo-router';
import StandaloneTutorial from '@/components/StandaloneTutorial';

export default function Tutorial() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const isFromHome = from === 'home';

  const handleComplete = () => router.replace('/(tabs)' as any);
  const handleSkip = () => router.replace('/(tabs)' as any);

  return (
    <StandaloneTutorial
      onComplete={handleComplete}
      onSkip={handleSkip}
      isFromHome={isFromHome}
    />
  );
}
