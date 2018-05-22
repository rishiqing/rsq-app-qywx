<template>
  <div>
    <div
      ref="todoNote"
      class="descrip"
      contenteditable="true"
      @focus="inputFocus"
      @input="inputChange"
      @blur="inputBlur" />
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          href="javascript:;"
          class="weui-btn weui-btn_primary"
          @tap="submit">
          完成
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  const DEFAULT_NOTE = '<span style="color:#ccc">输入任务描述</span>'

  export default {
    name: 'TodoNote',
    data () {
      return {}
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      note () {
        return this.currentTodo.pNote
      },
      isOriginalEmpty () {
        const str = this.note ? this.note.trim() : ''
        return str === ''
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '任务描述'})
      const noteElement = this.$refs.todoNote
      noteElement.innerHTML = this.isOriginalEmpty ? DEFAULT_NOTE : this.note
    },
    methods: {
      checkCurrentEmpty () {
        const content = this.$refs.todoNote.innerHTML.trim()
        return content === DEFAULT_NOTE || content === ''
      },
      inputFocus () {
        if (this.checkCurrentEmpty()) {
          this.$refs.todoNote.innerHTML = ''
        }
      },
      inputChange () {},
      inputBlur () {
        if (this.checkCurrentEmpty()) {
          this.$refs.todoNote.innerHTML = DEFAULT_NOTE
        }
      },
      submit () {
        if (this.checkCurrentEmpty()) {
          this.$router.go(-1)
          return
        }
        const inputHTML = this.$refs.todoNote.innerHTML.trim()
        const params = {pNote: inputHTML}
        this.$store.dispatch('postNote', params).then(() => {
          this.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
          this.$router.go(-1)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .descrip{
    border-top: 1px solid #E0E0E0;
    margin-top: 10px;
    padding: 3%;
    line-height: 0.7rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    letter-spacing: 0;
    background-color: white;
    height: 200px;
    overflow-y: auto;
    box-sizing: border-box;
    outline: none;
  }
  .editable-blank{
    color: #A5A5A5;
  }
</style>
