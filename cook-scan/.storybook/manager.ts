import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

const theme = create({
  base: 'light',
  brandTitle: 'CookScan UI',
  brandUrl: '/',
  colorPrimary: '#059669',
  colorSecondary: '#059669',
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,
  textColor: '#171717',
  textMutedColor: '#64748b',
  barTextColor: '#171717',
  barSelectedColor: '#059669',
  barBg: '#ffffff',
})

addons.setConfig({
  theme,
})
