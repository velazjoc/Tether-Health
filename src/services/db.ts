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

export async function getProfile(sessionId: string) {
  const { data, error } = await supabase
    .from('demo_profiles')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  if (error) throw error;
  return data;
}

export async function saveAppointmentPrep(sessionId: string, topics: object[]) {
  const { data, error } = await supabase
    .from('demo_appointment_prep')
    .upsert({ session_id: sessionId, topics }, { onConflict: 'session_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAppointmentPrep(sessionId: string) {
  const { data, error } = await supabase
    .from('demo_appointment_prep')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  if (error) throw error;
  return data;
}

export async function saveMessage(sessionId: string, role: string, content: string) {
  const { data, error } = await supabase
    .from('demo_messages')
    .insert({ session_id: sessionId, role, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('demo_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function saveInsight(sessionId: string, insight: object) {
  const { data, error } = await supabase
    .from('demo_insights')
    .insert({ session_id: sessionId, ...insight })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getInsightById(sessionId: string, id: string) {
  const { data, error } = await supabase
    .from('demo_insights')
    .select('*')
    .eq('session_id', sessionId)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getDocumentById(sessionId: string, id: string) {
  const { data, error } = await supabase
    .from('demo_documents')
    .select('*')
    .eq('session_id', sessionId)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getHealthLogsByMetric(sessionId: string, metricType: string) {
  const { data, error } = await supabase
    .from('demo_health_logs')
    .select('*')
    .eq('session_id', sessionId)
    .eq('metric_type', metricType)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
