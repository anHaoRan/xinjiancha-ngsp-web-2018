export function add0 (m) { return m < 10 ? '0' + m : m }

export function format (params) {
  const now = new Date(params)
  const y = now.getFullYear().toString()
  const d = now.getDate().toString()
  const m = (now.getMonth() + 1).toString()
  const h = now.getHours().toString()
  const mm = now.getMinutes().toString()
  const s = now.getSeconds().toString()
  return y + add0(m) + add0(d) + ' ' + add0(h) + add0(mm) + add0(s)
}

export function dateformat (params) {
  const now = new Date(params)
  const y = now.getFullYear().toString()
  const d = now.getDate().toString()
  const m = (now.getMonth() + 1).toString()
  if (add0(m) === 'NaN' && add0(y) === 'NaN' && add0(d) === 'NaN') {
    return ''
  }
  return y + '-' + add0(m) + '-' + add0(d)
}

export function timeformat (params) {
  if (!params) {
    return ''
  }
  return params.split('-').join(':')
}

export function tabletimeformat (params) {
  const now = new Date(params)
  const y = now.getFullYear().toString()
  const d = now.getDate().toString()
  const m = (now.getMonth() + 1).toString()
  const h = now.getHours().toString()
  const mm = now.getMinutes().toString()
  const s = now.getSeconds().toString()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

//  日期字符串增加分隔符  20130101 => 2013-01-01
export function dateStringAddSeparator (dateString, separator) {
  if (dateString.indexOf('-') > -1 || dateString.indexOf('/') > -1) {
    return dateString
  }
  separator = separator || '-'
  return `${dateString.substr(0, 4)}${separator}${dateString.substr(4, 2)}${separator}${dateString.substr(6)}`
}
