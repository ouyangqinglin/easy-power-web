
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from '@sub/i18n/enUS/index'
import zhLocale from '@sub/i18n/zhCN/index'
import ElementLocale from 'element-ui/lib/locale'
import elementEnLocal  from 'element-ui/lib/locale/lang/en'
import elementZhCNLocal  from 'element-ui/lib/locale/lang/zh-CN'

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
  locale: localStorage.getItem('lang') || 'en_US', // 通过this.$i18n.locale的值实现语言切换
  messages,
});


export default i18n
