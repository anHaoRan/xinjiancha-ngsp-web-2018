import router from '../router/index'
import {Message} from 'element-ui'
import {removeAuthedInfos} from './storageUtil.js'

/**
 * @content: 全局的基于Vue-Resource的ajax预处理
 * @export
 * @param {any} request
 * @param {any} next
 * @returns
 */
// 全局错误处理，全局loading
export default function (request, next) {
    //  当用到当前组件对象时, 使用 GlobalModel.RootVue
    next((res) => {
        if (res.status != 200) {
            if (res.error === 'invalid_token' || res.status === 401) {
                Message.error('您的登陆已过期，请重新登录!')
                removeAuthedInfos()
                router.push({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
                })
            } else {
                switch (res.status) {
                    case 404:
                        Message.error('请求资源未找到!')
                        router.push({
                            path: '/404'
                        })
                        break
                    case 415:
                        Message.error('请求参数类型错误!')
                        break
                    case 500:
                        Message.error('系统内部错误!')
                        break
                    default:
                        Message.error(res.message)
                        break
                }
            }
        }
        return res;
    })
}