<template>
  <div class="top-padding fixpadding fixborder">
    <r-input-title
      ref="title"
      :is-checkable="true"
      :item-title="editItem.name || ''"
      :item-checked="editItem.isDone || false"
      @click-checkout="finishChecked"
      @text-change="titleChanged"/>
    <div class="itm-group itm--edit-todo">
      <div class="firstGroup">
        <div class="common-field">
          <i class="icon2-schedule sche"/>
          <r-input-date
            :item="editItem"
            :sep="'/'"
            :has-left-space="true"/>
          <i class="icon2-arrow-right-small arrow"/>
        </div>
      </div>
      <div class="secondGroup">
        <div class="common-field">
          <i class="icon2-member sche"/>
          <r-input-member
            :has-left-space="true"
            :is-native="false"
            :index-title="'执行人'"
            :select-title="'请选择成员'"
            :user-rsq-ids="userRsqId"
            :single-select="true"
            :selected-rsq-ids="joinUserRsqIds"
            :creater-rsq-ids="pUserId"
            :disabled-rsq-ids="[]"
            @member-changed="saveMember"/>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui_btn_plain_default fblack"
          href="javascript:;"
          @tap="deleteSubtodo">
          删除
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import InputTitleText from 'com/pub/InputTitleText'
  import util from 'ut/jsUtil'
  import SubInputDate from 'com/pub/SubInputDate'
  import InputMember from 'com/pub/InputMember'

  export default {
    name: 'TodoEditSubtodo',
    components: {
      'r-input-title': InputTitleText,
      'r-input-date': SubInputDate,
      'r-input-member': InputMember
    },
    data () {
      return {
        editItem: {},
        newName: '',
        joinUserRsqIds: []
      }
    },
    computed: {
      currentSubtodo () {
        return this.$store.state.todo.currentSubtodo
      },
      pubid () {
        return this.$store.state.pub.pubid
      },
      userRsqId () {
        return this.$store.state.staff.list
      },
      pUserId () {
        return [this.$store.state.todo.currentTodo.pUserId]
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '编辑子任务'})
      util.extendObject(this.editItem, this.currentSubtodo)
      if (this.$store.state.pub.subtitle) {
        this.editItem.name = this.$store.state.pub.subtitle
      }
      this.$store.commit('PUB_TITLE_SUB', this.editItem.name)
      this.joinUserRsqIds = this.$store.state.todo.currentSubtodo.joinUsers.map(function (arr) {
        return arr.id.toString()
      })
      this.$store.commit('PUB_SUB_TODO_USER', {id: this.joinUserRsqIds})
    },
    methods: {
      copyTitle (value) {
        this.$store.commit('PUB_TITLE_SUB', value)
      },
      submitSubtodo () {
        const name = this.$store.state.pub.subtitle
        const id = this.$store.state.todo.currentSubtodo.id
        const isDone = this.$store.state.todo.currentSubtodo.isDone
        const endDate = this.$store.state.todo.currentSubtodo.endDate
        const startDate = this.$store.state.todo.currentSubtodo.startDate
        const dates = this.$store.state.todo.currentSubtodo.dates
        const joinUsers = this.$store.state.subUserId[0] || ''
        const item = this.currentSubtodo
        const that = this
        if (!name || /^\s+$/.test(name)) {
          return
        }
        window.rsqadmg.exec('showLoader', {text: '保存中...'})

        this.$store.dispatch('updateSubtodo', {item, id, name, isDone, endDate, startDate, dates, joinUsers})
          .then(() => {
            //  触发标记重复修改
            that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
            window.rsqadmg.exec('hideLoader')
            // this.$router.go(-1)
          })
      },
      saveMember (idArray) {
        window.rsqadmg.execute('setTitle', {title: '编辑子任务'})
        // this.joinUserRsqIds = idArray
        this.editItem.receiverIds = idArray
        this.$store.commit('PUB_SUB_TODO_USER', {id: idArray})
      },
      deleteSubtodo () {
        const that = this
        const item = this.currentSubtodo
        window.rsqadmg.exec('confirm', {
          message: '确定要删除此子任务？',
          success () {
            window.rsqadmg.execute('showLoader', {text: '删除中...'})
            that.$store.dispatch('deleteSubtodo', {item: item})
              .then(() => {
                //  触发标记重复修改
                that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
//                  this.$store.dispatch('saveTodoAction', {editItem: {idOrContent: value, type: 10}})
//                    .then(() => {
//                    })
                window.rsqadmg.exec('hideLoader')
                window.rsqadmg.execute('toast', {message: '删除成功'})
                that.$router.go(-1)
              })
          }
        })
      },
      titleChanged (value) {
        this.newName = value
        this.copyTitle(value)
      },
      finishChecked () {
        const item = this.currentSubtodo
        const nowState = !item.isDone
        this.$store.dispatch('submitSubtodoFinish', {item: item, status: nowState})
          .then(() => {
            this.editItem.isDone = nowState
            // that.$store.dispatch('saveTodoAction', {editItem: {status: !item.isDone, type: 17}})
            //   .then(() => {
            //   })
          })
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'subtodoList') {
        this.submitSubtodo()
      }
      if (to.name !== 'SubTodoEditDate') {
        this.$store.commit('PUB_TITLE_SUB', '')
      }
      next()
    }
  }
</script>
<style lang="scss" scoped>
  .top-padding {
    padding-top: 20px;
  }
  .fblack{
    color: black;
    background-color: #fff;
    // border: 0.5px solid #d4d4d4
  }
  .itm-group{
    margin-top: 20px;
  }
  .firstGroup{
    border-bottom: 1px solid #D9D9D9;
  }
  .sche{
   font-size: 0.586rem;
    color: #55A8FD;
    position: absolute;
    top: 50%;
    margin-top: -0.29rem;
    left: 25px;
    z-index: 1000;
  }
  .arrow {
    color: #999999;
    font-size: 21px;
    position: absolute;
    top: 50%;
    margin-top: -0.25rem;
    right: 0.2rem;
}
.btn-group{
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #000;
  margin-bottom: 10px;
  .weui-btn:after, .weui-btn{
    background-color: #f5f5f5;
    border: 0px !important;
    position: relative;
    color: red
  }
}
</style>
