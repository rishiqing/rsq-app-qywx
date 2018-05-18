<template>
  <!--计划任务的编辑页面-->
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div class="itm-edt-fields" >
          <div class="itm-group itm--edit-todo">
            <r-input-title
              ref="title"
              :is-checkable="true"
              :item-title="editItem.name"
              :item-checked="editItem.isDone"
              :is-show-bottom-border="true"
              @text-blur="saveTitle"
              @click-checkout="finishChecked"/>
            <r-input-note
              :content="editItem.note"
              :has-left-space="true"
              :todo-type="'plan'"/>
          </div>
          <div class="itm--edit-todo ">
            <div class="icon-field-group">
              <div class="common-field">
                <i class="icon2-schedule sche"/>
                <r-input-date
                  :item="editItem"
                  :sep="'/'"
                  :edit-time="true"
                  :todo-type="'plan'"/>
              </div>
              <div class="common-field">
                <i class="icon2-member sche"/>
                <r-input-member
                  :edit-time="true"
                  :is-native="true"
                  :index-title="'执行人'"
                  :select-title="'请选择成员'"
                  :user-rsq-ids="[]"
                  :selected-rsq-ids="joinUserRsqIds"
                  :disabled-rsq-ids="[]"
                  @member-changed="saveMember"/>
              </div>
              <div class="common-field">
                <i class="icon2-subplan-web sche"/>
                <r-input-subtodo
                  :item="currentKanbanItem"
                  :todo-type="'plan'"/>
              </div>
            </div>
            <r-comment-list
              :items="todoComments"
              :todo-id="currentKanbanItem.id"
              :todo-type="'plan'"/>
            <div class="btn-group deleteTask" >
              <div class="btn-wrap">
                <v-touch
                  tag="a"
                  class="weui-btn weui-btn_warn"
                  href="javascript:;"
                  @tap="deleteItem">
                  删除任务
                </v-touch>
              </div>
            </div>
            <v-touch
              class="bottom"
              @tap="switchToComment">
              参与讨论
            </v-touch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputNote from 'com/pub/InputNote'
  import InputMember from 'com/pub/InputMember'
  import InputSubtodo from 'com/pub/InputSubtodo'
  import SendConversation from 'com/demo/SendConversation'
  import util from 'ut/jsUtil'
  import CommentList from 'com/pub/CommentList'

  export default {
    name: 'PlanTodoEdit',
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-member': InputMember,
      'r-input-subtodo': InputSubtodo,
      'r-input-note': InputNote,
      'r-comment-list': CommentList,
      'r-send-conversation': SendConversation
    },
    data () {
      return {
        editItem: {},
        joinUserRsqIds: []
      }
    },
    computed: {
      currentKanbanItem () {
        return this.$store.state.plan.currentKanbanItem || {}
      },
      itemId () {
        return this.currentKanbanItem.id
      },
      todoComments () {
        return this.currentKanbanItem.commentList || []
      },
      //  普通评论
      commonComments () {
        return this.todoComments.filter(i => {
          return i.type === 0
        })
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      corpId () {
        return this.loginUser.authUser.corpId
      }
    },
    created () {
      window.rsqadmg.execute('setTitle', {title: '任务详情'})
      this.initPlan()
    },
    mounted () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    methods: {
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
        this.$router.push('/plan/todo/comment')
      },
      saveMember (idArray) { // 这个方法关键之处是每次要穿的参数是总接收id，增加的id减少的id
        const that = this
        const compRes = util.compareList(this.joinUserRsqIds, idArray)
        const params = {
          id: this.currentKanbanItem.id,
          receiverIds: idArray.join(','),
          addJoinUsers: compRes.addList.join(','),
          deleteJoinUsers: compRes.delList.join(',')
        }
        window.rsqadmg.execute('showLoader', {text: '保存中...'})
        this.$store.dispatch('updateKanbanItem', params).then(() => {
          this.joinUserRsqIds = idArray
          window.rsqadmg.exec('hideLoader')
          // window.rsqadmg.execute('toast', {message: '保存成功'})
          //  重新获取用户头像
          this.fetchCommentIds()
          if (params.addJoinUsers) {
            var url = window.location.href.split('#')
            var data = {
              'msgtype': 'textcard',
              'agentid': this.corpId,
              'textcard': {
                'title': this.currentKanbanItem.name,
                'description': '日程通知',
                'url': url[0] + '#' + '/plan/todo/' + this.currentKanbanItem.id
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
                    alert('发送失败：' + JSON.stringify(res))
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
          this.$store.dispatch('updateKanbanItem', {id: this.itemId, isDone: status, doneTime: moment().format('YYYY-MM-DD HH:mm:ss')})
              .then(() => {
//                this.$store.dispatch('saveTodoAction', {editItem: {status: status, type: 5}})
//                  .then(() => {
//                  })
                this.editItem.isDone = status
                var str = status ? '任务已完成' : '任务已重启'
                window.rsqadmg.execute('toast', {message: str})
              })
        }
      },
      saveTitle (newTitle) {
        if (!newTitle) {
          window.rsqadmg.execute('alert', {message: '任务标题不能为空'})
          return
        }
        if (newTitle !== this.editItem.name) {
          this.$store.dispatch('updateKanbanItem', {id: this.itemId, name: newTitle})
            .then(() => {
              this.editItem.name = newTitle
            })
        }
      },
      deleteItem () {
        const that = this
        window.rsqadmg.exec('confirm', {
          message: '确定要删除此任务？',
          success () {
            window.rsqadmg.execute('showLoader', {text: '删除中...'})
            that.$store.dispatch('deleteKanbanItem', {id: that.itemId})
              .then(() => {
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '删除成功'})
                that.$router.go(-1)
              })
          }
        })
      },
      initPlan () {
        window.rsqadmg.exec('showLoader', {'text': '加载中'})
        return this.$store.dispatch('getKanbanItem', {id: this.itemId})
          .then(item => {
            util.extendObject(this.editItem, item)
            this.joinUserRsqIds = this.editItem.joinUserIds.split(',')
          })
          .then(() => {
            this.fetchCommentIds()
            window.rsqadmg.exec('hideLoader')
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .deleteTask{
    padding-bottom: 2rem;
    background-color: #f6f6f6;
  }
  .remindColor{
    color: #A5A5A5;
  }
  .contentColor{
    color: #333333
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
  .desp{
    margin-bottom: 10px;
    padding-top:0.193rem ;
    padding-bottom: 0.293rem;
    padding-right: 0.3rem;
    line-height: 0.586rem;
    font-family: PingFangSC-Regular;
    font-size: 0.373rem;
    letter-spacing: 0;
    background-color: white;
    min-height:0.586rem;
  }
  .inbox-padding{
    padding-left: 0.3rem;
  }
  .sche-padding{
    padding-left: 1.1rem;
  }
  input{
    line-height: 0.933rem;
    width:6.8rem;
  }
  .bottom{
    height: 1.333rem;
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
  .itm-group{
    margin-top: 10px;
  }
</style>
