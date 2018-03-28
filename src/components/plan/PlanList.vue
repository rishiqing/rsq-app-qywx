<template>
  <div>
  <ul class="PlanList">
    <Plan
      v-for="item in planItems"
      :item="item"
      :key="item.id"
    ></Plan>
  </ul>
  <r-nav></r-nav>
    <!--<v-touch @tap="toCreate">-->
   <!--<div>去新建</div>-->
    <!--</v-touch>-->
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
  .PlanList{
    background-color: white;
    padding-left: 0.3rem;
    margin-top: 0.1rem;
    margin-bottom: 1.5rem;
  }
</style>
