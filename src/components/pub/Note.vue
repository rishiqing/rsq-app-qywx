<template>
  <div>
    <div
      id="noteEditable"
      :class="{'editable-blank': isBlank,'edit-color': remindColor}"
      class="descrip"
      contenteditable="true"
      name="note"
      rows="5"
      placeholder="输入任务描述"
      @focus="inputFocus"
      @input="inputChange">
      输入任务描述
    </div>
    <v-touch
      class="despSubmit"
      @tap="inputBlur()">
      <a
        href="javascript:;"
        class="weui-btn weui-btn_primary">
        提交
      </a>
    </v-touch>
  </div>
</template>
<script lang="scss" scoped>
  export default {
    name: 'Note',
    // 定义数据
    data () {
      return {
        noteChangeTimes: 0,  // 用来标记note变化的次数，只有第一次改变的时候才被watch监控
        DEFAULT_NOTE: this.pNote,
        isBlank: true    // 标记是否为空
      }
    },
    computed: {
      pNote () {
        return this.$store.state.todo.currentTodo.pNote
      },
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      remindColor () {
        var noteElement = document.getElementById('noteEditable')
        if (noteElement.innerHTML === '输入任务描述') {
          return true
        }
      }
    },
    watch: {
      'itemNote': function (newValue) {
        if (typeof newValue === 'undefined') {
          return
        }
        if (this.noteChangeTimes === 0 && newValue) {
          this.noteChangeTimes += 1
          var noteElement = document.getElementById('noteEditable')
          this.newItemNote = newValue
          noteElement.innerHTML = newValue
          this.isBlank = false
        }
      }
    },
    mounted () {
      var noteElement = document.getElementById('noteEditable')
      if (this.pNote) {
        noteElement.innerHTML = this.pNote
      }
    },
    methods: {
      inputFocus () {
        if (this.isBlank) {
          var noteElement = document.getElementById('noteEditable')
          if (noteElement.innerHTML === '输入任务描述') {
            noteElement.innerHTML = ''
          }
          this.isBlank = false
        }
      },
      inputChange () {
        var noteElement = document.getElementById('noteEditable')
        this.newItemNote = noteElement.innerHTML
        // this.$dispatch('text-change', this.newItemNote)
      },
      inputBlur () {
        var noteElement = document.getElementById('noteEditable')
        var inputHTML = noteElement.innerHTML
        this.newItemNote = inputHTML
        this.itemNote = this.newItemNote
        if (inputHTML) {
          this.isBlank = false
        } else {
          this.isBlank = true
          noteElement.innerHTML = this.DEFAULT_NOTE
        }
        var that = this
        var params = {pNote: this.newItemNote}
        if (this.currentTodo.kanbanId) {
          var newParams = {note: this.newItemNote, id: this.currentTodo.id}
          this.$store.dispatch('postKanbanItemNote', newParams).then(() => {
            this.currentTodo.note = this.newItemNote
//            that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
            that.$router.replace(window.history.back())
          })
        } else {
          this.$store.dispatch('postNote', params).then(() => {
            that.$store.commit('TD_CURRENT_TODO_REPEAT_EDITED', params)
            that.$router.replace(window.history.back())
          })
        }
      }
    }
  }
</script>
<style>
  .despSubmit{
    margin-top: 0.5rem;
  }
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
