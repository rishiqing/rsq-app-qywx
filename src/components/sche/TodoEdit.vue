<template>
  <!--收纳箱任务和日程任务公用的编辑页面-->
  <div class="router-view todo-fix">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div class="itm-edt-fields" >
          <div class="itm-group itm--edit-todo">
            <r-input-title
              ref="title"
              :is-edit="true"
              :is-checkable="!isInbox"
              :item-title="editItem.pTitle "
              :item-checked="editItem.pIsDone"
              :is-disabled="!isEditable"
              :disabled-text="disabledText"
              :is-show-bottom-border="true"
              @text-blur="saveTitle"
              @click-checkout="finishChecked"/>
            <r-input-note
              :content="editItem.pNote"
              :has-left-space="!isInbox"
              :is-disabled="!isEditable"
              :disabled-text="disabledText"/>
          </div>
          <div class="itm--edit-todo ">
            <div class="icon-field-group">
              <div class="common-field">
                <i class="icon2-schedule sche"/>
                <r-input-date
                  :is-disabled="!isEditable"
                  :disabled-text="disabledText"
                  :item="editItem"
                  :sep="'/'"/>
              </div>
              <div
                v-if="!isInbox"
                class="common-field">
                <i class="icon2-alarm sche"/>
                <r-input-time
                  :is-disabled="!isEditable"
                  :disabled-text="disabledText"
                  :item="editItem"/>
              </div>
              <div class="common-field">
                <i class="icon2-member sche"/>
                <r-input-member
                  :is-disabled="!isEditable"
                  :disabled-text="disabledText"
                  :edit-time="true"
                  :is-native="false"
                  :index-title="'执行人'"
                  :select-title="'请选择成员'"
                  :user-rsq-ids="userRsqId"
                  :selected-rsq-ids="joinUserRsqIds"
                  :creater-rsq-ids="pUserId"
                  :disabled-rsq-ids="[pUserId, rsqUser]"
                  @member-changed="saveMember"/>
              </div>
            </div>
            <div class="icon-field-group sub-todo">
              <div class="common-field">
                <img
                  src="../../assets/img/subtodo.svg"
                  class="sub-todo-png sche">
                <r-input-subtodo
                  :is-disabled="!isEditable"
                  :disabled-text="disabledText"
                  :item="currentTodo"
                  :edit-time="true"/>
              </div>
            </div>
            <r-comment-list
              :disabled="!isEditable"
              :items="todoComments"
              :todo-id="currentTodo.id"/>
            <div class="btn-group delete-task" >
              <div class="btn-wrap">
                <v-touch
                  tag="a"
                  class="weui-btn weui-btn_warn kong"
                  href="javascript:;"
                  @tap="delayCallFix">
                  删除任务
                </v-touch>
              </div>
            </div>
            <v-touch
              class="bottom"
              @tap="switchToComment">
              <img
                class="talk-png"
                src="../../assets/img/talk.png">
              参与讨论
            </v-touch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Promise } from 'es6-promise'
  import moment from 'moment'
  import InputTitleText from 'com/pub/InputTitleText'
  import InputNote from 'com/pub/InputNote'
  import InputDate from 'com/pub/InputDate'
  import InputTime from 'com/pub/InputTime'
  import InputMember from 'com/pub/InputMember'
  import InputSubtodo from 'com/pub/InputSubtodo'
  import SendConversation from 'com/demo/SendConversation'
  import util from 'ut/jsUtil'
  import dateUtil from 'ut/dateUtil'
  import CommentList from 'com/pub/CommentList'

  export default {
    name: 'TodoEdit',
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-time': InputTime,
      'r-input-member': InputMember,
      'r-input-subtodo': InputSubtodo,
      'r-input-note': InputNote,
      'r-comment-list': CommentList,
      'r-send-conversation': SendConversation
    },
    data () {
      return {
        disabledText: '过去的任务不能编辑',
        editItem: {},
        joinUserRsqIds: []
      }
    },
    computed: {
      rsqUser () {
        return this.$store.getters.loginUser.rsqUser.id
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo || {}
      },
      pNote () {
        return this.$store.state.todo.currentTodo.pNote
      },
      note () {
        return this.$store.state.todo.currentTodo.note
      },
      pUserId () {
        return [this.$store.state.todo.currentTodo.pUserId]
      },
      isInbox () {
        return this.currentTodo.pContainer === 'inbox'
      },
      //  对于日程中任务来说，过去的任务是disabled，无法编辑的。只有收纳箱中的任务和未来的任务才是可以编辑的
      isEditable () {
        return this.isInbox || this.currentNumDate + 24 * 3600 * 1000 > new Date().getTime()
      },
      dynamicId () {
        return this.$route.params.todoId
      },
      todoComments () {
        return this.currentTodo.comments || []
      },
      //  普通评论
      commonComments () {
        return this.todoComments.filter(i => {
          return i.type === 0
        })
      },
      userRsqId () {
        return this.$store.state.staff.list
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId
      },
      corpId () {
        return this.loginUser.authUser.corpId
      },
      currentNumDate () {
        return this.$store.getters.defaultNumTaskDate
      },
      dates () {
        var dates = this.$store.state.todo.currentTodo.dates
        var datesArray = dates.split(',')
        var newArray = []
        for (var i = 0; i < datesArray.length; i++) {
          var monthOfday = datesArray.substr(4, 5) + '月' + datesArray.substr(6, 7) + '日 '
          newArray.push(monthOfday)
        }
        return newArray
      },
      time () {
        var dates = this.$store.state.todo.currentTodo.clock
        return dates.startTime + '-' + dates.endTime
      },
      delayShowCheckbox () {
        return this.$store.state.todo.delayShowCheckbox
      }
    },
    created () {
      this.initData()
//      var that = this
      window.rsqadmg.execute('setTitle', {title: '任务详情'})
//      window.rsqadmg.execute('setOptionButtons', {
//        btns: [{key: 'more', name: '更多'}],
//        success (res) {
//          if (res.key === 'more') {
//            that.more()
//          }
//        }
//      })
    },
    mounted () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    methods: {
      delayCallFix (e) {
        window.setTimeout(() => {
          this.prepareDelete(e)
        }, 50)
      },
      initData () {
        var that = this
        // window.rsqadmg.exec('showLoader', {'text': '加载中'})
        return this.$store.dispatch('getTodo', {todo: {id: this.dynamicId}})
            .then(item => {
              util.extendObject(this.editItem, item)
              var joinUserArray = util.getMapValuePropArray(this.editItem.receiverUser, 'joinUser')
              this.joinUserRsqIds = joinUserArray.map(obj => {
                return obj['id'] + ''
              })
            })
          .then(() => {
            this.fetchCommentIds()
            // window.rsqadmg.exec('hideLoader')
          })
         .catch(err => {
           // window.rsqadmg.exec('hideLoader')
           if (err.code === 400320) {
             that.$router.push('/pub/check-failure')
           } else if (err.code === 400318) {
             that.$router.push('/pub/noPermission')
           }
         })
      },
      fetchCommentIds () {
        //  根据评论中的rsqId获取userId，用来显示头像
        var ids = this.commonComments.map(ti => {
          return ti.authorId
        })
        ids = util.unique(ids)  //  去重
        var corpId = this.loginUser.authUser.corpId
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: ids})
          .then(idMap => {
            var that = this
            that.commonComments.forEach(c => {
              const user = idMap[c.authorId]
              if (user) {
                // that.$set(c, 'authorAvatar', user.avatar)
                // that.$set(c, 'authorName', 'dingding-' + user.name)
                that.$set(c, 'qywxShowAvatar', user.avatar)
                that.$set(c, 'qywxShowName', user.name)
              }
            })
          })
      },
      switchToComment () {
        if (!this.isEditable) {
          window.rsqadmg.execute('toast', {message: '过去的任务不能编辑'})
          return
        }
        this.$router.push('/sche/todo/comment')
      },
      saveTitle (newTitle) {
        if (!newTitle || /^\s+$/.test(newTitle)) {
          window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
          return Promise.reject()
        }
        if (this.currentTodo.kanbanId) {
          this.$store.dispatch('updateKanbanItem', {id: this.currentTodo.id, name: newTitle})
        } else {
          if (newTitle !== this.editItem.pTitle) {
//          window.rsqadmg.exec('showLoader', {text: '保存中...'})
            var params = {pTitle: newTitle}
            return this.$store.dispatch('updateTodo', {editItem: params})
              .then(() => {
                this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
              })
              .then(() => {
                return this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: newTitle, type: 9}})
              })
              .then(() => {
                this.editItem.pTitle = newTitle
//              this.editItem.pTitle = newTitle
//              window.rsqadmg.exec('hideLoader')
//              window.rsqadmg.execute('toast', {message: '保存成功'})
              })
          } else {
            return Promise.resolve()
          }
        }
      },
      saveMember (idArray) { // 这个方法关键之处是每次要穿的参数是总接收id，增加的id减少的id
        window.rsqadmg.execute('setTitle', {title: '任务详情'})
        var that = this
        var compRes = util.compareList(this.joinUserRsqIds, idArray)
        var params = {
          receiverIds: idArray.join(','),
          addJoinUsers: compRes.addList.join(','),
          deleteJoinUsers: compRes.delList.join(',')
        }
        window.rsqadmg.execute('showLoader', {text: '保存中...'})
        this.$store.dispatch('updateTodo', {editItem: params}).then(() => {
          // this.joinUserRsqIds = idArray
          window.rsqadmg.exec('hideLoader')
          // window.rsqadmg.execute('toast', {message: '保存成功'})
          //  重新获取用户头像
          this.fetchCommentIds()
          if (params.addJoinUsers) {
            // var time = util.SendConversationTime(this.currentTodo)
            // var date = util.SendConversationDate(this.currentTodo)
            // var note = this.editItem.pNote
            // var newnote = note.replace(/<\/?.+?>/g, '\n').replace(/(\n)+/g, '\n')

            var url = window.location.href.split('#')
            var data = {
              'msgtype': 'textcard',
              'agentid': this.corpId,
              'textcard': {
                'title': this.currentTodo.pTitle,
                'description': '日程通知',
                'url': url[0] + '#' + '/sche/todo/' + this.currentTodo.id
              }
            }

            var IDArrays = params.addJoinUsers.split(',')
            var empIDArray = []
            this.$store.dispatch('fetchUseridFromRsqid', {corpId: that.loginUser.authUser.corpId, idArray: IDArrays})
              .then(idMap => {
                for (var i = 0; i < IDArrays.length; i++) {
                  empIDArray.push(idMap[IDArrays[i]].userId)
                }
                data['touser'] = empIDArray.toString().split(',').join('|')

                that.$store.dispatch('sendAsyncCorpMessage', {
                  corpId: that.loginUser.authUser.corpId,
                  data: data
                }).then(res => {
                  if (res.errcode !== 0) {
                    // alert('发送失败：' + JSON.stringify(res))
                  } else {
                    console.log('发送成功！')
                  }
                })
              })
          }
        })
      },
      finishChecked (status) {
        if (status !== this.editItem.isDone) {
          this.$store.dispatch('updateTodo', {editItem: {pIsDone: status}})
              .then(() => {
//                this.$store.dispatch('saveTodoAction', {editItem: {status: status, type: 5}})
//                  .then(() => {
//                  })
                this.editItem.pIsDone = status
                var str = status ? '任务已完成' : '任务已重启'
                window.rsqadmg.execute('toast', {message: str})
              })
        }
      },
      deleteCurrentTodo (p) {
        return this.$store.dispatch('deleteTodo', p)
      },
      prepareDelete (e) {
//        if (e.target.innerText === '删除任务') {
        var that = this
        if (that.currentTodo.isCloseRepeat) {
          window.rsqadmg.exec('confirm', {
            message: '确定要删除此任务？',
            success () {
              window.rsqadmg.execute('showLoader', {text: '删除中...'})
              that.deleteCurrentTodo({todo: that.currentTodo})
                .then(() => {
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                  that.$router.go(-1)
                })
            }
          })
        } else {
          if (e.target.innerText === '删除任务') {
            window.rsqadmg.exec('actionsheet', {
              buttonArray: ['仅删除此任务', '删除此任务及以后的任务', '删除所有的重复任务'],
              success: function (res) {
//                window.rsqadmg.execute('showLoader', {text: '删除中...'})
                var promise
                switch (res.buttonIndex) {
                  case 0:
                    promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'today'})
                    break
                  case 1:
                    promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'after'})
                    break
                  case 2:
                    promise = that.deleteCurrentTodo({todo: that.currentTodo, isRepeat: true, type: 'all'})
                    break
                  default:
                    break
                }
                promise.then(() => {
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.execute('toast', {message: '删除成功'})
                  that.$router.go(-1)
                })
              }
            })
          }
        }
      },
      more () {
        var that = this
        var arr = ['发送到聊天', '发送提醒']
        if (this.isEditable) {
          arr.push('删除任务')
        }
        window.rsqadmg.exec('actionsheet', {
          buttonArray: arr,
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                window.rsqadmg.exec('pickConversation', {
                  corpId: that.corpId,
                  success: function (conv) {
                    var d = dateUtil.repeatDate2Text(that.currentTodo)
                    var clock = that.currentTodo.clock || {}
                    var t = clock.startTime ? clock.startTime + '-' + clock.endTime : '全天'
                    var note = that.editItem.pNote || ''
                    var newnote = note.replace(/<\/?.+?>/g, '\n').replace(/(\n)+/g, '\n')
                    var params = {
                      corpId: that.corpId, // that.loginUser.authUser.corpId,
                      data: {
                        sender: that.userId,
                        cid: conv.cid,
                        msgtype: 'oa',
                        oa: {
                          message_url: window.location.href,
                          head: {
                            text: '日事清',
                            bgcolor: 'FF55A8FD'
                          },
                          body: {
                            title: that.editItem.pTitle,
                            form: [
                              {key: '日期：', value: d},
                              {key: '时间：', value: t}
                            ],
                            content: newnote,
                            author: that.loginUser.authUser.name// 这里要向后台要值
                          }
                        }
                      }
                    }
                    that.$store.dispatch('sendToConversation', params)
                    .then(() => {
                      window.rsqadmg.exec('toast', {message: '发送成功'})
                    })
                  }
                })
                break
              case 1:
                var IDArrays = that.currentTodo.receiverIds === null ? [that.currentTodo.pUserId] : that.currentTodo.receiverIds.split(',')
                var empIDArray = []
                that.$store.dispatch('fetchUseridFromRsqid', {corpId: that.corpId, idArray: IDArrays})
                  .then(idMap => {
                    for (var i = 0; i < IDArrays.length; i++) {
                      empIDArray.push(idMap[IDArrays[i]].emplId)
                    }
                    var standardTime = moment().format('YYYY-MM-DD HH:mm')
                    window.rsqadmg.exec('notify', {
                      userIds: empIDArray,
                      corpId: that.corpId,
                      alertTime: standardTime,
                      title: that.currentTodo.pTitle,
                      success: () => {
                        that.$router.replace(window.history.back())
                      }
                    })
                  })
                break
              case 2:
                that.prepareDelete()
                break
              default:
                break
            }
          }
        })
      },
      updateRepeat (p) {
        return this.$store.dispatch('updateRepeatTodo', p)
      },
      checkIfRepeatEdited (next) {
        //  如果check时发现title有未保存的内容，那么先保存title
        var newValue = this.$refs.title.$refs.titleInput.value
        this.saveTitle(newValue)
          .then(() => {
            var c = this.currentTodo
            var isEdited = this.$store.state.todo.isRepeatFieldEdit
            if (c.pContainer !== 'inbox' && !c.isCloseRepeat && isEdited) {
              var that = this
              window.rsqadmg.exec('actionsheet', {
                buttonArray: ['仅修改此任务', '修改此任务及以后的任务', '修改所有的重复任务', '取消'],
                success: function (res) {
                  window.rsqadmg.execute('showLoader', {text: '更新中...'})
                  var promise
                  switch (res.buttonIndex) {
                    case 0:
                      promise = that.updateRepeat({type: 'today'})
                      break
                    case 1:
                      promise = that.updateRepeat({type: 'after'})
                      break
                    case 2:
                      promise = that.updateRepeat({type: 'all'})
                      break
                    case 3:
                      promise = new Promise(function () {
                      })
                      window.rsqadmg.exec('hideLoader')
                      break
                    default:
                      break
                  }
                  promise.then(() => {
                    window.rsqadmg.exec('hideLoader')
                    window.rsqadmg.execute('toast', {message: '更新成功'})
                    return next()
                  })
                }
              })
            } else {
              return next()
            }
          })
          .catch(() => {
            next(false)
          })
      },
      noteChanged (p) {
        alert('note changed: ' + JSON.stringify(p))
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('RESET_DELAY_SHOW_CHECKBOX')
      //  判断是否需要用户选择“仅修改当前日程”、“修改当前以及以后日程”、“修改所有重复日程”
      if (to.name === 'sche') {
        // next(false)
        this.checkIfRepeatEdited(next)
      } else {
        return next()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .delete-task{
    padding-bottom: 2rem;
    background-color: #f6f6f6;
  }
  .sche{
    font-size:0.586rem;
    color:#55A8FD;
    position: absolute;
    top: 50%;
    margin-top: -0.29rem;
    left:0.3rem
  }
  .time-border{
    border-bottom: 1px solid #E0E0E0;
  }
  input::-webkit-input-placeholder { /* WebKit browsers */
    font-family: STHeitiSC-Light;
    font-size: 15px;
    color: #A3A3A3;
    letter-spacing: 0;
  }
  .content{
    background-color: white;
  }
  input{
    line-height: 0.933rem;
    width:6.8rem;
  }
  .bottom{
    height: 46px;
    display: flex;
    align-items: center;
    background-color: white;
    position: fixed;
    bottom: 0;
    left:0;
    right: 0;
    justify-content: center;
    width:100%;
    border-top:1px solid #DADADA ;
    background-color: #FDFDFF ;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #4A4A4A;
    letter-spacing: 0;
    text-align: center;
  }
  .bot{
    padding-left: 2%;
    width:8.6rem;
    height:0.945rem ;
    border:1px solid #E0E0E0 ;
    border-radius: 4px;
  }
  .send>input{
    width: 300px;
    height: 50px;
    border: 1px solid red;
  }
  p{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .ding{
    height:2rem;
    line-height: 1rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    position:relative;
    background-color: white;
    border-bottom:1px solid #E0E0E0;
  }
  .message{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #999999;
  }
  .mui-switch {
    width: 52px;
    height: 31px;
    position: absolute;
    top:0.55rem;
    right:0.55rem;
    border: 1px solid #dfdfdf;
    background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none; }
  .mui-switch:before {
    content: '';
    width: 29px;
    height: 29px;
    position: absolute;
    top: 0px;
    left: 0;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }
  .mui-switch:checked {
    border-color: #67B2FE;
    box-shadow: #67B2FE 0 0 0 16px inset;
    background-color: #67B2FE; }
  .mui-switch:checked:before {
    left: 21px; }
  .mui-switch.mui-switch-animbg {
    transition: background-color ease 0.4s; }
  .mui-switch.mui-switch-animbg:before {
    transition: left 0.3s; }
  .mui-switch.mui-switch-animbg:checked {
    box-shadow: #dfdfdf 0 0 0 0 inset;
    background-color: #67B2FE;
    transition: border-color 0.4s, background-color ease 0.4s; }
  .itm-edt-fields{
     padding-top: 20px;
  }
  .sub-todo-png{
    width: 20px;
    height: 20px;
  }
  .talk-png{
    width: 17px;
    height: 17px;
    margin-right: 9.3px;
    margin-top: 3px;
  }
  .itm-group{
    border-top: 0.5px solid #d4d4d4;
  }
  .common-field{
    border-bottom: 0.5px solid #d4d4d4;
    height: 56px;
    line-height: 56px
  }
  .sub-todo{
    margin-top: 20px;
  }
</style>
