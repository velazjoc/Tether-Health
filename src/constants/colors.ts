/**
 * Tether Design System — Color Constants
 *
 * Source of truth: figma-make/styles/theme.css
 * All hex values are exact matches to the CSS custom properties.
 * rgba helpers are typed as template literals for use in StyleSheet.
 */

// ─── Teal palette (primary brand) ────────────────────────────────────────────
export const teal = {
  /** Main interactive teal — buttons, links, icons */
  primary:  '#2E7D7D',
  /** Dark teal — teal-gradient endpoints, hover states */
  dark:     '#1A5C5C',
  /** Hover variant used in buttons */
  hover:    '#256868',
  /** Darker icon teal */
  icon:     '#3D6E68',
  /** Light teal — icon chip backgrounds, tag backgrounds */
  light:    '#E6F4F4',
  /** Text on light teal backgrounds */
  textDark: '#1E5C5C',
} as const;

// ─── Onboarding teal (rich, dark — used on teal-background screens) ──────────
export const onboarding = {
  /** Base background top — gradient start */
  base:   '#2E6A64',
  /** Deep background bottom — gradient end */
  deep:   '#1E4A46',
  /** Accent — active pill borders, CTA shine */
  accent: '#3D8078',
  /** Subtle glow overlay */
  glow:   'rgba(106, 158, 150, 0.25)',
} as const;

// ─── Background surfaces ──────────────────────────────────────────────────────
export const background = {
  /** App-wide warm cream background */
  warm:    '#F5F0E8',
  /** Standard card surface */
  card:    '#FDFAF5',
  /** Elevated card surface — sheets, modals */
  elevated: '#FEFCF8',
  /** Input / text-field background */
  input:   '#F8F5EF',
  /** Light cream used in pill-frosted */
  frosted: '#EDE8DF',
  /** Slightly richer cream for detail screens */
  detail:  '#F5F3F0',
  /** Teal-tinted chip/icon backgrounds */
  tealChip: '#DFE9E6',
} as const;

// ─── Text ─────────────────────────────────────────────────────────────────────
export const text = {
  /** Headings, primary labels */
  primary:     '#1C1A17',
  /** Also used for headlines in some screens */
  primaryAlt:  '#1A1816',
  /** Body copy */
  body:        '#2A2520',
  /** Secondary labels, metadata */
  secondary:   '#7A7570',
  /** Muted secondary variant */
  muted:       '#7E7670',
  /** Timestamps, hints, captions */
  placeholder: '#B0A898',
} as const;

// ─── Borders & dividers ───────────────────────────────────────────────────────
export const border = {
  /** Default card border — warm neutral */
  light:   'rgba(200, 190, 175, 0.5)',
  /** Row dividers inside cards */
  divider: '#EAE6E0',
  /** Subtle section divider */
  subtle:  'rgba(0, 0, 0, 0.06)',
  /** Input border (resting) */
  input:   '#E8E3D8',
  /** Input border (focused) */
  inputFocus: 'rgba(46, 125, 125, 0.5)',
} as const;

// ─── Status / semantic ────────────────────────────────────────────────────────
export const status = {
  needsAttention: {
    bg:     'rgba(196, 133, 122, 0.15)',
    border: 'rgba(196, 133, 122, 0.3)',
    text:   '#B05040',
    accent: '#C4857A',
  },
  keepGoing: {
    bg:     'rgba(200, 160, 80, 0.15)',
    border: 'rgba(200, 160, 80, 0.3)',
    text:   '#A07820',
  },
  onTrack: {
    bg:     'rgba(74, 155, 127, 0.15)',
    border: 'rgba(74, 155, 127, 0.3)',
    text:   '#2E7D60',
  },
} as const;

// ─── Accent colors ────────────────────────────────────────────────────────────
export const accent = {
  /** Rose / destructive */
  rose:       '#C4857A',
  /** Apple brand red */
  applePink:  '#FF2D55',
  /** Warm gold — sleep deep-bar, vitamin D */
  gold:       '#B89B6A',
  /** Privacy icon backgrounds */
  warmBeige:  '#F5EDDF',
  warmPink:   '#F2E8E6',
  /** Privacy icon tints */
  goldIcon:   '#B89B6A',
  roseIcon:   '#A8706A',
} as const;

// ─── Overlays (for use on teal backgrounds) ───────────────────────────────────
export const overlay = {
  white10:  'rgba(255, 255, 255, 0.1)',
  white15:  'rgba(255, 255, 255, 0.15)',
  white20:  'rgba(255, 255, 255, 0.2)',
  white25:  'rgba(255, 255, 255, 0.25)',
  white85:  'rgba(255, 255, 255, 0.85)',
  white90:  'rgba(255, 255, 255, 0.9)',
  black40:  'rgba(0, 0, 0, 0.4)',
  black60:  'rgba(0, 0, 0, 0.6)',
  teal08:   'rgba(46, 125, 125, 0.08)',
  teal12:   'rgba(46, 125, 125, 0.12)',
  teal15:   'rgba(46, 125, 125, 0.15)',
} as const;

// ─── Flat export for convenience ──────────────────────────────────────────────
/** Every named color in one flat object — use for quick lookups */
export const Colors = {
  // Teal
  tealPrimary:   teal.primary,
  tealDark:      teal.dark,
  tealLight:     teal.light,
  tealIcon:      teal.icon,
  tealTextDark:  teal.textDark,

  // Onboarding
  onboardingBase:  onboarding.base,
  onboardingDeep:  onboarding.deep,
  onboardingAccent: onboarding.accent,

  // Backgrounds
  bgWarm:     background.warm,
  bgCard:     background.card,
  bgElevated: background.elevated,
  bgInput:    background.input,
  bgDetail:   background.detail,
  bgTealChip: background.tealChip,

  // Text
  textPrimary:     text.primary,
  textBody:        text.body,
  textSecondary:   text.secondary,
  textPlaceholder: text.placeholder,

  // Borders
  borderLight:   border.light,
  borderDivider: border.divider,
  borderInput:   border.input,

  // Status
  rose:           accent.rose,
  needsAttention: status.needsAttention.accent,
  onTrack:        status.onTrack.text,

  // Pure
  white: '#FFFFFF',
  black: '#000000',
} as const;

export default Colors;
