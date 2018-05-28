<template>
  <div class="check-failure">
    <img
      class="deletedSche"
      src="../../assets/img/deleted1.png">
    <p class="deleted">该日程已被删除</p>
    <v-touch @tap="returnTo">
      <div class="returnTo">返回首页</div>
    </v-touch>
  </div>
</template>
<script>
  export default {
    name: 'CheckFailure',
    data () {
      return {}
    },
    methods: {
      returnTo () {
        this.$router.replace('/sche')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .check-failure{
    text-align: center;
    position: absolute;
    top: 50%;
    left:50%;
    margin-top:-3.31rem ;
    margin-left:-1.351rem ;
  }
  .deletedSche{
    width:2.7rem ;
    height:2.7rem ;
  }
  .deleted{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0;
  }
  .returnTo{
    background: #2F7DCD;
    border-radius: 4px;
    width: 97px;
    height: 35px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 0;
    display:flex;
    align-items: center;
    justify-content: center;
    margin: 50px auto;
  }

</style>
