import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from '@fiagram/core/src/locales/zh.json'
import en from '@fiagram/core/src/locales/en.json'

const resources = {
  zh,
  en,
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  })

export { i18n }
