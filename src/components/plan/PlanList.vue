<template>
  <div>
    <!--<v-touch class="wrap-empty-plan"  @tap="toCreate" v-show="planItems.length === 0">-->
      <!--<img src="../../assets/img/plan-empty.png" alt="" class="plan-empty">-->
      <!--<span class="post-new-plan">新建计划</span>-->
    <!--</v-touch>-->
    <ul class="PlanList" v-if="planItems.length > 0" :class="{'planCount': planCount}">
      <Plan
        v-for="item in planItems"
        :item="item"
        :key="item.id"
      ></Plan>
    </ul>
    <v-touch v-else class="itm-lst" @tap="toCreate">
      <img src="../../assets/img/plan-empty.png" alt="">
      <p class="shouye">还没有计划，赶快点击“+”号创建吧</p>
    </v-touch>
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
      window.rsqadmg.exec('setTitle', {title: '计划'})
      this.$store.dispatch('getPlan').then((res) => {
        this.$store.commit('SAVE_PLANS', res)
//          that.$router.replace(window.history.back())
      })
    }
  }
</script>
<style lang="scss" scoped>
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
  .itm-lst{
    text-align: center;
    background-color: #F8F8F8;
    height: 78%;

    img{
      width: 1.866rem;
      height: 1.866rem;
      margin-top:3.653rem ;
    }
    .shouye{
      padding: 0;
      margin:0;
      margin-top:0.418rem;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #55A8FD;
      letter-spacing: 0
    }
  }
</style>
