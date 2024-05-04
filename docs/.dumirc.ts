import { defineConfig } from 'dumi'

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Fiagram',
    logo: '/logo.png',
  },
  mfsu: false,
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'EN' },
  ],
})
