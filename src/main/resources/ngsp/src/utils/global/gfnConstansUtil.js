import { requestPrefix } from '../constants'

export default {
  install (Vue, options) {
    Vue.prototype.gfnGetRequestPrefix = () => {
      return requestPrefix
    }
    Vue.prototype.getUrlParam = (pUrl) => {
      let query = {}, i, params, param
      if (pUrl.indexOf('?') >= 0) {
        pUrl = pUrl.split('?')[1]
      } else {
        return query
      }
      params = pUrl.split('&')
      for (i = 0; i < params.length; i++) {
        param = params[i].split('=')
        query[param[0]] = decodeURIComponent(param[1])
      }
      return query
    }
    Vue.prototype.getDigitalToChinese = (num) => {
      let arr = [
        ['1', '一'],
        ['2', '二'],
        ['3', '三'],
        ['4', '四'],
        ['5', '五'],
        ['6', '六'],
        ['7', '七'],
        ['8', '八'],
        ['9', '九'],
        ['10', '十']
      ]
      let map = new Map(arr)
      return map.get(num.toString())
    }
    Vue.prototype.openNewWindow = (name, url) => {
      window.open(url, name)
    }
    Vue.prototype.closeNewWindow = (name, url) => {
      window.close()
    }
    Vue.prototype.gfnEchartShowLoading = (echart) => {
      echart.showLoading('default', {
          maskColor: 'rgba(0,0,0,0.6)',
          textColor: 'rgba(255,255,255,0.6)',
          color: 'rgba(255,255,255,0.6)'
        }
      )
    }
  }
}
