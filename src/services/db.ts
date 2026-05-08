import { supabase } from './supabase';

export async function getInsights(sessionId: string) {
  const { data, error } = await supabase
    .from('demo_insights')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getHealthLogs(sessionId: string) {
  const { data, error } = await supabase
    .from('demo_health_logs')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getDocuments(sessionId: string) {
  const { data, error } = await supabase
    .from('demo_documents')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveHealthLog(sessionId: string, log: object) {
  const { data, error } = await supabase
    .from('demo_health_logs')
    .insert({ session_id: sessionId, ...log })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveProfile(sessionId: string, profile: object) {
  const { data, error } = await supabase
    .from('demo_profiles')
    .upsert({ session_id: sessionId, ...profile }, { onConflict: 'session_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveConditions(sessionId: string, conditions: string[]) {
  const { data, error } = await supabase
    .from('demo_conditions')
    .upsert({ session_id: sessionId, conditions }, { onConflict: 'session_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveTrackingPreferences(sessionId: string, prefs: string[]) {
  const { data, error } = await supabase
    .from('demo_tracking_preferences')
    .upsert({ session_id: sessionId, preferences: prefs }, { onConflict: 'session_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
