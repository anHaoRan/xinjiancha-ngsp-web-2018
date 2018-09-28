// 正则
export default {
  install (Vue, options) {
    // 小数正则，适用于三位小数
    Vue.prototype.gfnFloatReg3 = (value) => {
      if (value) {
        return /^([1-9]\d*|0)(\.\d{1,3})?$/.test(value)
      }
      return true
    }
    // 验证[A-Z]#########格式的代码，适用于多个用逗号分隔的上述代码的验证
    Vue.prototype.gfnStockCodeReg = (value) => {
      let reg = /^[A-Z]\d{9}$/
      if (value.indexOf(',') === -1) {
        return reg.test(value)
      }
      let arr = value.split(','), flag = true
      arr.forEach(function (item) {
        if (item) {
          if (!reg.test(item)) {
            flag = false
          }
        }
      })
      return flag
    }
    Vue.prototype.gfnIntNum = (value, maxNum) => {
      if (maxNum == null) {
        return /^[0-9]\d*$/.test(value)
      }
      return /^[0-9]\d*$/.test(value) && ((value - 0) <= (maxNum - 0))
    }

    // Element-UI rules validation
    // 排除特殊字符
    Vue.prototype.gfnNoSpecialReg = (rule, value, callback) => {
      let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im // eslint-disable-line
      let regCn = /[·！#（——）：；”“’、，《。》？【】[\]]/im
      if (regEn.test(value) || regCn.test(value)) {
        callback(new Error('有非法字符'))
      } else {
        callback()
      }
    }
  }
}
