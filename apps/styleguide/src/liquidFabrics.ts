import type { LiquidThemeName } from '@hifi/liquid'

export interface LiquidFabric {
  readonly backgroundColor: string
  readonly backgroundImage: string
  readonly backgroundSize: string
  readonly pageShade: number
  readonly waveA: string
  readonly waveB: string
  readonly waveC: string
}

export const liquidFabrics: Readonly<Record<LiquidThemeName, LiquidFabric>> = {
  clear: {
    backgroundColor: '#07172d',
    backgroundImage:
      'linear-gradient(90deg, transparent 0 15%, rgb(56 201 255 / 0.85) 15% 16%, transparent 16% 47%, rgb(255 85 177 / 0.78) 47% 48%, transparent 48%), linear-gradient(rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.12) 1px, transparent 1px), radial-gradient(circle at 82% 28%, #604bff, transparent 26%)',
    backgroundSize: 'auto, 36px 36px, 36px 36px, auto',
    pageShade: 0.16,
    waveA: '#38c9ff',
    waveB: '#ff55b1',
    waveC: '#604bff',
  },
  tinted: {
    backgroundColor: '#432468',
    backgroundImage:
      'linear-gradient(180deg, rgb(255 255 255 / 0.2), transparent 44%), linear-gradient(105deg, #ff4778 0%, #ffbe4b 22%, #53e6a9 43%, #31bfff 64%, #755cff 82%, #f35ad2 100%)',
    backgroundSize: 'auto, auto',
    pageShade: 0.46,
    waveA: '#ff4778',
    waveB: '#ffbe4b',
    waveC: '#31bfff',
  },
  frosted: {
    backgroundColor: '#c9e7f3',
    backgroundImage:
      'linear-gradient(125deg, transparent 0 52%, rgb(255 255 255 / 0.64) 52% 54%, transparent 54%), linear-gradient(90deg, #f16b8b 0 24%, transparent 24% 72%, #2c8fff 72% 100%)',
    backgroundSize: 'auto, auto',
    pageShade: 0.68,
    waveA: '#f16b8b',
    waveB: '#2c8fff',
    waveC: '#e4fbff',
  },
  prismatic: {
    backgroundColor: '#0c1c38',
    backgroundImage:
      'linear-gradient(145deg, rgb(221 248 255 / 0.9), transparent 24% 68%, rgb(191 232 255 / 0.72)), conic-gradient(from 218deg at 52% 118%, #74eaff, #8b7dff 18%, #ff73c8 32%, #ffc76c 45%, #8affca 60%, #64cfff 76%, #74eaff)',
    backgroundSize: 'auto, auto',
    pageShade: 0.48,
    waveA: '#74eaff',
    waveB: '#ff73c8',
    waveC: '#ffc76c',
  },
  blurred: {
    backgroundColor: '#06162c',
    backgroundImage:
      'radial-gradient(circle at 18% 38%, #ff4eb8 0 12%, transparent 28%), radial-gradient(circle at 78% 64%, #20d7df 0 15%, transparent 34%), linear-gradient(115deg, #16265c, #071025 62%)',
    backgroundSize: 'auto, auto, auto',
    pageShade: 0.12,
    waveA: '#ff4eb8',
    waveB: '#20d7df',
    waveC: '#526dff',
  },
  smoked: {
    backgroundColor: '#d8f3ff',
    backgroundImage:
      'linear-gradient(90deg, #f7fdff 0 17%, #37c5ef 17% 20%, #f7fdff 20% 48%, #ff769f 48% 51%, #f7fdff 51% 100%), repeating-linear-gradient(0deg, transparent 0 23px, rgb(7 29 48 / 0.14) 23px 24px)',
    backgroundSize: 'auto, auto',
    pageShade: 0.72,
    waveA: '#37c5ef',
    waveB: '#ff769f',
    waveC: '#eafaff',
  },
}
