import {
  getStorage,
  setStorage,
  getBrowserLang
}
  from '@sub/utils/language'

export default {
  namespaced: true,
  state: {
    language: getStorage('lang') || getBrowserLang()
  },
  mutations: {
    setLanguage: (state, language) => {
      state.language = language
      setStorage('lang', language)
    }
  }
}
