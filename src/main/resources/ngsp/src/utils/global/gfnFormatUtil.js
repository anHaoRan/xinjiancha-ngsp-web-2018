import {
  securityStyle,
  securityColor
} from './../constants'

let d3 = require('d3-format')
const WAN = 10000
const YI = 100000000

function fnFormatDecThou (value, f) {
  let val = fnFormatValHasComma(value)
  if (f == null) {
    return d3.format(',')(val)
  }
  let pattern = ',.' + f + 'f'
  return d3.format(pattern)(val)
}

// 若后台返回带有千分位的字符串类型的数字，需用以下方法处理后再format
function fnFormatValHasComma (value) {
  let val = value
  if (typeof value === 'string' && value.indexOf(',') !== -1) {
    val = value.split(',').join('')
  }
  return val
}

function fnFormatDecimal (value, f) {
  if (f == null) {
    return value
  }
  let pattern = '.' + f + 'f'
  return d3.format(pattern)(value)
}

export default {
  install (Vue, options) {
    // 格式化小数位数
    Vue.prototype.gfnFormatDecimal = (value, f) => {
      if (f == null) {
        return value
      }
      let pattern = '.' + f + 'f'
      return d3.format(pattern)(value)
    }

    // 格式化千分位
    Vue.prototype.gfnFormatThousands = (value) => {
      return d3.format(',')(value)
    }

    // 格式化千分位和小数位
    // f为保留小数位数
    Vue.prototype.gfnFormatDecThou = (value, f) => {
      if (f == null) {
        return d3.format(',')(value)
      }
      let pattern = ',.' + f + 'f'
      return d3.format(pattern)(value)
    }

    // 格式化数据，包括千分位
    // <10000 原始
    // 10000 - 100000000 单位：万
    // 100000000以上单位：亿
    // f为小数位数
    Vue.prototype.gfnFormatNumberUnit = (value, f) => {
      if (typeof value != 'number') {
        value = Number(value)
      }

      if (value < WAN) {
        return {
          value: fnFormatDecimal(value, f),
          unit: ''
        }
      } else if (value < YI) {
        return {
          value: fnFormatDecimal(value / WAN, f),
          unit: '万'
        }
      }
      return {
        value: fnFormatDecimal(value / YI, f),
        unit: '亿'
      }
    }

    // 格式化证券涨跌样式表
    Vue.prototype.gfnFormatSecurityClass = (value) => {
      if (value < 0) {
        return securityStyle.down
      } else if (value > 0) {
        return securityStyle.up
      }
      return securityStyle.zero
    }

    // 格式化证券涨跌颜色
    Vue.prototype.gfnFormatSecurityColor = (value) => {
      if (value < 0) {
        return securityColor.down
      } else if (value > 0) {
        return securityColor.up
      }
      return securityColor.zero
    }

    // 用于 Element UI column fomatter
    // 保留小数位2位
    Vue.prototype.gfnElColFormatDec2 = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecimal(cellValue, 2)
    }

    // 保留小数位2位 专用于涨跌幅和占比加百分比
    Vue.prototype.gfnElColFormatDec2Percent = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecimal(cellValue, 2) + '%'
    }

    // 保留小数位3位
    Vue.prototype.gfnElColFormatDec3 = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecimal(cellValue, 3)
    }

    // 千分位格式化整数
    Vue.prototype.gfnElColFormatDecThou0 = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecThou(cellValue)
    }
    // 千分位格式化，不保留小数
    Vue.prototype.gfnElColFormatDecThouNoneFloat = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecThou(cellValue, 0)
    }

    // 千分位格式化，保留二位小数
    Vue.prototype.gfnElColFormatDecThou = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecThou(cellValue, 2)
    }

    // 千分位格式化，保留三位小数
    Vue.prototype.gfnElColFormatDecThou3 = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      if (cellValue == '合计') {
        return cellValue
      }
      return fnFormatDecThou(cellValue, 3)
    }

    // 格式化亿，带千分位，保留二位小数
    Vue.prototype.gfnElColFormatDecThouYi = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecThou(cellValue / YI, 2)
    }

    // 格式化万，带千分位，保留二位小数
    Vue.prototype.gfnElColFormatDecThouWan = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecThou(cellValue / WAN, 2)
    }

    // 格式化万，带千分位，保留三位小数
    Vue.prototype.gfnElColFormatDecThouWan3 = (row, column, cellValue) => {
      if (!cellValue) {
        return ''
      }
      return fnFormatDecThou(cellValue / WAN, 3)
    }
  }
}
