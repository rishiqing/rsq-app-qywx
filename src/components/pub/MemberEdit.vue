<template>
  <ul class="wrap-memberEdit">
    <li v-for="item in departList" class="memberEdit">
      <v-touch @tap="gotoMember(item)">
        <span class="departName">{{item.name}}</span>
      </v-touch>
    </li>
  </ul>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      departList () {
        return this.$store.state.userList
      }
    },
    methods: {
      gotoMember (item) {
        if (item.childList.length > 0) {
          this.$store.commit('SAVE_USER', {item: item.childList})
        } else {
          console.log('人员列表是' + JSON.stringify(item.userList))
          this.$store.commit('SAVE_MEMBER', item.userList)
          this.$router.replace('/pub/MemberList')
        }
      }
    },
    mounted () {
      console.log('本页面拿到的是' + JSON.stringify(this.departList))
    }
  }
</script>
<style>
  .wrap-memberEdit{
    border-top: 1px solid #e0e0e0;
    margin-top: 0.3rem;
  }
  .memberEdit{
    height: 1.466rem;
    border-bottom: 1px solid #e0e0e0;
    padding-left: 0.3rem;
  }
  .departName{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #3D3D3D;
  }
</style>
