<template>
  <div>
    <v-touch class="wrap-empty-plan"  @tap="toCreate" v-show="planItems.length === 0">
      <img src="../../assets/img/plan-empty.png" alt="" class="plan-empty">
      <span class="post-new-plan">新建计划</span>
    </v-touch>
    <ul class="PlanList" v-show="planItems.length > 0" :class="{'planCount': planCount}">
      <Plan
        v-for="item in planItems"
        :item="item"
        :key="item.id"
      ></Plan>
    </ul>
    <r-nav></r-nav>
  </div>
</template>
<script>
  import Plan from 'com/plan/Plan'
  import nav from 'com/Nav'
  export default {
    data () {
      return {
      }
    },
    components: {
      'Plan': Plan,
      'r-nav': nav
    },
    computed: {
      planItems () {
        return this.$store.state.planlist
      },
      planCount () {
        return this.planItems.length > 8
      }
    },
//    props: {
//      planItems: Array
//    },
    methods: {
      toCreate () {
        this.$router.push('/plan/Main')
      }
    },
    mounted () {
      this.$store.dispatch('getPlan').then((res) => {
        this.$store.commit('SAVE_PLANS', res)
//          that.$router.replace(window.history.back())
      })
    }
  }
</script>
<style>
  .planCount{
    padding-bottom: 1.5rem;
  }
  .post-new-plan{
    font-size: 18px;
    font-family: PingFangSC-Medium;
    margin-left: 0.2rem;
  }
  .wrap-empty-plan{
    display: flex;
    align-items: center;
    padding: 0.3rem;
    border: 1px solid lightgray;
  }
  .plan-empty{
    width: 1rem;
    height: 1rem;
  }
  .PlanList{
    background-color: white;
    padding-left: 0.3rem;
    /*padding-bottom: 1.5rem;*/
    margin-top: 0.1rem;
    /*margin-bottom: 2.9rem;*/
  }
</style>
