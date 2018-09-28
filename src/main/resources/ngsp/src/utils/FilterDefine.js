import Vue from 'vue'
import moment from 'moment'

//  把数字四舍五入为指定小数位数的小数
//  num可传int或string,不传为2
Vue.filter('toFixed', function (value, num) {
  if (num !== 0 || num === '0') {
    num = (num && (num % 1 === 0) && num > 0) ? parseInt(num) : 2
  }
  if (isNaN(value)) {
    return value
  }
  return Number(value).toFixed(num)
})

Vue.filter('dateFormat', function (date, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(format)
})
