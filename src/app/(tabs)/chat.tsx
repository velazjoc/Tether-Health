import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.8;

// ─── TetherLogo ───────────────────────────────────────────────────────────────
function TetherLogo({ size = 40 }: { size?: number }) {
  const s = size / 32;
  const color = '#2E7D7D';
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', left: 13 * s, top: 13 * s, width: 6 * s, height: 6 * s, borderRadius: 3 * s, backgroundColor: color }} />
      <View style={{ position: 'absolute', left: 4.5 * s, top: 9.5 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: color }} />
      <View style={{ position: 'absolute', right: 4.5 * s, top: 9.5 * s, width: 5 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: color }} />
    </View>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  sender: 'user' | 'tether';
  text: string | React.ReactNode;
  timestamp: string;
  date: string;
  hasQuickReplies?: boolean;
  appointmentAdded?: boolean;
};

type ConversationThread = {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
};

// ─── Inline bold style ────────────────────────────────────────────────────────
const b = { fontWeight: '600' as const };

// ─── Sample threads (messages use RN Text instead of HTML spans) ──────────────
const sampleThreads: ConversationThread[] = [
  {
    id: 'thread-1',
    title: 'Vitamin D levels and sleep patterns',
    preview: 'Your deep sleep dropped again last night...',
    date: 'Today',
    messages: [
      { id: 'msg-1', sender: 'user',   text: 'Should I be worried about my Vitamin D levels?', timestamp: '8:02 AM', date: 'Yesterday' },
      { id: 'msg-2', sender: 'tether', timestamp: '8:02 AM', date: 'Yesterday',
        text: <Text><Text style={b}>Right now ·</Text>{' '}Your level is 29 ng/mL — below the optimal range of 40–60 ng/mL.{'\n\n'}Dr. Kim flagged this in October and recommended supplementation. It's worth mentioning at your next visit.</Text> },
      { id: 'msg-3', sender: 'user',   text: 'When is my next appointment?', timestamp: '8:03 AM', date: 'Today' },
      { id: 'msg-4', sender: 'tether', timestamp: '8:03 AM', date: 'Today', hasQuickReplies: true,
        text: <Text><Text style={b}>Next up ·</Text>{' '}Dr. Patel on Tuesday March 3.{'\n\n'}I've already prepared a summary — want me to pull it up?</Text> },
      { id: 'msg-5', sender: 'user',   text: 'What do you think is causing my sleep issues?', timestamp: '9:14 AM', date: 'Today' },
      { id: 'msg-6', sender: 'tether', timestamp: '9:15 AM', date: 'Today',
        text: <Text><Text style={b}>Last night ·</Text>{' '}Your deep sleep dropped to 48 minutes — below your 1hr average. This is the 5th night in a row.{'\n\n'}<Text style={b}>Most likely cause ·</Text>{' '}Late screen time. Your wind-down routine has slipped the past two weeks.{'\n\n'}Your sleep score improves by about 18% on nights you follow it.</Text> },
    ],
  },
  {
    id: 'thread-2', title: 'Exercise routine and PCOS symptoms',
    preview: 'Based on your recent workouts...', date: 'Yesterday',
    messages: [
      { id: 'msg-7', sender: 'user',   text: 'How is my exercise routine affecting my PCOS symptoms?', timestamp: '2:15 PM', date: 'Yesterday' },
      { id: 'msg-8', sender: 'tether', timestamp: '2:16 PM', date: 'Yesterday',
        text: <Text><Text style={b}>Good news ·</Text>{' '}Your consistent strength training 3x per week is positively impacting your insulin sensitivity.{'\n\n'}Your fasting glucose has improved by 8% over the past month.</Text> },
    ],
  },
  {
    id: 'thread-3', title: 'Medication timing questions',
    preview: 'Your metformin schedule...', date: 'Mar 2',
    messages: [
      { id: 'msg-9',  sender: 'user',   text: 'Should I adjust my metformin timing?', timestamp: '10:30 AM', date: 'Mar 2' },
      { id: 'msg-10', sender: 'tether', timestamp: '10:31 AM', date: 'Mar 2',
        text: <Text><Text style={b}>Current schedule ·</Text>{' '}500mg twice daily with meals looks optimal.{'\n\n'}Dr. Patel adjusted this last month, and your tolerance has been excellent. I'd recommend keeping this schedule unless you experience any changes.</Text> },
    ],
  },
  {
    id: 'thread-4', title: 'Lab results interpretation',
    preview: 'Your recent thyroid panel...', date: 'Feb 28',
    messages: [
      { id: 'msg-11', sender: 'user',   text: 'Can you explain my latest lab results?', timestamp: '3:45 PM', date: 'Feb 28' },
      { id: 'msg-12', sender: 'tether', timestamp: '3:46 PM', date: 'Feb 28',
        text: <Text><Text style={b}>Thyroid ·</Text>{' '}TSH at 2.1 mIU/L — normal range.{'\n\n'}<Text style={b}>Blood sugar ·</Text>{' '}A1C is 5.4% — excellent control.{'\n\n'}<Text style={b}>Needs attention ·</Text>{' '}Vitamin D at 29 ng/mL, which we discussed earlier.</Text> },
    ],
  },
  {
    id: 'thread-5', title: 'Fertility preparation discussion',
    preview: 'Given your preconception goals...', date: 'Feb 25',
    messages: [
      { id: 'msg-13', sender: 'user',   text: 'What should I focus on for pregnancy preparation?', timestamp: '9:00 AM', date: 'Feb 25' },
      { id: 'msg-14', sender: 'tether', timestamp: '9:01 AM', date: 'Feb 25',
        text: 'Given your preconception goals, the priority areas are: 1) Optimize your cycle regularity (currently 32-day average), 2) Continue metformin as prescribed, 3) Increase Vitamin D supplementation to 2000 IU daily, 4) Maintain current exercise routine. Dr. Patel can discuss ovulation tracking at your next visit.' },
    ],
  },
];

// ─── Response generator (returns RN-compatible ReactNode) ────────────────────
const generateTetherResponse = (question: string): (string | React.ReactElement)[] => {
  const q = question.toLowerCase();

  if (q.includes('deep sleep') && q.includes('why') && q.includes('matter')) {
    return [
      'Deep sleep is when your body does its most important repair work — healing tissue, balancing hormones, and strengthening your immune system.',
      <Text key="1"><Text style={b}>For you specifically ·</Text>{' '}It directly affects insulin sensitivity and hormone balance, both key for managing PCOS and preparing for pregnancy.</Text>,
      <Text key="2"><Text style={b}>Right now ·</Text>{' '}Your deep sleep has dropped from 68 minutes to about 52 minutes over the past two weeks.{'\n\n'}This likely started after your UTI in mid-February — your body is still recovering.</Text>,
      'Want me to add this to your Dr. Patel prep? Your appointment is March 3.',
    ];
  }
  if (q.includes('lifestyle') && q.includes('sleep')) {
    return [
      <Text key="0"><Text style={b}>Wind-down timing ·</Text>{' '}Your sleep is noticeably better on nights you start winding down by 10pm, and lately you've been starting closer to 11.</Text>,
      <Text key="1"><Text style={b}>Late screens ·</Text>{' '}You lose about 12 minutes of deep sleep on nights you're on your phone after 10:30.</Text>,
      'Would you like me to suggest a couple of simple adjustments that might help?',
    ];
  }
  if (q.includes('sleep') && (q.includes('health') || q.includes('condition'))) {
    return [
      'Your sleep has a pretty direct connection to your PCOS symptoms.',
      <Text key="1">On weeks when you're sleeping well, your blood sugar levels are noticeably more stable, and your body's inflammation levels drop.{'\n\n'}Both of these help with cycle regularity and your fertility goals.</Text>,
      <Text key="2"><Text style={b}>Good news ·</Text>{' '}Your body responds really well when your sleep improves.</Text>,
      'Want me to add this to your Dr. Patel prep? Your appointment is March 3.',
    ];
  }
  if (q.includes('sleep') && q.includes('been')) {
    return [
      <Text key="0">Your sleep has been lighter than usual the past two weeks.{'\n\n'}<Text style={b}>What's changed ·</Text>{' '}You're getting less deep sleep and waking up more during the night.</Text>,
      <Text key="1"><Text style={b}>Why this happened ·</Text>{' '}It started right after your UTI in mid-February, which makes sense since your body uses sleep to recover from illness.</Text>,
      'Your antibiotics finished a few days ago, so you should start feeling improvements soon.',
      'Want me to add this to your Dr. Patel prep? Your appointment is March 3.',
    ];
  }
  if (q.includes('doctor') || q.includes('appointment')) {
    return [
      'Based on what\'s been going on lately, I\'d focus on three things:',
      <Text key="1"><Text style={b}>Vitamin D ·</Text>{' '}Still at 29 ng/mL despite supplementation.{'\n\n'}<Text style={b}>Sleep recovery ·</Text>{' '}Hasn't fully bounced back since that UTI.{'\n\n'}<Text style={b}>Cycle regularity ·</Text>{' '}Getting better but still some variability.</Text>,
      'I\'ve already drafted a summary for Dr. Patel on Tuesday — want me to pull it up?',
    ];
  }
  if (q.includes('health') && q.includes('trend')) {
    return [
      <Text key="0"><Text style={b}>Overall ·</Text>{' '}You're doing really well this month.{'\n\n'}Your exercise consistency is strong, blood sugar is trending down, and you're staying on top of your medications.</Text>,
      <Text key="1"><Text style={b}>Needs attention ·</Text>{' '}Your sleep has dipped over the past two weeks.</Text>,
      'Everything else is tracking nicely toward your goals.',
      'Want me to break down any of these areas in more detail?',
    ];
  }
  return [
    <Text key="0"><Text style={b}>This is a demo ·</Text>{' '}I can't respond to custom questions yet in this prototype.</Text>,
    'Try tapping one of the suggested questions above to see how Tether would respond to your actual health data.',
  ];
};

const suggestions = ["How's my sleep been?", 'What should I ask my doctor?', 'Show my health trends'];
const ts = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function Chat() {
  const { initialQuestion } = useLocalSearchParams<{ initialQuestion?: string }>();
  const initialThreadIdRef = useRef<string | null>(initialQuestion ? `thread-${Date.now()}` : null);

  const [conversations, setConversations] = useState<ConversationThread[]>(() => {
    if (initialQuestion && initialThreadIdRef.current) {
      const newThread: ConversationThread = {
        id: initialThreadIdRef.current,
        title: initialQuestion.length > 50 ? initialQuestion.slice(0, 50) + '...' : initialQuestion,
        preview: initialQuestion,
        date: 'Today',
        messages: [{ id: `user-${Date.now()}`, sender: 'user', text: initialQuestion, timestamp: ts(), date: 'Today' }],
      };
      return [newThread, ...sampleThreads];
    }
    return sampleThreads;
  });

  const [currentThreadId, setCurrentThreadId] = useState<string | null>(initialThreadIdRef.current);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(!!initialQuestion);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [appointmentCardMessageId, setAppointmentCardMessageId] = useState<string | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(!!initialQuestion);
  const [typingDot, setTypingDot] = useState(0);
  const hasHandledInitialQuestion = useRef(false);

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const currentThread = currentThreadId ? conversations.find((t) => t.id === currentThreadId) : null;
  const messages = currentThread?.messages ?? [];

  // Typing dot cycle
  useEffect(() => {
    if (!isTyping) return;
    const id = setInterval(() => setTypingDot((d) => (d + 1) % 3), 300);
    return () => clearInterval(id);
  }, [isTyping]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0 && hasScrolledToBottom) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, hasScrolledToBottom]);

  // Handle initial question response
  useEffect(() => {
    if (initialQuestion && !hasHandledInitialQuestion.current && currentThreadId) {
      hasHandledInitialQuestion.current = true;
      sendTetherBubbles(generateTetherResponse(initialQuestion), currentThreadId);
    }
  }, [initialQuestion, currentThreadId]);

  const sendTetherBubbles = (bubbles: (string | React.ReactElement)[], threadId: string) => {
    let delay = 1500;
    bubbles.forEach((text, i) => {
      if (i > 0) { setTimeout(() => setIsTyping(true), delay); delay += 800; }
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, { id: `tether-${Date.now()}-${i}`, sender: 'tether', text, timestamp: ts(), date: 'Today' }] }
              : t
          )
        );
        setIsTyping(false);
      }, delay);
      delay += 400;
    });
  };

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 280, useNativeDriver: true }).start(() =>
      setSidebarVisible(false)
    );
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setHasScrolledToBottom(true);
    const text = inputValue;
    setInputValue('');

    if (!currentThreadId) {
      const id = `thread-${Date.now()}`;
      const newThread: ConversationThread = {
        id, date: 'Today', preview: text,
        title: text.length > 50 ? text.slice(0, 50) + '...' : text,
        messages: [{ id: `user-${Date.now()}`, sender: 'user', text, timestamp: ts(), date: 'Today' }],
      };
      setConversations((prev) => [newThread, ...prev]);
      setCurrentThreadId(id);
      setIsTyping(true);
      sendTetherBubbles(generateTetherResponse(text), id);
    } else {
      setConversations((prev) =>
        prev.map((t) =>
          t.id === currentThreadId
            ? { ...t, messages: [...t.messages, { id: `user-${Date.now()}`, sender: 'user', text, timestamp: ts(), date: 'Today' }], preview: text.slice(0, 50) + '...', date: 'Today' }
            : t
        )
      );
      setIsTyping(true);
      sendTetherBubbles(generateTetherResponse(text), currentThreadId);
    }
  };

  const handleSuggestionTap = (suggestion: string) => {
    setHasScrolledToBottom(true);
    const id = `thread-${Date.now()}`;
    const newThread: ConversationThread = {
      id, date: 'Today', preview: suggestion,
      title: suggestion.length > 50 ? suggestion.slice(0, 50) + '...' : suggestion,
      messages: [{ id: `user-${Date.now()}`, sender: 'user', text: suggestion, timestamp: ts(), date: 'Today' }],
    };
    setConversations((prev) => [newThread, ...prev]);
    setCurrentThreadId(id);
    setIsTyping(true);
    sendTetherBubbles(generateTetherResponse(suggestion), id);
  };

  const handleQuickReply = (reply: string) => {
    if (!currentThreadId) return;
    setHasScrolledToBottom(true);
    setConversations((prev) =>
      prev.map((t) =>
        t.id === currentThreadId
          ? { ...t, messages: [...t.messages, { id: `user-${Date.now()}`, sender: 'user', text: reply, timestamp: ts(), date: 'Today' }] }
          : t
      )
    );
    if (reply === 'Yes, show me') {
      setTimeout(() => router.push('/appointment-prep' as any), 500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((t) =>
            t.id === currentThreadId
              ? { ...t, messages: [...t.messages, { id: `tether-${Date.now()}`, sender: 'tether', text: "No problem! Let me know if you need anything else.", timestamp: ts(), date: 'Today' }] }
              : t
          )
        );
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleAppointmentReply = (reply: 'yes' | 'no') => {
    if (!currentThreadId) return;
    setHasScrolledToBottom(true);
    const replyText = reply === 'yes' ? 'Yes, add it' : 'Not right now';
    setConversations((prev) =>
      prev.map((t) =>
        t.id === currentThreadId
          ? { ...t, messages: [...t.messages, { id: `user-${Date.now()}`, sender: 'user', text: replyText, timestamp: ts(), date: 'Today' }] }
          : t
      )
    );
    setIsTyping(true);
    setTimeout(() => {
      if (reply === 'yes') {
        const confirmId = `tether-${Date.now()}`;
        setConversations((prev) =>
          prev.map((t) =>
            t.id === currentThreadId
              ? { ...t, messages: [...t.messages, { id: confirmId, sender: 'tether', text: 'Added to your Dr. Patel prep ✓', timestamp: ts(), date: 'Today', appointmentAdded: true }] }
              : t
          )
        );
        setIsTyping(false);
        setAppointmentCardMessageId(confirmId);
        setTimeout(() => setAppointmentCardMessageId(null), 10000);
      } else {
        setConversations((prev) =>
          prev.map((t) =>
            t.id === currentThreadId
              ? { ...t, messages: [...t.messages, { id: `tether-${Date.now()}`, sender: 'tether', text: "No problem! Let me know if you need anything else.", timestamp: ts(), date: 'Today' }] }
              : t
          )
        );
        setIsTyping(false);
      }
    }, 1000);
  };

  const renderMessages = () => {
    const rendered: React.ReactElement[] = [];
    let lastDate = '';

    messages.forEach((message, index) => {
      if (message.date !== lastDate) {
        rendered.push(
          <View key={`date-${index}`} style={styles.dateSep}>
            <Text style={styles.dateSepText}>{message.date}</Text>
          </View>
        );
        lastDate = message.date;
      }

      if (message.sender === 'tether') {
        const prev = messages[index - 1];
        const next = messages[index + 1];
        const isPrevTether = prev?.sender === 'tether';
        const isNextTether = next?.sender === 'tether';
        const showLogo = !isPrevTether;
        const showTimestamp = !isNextTether;

        rendered.push(
          <View key={message.id} style={[styles.tetherRow, { marginBottom: isPrevTether ? 8 : 24 }]}>
            <View style={[styles.tetherLogoSlot, { opacity: showLogo ? 1 : 0 }]}>
              {showLogo && <TetherLogo size={20} />}
            </View>
            <View style={styles.tetherBubbleWrap}>
              <Text style={styles.tetherText}>{message.text}</Text>
              {showTimestamp && <Text style={styles.timestampText}>{message.timestamp}</Text>}

              {/* Appointment prep quick-action */}
              {typeof message.text === 'string' && message.text.includes('Want me to add this to your Dr. Patel prep') && (
                <View style={styles.quickReplies}>
                  <TouchableOpacity onPress={() => handleAppointmentReply('yes')} style={styles.qrPrimary} activeOpacity={0.8}>
                    <Text style={styles.qrPrimaryText}>Yes, add it</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAppointmentReply('no')} style={styles.qrSecondary} activeOpacity={0.8}>
                    <Text style={styles.qrSecondaryText}>Not right now</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Appointment added card */}
              {message.appointmentAdded && appointmentCardMessageId === message.id && (
                <View style={{ marginTop: 12, gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => { router.push('/appointment-prep' as any); setAppointmentCardMessageId(null); }}
                    style={styles.apptCard}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="sparkles" size={16} color="#2E7D7D" />
                    <Text style={styles.apptCardLabel}>Dr. Patel prep · March 3</Text>
                    <Ionicons name="chevron-forward" size={16} color="#7A7570" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAppointmentCardMessageId(null)} activeOpacity={0.6}>
                    <Text style={styles.keepChattingText}>Keep chatting</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Quick replies (hasQuickReplies flag on sample message) */}
              {message.hasQuickReplies && (
                <View style={styles.quickReplies}>
                  <TouchableOpacity onPress={() => handleQuickReply('Yes, show me')} style={styles.qrPrimary} activeOpacity={0.8}>
                    <Text style={styles.qrPrimaryText}>Yes, show me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleQuickReply('Not now')} style={styles.qrSecondary} activeOpacity={0.8}>
                    <Text style={styles.qrSecondaryText}>Not now</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
      } else {
        rendered.push(
          <View key={message.id} style={styles.userRow}>
            <View style={styles.userBubbleWrap}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{message.text as string}</Text>
              </View>
              <Text style={styles.userTimestamp}>{message.timestamp}</Text>
            </View>
          </View>
        );
      }
    });

    return rendered;
  };

  const canSend = inputValue.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={openSidebar} style={styles.menuButton} activeOpacity={0.7}>
                <Ionicons name="menu-outline" size={20} color="#7A7570" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerCenter}>
              <TetherLogo size={40} />
              <Text style={styles.greeting}>Hey Sarah,</Text>
              <Text style={styles.subGreeting}>What can I help you with today?</Text>
            </View>
          </View>

          {/* ── Messages or suggestions ── */}
          <View style={styles.messagesArea}>
            {messages.length === 0 ? (
              <View style={styles.suggestionsWrap}>
                {suggestions.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleSuggestionTap(s)}
                    style={styles.suggestionChip}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <>
                {renderMessages()}
                {isTyping && (
                  <View style={[styles.tetherRow, { marginBottom: 24 }]}>
                    <View style={styles.tetherLogoSlot}>
                      <TetherLogo size={20} />
                    </View>
                    <View style={styles.typingDots}>
                      {[0, 1, 2].map((i) => (
                        <View key={i} style={[styles.typingDot, { opacity: typingDot === i ? 1 : 0.3 }]} />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>

        {/* ── Input bar ── */}
        <View style={styles.inputBar}>
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            placeholder="Ask me anything about your health..."
            placeholderTextColor="#B0A898"
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!canSend}
            style={[styles.sendButton, canSend && styles.sendButtonActive]}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── Left-slide sidebar (rendered above KAV at SafeAreaView level) ── */}
      {sidebarVisible && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          {/* Backdrop */}
          <TouchableOpacity
            style={[StyleSheet.absoluteFillObject, styles.sidebarBackdrop]}
            activeOpacity={1}
            onPress={closeSidebar}
          />
          {/* Panel */}
          <Animated.View style={[styles.sidebarPanel, { transform: [{ translateX: slideAnim }] }]}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Drawer header */}
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Past Conversations</Text>
                <TouchableOpacity onPress={closeSidebar} style={styles.sidebarCloseButton} activeOpacity={0.7}>
                  <Ionicons name="close" size={20} color="#1C1A17" />
                </TouchableOpacity>
              </View>

              {/* New conversation */}
              <View style={styles.sidebarNewWrap}>
                <TouchableOpacity
                  onPress={() => { setCurrentThreadId(null); closeSidebar(); setHasScrolledToBottom(false); }}
                  style={styles.newConvoButton}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.newConvoText}>New conversation</Text>
                </TouchableOpacity>
              </View>

              {/* Thread list */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {conversations.map((thread, i) => (
                  <View key={thread.id}>
                    <TouchableOpacity
                      onPress={() => { setCurrentThreadId(thread.id); closeSidebar(); setHasScrolledToBottom(false); }}
                      style={[styles.threadRow, currentThreadId === thread.id && styles.threadRowActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.threadTitle} numberOfLines={1}>{thread.title}</Text>
                      <Text style={styles.threadDate}>{thread.date}</Text>
                    </TouchableOpacity>
                    {i < conversations.length - 1 && <View style={styles.threadDivider} />}
                  </View>
                ))}
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, backgroundColor: 'rgba(46,125,125,0.07)' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  menuButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(253,250,245,0.75)', borderWidth: 1, borderColor: 'rgba(232,227,216,0.5)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '500', color: '#1C1A17', marginTop: 12 },
  subGreeting: { fontSize: 15, color: '#5A5550', marginTop: 4 },

  // Messages
  messagesArea: { paddingHorizontal: 20, paddingTop: 8 },
  dateSep: { alignItems: 'center', marginVertical: 20 },
  dateSepText: { fontSize: 11, color: '#B0A898' },
  suggestionsWrap: { marginTop: 32, alignItems: 'center', gap: 10 },
  suggestionChip: { width: '100%', maxWidth: 340, paddingVertical: 11, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(232,227,216,0.6)', alignItems: 'center' },
  suggestionText: { fontSize: 14, color: '#7A7570' },

  // Tether row
  tetherRow: { flexDirection: 'row', gap: 10 },
  tetherLogoSlot: { width: 20, height: 20, flexShrink: 0, marginTop: 2 },
  tetherBubbleWrap: { flex: 1, paddingRight: 20 },
  tetherText: { fontSize: 15, lineHeight: 24, color: '#1C1A17' },
  timestampText: { fontSize: 10, color: '#B0A898', marginTop: 4 },

  // Quick replies
  quickReplies: { flexDirection: 'row', gap: 8, marginTop: 12 },
  qrPrimary: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#2E7D7D' },
  qrPrimaryText: { fontSize: 13, fontWeight: '500', color: '#FFFFFF' },
  qrSecondary: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E8E3D8' },
  qrSecondaryText: { fontSize: 13, fontWeight: '500', color: '#1C1A17' },

  // Appointment card
  apptCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: '#FAF7F0', borderWidth: 1, borderColor: '#E8E3D8' },
  apptCardLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1C1A17' },
  keepChattingText: { fontSize: 13, color: '#7A7570' },

  // User row
  userRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  userBubbleWrap: { maxWidth: '72%' },
  userBubble: { backgroundColor: '#EDE8DF', borderRadius: 18, borderBottomRightRadius: 4, paddingVertical: 10, paddingHorizontal: 14 },
  userBubbleText: { fontSize: 15, lineHeight: 22, color: '#1C1A17' },
  userTimestamp: { fontSize: 10, color: '#B0A898', textAlign: 'right', marginTop: 4 },

  // Typing
  typingDots: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#B0A898' },

  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F5F0E8', borderTopWidth: 1, borderTopColor: 'rgba(232,227,216,0.4)' },
  textInput: { flex: 1, height: 40, paddingHorizontal: 16, paddingRight: 44, borderRadius: 24, borderWidth: 1, borderColor: '#E8E3D8', backgroundColor: '#FFFFFF', fontSize: 15, color: '#1C1A17' },
  sendButton: { position: 'absolute', right: 24, width: 30, height: 30, borderRadius: 15, backgroundColor: '#E8E3D8', alignItems: 'center', justifyContent: 'center' },
  sendButtonActive: { backgroundColor: '#2E7D7D' },

  // Sidebar
  sidebarBackdrop: { backgroundColor: 'rgba(28,26,23,0.4)' },
  sidebarPanel: { position: 'absolute', top: 0, left: 0, bottom: 0, width: SIDEBAR_WIDTH, backgroundColor: '#FEFCF8', zIndex: 10 },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#E8E3D8' },
  sidebarTitle: { fontSize: 17, fontWeight: '500', color: '#1C1A17' },
  sidebarCloseButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  sidebarNewWrap: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#E8E3D8' },
  newConvoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12, backgroundColor: '#2E7D7D' },
  newConvoText: { fontSize: 15, fontWeight: '500', color: '#FFFFFF' },
  threadRow: { paddingVertical: 16, paddingHorizontal: 24 },
  threadRowActive: { backgroundColor: '#F9F6F0' },
  threadTitle: { fontSize: 15, color: '#1C1A17', marginBottom: 4 },
  threadDate: { fontSize: 13, color: '#B0A898' },
  threadDivider: { height: 1, backgroundColor: '#E8E3D8' },
});
