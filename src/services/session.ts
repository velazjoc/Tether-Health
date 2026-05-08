import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const SESSION_KEY = 'tether_session_id';

export async function getOrCreateSession(): Promise<string> {
  // TEMP: hardcode for demo testing, remove before handoff
  const SESSION_ID = '00000000-0000-0000-0000-000000000001';
  await AsyncStorage.setItem('tether_session_id', SESSION_ID);
  return SESSION_ID;
}