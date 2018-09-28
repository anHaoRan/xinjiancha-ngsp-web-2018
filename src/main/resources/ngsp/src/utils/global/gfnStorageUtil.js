import { getTheme, setTheme, getUsername, getRealName } from '../storageUtil.js'

export default {
  install (Vue, options) {
    Vue.prototype.gfnGetTheme = () => {
      return getTheme()
    }

    Vue.prototype.gfnSetTheme = (theme) => {
      setTheme(theme)
    }

    Vue.prototype.gfnGetUsername = () => {
      return getUsername()
    }

    Vue.prototype.gfnGetRealName = () => {
      return getRealName()
    }
  }
}
