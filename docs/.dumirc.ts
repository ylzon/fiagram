import path from 'node:path'
import { defineConfig } from 'dumi'

export default defineConfig({
  outputPath: 'docs-dist',
  favicons: [
    '/logo.png',
  ],
  themeConfig: {
    name: 'Fiagram',
    logo: '/logo.png',
    hd: { rules: [] },
    rtl: false,
    footer: `Open-source MIT Licensed | Copyright © 2024-present
<br />
Powered by Allenyan`,
    prefersColor: { default: 'auto' },
    socialLinks: {
      github: 'https://github.com/ylzon/fiagram',
    },
  },
  mfsu: false,
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'EN' },
  ],
  alias: {
    '@fiagram/react': path.resolve(__dirname, '../packages/react'),
  },
})
