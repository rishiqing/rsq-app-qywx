<template>
  <div
    class="bot"
    style="position: fixed;bottom: 0;left: 0;right: 0;">
    <div class="con">
      <div class="left">
        <v-touch
          :class="{'is-active': '/sche' == currentPath}"
          class="left-sche"
          @tap="reload('/sche')">
          <span>
            <img
              v-show="'/sche' === currentPath"
              src="../assets/img/sches.svg"
              class="icon2-schedule richeng icon">
            <img
              v-show="'/sche' !== currentPath"
              src="../assets/img/sche.svg"
              class="icon2-schedule richeng icon">
          </span>
          <p
            :class="{'is-active': '/sche' == currentPath}"
            class="sche">
            我的日程
          </p>
        </v-touch>
      </div>
      <div class="mid">
        <v-touch
          :class="{'is-active': '/inbox' === currentPath}"
          class="right-me"
          @tap="toInbox">
          <img
            v-show="'/inbox' === currentPath"
            src="../assets/img/inboxs.svg"
            class="icon">
          <img
            v-show="'/inbox' !== currentPath"
            src="../assets/img/inbox.svg"
            class="icon">
          <p
            :class="{'is-active': '/inbox' === currentPath}"
            class="my">
            记事
          </p>
        </v-touch>
      </div>
      <div class="right">
        <v-touch
          :class="{'is-active': '/plan/list' === currentPath}"
          class="right-me"
          @tap="reload('/plan/list')">
          <img
            v-show="'/plan/list' === currentPath"
            src="../assets/img/plans.svg"
            class="icon">
          <img
            v-show="'/plan/list' !== currentPath"
            src="../assets/img/planns.svg"
            class="icon">
          <p
            :class="{'is-active': '/plan/list' === currentPath}"
            class="my">
            计划管理
          </p>
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  // import def from 'ut/defaultUtil'

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
      toInbox () {
        this.$router.push('/inbox')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .right-me{
    display: flex;
    flex-direction: column;
    justify-content:center;
    width: 100%;
    padding-top: 4px;
  }
  .icon,.left-sche{
    font-size:0.586rem;
    margin: 0 auto;
    padding-top: 4px;
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
    border-top:0.5px solid #D4D4D4;
    height: 50px;
    background-color: #FDFDFF;;
  }
  .richeng{
    font-size: 0.586rem;
    color: #999999;
  }
  .sche{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    margin:0;
    padding:0;
    // margin-top:0.053rem;
    margin-bottom: 4px;
  }
  .me{
    display: block;
    font-size: 0.586rem;
    color:   #999999;;
  }
  .my{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    margin: 0;
    padding:0;
    margin:0 auto;
    // margin-top:0.053rem;
    margin-bottom: 4px;
  }
  .left{
    // position: absolute;
    // left: 2.053rem;
    // height: 1.306rem;
    width: 33.333%;
    display: flex;
    align-items: center;
    text-align: center;
  }
  .right{
    text-align: center;
    // position: absolute;
    // right: 2.11rem;
    // height: 1.306rem;
    display: flex;
    align-items: center;
    width: 33.333%;
  }
  .mid{
    display: flex;
    align-items: center;
    justify-content: center;
    // height: 1.306rem;
    width: 33.333%;
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
  .icon{
    width: 22px;
    height:22px
  }
  .con{
    width: 78%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
