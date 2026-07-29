import type { CharacterVisual } from '@/data/characters';
import type { SceneExpression } from '@/domain/scenario';

const OUTLINE = '#191320';
const STROKE = 3.2;

type Props = {
  character: CharacterVisual;
  expression: SceneExpression;
  /** Drives the mouth flap; only the character with the line should talk. */
  talking?: boolean;
  className?: string;
};

function Mouth({ expression }: { expression: SceneExpression }) {
  const common = { stroke: OUTLINE, strokeWidth: STROKE, strokeLinecap: 'round' as const };

  switch (expression) {
    case 'happy':
      return (
        <path d="M38 64 Q50 76 62 64" fill="#7A2E33" {...common} />
      );
    case 'sad':
      return <path d="M38 72 Q50 62 62 72" fill="none" {...common} />;
    case 'flat':
      return <line x1="39" y1="68" x2="61" y2="68" {...common} />;
    case 'shock':
      return <ellipse cx="50" cy="69" rx="7" ry="8" fill="#5E2126" {...common} />;
    case 'yell':
      return <ellipse cx="50" cy="70" rx="11" ry="13" fill="#5E2126" {...common} />;
    case 'angry':
      return <path d="M38 70 Q50 64 62 70" fill="#5E2126" {...common} />;
    default:
      return <ellipse cx="50" cy="68" rx="8" ry="3.4" fill="#5E2126" {...common} />;
  }
}

function Brows({ expression }: { expression: SceneExpression }) {
  const common = {
    stroke: OUTLINE,
    strokeWidth: 3.4,
    strokeLinecap: 'round' as const,
  };

  if (expression === 'angry') {
    return (
      <g {...common}>
        <line x1="31" y1="26" x2="45" y2="33" />
        <line x1="69" y1="26" x2="55" y2="33" />
      </g>
    );
  }
  if (expression === 'shock' || expression === 'yell') {
    return (
      <g {...common}>
        <line x1="31" y1="24" x2="45" y2="21" />
        <line x1="69" y1="24" x2="55" y2="21" />
      </g>
    );
  }
  if (expression === 'sad') {
    return (
      <g {...common}>
        <line x1="32" y1="30" x2="45" y2="25" />
        <line x1="68" y1="30" x2="55" y2="25" />
      </g>
    );
  }
  return null;
}

function Eyes({
  expression,
  skin,
}: {
  expression: SceneExpression;
  skin: string;
}) {
  const wide = expression === 'shock' || expression === 'yell';
  const ry = wide ? 13 : 11;
  const pupil = wide ? 2.6 : 3.4;
  const lidded = expression === 'flat';

  return (
    <g>
      {[40, 60].map((cx) => (
        <g key={cx} className="cutout-blink" style={{ transformOrigin: `${cx}px 44px` }}>
          <ellipse
            cx={cx}
            cy={44}
            rx={9}
            ry={ry}
            fill="#FFFFFF"
            stroke={OUTLINE}
            strokeWidth={STROKE}
          />
          <circle cx={cx} cy={lidded ? 47 : 45} r={pupil} fill={OUTLINE} />
          {/* Half-lidded deadpan: the lid has to be the character's own skin. */}
          {lidded ? (
            <path
              d={`M${cx - 9} 44 A9 ${ry} 0 0 1 ${cx + 9} 44 Z`}
              fill={skin}
              stroke={OUTLINE}
              strokeWidth={2.4}
            />
          ) : null}
        </g>
      ))}
    </g>
  );
}

function Hair({ character }: { character: CharacterVisual }) {
  const { hairStyle, hair } = character;
  const fill = { fill: hair, stroke: OUTLINE, strokeWidth: STROKE };

  switch (hairStyle) {
    case 'braids':
      return (
        <g {...fill}>
          {[26, 38, 50, 62, 74].map((cx, index) => (
            <circle key={cx} cx={cx} cy={index % 2 === 0 ? 18 : 15} r={8} />
          ))}
        </g>
      );
    case 'bob':
      return (
        <g {...fill}>
          <path d="M17 46 Q17 10 50 10 Q83 10 83 46 L83 58 Q74 44 74 36 Q50 44 26 36 Q26 44 17 58 Z" />
        </g>
      );
    case 'curly':
      return (
        <g {...fill}>
          {[
            [28, 22, 10],
            [42, 14, 11],
            [58, 14, 11],
            [72, 22, 10],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
    case 'messy':
      return (
        <g {...fill}>
          <path d="M18 34 L24 14 L32 26 L40 8 L50 24 L58 10 L68 26 L76 16 L82 36 Q50 22 18 34 Z" />
        </g>
      );
    case 'buzz':
      return <path d="M18 40 Q18 12 50 12 Q82 12 82 40 Q50 26 18 40 Z" {...fill} />;
    case 'bald':
      return (
        <g>
          <path
            d="M20 40 Q22 22 34 16"
            fill="none"
            stroke={hair}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <path
            d="M80 40 Q78 22 66 16"
            fill="none"
            stroke={hair}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
      );
    case 'cap':
      return (
        <g {...fill}>
          <path d="M18 26 Q18 4 50 4 Q82 4 82 26 Z" />
          <rect x="12" y="24" width="76" height="8" rx="4" />
        </g>
      );
    case 'hood':
      return (
        <g {...fill}>
          <path d="M12 52 Q12 6 50 6 Q88 6 88 52 Q70 34 50 34 Q30 34 12 52 Z" />
        </g>
      );
    default:
      return null;
  }
}

/**
 * Accessories are split by draw order, not by kind.
 *
 * Anything on the face has to land after the eyes or the head shape paints over
 * it; anything on the body has to land before the head so the neckline reads
 * correctly. One combined component silently loses every pair of glasses.
 */
function FaceAccessory({ character }: { character: CharacterVisual }) {
  switch (character.accessory) {
    case 'glasses':
      return (
        <g fill="none" stroke={OUTLINE} strokeWidth={3}>
          <circle cx="40" cy="45" r="13" />
          <circle cx="60" cy="45" r="13" />
          <line x1="53" y1="45" x2="47" y2="45" />
        </g>
      );
    case 'sunglasses':
      return (
        <g stroke={OUTLINE} strokeWidth={3}>
          <rect x="24" y="34" width="24" height="18" rx="4" fill="#14121A" />
          <rect x="52" y="34" width="24" height="18" rx="4" fill="#14121A" />
          <line x1="48" y1="42" x2="52" y2="42" />
        </g>
      );
    default:
      return null;
  }
}

function BodyAccessory({ character }: { character: CharacterVisual }) {
  switch (character.accessory) {
    case 'tie':
      return (
        <g stroke={OUTLINE} strokeWidth={2.6}>
          <path d="M50 80 L45 86 L50 104 L55 86 Z" fill="#8B2E3F" />
        </g>
      );
    case 'backpack':
      return (
        <g stroke={OUTLINE} strokeWidth={2.6}>
          <rect x="34" y="80" width="8" height="30" rx="3" fill="#2A2F3D" />
          <rect x="58" y="80" width="8" height="30" rx="3" fill="#2A2F3D" />
        </g>
      );
    default:
      return null;
  }
}

/**
 * One construction-paper kid, drawn into a 100x150 local box.
 *
 * Emits a bare `<g>` so callers can place it with a transform inside a scene's
 * coordinate space. The head is deliberately oversized relative to the body —
 * that proportion is doing most of the work in making the style read.
 */
export function CutoutCharacter({ character, expression, talking, className }: Props) {
  const rattled = expression === 'shock' || expression === 'yell';

  return (
    <g className={className}>
      <g className={rattled ? 'cutout-shake' : 'cutout-bob'}>
        {/* legs and shoes */}
        <g stroke={OUTLINE} strokeWidth={STROKE}>
          <rect x="34" y="112" width="13" height="26" rx="4" fill={character.bottom} />
          <rect x="53" y="112" width="13" height="26" rx="4" fill={character.bottom} />
          <rect x="30" y="134" width="19" height="9" rx="4" fill={OUTLINE} />
          <rect x="51" y="134" width="19" height="9" rx="4" fill={OUTLINE} />
        </g>

        {/* arms and torso */}
        <g stroke={OUTLINE} strokeWidth={STROKE}>
          <rect x="16" y="78" width="12" height="30" rx="6" fill={character.top} />
          <rect x="72" y="78" width="12" height="30" rx="6" fill={character.top} />
          <circle cx="22" cy="110" r="6.5" fill={character.skin} />
          <circle cx="78" cy="110" r="6.5" fill={character.skin} />
          <rect x="26" y="74" width="48" height="40" rx="9" fill={character.top} />
        </g>

        <BodyAccessory character={character} />

        {/* head */}
        <g stroke={OUTLINE} strokeWidth={STROKE}>
          <ellipse cx="50" cy="46" rx="32" ry="30" fill={character.skin} />
        </g>
        <Hair character={character} />
        <Eyes expression={expression} skin={character.skin} />
        <Brows expression={expression} />
        <FaceAccessory character={character} />
        <g className={talking ? 'cutout-talk' : undefined} style={{ transformOrigin: '50px 68px' }}>
          <Mouth expression={expression} />
        </g>
      </g>
    </g>
  );
}
