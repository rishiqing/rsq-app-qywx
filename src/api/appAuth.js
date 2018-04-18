/**
 * 第三方信息api
 */
import { Promise } from 'es6-promise'
import Vue from 'vue'
import url from 'url'
import util from 'ut/jsUtil'
import mapping from './urlMapping'

export default {
  /**
   * 根据传入的openid数组获取对应的rsqid
   */
  getOpenidMap (props) {
    return new Promise((resolve, reject) => {
      var request = url.resolve(window.rsqConfig.authServer, mapping.AUTH_TO_RSQID) + '?corpid=' + props.corpId
      var params = props.idArray
      // alert('request' + request)
      Vue.http.post(request, JSON.stringify(params))
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  /**
   * 根据传入的rsqid数组获取对应的userid
   * @returns {*}
   */
  getRsqidMap (props) {
    return new Promise((resolve, reject) => {
      var request = url.resolve(window.rsqConfig.authServer, mapping.AUTH_TO_USERID) + '?corpid=' + props.corpId
      var params = props.idArray
      Vue.http.post(request, JSON.stringify(params))
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  sendToConversation (props) {
    return new Promise((resolve, reject) => {
      var request = url.resolve(window.rsqConfig.authServer, mapping.SEND_TO_CONV) + '?' + util.combineUrlParams(props.urlParams)
      Vue.http.post(request, JSON.stringify(props.data))
        .then(res => {
          resolve(res.json())
        }, err => {
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  sendAsyncCorpMessage (props) {
    // alert(JSON.stringify(props))
    return new Promise((resolve, reject) => {
      var request = window.rsqConfig.authServer + mapping.SEND_NOTIFY + '?' + util.combineUrlParams(props.urlParams)
      // var request = url.resolve(window.rsqConfig.authServer, mapping.SEND_NOTIFY) + '?' + util.combineUrlParams(props.urlParams)
      // alert('data' + JSON.stringify(props.data))
      Vue.http.post(request, JSON.stringify(props.data))
        .then(res => {
          // alert('成功' + JSON.stringify(res))
          resolve(res.json())
        }, err => {
          // alert('失败' + JSON.stringify(err))
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  },
  sendRemind (props) {
    return new Promise((resolve, reject) => {
      var request = window.rsqConfig.authServer + mapping.SEND_QYWX_REMIND + '?' + util.combineUrlParams(props.urlParams)
      // var request = url.resolve(window.rsqConfig.authServer, mapping.SEND_QYWX_REMIND) + '?' + util.combineUrlParams(props.urlParams)
      Vue.http.post(request, JSON.stringify(props.data))
        .then(res => {
          // alert('成功' + JSON.stringify(res))
          resolve(res.json())
        }, err => {
          // alert('失败' + JSON.stringify(err))
          window.rsqadmg.error(JSON.stringify(err))
          reject(err)
        })
    })
  }
}
