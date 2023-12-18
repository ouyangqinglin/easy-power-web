
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from '@sub/i18n/enUS/index'
import zhLocale from '@sub/i18n/zhCN/index'
import ElementLocale from 'element-ui/lib/locale'
import elementEnLocal  from 'element-ui/lib/locale/lang/en'
import elementZhCNLocal  from 'element-ui/lib/locale/lang/zh-CN'
import { getStorage, getBrowserLang } from '@sub/utils/language'
// 获取当前语言（初始化时localStorage里没有存语言，默认为浏览器当前的语言）
const lang = getStorage('lang') || getBrowserLang()
// console.log('i18n', lang)
ElementLocale.i18n((key, value) => i18n.t(key, value))

Vue.use(VueI18n);
const messages = {
  en_US: {
    ...enLocale,
    ...elementEnLocal
  },
  zh_CN: {
    ...zhLocale,
    ...elementZhCNLocal
  }
}

const i18n = new VueI18n({
  locale: lang, // 通过this.$i18n.locale的值实现语言切换
  messages,
  silentFallbackWarn: true,
});


export default i18n
