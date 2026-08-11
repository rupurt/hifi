import { liquidStyles as styles } from './stylex/liquid.stylex'
import { className } from './stylex/shared.stylex'

const PAINT_WAVES = [
  {
    path: 'M-100 590 C360 520 930 650 1540 540',
  },
  {
    path: 'M-100 1810 C390 1720 1010 1845 1540 1740',
  },
  {
    path: 'M-100 3240 C410 3150 950 3290 1540 3180',
  },
  {
    path: 'M-100 4760 C340 4670 990 4800 1540 4680',
  },
  {
    path: 'M-100 6360 C380 6250 940 6410 1540 6280',
  },
] as const

export function LiquidEmissionField() {
  return (
    <svg
      aria-hidden="true"
      className={className(styles.emissionField)}
      preserveAspectRatio="none"
      viewBox="0 0 1440 7200"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="liquid-depth-emission"
          x1="0"
          x2="0"
          y1="0"
          y2="7200"
        >
          <stop offset="0%" stopColor="var(--liquid-wave-a)" stopOpacity="0" />
          <stop offset="4%" stopColor="var(--liquid-wave-a)" stopOpacity="0.08" />
          <stop offset="7%" stopColor="var(--liquid-wave-a)" stopOpacity="0.72" />
          <stop offset="8.5%" stopColor="var(--liquid-wave-b)" stopOpacity="1" />
          <stop offset="10.5%" stopColor="var(--liquid-wave-c)" stopOpacity="0.7" />
          <stop offset="15%" stopColor="var(--liquid-wave-c)" stopOpacity="0.02" />
          <stop offset="20%" stopColor="var(--liquid-wave-b)" stopOpacity="0.02" />
          <stop offset="24%" stopColor="var(--liquid-wave-c)" stopOpacity="0.7" />
          <stop offset="25.5%" stopColor="var(--liquid-wave-a)" stopOpacity="1" />
          <stop offset="28%" stopColor="var(--liquid-wave-b)" stopOpacity="0.64" />
          <stop offset="33%" stopColor="var(--liquid-wave-b)" stopOpacity="0.02" />
          <stop offset="39%" stopColor="var(--liquid-wave-c)" stopOpacity="0.02" />
          <stop offset="44%" stopColor="var(--liquid-wave-a)" stopOpacity="0.7" />
          <stop offset="45.5%" stopColor="var(--liquid-wave-b)" stopOpacity="1" />
          <stop offset="48%" stopColor="var(--liquid-wave-c)" stopOpacity="0.72" />
          <stop offset="53%" stopColor="var(--liquid-wave-c)" stopOpacity="0.02" />
          <stop offset="59%" stopColor="var(--liquid-wave-a)" stopOpacity="0.02" />
          <stop offset="64%" stopColor="var(--liquid-wave-c)" stopOpacity="0.68" />
          <stop offset="66%" stopColor="var(--liquid-wave-a)" stopOpacity="1" />
          <stop offset="69%" stopColor="var(--liquid-wave-b)" stopOpacity="0.66" />
          <stop offset="73%" stopColor="var(--liquid-wave-b)" stopOpacity="0.02" />
          <stop offset="80%" stopColor="var(--liquid-wave-c)" stopOpacity="0.02" />
          <stop offset="86%" stopColor="var(--liquid-wave-b)" stopOpacity="0.7" />
          <stop offset="88%" stopColor="var(--liquid-wave-c)" stopOpacity="1" />
          <stop offset="91%" stopColor="var(--liquid-wave-a)" stopOpacity="0.64" />
          <stop offset="96%" stopColor="var(--liquid-wave-a)" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="liquid-trough-radiance"
          x1="0"
          x2="0"
          y1="0"
          y2="7200"
        >
          <stop offset="0%" stopColor="var(--liquid-wave-a)" />
          <stop offset="16%" stopColor="var(--liquid-wave-c)" />
          <stop offset="32%" stopColor="var(--liquid-wave-b)" />
          <stop offset="50%" stopColor="var(--liquid-wave-a)" />
          <stop offset="68%" stopColor="var(--liquid-wave-c)" />
          <stop offset="84%" stopColor="var(--liquid-wave-b)" />
          <stop offset="100%" stopColor="var(--liquid-wave-a)" />
        </linearGradient>
      </defs>

      <rect
        className={className(styles.emissionTrough)}
        fill="url(#liquid-trough-radiance)"
        height="7200"
        width="1440"
      />
      <g className={className(styles.emissionFar)}>
        {PAINT_WAVES.map((wave) => (
          <path
            d={wave.path}
            fill="none"
            key={wave.path}
            stroke="rgb(218 226 233 / 0.24)"
            strokeLinecap="round"
            strokeWidth="760"
          />
        ))}
      </g>
      <g className={className(styles.emissionMid)}>
        {PAINT_WAVES.map((wave) => (
          <path
            d={wave.path}
            fill="none"
            key={wave.path}
            stroke="url(#liquid-depth-emission)"
            strokeLinecap="round"
            strokeWidth="520"
          />
        ))}
      </g>
      <g className={className(styles.emissionNear)}>
        {PAINT_WAVES.map((wave) => (
          <path
            d={wave.path}
            fill="none"
            key={wave.path}
            stroke="url(#liquid-depth-emission)"
            strokeLinecap="round"
            strokeWidth="260"
          />
        ))}
      </g>
    </svg>
  )
}
