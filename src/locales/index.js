import { createI18n } from 'vue-i18n'
import en from './en.json'
import rw from './rw.json'

const savedLocale = typeof localStorage !== 'undefined' ? localStorage.getItem('ac-locale') : null

const i18n = createI18n({
  legacy: false,
  locale: savedLocale || 'en',
  fallbackLocale: 'en',
  messages: { en, rw },
})

export default i18n
