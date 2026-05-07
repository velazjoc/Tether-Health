import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// Primary-color logo for cream background
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

type Message = {
  id: string;
  sender: 'user' | 'tether';
  text: string | React.ReactNode;
  timestamp: string;
  isFollowUp?: boolean;
};

// Returns RN-compatible ReactNode[] — same content as web, bold spans → nested Text
const generateTetherResponse = (question: string): (string | React.ReactElement)[] => {
  const q = question.toLowerCase();

  if (q.includes('vitamin') && q.includes('d')) {
    return [
      <Text key="0"><Text style={s.bold}>What it means ·</Text>{' '}Vitamin D below 30 ng/mL is considered insufficient. Optimal levels are 40–60 ng/mL.</Text>,
      <Text key="1">Low Vitamin D is really common — especially in winter or if you're mostly indoors. Your body needs it to absorb calcium, support your immune system, and regulate mood.</Text>,
      <Text key="2"><Text style={s.bold}>Common symptoms ·</Text>{' '}Fatigue, muscle weakness, mood changes, and getting sick more often. Many people don't notice symptoms until levels are very low.</Text>,
      <Text key="3"><Text style={s.bold}>What to ask your doctor ·</Text>{' '}"My Vitamin D came back low — should I start a supplement, and what dosage do you recommend?" Most doctors suggest 1,000–2,000 IU daily, but yours might recommend more depending on your level.</Text>,
    ];
  }

  if (q.includes('iron')) {
    return [
      <Text key="0"><Text style={s.bold}>Normal range ·</Text>{' '}For women, ferritin (stored iron) should be 20–200 ng/mL. Below 20 suggests low iron stores, even if you're not anemic yet.</Text>,
      <Text key="1">Low iron is common in menstruating women. You might feel tired, have trouble concentrating, or notice your hair thinning. But mild low iron is usually easy to fix.</Text>,
      <Text key="2"><Text style={s.bold}>When to follow up ·</Text>{' '}If your ferritin is below 30, your doctor will likely recommend an iron supplement or dietary changes. Recheck in 2–3 months to see if it's improving.</Text>,
      <Text key="3">If your iron is in the normal range but you're still tired, there might be something else going on — worth mentioning to your doctor so they can rule out thyroid issues or B12 deficiency.</Text>,
    ];
  }

  if (q.includes('doctor') || q.includes('visit')) {
    return [
      <Text key="0"><Text style={s.bold}>Good questions to ask ·</Text>{' '}Here's what I'd focus on based on common health tracking:</Text>,
      <Text key="1">
        <Text style={s.bold}>1. Lab trends ·</Text>{' '}"I've been tracking my results — my Vitamin D has been low for 3 months. Should we adjust my supplement dose?"{'\n\n'}
        <Text style={s.bold}>2. Symptoms ·</Text>{' '}"I've noticed I'm more tired than usual, especially in the afternoons. Could this be related to my thyroid or iron levels?"{'\n\n'}
        <Text style={s.bold}>3. Prevention ·</Text>{' '}"Based on my family history and current labs, is there anything I should be monitoring more closely?"
      </Text>,
      <Text key="2">Bringing your recent lab results or a summary helps your doctor see patterns they might miss if they're only looking at one test at a time.</Text>,
    ];
  }

  return [
    <Text key="0"><Text style={s.bold}>This is a demo ·</Text>{' '}I can't respond to custom questions yet in this prototype.</Text>,
    'Try tapping one of the sample questions above to see how Tether would actually respond to your health data.',
  ];
};

const suggestions = [
  'What does my Vitamin D result mean?',
  'Should I be worried about my iron levels?',
  'What should I ask my doctor at my next visit?',
];

const lockedTabs = [
  { icon: 'home-outline' as const, label: 'Home' },
  { icon: 'pulse-outline' as const, label: 'My Health' },
  { icon: 'trending-up-outline' as const, label: 'Progress' },
  { icon: 'person-outline' as const, label: 'Profile' },
];

export default function GuestChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatsRemaining, setChatsRemaining] = useState(10);
  const [uploadsRemaining] = useState(2);
  const [showLimitSheet, setShowLimitSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dismissedFollowUps, setDismissedFollowUps] = useState<Set<string>>(new Set());
  const [typingDot, setTypingDot] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Animate typing dots
  useEffect(() => {
    if (!isTyping) return;
    const interval = setInterval(() => setTypingDot((d) => (d + 1) % 3), 300);
    return () => clearInterval(interval);
  }, [isTyping]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const timestamp = () =>
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const sendTetherBubbles = (bubbles: (string | React.ReactElement)[]) => {
    let delay = 1500;

    bubbles.forEach((bubbleText, index) => {
      if (index > 0) {
        setTimeout(() => setIsTyping(true), delay);
        delay += 800;
      }
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `tether-${Date.now()}-${index}`, sender: 'tether', text: bubbleText, timestamp: timestamp() },
        ]);
        setIsTyping(false);
      }, delay);
      delay += 400;
    });

    // Follow-up nudge
    setTimeout(() => setIsTyping(true), delay);
    delay += 600;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `tether-followup-${Date.now()}`, sender: 'tether', text: '', timestamp: timestamp(), isFollowUp: true },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleDismissFollowUp = (id: string) => {
    setDismissedFollowUps((prev) => new Set(prev).add(id));
    inputRef.current?.focus();
  };

  const navigateToWelcome = () => {
    router.push({ pathname: '/welcome', params: { fromGuest: 'true' } } as any);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    if (chatsRemaining <= 0) { setShowLimitSheet(true); return; }

    const text = inputValue;
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text, timestamp: timestamp() },
    ]);
    const remaining = chatsRemaining - 1;
    setChatsRemaining(remaining);
    setInputValue('');
    setIsTyping(true);

    sendTetherBubbles(generateTetherResponse(text));
    if (remaining === 0) setTimeout(() => setShowLimitSheet(true), 3000);
  };

  const handleSuggestionTap = (suggestion: string) => {
    if (chatsRemaining <= 0) { setShowLimitSheet(true); return; }
    setMessages([{ id: `user-${Date.now()}`, sender: 'user', text: suggestion, timestamp: timestamp() }]);
    const remaining = chatsRemaining - 1;
    setChatsRemaining(remaining);
    setIsTyping(true);
    sendTetherBubbles(generateTetherResponse(suggestion));
    if (remaining === 0) setTimeout(() => setShowLimitSheet(true), 3000);
  };

  const handleDeleteData = () => {
    setShowDeleteDialog(false);
    setShowLimitSheet(false);
    router.replace('/');
  };

  const renderMessages = () =>
    messages.map((message, index) => {
      if (message.sender === 'tether') {
        if (message.isFollowUp && dismissedFollowUps.has(message.id)) return null;

        const prev = messages[index - 1];
        const next = messages[index + 1];
        const isPrevTether = prev?.sender === 'tether' && !prev?.isFollowUp;
        const isNextTether = next?.sender === 'tether' && !message.isFollowUp;
        const showLogo = !isPrevTether && !message.isFollowUp;
        const showTimestamp = !isNextTether && !message.isFollowUp;

        if (message.isFollowUp) {
          return (
            <View key={message.id} style={[styles.tetherRow, { marginBottom: 24 }]}>
              <View style={{ width: 20 }} />
              <View style={styles.followUpCard}>
                <Text style={styles.followUpText}>
                  This is general information. Create an account and Tether can tailor this to your
                  actual health data — what you choose to share stays private and is never shared
                  with anyone.
                </Text>
                <View style={styles.followUpActions}>
                  <TouchableOpacity onPress={navigateToWelcome} style={styles.followUpGetStarted} activeOpacity={0.8}>
                    <Text style={styles.followUpGetStartedText}>Get started</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDismissFollowUp(message.id)} activeOpacity={0.6}>
                    <Text style={styles.followUpDismissText}>Continue exploring</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }

        return (
          <View key={message.id} style={[styles.tetherRow, { marginBottom: isPrevTether ? 8 : 24 }]}>
            <View style={[styles.tetherLogoSlot, { opacity: showLogo ? 1 : 0 }]}>
              {showLogo && <TetherLogo size={20} />}
            </View>
            <View style={styles.tetherBubbleWrap}>
              <Text style={styles.tetherBubbleText}>{message.text}</Text>
              {showTimestamp && <Text style={styles.timestampText}>{message.timestamp}</Text>}
            </View>
          </View>
        );
      }

      // User bubble
      return (
        <View key={message.id} style={styles.userRow}>
          <View style={styles.userBubbleWrap}>
            <View style={styles.userBubble}>
              <Text style={styles.userBubbleText}>{message.text as string}</Text>
            </View>
            <Text style={styles.userTimestamp}>{message.timestamp}</Text>
          </View>
        </View>
      );
    });

  const canSend = inputValue.trim().length > 0 && chatsRemaining > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0E8" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <TetherLogo size={40} />
            <Text style={styles.headerTitle}>Hey there,</Text>
            <Text style={styles.headerSubtitle}>Try asking a health question</Text>

            <View style={styles.headerMeta}>
              {/* Guest badge */}
              <TouchableOpacity
                onPress={() => setShowLimitSheet(true)}
                style={styles.guestBadge}
                activeOpacity={0.7}
              >
                <View style={styles.guestDot} />
                <Text style={styles.guestBadgeText}>
                  Guest · {chatsRemaining} {chatsRemaining === 1 ? 'chat' : 'chats'} left
                </Text>
              </TouchableOpacity>

              {/* Create account */}
              <TouchableOpacity
                onPress={navigateToWelcome}
                style={styles.createAccountButton}
                activeOpacity={0.8}
              >
                <Text style={styles.createAccountText}>Create account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Messages / Suggestions ── */}
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
                        <View
                          key={i}
                          style={[styles.typingDot, { opacity: typingDot === i ? 1 : 0.3 }]}
                        />
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
          {/* Upload button + badge */}
          <TouchableOpacity
            onPress={() => setShowLimitSheet(true)}
            style={styles.uploadButton}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload-outline" size={18} color="#7A7570" />
            <View style={styles.uploadBadge}>
              <Text style={styles.uploadBadgeText}>{uploadsRemaining}</Text>
            </View>
          </TouchableOpacity>

          {/* Text input */}
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            placeholder="Ask me anything about health..."
            placeholderTextColor="#B0A898"
            editable={chatsRemaining > 0}
            style={[styles.textInput, chatsRemaining <= 0 && { opacity: 0.5 }]}
          />

          {/* Send button */}
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

      {/* ── Locked tab bar (design element, not real navigation) ── */}
      <View style={styles.lockedTabBar}>
        {lockedTabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setShowLimitSheet(true)}
            style={styles.lockedTabItem}
            activeOpacity={0.6}
          >
            <View style={styles.lockedIconWrap}>
              <Ionicons name={tab.icon} size={24} color="#B0A898" />
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={7} color="#B0A898" />
              </View>
            </View>
            <Text style={styles.lockedTabLabel}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Limit bottom sheet ── */}
      <Modal
        visible={showLimitSheet && !showDeleteDialog}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLimitSheet(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setShowLimitSheet(false)}
          />
          <View style={styles.limitSheet}>
            {/* Close */}
            <TouchableOpacity
              onPress={() => setShowLimitSheet(false)}
              style={styles.sheetCloseButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#7A7570" />
            </TouchableOpacity>

            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>
              Ready to get more out of Tether?
            </Text>
            <Text style={styles.sheetSubtitle}>
              Create an account and your chats, uploads, and data from this session will all be
              saved and waiting for you.
            </Text>

            <TouchableOpacity
              onPress={navigateToWelcome}
              style={styles.sheetPrimaryButton}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetPrimaryButtonText}>Set up my account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDeleteDialog(true)}
              style={styles.sheetDestructiveButton}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetDestructiveText}>No thanks, delete my data</Text>
            </TouchableOpacity>

            <View style={styles.sheetDivider} />
            <Text style={styles.sheetFootnote}>Your chat history will carry over</Text>
          </View>
        </View>
      </Modal>

      {/* ── Delete confirmation dialog ── */}
      <Modal
        visible={showDeleteDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              Are you sure you want to delete your data?
            </Text>
            <TouchableOpacity
              onPress={handleDeleteData}
              style={styles.dialogDestructiveButton}
              activeOpacity={0.85}
            >
              <Text style={styles.dialogDestructiveText}>Yes, delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDeleteDialog(false)}
              style={styles.dialogCancelButton}
              activeOpacity={0.8}
            >
              <Text style={styles.dialogCancelText}>No, go back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Inline bold style used in generateTetherResponse (must be defined before the function)
const s = StyleSheet.create({ bold: { fontWeight: '600' } });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // ── Header
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1C1A17',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#5A5550',
    marginTop: 4,
  },
  headerMeta: {
    marginTop: 16,
    alignItems: 'center',
    gap: 14,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guestDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D7D',
  },
  guestBadgeText: {
    fontSize: 13,
    color: '#2E7D7D',
  },
  createAccountButton: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(46,125,125,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(46,125,125,0.2)',
  },
  createAccountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D7D',
  },

  // ── Messages
  messagesArea: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  suggestionsWrap: {
    marginTop: 32,
    alignItems: 'center',
    gap: 10,
  },
  suggestionChip: {
    width: '100%',
    maxWidth: 340,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(232,227,216,0.6)',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: '#7A7570',
    textAlign: 'center',
  },

  // Tether row
  tetherRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tetherLogoSlot: {
    width: 20,
    height: 20,
    flexShrink: 0,
    marginTop: 2,
  },
  tetherBubbleWrap: {
    flex: 1,
    paddingRight: 20,
  },
  tetherBubbleText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1C1A17',
    fontWeight: '400',
  },
  timestampText: {
    fontSize: 10,
    color: '#B0A898',
    marginTop: 4,
  },

  // Follow-up card
  followUpCard: {
    flex: 1,
    paddingRight: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(122,117,112,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(122,117,112,0.12)',
  },
  followUpText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#7A7570',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  followUpActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  followUpGetStarted: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#2E7D7D',
  },
  followUpGetStartedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followUpDismissText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7A7570',
  },

  // User row
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  userBubbleWrap: {
    maxWidth: '72%',
  },
  userBubble: {
    backgroundColor: '#EDE8DF',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userBubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1C1A17',
  },
  userTimestamp: {
    fontSize: 10,
    color: '#B0A898',
    textAlign: 'right',
    marginTop: 4,
  },

  // Typing dots
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B0A898',
  },

  // ── Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F0E8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(232,227,216,0.4)',
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E3D8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  uploadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2E7D7D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5F0E8',
  },
  uploadBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 16,
    paddingRight: 44,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8E3D8',
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#1C1A17',
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8E3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#2E7D7D',
  },

  // ── Locked tab bar
  lockedTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#FEFCF8',
    borderTopWidth: 1,
    borderTopColor: '#E8E3D8',
  },
  lockedTabItem: {
    alignItems: 'center',
    gap: 4,
    opacity: 0.4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lockedIconWrap: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
  },
  lockedTabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#B0A898',
  },

  // ── Limit sheet modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  limitSheet: {
    backgroundColor: '#FEFCF8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
  sheetCloseButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  sheetHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EAE6E0',
    alignSelf: 'center',
    marginBottom: 32,
  },
  sheetTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '400',
    color: '#1A1816',
    marginBottom: 12,
  },
  sheetSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: '#7A7570',
    marginBottom: 32,
  },
  sheetPrimaryButton: {
    height: 56,
    borderRadius: 100,
    backgroundColor: '#2E6A64',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2E6A64',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  sheetPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sheetDestructiveButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sheetDestructiveText: {
    fontSize: 14,
    color: '#7A7570',
  },
  sheetDivider: {
    marginTop: 24,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E3D8',
  },
  sheetFootnote: {
    fontSize: 13,
    color: '#B0A898',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ── Delete dialog
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FEFCF8',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 16,
    gap: 12,
  },
  dialogTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
    color: '#1A1816',
    textAlign: 'center',
    marginBottom: 8,
  },
  dialogDestructiveButton: {
    height: 52,
    borderRadius: 100,
    backgroundColor: '#A8706A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogDestructiveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dialogCancelButton: {
    height: 52,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E8E3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1A17',
  },
});
