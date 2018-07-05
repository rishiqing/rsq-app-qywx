<template>
  <v-touch @tap="delayCallFix">
    <div
      class="outer-wrap bottom-border" >
      <span class="inner-key">{{ planName }}</span>
      <i class="icon2-arrow-right-small arrow"/>
    </div>
  </v-touch>
</template>
<script>
  export default {
    name: 'MoveToPlan',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      kanbanItem () {
        return this.$store.state.todo.currentTodo.kanbanItem
      },
      planName () {
        if (this.kanbanItem) {
          return this.$store.state.todo.currentTodo.kanbanItem.kanbanName || ''
        } else {
          return '添加到计划'
        }
      }
    },
    methods: {
      delayCallFix (e) {
        window.setTimeout(() => {
          this.moveToPlan(e)
        }, 50)
      },
      moveToPlan () {
        if (this.$store.state.todo.currentTodo.editControl.from) {
          this.$router.push('/sche/todo/move')
        } else {
          window.rsqadmg.exec('alert', {message: '您非该任务创建者，暂时无法进行此操作！'})
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .outer-wrap{
    display: flex;
    align-items: center;
    position: relative;
    line-height: 56px;
    background-color: transparent;
  }
  .inner-key{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 80%;
  }
  .has-padding{
    padding-left: 3%;
  }
  .edit-padding-left{
    left: 1.3rem;
  }
  .bottom-border{
    // border-bottom: 1px solid #E0E0E0;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    height: 100%;
    line-height: 56px;
    right: 0.2rem;
}
</style>
