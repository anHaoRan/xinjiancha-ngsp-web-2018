export default {
  install (Vue, options) {
    Vue.prototype.gfnSortByNumber = (a, b) => {
      return sortByNumber(a, b)
    }

    Vue.prototype.gfnSortColByNumber = (field, curr, next) => {
      if (field == null) {
        console.error('[Element-UI Table排序]filed不能为空!')
      }
      // 适配范围排序 如：500-1000,1000-2000
      if (curr.toString().indexOf('-') !== -1 && next.toString().indexOf('-') !== -1) {
        curr = curr.split('-')[0]
        next = next.split('-')[0]
      }
      let a = curr == null ? null : curr[field]
      let b = next == null ? null : next[field]
      return sortByNumber(a, b)
    }

    Vue.prototype.gfnSortByChineseCharacters = (field, curr, next) => {
      if (field == null) {
        console.error('[Element-UI Table排序]filed不能为空!')
      }
      let a = curr == null ? null : curr[field]
      let b = next == null ? null : next[field]
      return sortByChineseCharacters(a, b)
    }

    Vue.prototype.gfnSortColByDetailTime = (field, curr, next) => {
      if (field == null) {
        console.error('[Element-UI Table排序]filed不能为空!')
      }
      // 适配范围排序 如：500-1000,1000-2000
      if (curr.toString().indexOf('-') !== -1 && next.toString().indexOf('-') !== -1) {
        curr = curr.split('-')[0]
        next = next.split('-')[0]
      }
      let a = curr == null ? null : curr[field]
      let b = next == null ? null : next[field]
      return sortByDetailTime(a, b)
    }
  }
}

function sortByDetailTime (a, b) {
  if (a === '' || a == null) { // 针对空格和0的排序
    return -1
  }
  if (b === '' || b == null) {
    return 1
  }
  a = Number(a.replace(/:/g, '')) // 去除包含的冒号
  b = Number(b.replace(/:/g, ''))
  return a - b
}

function sortByNumber (a, b) {
  if (a === '' || a == null) { // 针对空格和0的排序
    return -1
  }
  if (b === '' || b == null) {
    return 1
  }

  if (typeof a != 'number') {
    a = Number(a.replace(/,/g, '')) // 去除包含的逗号
  }

  if (typeof b != 'number') {
    b = Number(b.replace(/,/g, ''))
  }

  return a - b
}

//  按照拼音首字母排序，主要用于table中名称列的排序
function sortByChineseCharacters (a, b) {
  if (a) {
    return a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'})
  }
}
