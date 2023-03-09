import Vue from 'vue'

Vue.prototype.TYPE_JUD = function (value, type) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase()
}
/**
 * 格式化日期
 * @param {string} fmt - 格式化字符串
 * @param {Date} date - Date对象
 * @example formatDate('yy-M-d h:m:s', new Date())
 * @desc 输出18-1-9 9:1:1
 * @example formatDate('yyyy-MM-dd h:m:s', new Date())
 * @desc 输出2018-01-09 09:01:01
 */
Vue.prototype.DATE_FORMAT = function (fmt, date) {
  if (Vue.prototype.TYPE_JUD(date, 'number')) date = new Date(date)
  if (Vue.prototype.TYPE_JUD(date, 'string')) date = new Date(date.replace(/-/g, '/'))
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
