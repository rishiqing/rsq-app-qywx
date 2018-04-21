<template>
  <div class="">
    <r-input-title
      ref="title"
      :disabled="false"
      :item-title="editItem.name"
      :item-checked="editItem.isDone"
      @click-checkout="finishChecked"
      @text-change="titleChanged"/>
    <div class="buttons">
      <v-touch
        class="button-wrap"
        @tap="submitSubtodo">
        <a
          class="weui-btn weui-btn_primary"
          href="javascript:;">
          保存
        </a>
      </v-touch>
      <v-touch
        class="button-wrap"
        @tap="deleteSubtodo">
        <a
          class="weui-btn weui-btn_default"
          href="javascript:;">
          删除
        </a>
      </v-touch>
    </div>
  </div>
</template>
<script>
  import InputTitleRichText from 'com/pub/InputTitleRichText'
  import util from 'ut/jsUtil'
  //  缓存的变量，用来接收r-input-title组件中的值的改变
  let newName = ''

  export default {
    name: 'TodoEditSubtodo',
    components: {
      'r-input-title': InputTitleRichText
    },
    data () {
      return {
        editItem: {}
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
        const value = newName
        const item = this.currentSubtodo
        const that = this
        if (item.name !== value) {
          window.rsqadmg.exec('showLoader', {text: '保存中...'})
          this.$store.dispatch('updateSubtodo', {item: item, name: value})
            .then(() => {
              //  触发标记重复修改
              that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED')
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
        console.log('newTitle: ' + value)
        newName = value
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
    }
  }
</script>
<style lang="scss" scoped>
  .buttons {
    padding-top: 0.2rem;
  }
  .button-wrap {
    margin: 0.3rem 0.3rem 0;
  }
</style>
