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
          提交
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  const DEFAULT_NOTE = '输入任务描述'

  export default {
    name: 'PlanTodoNote',
    data () {
      return {}
    },
    computed: {
      currentKanbanItem () {
        return this.$store.state.plan.currentKanbanItem
      },
      note () {
        return this.currentKanbanItem.note
      },
      isOriginalEmpty () {
        const str = this.note ? this.note.trim() : ''
        return str === ''
      }
    },
    mounted () {
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
      inputChange () {
      },
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
        var params = {note: inputHTML, id: this.currentKanbanItem.id}
        this.$store.dispatch('updateKanbanItem', params).then(() => {
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
