<template>
  <li class="slider">
    <v-touch @tap="toChildPlan">
      <div class="forward-plan">
        <img
          :src="item.cover"
          class="plan-image">
        <span class="plan-name">{{ item.name }}</span>
        <i
          :class="{'icon2-selected': selected}"
          class="selected-icon"/>
      </div>
    </v-touch>
  </li>
</template>
<script>
  export default {
    name: 'ToPlan',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
      }
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      },
      selected () {
        if (this.$store.state.todo.currentTodo.kanbanItem) {
          return this.$store.state.todo.currentTodo.kanbanItem.kanbanId === this.item.id
        }
      }
    },
    mounted () {
    },
    methods: {
      toChildPlan () {
        var that = this
        this.$store.dispatch('getChildKanbanList', this.item).then(
          (res) => {
            this.$store.commit('SET_CURRENT_PLAN', res)
            that.$store.commit('SAVE_CHILD_PLAN', res.childKanbanList)
            that.$store.dispatch('getLabels', this.item).then((res) => {
              that.$store.commit('SAVE_LABELS', res)
            }).then(() => {
              this.$store.commit('SET_EMPTY_CURRENT_SUB_PLAN')
              that.$router.push('/sche/todo/' + this.currentPlan.id + '/moveplan')
            })
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .selected-icon{
    display: none;
    align-items: flex-start;
    padding-top: 0.05rem;
    line-height: 56px
  }
  .selected-icon{
    color: #55A8FD;
    font-size: 14px;
    margin-right: 0.3rem
  }
  .forward-plan{
    display: flex;
    align-items: center;
    height: 100%;
  }
  .plan-image{
    width: 36px;
    height: 36px;
    border-radius: 2px;
  }
  .plan-name{
    width: 7.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #3D3D3D;
    margin-left: 0.3rem;
  }
  .slider {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.5px solid #D4D4D4;
    width: 131%;
    position: relative;
    user-select: none;
    transition: transform 0.3s;
  }
   .slider:last-child {
    border-bottom: 0;
  }
  .icon2-selected{
    display: flex
  }
</style>
