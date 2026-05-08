import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const SESSION_KEY = 'tether_session_id';

export async function getOrCreateSession(): Promise<string> {
  const existing = await AsyncStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = uuidv4();

  await supabase.from('demo_sessions').insert({ session_id: sessionId });
  await AsyncStorage.setItem(SESSION_KEY, sessionId);

  return sessionId;
}
