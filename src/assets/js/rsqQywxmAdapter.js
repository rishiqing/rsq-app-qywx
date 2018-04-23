function rsqChk(fun, p){
  if(typeof fun == 'function'){
    fun.apply(null, p);
  }
}
function rsqNvl(orgVal, defValue){
  return null === orgVal || undefined === orgVal ? defValue : orgVal;
}
function padLeft(num){
  return (num > 9 ? '' :'0') + num;
}
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

//写cookies

function setCookie(name,value)
{
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name)
{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

  if(arr=document.cookie.match(reg))

    return decodeURIComponent(arr[2]);
  else
    return null;
}

//删除cookies
function deleteCookie(name)
{
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
rsqadmg.store = {};
rsqadmg.store.app = getJsonFromUrl();
rsqadmg.store.app.appid = rsqadmg.store.app.agentid;
//  oauth对象中的key和value值适用于微信oauth认证，key和value只均不允许修改
rsqadmg.store.oauth = {
  url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  params: {
    appid: rsqadmg.store.app.corpid,
    agentid: rsqadmg.store.app.agentid,
    response_type: 'code',
    scope: 'snsapi_base',
    state: 'STATE',
    redirect_uri: encodeURIComponent(rsqConfig.authServer + 'oauth/after?corpId=' + rsqadmg.store.app.corpid + '&agentId=' + rsqadmg.store.app.agentid)
  }
};
function getOauthUrl(){
  var data = rsqadmg.store.oauth;
  var base = data.url;
  var pArray = [];
  for(var key in data.params){
    if(data.params.hasOwnProperty(key)){
      pArray.push(key + '=' + data.params[key]);
    }
  }
  return base + '?' + pArray.join('&') + '#wechat_redirect';
}
var loading
/**
 * adapter钉钉适配，参加钉钉jssdk文档
 * @link https://open-doc.dingtalk.com/docs/doc.htm
 */
rsqAdapterManager.register({
  auth: function(params){

    //------------------------------------------------------------
    // var authUser = {
    //   "avatar":"http://shp.qpic.cn/bizmp/sfD9v8uDETrX0O6zM5Aw0nkDxHyPPc2on1Ca5qsibmtE6b5lDhvY2TA/",
    //   "corpId":"wxec002534a59ea2e7",
    //   "department":"[8]",
    //   "englishName":"",
    //   "gender":"1",
    //   "id":14,
    //   "isLeaderInDepts":"0",
    //   "name":"毛文强",
    //   "orderInDepts":"[0]",
    //   "position":"",
    //   "rsqPassword":"uiHbhe",
    //   "rsqUserId":"15242",
    //   "rsqUsername":"vjBXU_1520435764814@qywxtest.rishiqing.com",
    //   "status":1,
    //   "userId":"0002"
    // }
    // rsqAdapterManager.ajax.post(rsqConfig.apiServer + 'task/j_spring_security_check', {
    //   j_username: authUser.rsqUsername, j_password: authUser.rsqPassword, _spring_security_remember_me: true
    // }, function(result){
    //   var resJson = JSON.parse(result);
    //   // console.log(JSON.stringify(resJson))
    //   if(resJson.success){
    //     rsqChk(params.success, [resJson, authUser]);
    //   }else{
    //     rsqChk(params.error, [resJson]);
    //   }
    // });
    // return
    //--------------------------------------------------------

    //先取签名
    rsqadmg.execute('sign', {
        success: function(res){
          rsqadmg.execute('init', {
            appId: res.appId,
            "timeStamp": res.timeStamp,
            "nonceStr": res.nonceStr,
            "signature": res.signature,
            success: function(authUser){
              rsqAdapterManager.ajax.post(rsqConfig.apiServer + 'task/j_spring_security_check', {
                j_username: authUser.rsqUsername, j_password: authUser.rsqPassword, _spring_security_remember_me: true
              }, function(result){
                var resJson = JSON.parse(result);
                if(resJson.success){
                  rsqChk(params.success, [resJson, authUser]);
                }else{
                  rsqChk(params.error, [resJson]);
                }
              });
            },
            error: function(authResult){
              rsqChk(params.error, [authResult]);
            }
          });
        }
      }
    );
  },
  sign: function(params){
    var currentUrl = window.location.href.split('#')[0];
    var pa = rsqadmg.store.app;
    rsqAdapterManager.ajax.get(rsqConfig.authServer + 'get_js_config', {
      url: currentUrl,
      corpId: pa.corpid,
      agentId: pa.agentid
    }, function(resSign){
      var resJson = JSON.parse(resSign);
      rsqChk(params.success, [resJson]);
    });
  },
  init: function(params){
    wx.config({
      beta: true,  // 必须这么写，否则在微信插件有些jsapi会有问题
      debug: false,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: params.appId,  // 必填，企业微信的cropID
      timestamp: params.timeStamp, //  必填，生成签名的时间戳
      nonceStr: params.nonceStr,  // 必填，生成签名的随机串
      signature: params.signature,  // 必填，签名，见[附录1](#11974)
      // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      jsApiList: ['getNetworkType', 'hideOptionMenu', 'selectEnterpriseContact']
    });
    wx.ready(function(res){
      var appdata = rsqadmg.store.app;
      var cookieName = appdata.agentid + '-' + appdata.corpid + '-userId';

      //  执行删除cookie，后续在app中删除cookie
      // rsqadmg.exec('deleteUserCache', {
      //   name: cookieName
      // });

      var userCookie = getCookie(cookieName);
      //  从cookie中获取
      if(userCookie){
        //  直接从authServer获取到用户数据
        rsqAdapterManager.ajax.get(rsqConfig.authServer + 'corp/staff', {
          corpId: appdata.corpid, agentId: appdata.agentid, userId: userCookie
        }, function(result){
          var resJson = JSON.parse(result);
          if(resJson.errcode && resJson.errcode != '0'){
            rsqChk(params.error, [resJson]);
          }else{
            rsqChk(params.success, [resJson.user]);
          }
        });
      }else{
        var oauthUrl = getOauthUrl();
        window.location.href = oauthUrl;
      }
    });
    wx.error(function(err){
      //  如果是config:fail，那么就刷新jsapi ticket
      if(err['errMsg'] !== null){
        // alert(JSON.stringify(err));
        var pa = rsqadmg.store.app;
        rsqAdapterManager.ajax.get(rsqConfig.authServer + 'refresh_js_ticket', {
          corpId: pa.corpid,
          agentId: pa.agentid
        }, function(resSign){
          var resJson = JSON.parse(resSign);
          if(!resJson.errcode){
            window.location.reload();
          }
        });
      }
    });
  },
  deleteUserCache: function(params){
    deleteCookie(params.name);
  },
  autoLogin: function(params){

  },
  log: function(params){
    console.log(params.message)
  },
  error: function(params){
    window.alert(JSON.stringify(params))
  },
  setTitle: function(params){
    document.title = params.title;
  },
  setOptionButtons: function(params){
    wx.showOptionMenu();
  },
  hideOptionButtons: function(params){
    wx.hideOptionMenu()
  },

  /**
   * alert提示框
   * @param params.title
   * @param params.message
   * @param params.buttonName
   * @param params.onSuccess
   * @param params.onFail
   */
  alert: function(params){
    weui.alert(params.message);
  },
  /**
   * confirm提示框
   * @param params.title
   * @param params.message
   * @param params.buttonLabels
   * @param params.onSuccess
   * @param params.onFail
   */
  confirm: function(params){
    weui.confirm(
      '',
      function(){
        rsqChk(params.success, []);
      },
      function(){
        rsqChk(params.cancel, []);
      },
      {title: params.message}
    );
  },
  /**
   * prompt提示框
   * @param params.title
   * @param params.message
   * @param params.buttonLabels
   * @param params.onSuccess
   * @param params.onFail
   */
  prompt: function(params){},
  /**
   * 显示加载框
   * @param params.text
   * @param params.showIcon
   * @param params.onSuccess
   * @param params.onFail
   */
  showLoader: function(params){
    loading = weui.loading(params.text, {
      className: 'custom-classname'
    });
  },
  /**
   * 隐藏加载库
   * @param params.onSuccess
   * @param params.onFail
   */
  hideLoader: function(params){
    loading.hide(function() {
      console.log('`loading` has been hidden');
    });
  },
  topTips: function (params) {
    weui.topTips(params.message, 2000);
  },
  /**
   * actionsheet
   * @param params.title
   * @param params.cancelButton
   * @param params.otherButtons
   * @param params.onSuccess
   * @param params.onFail
   */
  actionsheet: function(params){
    if (params.buttonArray.length === 3) {
      weui.actionSheet([
          {
            label: params.buttonArray[0],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 0}]);
            }
          }, {
            label:  params.buttonArray[1],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 1}]);
            }
          }, {
            label: params.buttonArray[2],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 2}]);
            }
          },  {
            label: '取消',
            onClick: function () {
              // rsqChk(params.success, [{buttonIndex: 3}]);
            }
          }
        ],
        {
          className: 'custom-classname',
          onClose: function(){
            console.log('关闭');
          }
        });
    } else {
      weui.actionSheet([
          {
            label: params.buttonArray[0],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 0}]);
            }
          }, {
            label:  params.buttonArray[1],
            onClick: function () {
              rsqChk(params.success, [{buttonIndex: 1}]);
            }
          }, {
            label: '取消',
            onClick: function () {
              console.log('取消');
              // rsqChk(params.success, [{buttonIndex: 3}]);
            }
          }
        ],
        {
          className: 'custom-classname',
          onClose: function(){
            console.log('关闭');
          }
        });
    }
  },
  /**
   * toast
   * @param params.text
   * @param params.showIcon
   * @param params.duration
   * @param params.delay
   * @param params.onSuccess
   * @param params.onFail
   */
  toast: function(params){
    weui.toast(params.message, {
      duration: 1500
    });
  },
  selectDeptMember: function(params){
    wx.invoke('selectEnterpriseContact', {
        'fromDepartmentId': -1,// 必填，-1表示打开的通讯录从自己所在部门开始展示, 0表示从最上层开始
        'mode': 'multi',// 必填，选择模式，single表示单选，multi表示多选
        'type': ['department', 'user'],// 必填，选择限制类型，指定department、user中的一个或者多个
        'selectedDepartmentIds': [],// 非必填，已选部门ID列表。用于多次选人时可重入
        'selectedUserIds': params.selectedIds// 非必填，已选用户ID列表。用于多次选人时可重入
      },function(res){
        rsqChk(params.success, [res]);
        if (res.err_msg == "selectEnterpriseContact:ok")
        {
          if(typeof res.result == 'string')
          {
            res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
          }
          var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
          for (var i = 0; i < selectedDepartmentList.length; i++)
          {
            var department = selectedDepartmentList[i];
            var departmentId = department.id;// 已选的单个部门ID
            var departemntName = department.name;// 已选的单个部门名称
          }
          var selectedUserList = res.result.userList; // 已选的成员列表
          for (var i = 0; i < selectedUserList.length; i++)
          {
            var user = selectedUserList[i];
            var userId = user.id; // 已选的单个成员ID
            var userName = user.name;// 已选的单个成员名称
            var userAvatar= user.avatar;// 已选的单个成员头像
          }
        }
      }
    );
  },
  selectMember: function(params){
  },
  picker: function(params){
  },
  datePicker: function(params){
  },
  timePicker: function(params){
    var hours = [],
    minites = [],
    symbol = [{ label: ':', value: 0 }];
    if (!hours.length) {
      for (var i = 0; i< 24; i++) {
        var hours_item = {};
        hours_item.label = ('' + i).length === 1 ? '0' + i : '' + i;
        hours_item.value = i;
        hours.push(hours_item);
      }
    }
    if (!minites.length) {
      for (var j= 0; j < 60; j++) {
        var minites_item = {};
        minites_item.label = ('' + j).length === 1 ? '0' + j : '' + j;
        minites_item.value = j;
        minites.push(minites_item);
      }
    }
    var defString = params.strInit || '00:00';
    var defArray = [defString.substr(0, 2), ':', defString.substr(3, 2)];
    weui.picker(hours, symbol, minites, {
      id: 'time-picker' + new Date().getTime(),  // 使用变化的id，保证不做缓存，每次都新建picker
      defaultValue: defArray,
      onConfirm: function(result) {
        var time = result[0].label + ':' + result[2].label;
        var result = {value: time}
        rsqChk(params.success, [result]);
      }
    });
  },
  disableBounce: function(){
    //  去掉iOS的回弹效果
  },
  /**
   * 钉钉中发Ding
   * @param params
   */
  notify: function(params) {
  },
  /**
   * 发送到聊天
   * @param prams
   */
  pickConversation: function(params) {
  },
  /**
   * 从localStorage中获取值
   * @param params
   */
  getItem: function(params) {
    //  检查是否存在version信息，version信息以整数为准，初始值为1
    if (window.localStorage) {
      var item = localStorage.getItem(params.name)
      rsqChk(params.success, [{key: params.name, value: item}])
    } else {
      alert('localStorage not found!')
    }
  },
  setItem: function(params) {
    if (window.localStorage) {
      localStorage.setItem(params.name, params.value)
      rsqChk(params.success, [{key: params.name, value: params.value}])
    } else {
      alert('localStorage not found!')
    }
  },
  removeItem: function(params) {
    if (window.localStorage) {
      localStorage.removeItem(params.name)
      rsqChk(params.success, [{}])
    } else {
      alert('localStorage not found!')
    }
  },
})
