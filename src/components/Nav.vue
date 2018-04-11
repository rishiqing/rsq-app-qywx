<template>
  <div class="bot" style="position: fixed;bottom: 0;left: 0;right: 0;">
      <div class="left">
        <v-touch class="left-sche" @tap="reload('/sche')" :class="{'is-active': '/sche' == currentPath}">
          <span><i class="icon2-schedule richeng" :class="{'is-active': '/sche' == currentPath}"></i></span>
          <p class="sche " :class="{'is-active': '/sche' == currentPath}">日程</p>
        </v-touch>
      </div>
      <div class="mid">
        <v-touch class="" @tap="createNew">
          <i class="icon2-add-circle add" ></i>
        </v-touch>
      </div>
      <div class="right">
        <v-touch class="right-me" @tap="reload('/plan/PlanList')" :class="{'is-active': '/plan/PlanList' == currentPath}">
          <img src="../assets/img/Group18.png" alt="" class="plan-icon"   v-show="'/plan/PlanList' == currentPath">
          <img src="../assets/img/Group18Copy.png" alt="" class="plan-icon" v-show="'/plan/PlanList' !== currentPath">
          <!--<i class="icon2-member me" :class="{'is-active': '/plan/PlanList' == currentPath}"></i>-->
          <p class="my" :class="{'is-active': '/plan/PlanList' == currentPath}">计划</p>
        </v-touch>
      </div>
    </div>
</template>
<script>
  import def from 'ut/defaultUtil'

  export default {
    name: 'Nav',
    data () {
      return {}
    },
    computed: {
      count () {
        return this.$store.getters.getCount
      },
      currentPath () {
        return this.$store.state.sys.currentPath.split('?')[0]
      },
      currentNumDate () {
        return this.$store.getters.defaultNumTaskDate
      }
    },
    methods: {
      reload (page) {
        this.$router.replace(page)
      },
      createNew () {
        //  过去的日期不允许创建任务
        if (this.currentNumDate + 24 * 3600 * 1000 < new Date().getTime()) {
          return window.rsqadmg.exec('topTips', {message: '过去的日期不能创建日程'})
//          return window.rsqadmg.exec('toast', {message: '过去的日期不能创建日程'})
        }
        if (this.currentPath === '/plan/PlanList') {
          this.$router.push('/plan/Main')
        } else {
          this.$store.dispatch('setCurrentTodo', def.allDefaultTodo())
          this.$router.push('/todo/new/schedule')
        }
      }
    }
  }
</script>
<style scoped>
  .right-me{
    /*padding-bottom: 0.6rem;*/
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
  }
  .plan-icon{
    font-size:0.586rem;
  }
  .is-active{
    color:#55A8FD
  }
  .richeng {
    font-size:0.586rem;
    color:  #999999;
    display: block;
  }
  .bot{
    display: flex;
    justify-content: center;
    align-items: center;
    border-top:1px solid #CDCDCD;
    height: 1.306rem;
    background-color: #FDFDFF;;
  }
  .richeng{
    font-size: 0.586rem;
    color: #999999;
    /*display: block;*/
  }
  .sche{
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    margin:0;
    padding:0;
    margin-top:0.053rem;
  }
  .me{
    display: block;
    font-size: 0.586rem;
    color:   #999999;;
  }
  .my{
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #999999;
    letter-spacing: 0;
    margin: 0;
    padding:0;
    margin:0 auto;
    margin-top:0.053rem;
  }
  .left{
    position: absolute;
    left: 2.053rem;
    /*bottom:0.23rem;*/
    /*padding-bottom:0.026rem;*/
    height: 1.306rem;
    /*top:50%;*/
    /*margin-top: -0.453rem;*/
    display: flex;
    align-items: center;
    text-align: center;
    /*justify-content: center;*/
  }
  .right{
    text-align: center;
    /*padding-bottom:0.026rem;*/
    position: absolute;
    right: 2.11rem;
    /*bottom:0.23rem;*/
    /*bottom:50%;*/
    /*margin-bottom: -0.45rem;*/
    height: 1.306rem;
    display: flex;
    align-items: center;
    /*justify-content: center;*/
  }
  .mid{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.306rem;
  }
  .add{
    color:#4D93DE;
    font-size: 29.6px;
    display: block;
  }
  .bot:after{
    content:'';
    display: block;
    clear: both;
  }
  .plan-icon{
    width: 0.6rem;
    height:0.6rem
  }
  /*img{*/
    /*width: 1.866rem;*/
    /*height: 1.866rem;*/
    /*margin-top:3.653rem ;*/
  /*}*/
</style>
