<template>
  <div class="router-view">
    <div class="itm-edt z-index-xs">
      <div class="content">
        <div class="itm-edt-fields" style="padding-bottom: 80px;">
          <div class="itm-group input-title">
            <r-input-title
              :new-checkable="true"
              :item-title="editItem.pTitle"
              @text-change="saveTitle"
            ></r-input-title>
          </div>
          <div class="itm-group itm--edit-todo" :class="{'is-hidden': !isShowNote}">
          </div>
          <div class="itm-group itm--edit-todo">
            <div class="firstGroup">
              <r-input-date
                :item="editItem"
                :sep="'/'"
                :newItem="true"
              ></r-input-date>
              <r-input-time
                :item="editItem"
                :newItem="true"
              ></r-input-time>
            </div>
            <div class="secondGroup">
              <r-input-member
                :new-time="true"
                :is-native="true"
                :index-title="'执行人'"
                :select-title="'请选择成员'"
                :user-rsq-ids="[]"
                :selected-rsq-ids="joinUserRsqIds"
                :disabled-rsq-ids="[]"
                @member-changed="saveMember"
              ></r-input-member>
              <v-touch @tap="submitTodo" class="create-bot">
                <a href="javascript:;" class="weui-btn weui-btn_primary">创建任务</a>
              </v-touch>
            </div>
          </div>
          <!--<div class="itm-group itm&#45;&#45;edit-todo" @click="submitTodo">提交（测试）</div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .input-title{
    border-top: 1px solid #DADADA;
    border-bottom: 1px solid #DADADA;
  }
  .create-bot{
    margin-top: 0.5rem;
  }
  .router-view{
    height: 100%;
    background-color: #f6f6f6;
  }
  .content{
    height: 100%;
  }
  .firstGroup{
    margin-top:10px;
    border-top: 1px solid #DADADA;
    border-bottom: 1px solid #DADADA;
  }
  .secondGroup{
    margin-top:10px;
    border-top: 1px solid #DADADA;
    /*border-bottom: 1px solid #E0E0E0;*/
  }
  p{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .bottom {
    height: 2rem;
    display: inline-block;
    padding-left: 11px;
    line-height: 0.1rem;
    position: relative;
    margin-top: 0.7rem;
  }
  .ding{
    height:2rem;
    line-height: 1rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    position:relative;
    background-color: white;
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
    right:0.3rem;
    border: 1px solid #dfdfdf;
    background-color: #fdfdfd;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
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
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
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
</style>

<script>
//  import moment from 'moment'
  import InputTitleText from 'com/pub/InputTitleText'
  import InputDate from 'com/pub/InputDate'
  import InputMember from 'com/pub/InputMember'
  import InputTime from 'com/pub/InputTime'
  import dateUtil from 'ut/dateUtil'
  import jsUtil from 'ut/jsUtil'
  export default {
    data () {
      return {
        editItem: {
          isChecked: false,
          isAllDay: true
//          receiverIds: []
        },
        joinUserRsqIds: [],
        isShowNote: false
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      isInbox () {
        //  所有日期属性均为date，判断当前新建的item为收纳箱任务
        return this.editItem.pContainer === 'inbox'
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      corpId () {
        return this.loginUser.authUser.corpId ? this.loginUser.authUser.corpId : 'dingtalkupload'
      },
      kanbanCardId () {
        return this.$store.state.kanbanCardId
      },
      cardItemLength () {
        return this.$store.state.cardItemLength
      }
    },
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': InputDate,
      'r-input-time': InputTime,
      'r-input-member': InputMember
    },
    beforeRouteEnter (to, from, next) {
      next()
      // beforeRouteEnter中不能获取到this，因为this还没有创建，只能通过next获取
    },
    methods: {
      empty () {},
      toggleAllDay (e) {
        this.editItem.isChecked = !this.editItem.isChecked
      },
      /**
       * 初始化数据，从state的currentTodo复制到local的editItem
       */
      initData () {
        jsUtil.extendObject(this.editItem, this.currentTodo)
      },
      /**
       * 从startDate endDate dates三个字段中转换成用户前台显示的date结构
       */
      getPlanedTime () {
        var ei = this.editItem
        var result = dateUtil.backend2frontend({dates: ei.dates, startDate: ei.startDate, endDate: ei.endDate})
        return (result && result.dateResult) ? result.dateResult[0] : null
      },
      saveTitle (newTitle) {
        this.editItem.pTitle = newTitle
        this.$store.commit('TD_TODO_UPDATED', {todo: {pTitle: newTitle}})
      },
      saveMember (idArray) {
        this.joinUserRsqIds = idArray
        var ids = idArray.join(',')
        this.editItem.receiverIds = ids
        this.$store.commit('TD_TODO_UPDATED', {todo: {receiverIds: ids}})
//        this.editItem.receiverIds = idArray
      }, // 注意这里没有和后台打交道，在提交新建的时候才打交道
      /**
       * 将local的对象保存到state的变量中
       */
      saveTodoState () {
        this.$store.commit('TD_CURRENT_TODO_UPDATE', {item: this.editItem})
      },
      submitTodo () {
        if (!this.editItem.pTitle) {
          return window.rsqadmg.execute('alert', {message: '请填写任务名称'})
        }
        if (!this.isInbox) {
          var planTime = this.getPlanedTime()
          if (!planTime) {
//            return window.rsqadmg.execute('alert', {message: '请选择任务日期'})
          }
          //  坑爹啊。。。格式不统一，需要做额外的hack
          this.editItem.pPlanedTime = dateUtil.dateNum2Text(planTime, '-') + ' 00:00:00'
          this.editItem.createTaskDate = dateUtil.dateNum2Text(planTime)
        }

        this.saveTodoState()
//        var that = this
        var todoType = this.isInbox ? 'inbox' : 'schedule'
//        window.rsqadmg.execute('showLoader', {text: '创建中...'})
        //  在有提醒的情况下返回值中居然不包括clock.alert的数据，需要前端组合传入
//        debugger
        var clockAlert = JSON.parse(JSON.stringify(this.currentTodo.clock.alert || null))
        var that = this
        if (this.kanbanCardId) {
          var startDate = this.currentTodo.startDate ? this.currentTodo.startDate.split('/').join('') : null
          var endDate = this.currentTodo.endDate ? this.currentTodo.endDate.split('/').join('') : null
          var params = {
            name: this.currentTodo.pTitle,
            kanbanCard: this.kanbanCardId,
            displayOrder: 65535 - this.cardItemLength,
            joinUser: this.editItem.receiverIds,
            dates: this.currentTodo.dates,
            startDate: startDate,
            endDate: endDate
          } // 后期加上日期和选人参数
          this.$store.dispatch('submitKanbanItem', params).then((res) => {
            that.$router.replace(window.history.back())
          })
        } else {
          this.$store.dispatch('submitCreateTodoItem', {newItem: this.currentTodo, todoType: todoType})
            .then(item => {
              if (this.currentTodo.clock && this.currentTodo.clock.startTime) {
                item.clock.alert = clockAlert
//                return this.$store.dispatch('handleRemind', {item})
              } else {
                return item
              }
            })
            .then(item => {
              window.rsqadmg.execute('toast', {message: '创建成功'})
//              if (item.receiverIds) {
//                var url = window.location.href.split('#')
//                var note = this.editItem.pNote
//                var newnote = note.replace(/<\/?.+?>/g, '\n').replace(/(\n)+/g, '\n')
//                var data = {
//                  'msgtype': 'textcard',
//                  'agentid': this.corpId,
//                  'textcard': {
//                    'title': item.pTitle,
//                    'description': newnote,
//                    'url': url[0] + '#' + '/todo/' + item.id
//                  }
//                }
//                var IDArrays = item.receiverIds.split(',')
//                var empIDArray = []
//                this.$store.dispatch('fetchUseridFromRsqid', {corpId: that.loginUser.authUser.corpId, idArray: IDArrays})
//                  .then(idMap => {
//                  alert('idmap' + JSON.stringify(idMap))
//                    for (var i = 0; i < IDArrays.length; i++) {
//                      empIDArray.push(idMap[IDArrays[i]].userId)
//                    }
//                  alert('发送的id' + JSON.stringify(empIDArray))
//                  alert(empIDArray.toString().split(',').join('|'))
//                    data['touser'] = empIDArray.toString().split(',').join('|')
//                  that.$store.dispatch('sendMessage', {
//                    corpId: that.loginUser.authUser.corpId,
//                    data: data
//                  }).then(res => {
//                    alert(JSON.stringify(res))
//                    if (res.errcode !== 0) {
//                      alert('发送失败：' + JSON.stringify(res))
//                    } else {
//                      console.log('发送成功！')
//                    }
//                  })
//                  })
//              }
              this.$router.replace('/sche')
            })
        }
      }
    },
    created () {
      this.initData()
    },
    mounted () {
      this.joinUserRsqIds = [this.$store.state.loginUser.rsqUser.id]
      if (this.editItem.receiverIds !== null) {
        var idArray = this.editItem.receiverIds.split(',')
        this.joinUserRsqIds = []
        for (var i = 0; i < idArray.length; i++) {
          this.joinUserRsqIds.push(idArray[i])
        }
      }
    }
  }
</script>
