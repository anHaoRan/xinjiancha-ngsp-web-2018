const getUrlParam = (pUrl) => {
  let query = {}, i, params, param
  if (pUrl.indexOf('?') >= 0) pUrl = pUrl.split('?')[1]
  else return query
  params = pUrl.split('&')
  for (i = 0; i < params.length; i++) {
    param = params[i].split('=')
    query[param[0]] = param[1]
  }
  return query
}
export {
  getUrlParam
}
