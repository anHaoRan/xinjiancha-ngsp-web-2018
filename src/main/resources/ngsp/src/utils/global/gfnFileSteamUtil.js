import {get, post} from '../api'
import {requestPrefix} from '../constants'
import {getAccessToken} from '../storageUtil'

function exportWithForm(url, params) {
  let form = document.createElement('form')
  form.style.display = 'none'
  form.action = url
  form.method = 'POST'
  document.body.appendChild(form)

  let input = document.createElement('input')
  input.type = 'hidden'
  input.name = 'params'
  input.value = JSON.stringify(params)
  form.appendChild(input)

  form.submit()
}

export default {
  install(Vue, options) {
    // 弃用!!
    // 辗转导出文件
    // 先保存参数，再导出
    Vue.prototype.gfnExportFile = (url, params) => {
      post(requestPrefix + '/admin/export/v1/params/prepare', params).then((res) => {
        window.location.href = requestPrefix + url + '?id=' + res + '&access_token=' + getAccessToken()
      })
    }

    // 导出文件
    // 不传递表头等复杂信息，使用普通的GET方式
    Vue.prototype.gfnExportFileSimple = (url) => {
      window.location.href = requestPrefix + url + '&access_token=' + getAccessToken()
    }

    // 只支持POST方法
    // 造form请求导出文件
    Vue.prototype.gfnExportFileWithForm = (url, params) => {
      url = requestPrefix + url + '?access_token=' + getAccessToken()
      exportWithForm(url, params)
    }

    // 下载文件
    // 用于从统一文件存储服务下载文件
    // 这里的fileId来自于统一文件存储
    Vue.prototype.gfnDownloadFile = (fileId, fileName) => {
      window.location.href = requestPrefix + '/admin/v1/file/download?fileId=' + fileId + '&fileName=' + fileName + '&access_token=' + getAccessToken()
    }

    // 获取下载文件的路径
    // 用于从统一文件存储服务下载文件
    // 这里的fileId来自于统一文件存储
    Vue.prototype.gfnGetDownloadFileUrl = (fileId, fileName) => {
      return requestPrefix + '/admin/v1/file/download?fileId=' + fileId + '&fileName=' + fileName + '&access_token=' + getAccessToken()
    }

    // 用于下载模板文件
    // params = {code: "**"}
    // 模板通过系统管理里的“模板管理”进行配置管理，code来源于此。
    Vue.prototype.gfnDownloadTemplateFile = (params) => {
      get(requestPrefix + '/admin/v1/template/code', params).then((res) => {
        if (res) {
          window.location.href = requestPrefix + '/admin/v1/file/download?fileId=' + res.fileId + '&fileName=' + res.fileName + '&access_token=' + getAccessToken()
        } else {
          Vue.prototype.$message.error('请先到系统管理-模板管理中上传模板文件再操作')
        }
      })
    }

    // 获取上传文件的路径
    // 用于保存文件（非上传参数）
    Vue.prototype.gfnGetUploadFileUrl = () => {
      return requestPrefix + '/zuul/admin/v1/file/upload?position=PUB&access_token=' + getAccessToken()
    }

    // 获取上传模板文件的路径
    // 用于保存模板文件（非上传参数）
    // 一般不用这个
    Vue.prototype.gfnGetUploadTemplateFileUrl = () => {
      return requestPrefix + '/zuul/admin/v1/file/upload?position=SYS&access_token=' + getAccessToken()
    }

    // 获取上传Excel，返回1个sheet的基本类型参数的路径
    Vue.prototype.gfnGetUploadExcelReturnBasicUrl = () => {
      return requestPrefix + '/zuul/admin/upload/v1/file/return-basic/excel?&access_token=' + getAccessToken()
    }

    // 获取上传Excel，返回多个sheet的POJO类型参数的路径
    Vue.prototype.gfnGetUploadExcelReturnPojoUrl = () => {
      return requestPrefix + '/zuul/admin/upload/v1/file/return-object/excel?&access_token=' + getAccessToken()
    }

    // 获取上传txt/csv，返回POJO类型参数的路径
    Vue.prototype.gfnGetUploadFlatReturnPojoUrl = () => {
      return requestPrefix + '/zuul/admin/upload/v1/file/return-object/flat?&access_token=' + getAccessToken()
    }

    // 获取上传txt/csv，返回基本类型参数的路径
    Vue.prototype.gfnGetUploadFlatReturnBasicUrl = () => {
      return requestPrefix + '/zuul/admin/upload/v1/file/return-basic/flat?&access_token=' + getAccessToken()
    }

    // 打开PDF预览
    Vue.prototype.openPDFPreview = (that, url) => {
      that.openNewWindow(url, `#/pdf-preview/${encodeURIComponent(url)}`)
    }
  }
}
