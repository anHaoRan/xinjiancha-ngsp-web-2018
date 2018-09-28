const keyAccessToken = 'access_token'
const keyRefreshToken = 'refresh_token'
const keyTokenType = 'token_type'
const keyUsername = 'username'
const keyRealName = 'real_name'
const keyTheme = 'theme'

/*  LocalStorage  */
export function getLocalStore (key) {
  if (!window.localStorage) {
    console.error('不支持LocalStorage!')
    return
  }
  // eslint-disable-next-line
  return window.localStorage.getItem(key)
}

export function setLocalStore (key, value) {
  if (!window.localStorage) {
    console.error('不支持LocalStorage!')
    return
  }
  window.localStorage.setItem(key, value)
}

export function removeLocalStore (key) {
  if (!window.localStorage) {
    console.error('不支持LocalStorage!')
    return
  }
  window.localStorage.removeItem(key)
}

/*  SessionStorage  */
export function getSessionStore (key) {
  if (!window.sessionStorage) {
    console.error('不支持sessionStorage!')
    return
  }
  // eslint-disable-next-line
  return window.sessionStorage.getItem(key)
}

export function setSessionStore (key, value) {
  if (!window.sessionStorage) {
    console.error('不支持sessionStorage!')
    return
  }
  window.sessionStorage.setItem(key, value)
}

export function removeSessionStore (key) {
  if (!window.sessionStorage) {
    console.error('不支持sessionStorage!')
    return
  }
  window.sessionStorage.removeItem(key)
}

/*  authed infos  */
export function saveAuthedInfos (authInfo, username) {
  setLocalStore(keyAccessToken, authInfo.access_token)
  setLocalStore(keyRefreshToken, authInfo.refresh_token)
  setLocalStore(keyTokenType, authInfo.token_type)
  setLocalStore(keyUsername, username)
}

export function saveRealName (realname) {
  setLocalStore(keyRealName, realname)
}

export function removeAuthedInfos () {
  removeLocalStore(keyAccessToken)
  removeLocalStore(keyRefreshToken)
  removeLocalStore(keyTokenType)
  removeLocalStore(keyUsername)
  removeLocalStore(keyRealName)
}

export function getAccessToken () {
  return getLocalStore(keyAccessToken)
}

export function getTokenWithType () {
  return getLocalStore(keyTokenType) && getAccessToken() ? getLocalStore(keyTokenType) + ' ' + getAccessToken() : undefined
}

export function getUsername () {
  return getLocalStore(keyUsername)
}

export function getRealName () {
  return getLocalStore(keyRealName)
}

/*  theme */
export function getTheme () {
  let theme = getLocalStore(keyTheme)
  theme = theme == null ? 'theme_dark' : theme
  return theme
}

export function setTheme (theme) {
  setLocalStore(keyTheme, theme)
}
