/*
 *数仓排序方法
 */
import Vue from 'vue'

function complexQueryDec0(row, column, cellValue) { // 千分位 0位小数
  if (cellValue == null) {
    return ''
  }
  return Number(cellValue) == 0 ? '0' : Vue.prototype.gfnFormatDecThou(cellValue, 0)
}

function complexQueryDec2(row, column, cellValue) { // 千分位 2位小数
  if (cellValue == null) {
    return ''
  }
  return Number(cellValue) == 0 ? '0.00' : Vue.prototype.gfnFormatDecThou(cellValue, 2)
}

function complexQueryDec3(row, column, cellValue) { // 千分位 3位小数
  if (cellValue == null) {
    return ''
  }
  return Number(cellValue) == 0 ? '0.000' : Vue.prototype.gfnFormatDecThou(cellValue, 3)
}

function complexQueryDec5(row, column, cellValue) { // 千分位 5位小数
  if (cellValue == null) {
    return ''
  }
  return Number(cellValue) == 0 ? '0.00000' : Vue.prototype.gfnFormatDecThou(cellValue, 5)
}

function complexQueryDec7(row, column, cellValue) { // 千分位 7位小数
  if (cellValue == null) {
    return ''
  }
  return Number(cellValue) == 0 ? '0.0000000' : Vue.prototype.gfnFormatDecThou(cellValue, 7)
}

export {complexQueryDec0, complexQueryDec2, complexQueryDec3, complexQueryDec5, complexQueryDec7}