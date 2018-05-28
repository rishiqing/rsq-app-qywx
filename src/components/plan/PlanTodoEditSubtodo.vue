<template>
  <div class="top-padding fixpadding">
    <div class="b-t-b">
      <r-input-title
        ref="title"
        :is-checkable="true"
        :item-title="editItem.name || ''"
        :item-checked="editItem.isDone || false"
        @click-checkout="finishChecked"
        @text-change="titleChanged"/>
    </div>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="submitSubtodo">
          保存
        </v-touch>
      </div>
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_warn"
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

  export default {
    name: 'PlanTodoEditSubtodo',
    components: {
      'r-input-title': InputTitleText
    },
    data () {
      return {
        editItem: {},
        newName: ''
      }
    },
    computed: {
      currentSubtodo () {
        return this.$store.state.todo.currentSubtodo
      }
    },
    mounted () {
      window.rsqadmg.execute('setTitle', {title: '编辑子任务'})
      util.extendObject(this.editItem, this.currentSubtodo)
    },
    methods: {
      submitSubtodo () {
        const value = this.newName
        const item = this.currentSubtodo
        const that = this
        if (item.name !== value) {
          window.rsqadmg.exec('showLoader', {text: '保存中...'})
          this.$store.dispatch('updateKanbanSubtodo', {id: item.id, name: value})
            .then(() => {
              //  触发标记重复修改
              window.rsqadmg.exec('hideLoader')
              that.$router.go(-1)
            })
        } else {
          this.$router.go(-1)
        }
      },
      deleteSubtodo () {
        const that = this
        const item = this.currentSubtodo
        window.rsqadmg.exec('confirm', {
          message: '确定要删除此子任务？',
          success () {
            window.rsqadmg.execute('showLoader', {text: '删除中...'})
            that.$store.dispatch('deleteKanbanSubtodo', item)
              .then(() => {
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
      },
      finishChecked () {
        const item = this.currentSubtodo
        const nowState = !item.isDone
        this.$store.dispatch('updateKanbanSubtodo', {id: item.id, isDone: !item.isDone})
          .then(() => {
            this.editItem.isDone = nowState
            // that.$store.dispatch('saveTodoAction', {editItem: {status: !item.isDone, type: 17}})
            //   .then(() => {
            //   })
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .top-padding {
    padding-top: 0.2rem;
  }
  .b-t-b{
    border-top: 0.5px solid #d4d4d4;
    border-bottom: 0.5px solid #d4d4d4;
  }
</style>
