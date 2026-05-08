/**
 * Tether Design System — Typography Constants
 *
 * Font families: Jost (UI) · Playfair Display (display/hero)
 * Scale locked to figma-make/styles/theme.css .type-* classes.
 *
 * Note: custom fonts require expo-font loading in the root _layout.tsx.
 * Until loaded, React Native falls back to system sans-serif / serif.
 * Replace family strings with loaded font names once configured.
 */

// ─── Font families ────────────────────────────────────────────────────────────
export const FontFamily = {
  /** Primary UI font — all body, labels, captions */
  sans:        'Jost',
  /** Display/hero font — screen titles, onboarding heading */
  serif:       'PlayfairDisplay',
  /** System fallbacks (used before custom fonts load) */
  systemSans:  'System',
  systemSerif: 'Georgia',
} as const;

// ─── Font weights ─────────────────────────────────────────────────────────────
export const FontWeight = {
  regular: '400' as const,
  medium:  '500' as const,
  semibold: '600' as const,
  bold:    '700' as const,
} as const;

// ─── Type scale — mirrors .type-* CSS classes in theme.css ───────────────────

/** Display — 32px / 1.25lh — Tether's voice, one per screen max */
export const TypeDisplay = {
  fontFamily:  FontFamily.serif,
  fontStyle:   'italic' as const,
  fontSize:    32,
  lineHeight:  40,
  fontWeight:  FontWeight.regular,
} as const;

/** Screen title — 28px / 1.3lh — page headers */
export const TypeTitle = {
  fontFamily: FontFamily.serif,
  fontSize:   28,
  lineHeight: 36,
  fontWeight: FontWeight.regular,
} as const;

/** Card headline — 17px / 1.4lh — card titles, section headers */
export const TypeLabelLarge = {
  fontFamily: FontFamily.sans,
  fontSize:   17,
  lineHeight: 24,
  fontWeight: FontWeight.medium,
} as const;

/** Body — 15px / 1.6lh — all body copy and descriptions */
export const TypeBody = {
  fontFamily: FontFamily.sans,
  fontSize:   15,
  lineHeight: 24,
  fontWeight: FontWeight.regular,
} as const;

/** Label — 13px / 1.4lh — form labels, buttons, action text */
export const TypeLabel = {
  fontFamily: FontFamily.sans,
  fontSize:   13,
  lineHeight: 18,
  fontWeight: FontWeight.medium,
} as const;

/** Section label — 11px / 1.4lh — section headers, metadata (uppercase) */
export const TypeLabelSmall = {
  fontFamily:   FontFamily.sans,
  fontSize:     11,
  lineHeight:   15,
  fontWeight:   FontWeight.medium,
  textTransform: 'uppercase' as const,
  letterSpacing: 1,
} as const;

/** Caption — 12px / 1.5lh — timestamps, helper text, secondary info */
export const TypeCaption = {
  fontFamily: FontFamily.sans,
  fontSize:   12,
  lineHeight: 18,
  fontWeight: FontWeight.regular,
} as const;

// ─── Convenience object ───────────────────────────────────────────────────────
export const Typography = {
  display:      TypeDisplay,
  title:        TypeTitle,
  labelLarge:   TypeLabelLarge,
  body:         TypeBody,
  label:        TypeLabel,
  labelSmall:   TypeLabelSmall,
  caption:      TypeCaption,
} as const;

export default Typography;
