<template>
  <div class="check-failure">
    <img
      class="deletedSche"
      src="../../assets/img/delete.svg">
    <p class="deleted">该任务已被删除</p>
    <p class="deleted">您可登录日事清官网，在回收站查找已删除的任务</p>
    <v-touch @tap="returnTo">
      <div class="returnTo">回到{{ plan ? '计划' : '日程' }}</div>
    </v-touch>
  </div>
</template>
<script>
  export default {
    name: 'CheckFailure',
    data () {
      return {}
    },
    computed: {
      plan () {
        return this.$route.query.from === 'plan'
      }
    },
    methods: {
      returnTo () {
        if (!this.plan) {
          this.$router.replace('/sche')
        } else {
          this.$router.replace('/plan/list')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .check-failure{
    text-align: center;
    margin-top: 3.653rem;
  }
  .deletedSche{
    width:73px ;
    height:69px ;
  }
  .deleted{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0;
  }
  .deleted:first-of-type{
    margin-top: 30px;
  }
  .returnTo{
    height: 35px;
    font-family: PingFangSC-Regular;
    width:141px;
    height:36px;
    background:rgba(90,160,232,1);
    border-radius:23px;
    margin: 0 auto;
    margin-top: 30px;
    line-height: 36px;
    color:#fff
  }

</style>
