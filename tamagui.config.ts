import { createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'

const interFont = createInterFont({
  face: {
    normal: { normal: 'Inter' },
  },
})

const config = createTamagui({
  fonts: {
    body: interFont,
    heading: interFont,
  },
  tokens,
  themes,
  shorthands,
  defaultFont: 'body',
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config 