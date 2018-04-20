<template>
  <v-touch @tap="toChildPlan">
    <li class="plan">
      <div class="forward-plan">
        <img
          :src="item.cover"
          class="plan-image">
        <span class="plan-name">{{ item.name }}</span>
      </div>
      <i
        v-show="item.starMark"
        class="icon2-star-target-2 star"/>
    </li>
  </v-touch>
</template>
<script>
  export default {
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
      currentSubPlanOfTask () {
        return this.$store.state.currentSubPlan
      }
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
              that.$router.push('/plan/' + this.currentPlan.id + '/child-plan')
            })
          })
      }
    }
  }
</script>
<style>
  .forward-plan{
    display: flex;
    align-items: center;
    height: 100%;
  }
  .plan-image{
    width: 0.906rem;
    height: 0.906rem;
  }
  .plan-name{
    width: 7rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #3D3D3D;
    margin-left: 0.3rem;
  }
  .plan{
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    padding-right: 0.3rem;
    border-bottom: 1px solid #EAEAEA;
  }
  .star{
    color: #F8E71C;
    font-size: 16px;
    margin-right: 0.3rem;
  }
</style>
