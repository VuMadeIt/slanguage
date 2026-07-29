import { getCharacter } from '@/data/characters';
import type { SceneArt, SceneProp, SceneSetting } from '@/domain/scenario';

import { CutoutCharacter } from './CutoutCharacter';

const OUTLINE = '#191320';

/**
 * The scene is authored portrait (400x600) rather than widescreen.
 *
 * A 16:9 frame scaled to fill a phone would crop away roughly three quarters of
 * its width, which is where the characters live. Authoring tall lets the art
 * fill the screen without losing the cast.
 */
const FRAME_W = 400;
const FRAME_H = 600;
const HORIZON = 430;

/**
 * Composition tables rather than evenly divided slots.
 *
 * The frame is scaled to *fill* the screen, so on a tall phone roughly the outer
 * 15% of the width is cropped away. Fixed positions keep every cast member
 * inside that safe band and stop heads from colliding, which even spacing does
 * not guarantee once characters are this wide.
 */
const FRONT_LAYOUT: Record<number, { xs: number[]; scale: number }> = {
  1: { xs: [200], scale: 1.35 },
  2: { xs: [135, 265], scale: 1.3 },
  3: { xs: [115, 200, 285], scale: 1.0 },
  4: { xs: [110, 170, 230, 290], scale: 0.85 },
};

const BACK_LAYOUT: Record<number, { xs: number[]; scale: number }> = {
  1: { xs: [200], scale: 0.95 },
  2: { xs: [140, 260], scale: 0.9 },
  3: { xs: [120, 200, 280], scale: 0.8 },
  4: { xs: [115, 172, 228, 285], scale: 0.7 },
};

export const SETTING_PALETTE: Record<
  SceneSetting,
  { wall: string; floor: string; label: string }
> = {
  homeroom: { wall: '#F0DFBC', floor: '#B99C6E', label: 'Room 108' },
  hallway: { wall: '#DCC9A6', floor: '#9E8659', label: 'C-Wing' },
  cafeteria: { wall: '#E7D6AE', floor: '#A98F62', label: 'Cafeteria' },
  street: { wall: '#B8C4CC', floor: '#7C868E', label: 'Outside' },
  void: { wall: '#0B0920', floor: '#161036', label: 'Mission Control' },
};

function Backdrop({ setting }: { setting: SceneSetting }) {
  const palette = SETTING_PALETTE[setting];

  return (
    <g>
      <rect x="0" y="0" width={FRAME_W} height={HORIZON} fill={palette.wall} />
      <rect x="0" y={HORIZON} width={FRAME_W} height={FRAME_H - HORIZON} fill={palette.floor} />
      <line x1="0" y1={HORIZON} x2={FRAME_W} y2={HORIZON} stroke={OUTLINE} strokeWidth="4" />

      {setting === 'homeroom' ? (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="24" y="140" width="176" height="128" rx="5" fill="#3E6B4F" />
          <g stroke="#DCE9DD" strokeWidth="3.5" strokeLinecap="round">
            <line x1="46" y1="176" x2="176" y2="176" />
            <line x1="46" y1="204" x2="154" y2="204" />
            <line x1="46" y1="232" x2="120" y2="232" />
          </g>
          <rect x="248" y="146" width="128" height="112" rx="5" fill="#9BD3E8" />
          <line x1="312" y1="146" x2="312" y2="258" />
          <line x1="248" y1="202" x2="376" y2="202" />
          {/* desks along the back row */}
          <g fill="#8E6C43">
            <rect x="18" y="332" width="104" height="16" rx="4" />
            <rect x="150" y="332" width="104" height="16" rx="4" />
            <rect x="282" y="332" width="104" height="16" rx="4" />
          </g>
        </g>
      ) : null}

      {setting === 'hallway' ? (
        <g stroke={OUTLINE} strokeWidth="4">
          {[6, 72, 138, 204, 270, 336].map((x) => (
            <g key={x}>
              <rect x={x} y="170" width="58" height={HORIZON - 170} rx="4" fill="#7E9BB8" />
              <line x1={x + 10} y1="238" x2={x + 48} y2="238" strokeWidth="3" />
              <circle cx={x + 46} cy="272" r="4.5" fill={OUTLINE} />
            </g>
          ))}
          <rect x="0" y="120" width={FRAME_W} height="18" fill="#C4442F" />
        </g>
      ) : null}

      {setting === 'cafeteria' ? (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="26" y="132" width="128" height="76" rx="5" fill="#C4442F" />
          <text
            x="90"
            y="184"
            textAnchor="middle"
            fill="#F6E8CE"
            stroke="none"
            fontSize="34"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            LUNCH
          </text>
          <rect x="228" y="150" width="148" height="96" rx="5" fill="#8FA88C" />
          {/* long table running across the room */}
          <rect x="-10" y="330" width={FRAME_W + 20} height="26" rx="6" fill="#C9A87C" />
        </g>
      ) : null}

      {setting === 'street' ? (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="14" y="120" width="168" height={HORIZON - 120} rx="5" fill="#8E9AA4" />
          <rect x="226" y="156" width="160" height={HORIZON - 156} rx="5" fill="#7B8892" />
          <g fill="#C9D6DE">
            <rect x="36" y="150" width="52" height="44" rx="3" />
            <rect x="108" y="150" width="52" height="44" rx="3" />
            <rect x="252" y="188" width="52" height="44" rx="3" />
            <rect x="316" y="188" width="52" height="44" rx="3" />
          </g>
          <line
            x1="0"
            y1="562"
            x2={FRAME_W}
            y2="562"
            strokeDasharray="26 20"
            strokeWidth="6"
            stroke="#E8DFA8"
          />
        </g>
      ) : null}

      {setting === 'void' ? (
        <g>
          {[
            [34, 58],
            [92, 30],
            [148, 96],
            [212, 44],
            [286, 78],
            [352, 36],
            [258, 148],
            [62, 152],
            [178, 200],
            [330, 208],
            [24, 250],
            [376, 122],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#EAF6FF" />
          ))}
          <circle cx="308" cy="150" r="48" fill="#5B3FA8" stroke={OUTLINE} strokeWidth="4" />
          <ellipse
            cx="308"
            cy="150"
            rx="76"
            ry="15"
            fill="none"
            stroke="#2DE2E6"
            strokeWidth="4"
          />
          <circle cx="88" cy="330" r="22" fill="#B4478F" stroke={OUTLINE} strokeWidth="4" />
        </g>
      ) : null}
    </g>
  );
}

/**
 * Anonymous bodies filling out the room.
 *
 * Their baseline sits below the horizon so they read as standing in front of the
 * set dressing; any higher and they look like they are inside the lockers.
 */
function Crowd() {
  return (
    <g opacity="0.55">
      {[22, 100, 300, 378].map((x, index) => (
        <g key={x} transform={`translate(${x} ${456 - (index % 2) * 12}) scale(0.95)`}>
          <ellipse cx="0" cy="-96" rx="30" ry="28" fill="#4A4256" />
          <rect x="-23" y="-70" width="46" height="70" rx="9" fill="#3B3546" />
        </g>
      ))}
    </g>
  );
}

/**
 * A raised phone belongs behind the principals (someone in the room is filming);
 * everything else is handled by them and belongs in front. Drawn centred behind
 * the cast, a tray or a fry carton disappears entirely the moment a scene has a
 * third character standing in the middle.
 */
function isRaisedProp(prop: SceneProp): boolean {
  return prop === 'phone-raised';
}

function Prop({ prop }: { prop: SceneProp }) {
  switch (prop) {
    case 'phone':
      return (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="186" y="486" width="30" height="46" rx="5" fill="#1D1B26" />
          <rect x="192" y="493" width="18" height="32" rx="2" fill="#6FD8E8" />
        </g>
      );
    /*
     * Held up by an anonymous arm at the right edge rather than floating in the
     * centre: centred, it painted straight over the face of whichever back-row
     * character was doing the filming.
     */
    case 'phone-raised':
      return (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="288" y="350" width="20" height="72" rx="9" fill="#3B3546" />
          <circle cx="298" cy="352" r="13" fill="#D9A579" />
          <rect x="278" y="292" width="40" height="62" rx="6" fill="#1D1B26" />
          <rect x="285" y="300" width="26" height="46" rx="3" fill="#F4E27A" />
          <circle cx="298" cy="282" r="6" fill="#FF4D6D" />
        </g>
      );
    case 'fries':
      return (
        <g stroke={OUTLINE} strokeWidth="4">
          <path d="M172 542 L228 542 L220 482 L180 482 Z" fill="#D8453B" />
          <g fill="#F2C64B" stroke={OUTLINE} strokeWidth="3">
            <rect x="182" y="450" width="9" height="36" rx="3" />
            <rect x="195" y="440" width="9" height="46" rx="3" />
            <rect x="208" y="456" width="9" height="30" rx="3" />
          </g>
        </g>
      );
    case 'tray':
      return (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="156" y="512" width="88" height="22" rx="5" fill="#8C93A6" />
          <circle cx="182" cy="510" r="11" fill="#C4763B" />
          <rect x="200" y="500" width="32" height="12" rx="4" fill="#6E9A5A" />
        </g>
      );
    case 'schedule':
      return (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="176" y="466" width="46" height="60" rx="4" fill="#F7F1E0" />
          <g stroke={OUTLINE} strokeWidth="3">
            <line x1="186" y1="482" x2="212" y2="482" />
            <line x1="186" y1="496" x2="212" y2="496" />
            <line x1="186" y1="510" x2="204" y2="510" />
          </g>
        </g>
      );
    case 'clipboard':
      return (
        <g stroke={OUTLINE} strokeWidth="4">
          <rect x="172" y="462" width="50" height="66" rx="5" fill="#B58B52" />
          <rect x="180" y="472" width="34" height="48" rx="3" fill="#F7F1E0" />
          <rect x="188" y="454" width="18" height="10" rx="3" fill="#8C93A6" />
        </g>
      );
    default:
      return null;
  }
}

type Props = {
  art: SceneArt;
  /** Cast key of whoever currently has the line, so only they flap their mouth. */
  speakingKey?: string | null;
  className?: string;
};

/**
 * Renders a beat as flat cutout art.
 *
 * `back` cast members are drawn first, smaller and higher up, so a four-person
 * scene still reads at phone size.
 */
export function CutoutScene({ art, speakingKey, className }: Props) {
  const cast = art.characters.flatMap((entry) => {
    const visual = getCharacter(entry.key);
    return visual ? [{ entry, visual }] : [];
  });

  const front = cast.filter((item) => !item.entry.back);
  const back = cast.filter((item) => item.entry.back);

  const prop = art.prop ?? 'none';
  const raised = isRaisedProp(prop);

  const render = (items: typeof cast, isBack: boolean) => {
    const table = isBack ? BACK_LAYOUT : FRONT_LAYOUT;
    const layout = table[items.length] ?? table[4];
    const baseline = isBack ? 442 : 578;

    return items.map((item, index) => {
      const x = layout.xs[index] ?? FRAME_W / 2;
      const size = layout.scale * item.visual.heightScale;
      return (
        <g
          key={`${isBack ? 'back' : 'front'}-${item.visual.key}`}
          transform={`translate(${x} ${baseline}) scale(${size}) translate(-50 -150)`}
        >
          <CutoutCharacter
            character={item.visual}
            expression={item.entry.expression}
            talking={speakingKey === item.visual.key}
          />
        </g>
      );
    });
  };

  return (
    <svg
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${SETTING_PALETTE[art.setting].label} scene`}
    >
      <Backdrop setting={art.setting} />
      {art.crowd ? <Crowd /> : null}
      {raised ? <Prop prop={prop} /> : null}
      {render(back, true)}
      {render(front, false)}
      {raised ? null : <Prop prop={prop} />}

      {art.gag ? (
        <g>
          <rect x="0" y="0" width={FRAME_W} height="46" fill={OUTLINE} opacity="0.85" />
          <text
            x={FRAME_W / 2}
            y="31"
            textAnchor="middle"
            fill="#F6E8CE"
            fontSize="21"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            {art.gag}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
