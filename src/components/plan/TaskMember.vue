<template>
  <div class="task-member">
    <avatar
      v-for="item in local"
      :key="item.rsqUserId"
      :src="item.avatar"
      :username="item.name"/>
  </div>
</template>
<script>
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'
  export default {
    components: {
      'avatar': Avatar
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        local: []
      }
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      }
    },
    mounted () {
      var corpId = this.loginUser.authUser.corpId
//      alert('金莱尔')
      this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: [this.item.joinUserIds]})
        .then(idMap => {
//          alert('idmap' + JSON.stringify(util.getMapValuePropArray(idMap)))
          this.local = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
        })
    }
  }

</script>
<style>
  .task-member{
    margin-top: 0.2rem;
  }
  .task-member> *{
    border-radius: 0;
  }
</style>
