<template>
  <div>
    <ul
      v-if="planItems.length > 0"
      :class="{'plan-count': planCount}"
      class="plan-list">
      <r-plan
        v-for="item in planItems"
        :key="item.id"
        :item="item"/>
      <li
        class="plan"
        @click="toCreate">
        <div class="forward-plan">
          <img
            src="../../assets/img/add2.png"
            class="plan-image">
          <span class="plan-name">新建计划</span>
        </div>
      </li>
    </ul>
    <v-touch
      v-else
      class="itm-lst"
      @tap="toCreate">
      <img src="../../assets/img/plan-empty.png">
      <p class="shouye">还没有计划，赶快点击“+”号创建吧</p>
    </v-touch>
    <r-nav/>
  </div>
</template>
<script>
  import Plan from 'com/plan/Plan'
  import Nav from 'com/Nav'

  export default {
    name: 'PlanList',
    components: {
      'r-plan': Plan,
      'r-nav': Nav
    },
    data () {
      return {
      }
    },
    computed: {
      planItems () {
        return this.$store.state.planList
      },
      planCount () {
        return this.planItems.length > 8
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '计划'})
      this.$store.dispatch('getPlan').then((res) => {
        this.$store.commit('SAVE_PLANS', res)
      })
    },
    methods: {
      toCreate () {
        this.$router.push('/plan/create')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .plan-count{
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
  .plan-list{
    background-color: white;
    padding-left: 0.3rem;
    margin-top: 20px;
    overflow-x: hidden;
  }
  .itm-lst{
    text-align: center;
    background-color: #F5F5F5;
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
      letter-spacing: 0;
    }
  }
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
    font-size: 17px;
    color: #3D3D3D;
    margin-left: 0.3rem;
    color: #2F7DCD;
  }
  .plan{
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #EAEAEA;
  }
</style>
