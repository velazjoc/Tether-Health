import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'your_supabase_url',
  'your_service_role_key' // use service role for seeding
);

const SESSION_ID = 'demo-session-fixed-id'; // fixed so demo is consistent

async function seed() {

  // Create fixed demo session
  await supabase.from('demo_sessions').upsert({ id: SESSION_ID });

  // Profile
  await supabase.from('demo_profile').upsert({
    session_id: SESSION_ID,
    first_name: 'Sarah',
    pronouns: 'She/Her',
    dob: '1996-03-14',
    biological_sex: 'Female'
  });

  // Conditions
  await supabase.from('demo_conditions').insert([
    { session_id: SESSION_ID, condition_name: 'PCOS' },
    { session_id: SESSION_ID, condition_name: 'Iron Deficiency' },
  ]);

  // Health logs — 30 days of realistic data
  const logs = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    logs.push(
      { session_id: SESSION_ID, metric_type: 'sleep_hours', value: +(5 + Math.random() * 3).toFixed(1), unit: 'hours', logged_at: date },
      { session_id: SESSION_ID, metric_type: 'hydration_l', value: +(1 + Math.random() * 1.5).toFixed(1), unit: 'liters', logged_at: date },
      { session_id: SESSION_ID, metric_type: 'mood_score', value: Math.floor(4 + Math.random() * 6), unit: 'score', logged_at: date },
      { session_id: SESSION_ID, metric_type: 'steps', value: Math.floor(3000 + Math.random() * 7000), unit: 'steps', logged_at: date },
    );
  }
  await supabase.from('demo_health_logs').insert(logs);

  // Pre-generated insights (so dashboard works before AI is hooked up)
  await supabase.from('demo_insights').insert([
    {
      session_id: SESSION_ID,
      title: 'Your Vitamin D has been low for 3 months in a row',
      summary: 'This pattern is common in your region during winter and may explain the fatigue you have been logging.',
      severity: 'needs_attention',
      category: 'vitamin_d',
      what_this_means: 'Vitamin D plays a key role in energy, mood, and immune function. Levels below 30 ng/mL are considered insufficient. Yours have averaged 24 ng/mL over the past 3 months.',
      doctor_questions: ['Should I start taking Vitamin D3? What dosage?', 'Could low Vitamin D be contributing to my fatigue?'],
      follow_up_questions: ['What foods are high in Vitamin D?', 'How long does it take to raise Vitamin D levels?'],
      breakdown: [{ label: 'Jan', value: 22 }, { label: 'Feb', value: 24 }, { label: 'Mar', value: 26 }],
    },
    {
      session_id: SESSION_ID,
      title: 'Your deep sleep has been dropping for two weeks',
      summary: 'You are averaging 3.8 hours of deep sleep, down from 5 hours two weeks ago.',
      severity: 'needs_attention',
      category: 'sleep',
      what_this_means: 'Deep sleep is when your body does most of its repair work. A consistent drop often correlates with stress, hydration, or cycle changes.',
      doctor_questions: ['Could my PCOS be affecting my sleep quality?', 'Should I consider a sleep study?'],
      follow_up_questions: ['What lifestyle changes can improve deep sleep?', 'How does sleep affect my other conditions?'],
      breakdown: [{ label: 'Deep', value: 38, pct: 38 }, { label: 'REM', value: 22, pct: 22 }, { label: 'Light', value: 40, pct: 40 }],
    },
    {
      session_id: SESSION_ID,
      title: 'Hydration is on track this week',
      summary: 'You have averaged 1.8L daily this week, up from 1.2L last week.',
      severity: 'on_track',
      category: 'hydration',
      what_this_means: 'Staying consistently hydrated supports energy, focus, and kidney function. Keep it up.',
      doctor_questions: [],
      follow_up_questions: ['How does hydration affect PCOS symptoms?'],
      breakdown: [],
    }
  ]);

  // Pre-seeded document (lab result)
  await supabase.from('demo_documents').insert({
    session_id: SESSION_ID,
    type: 'lab_result',
    title: 'Lab Results — Vitamin D Panel',
    plain_text: 'Vitamin D (25-OH): 29 ng/mL. Calcium: 9.2 mg/dL.',
    ai_summary: 'Your Vitamin D level is below the optimal range of 30-50 ng/mL.',
    extracted_values: [
      { name: 'Vitamin D (25-OH)', value: 29, unit: 'ng/mL', status: 'needs_attention' },
      { name: 'Calcium', value: 9.2, unit: 'mg/dL', status: 'on_track' }
    ]
  });

  console.log('Seeded successfully');
}

seed();