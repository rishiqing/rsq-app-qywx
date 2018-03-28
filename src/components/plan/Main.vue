<template>
  <div>
    <input type="text" v-model="content" class="createPlan" placeholder="计划名称">
    <div class="wrapPlanMember">
      <span class="plan-member-word">计划成员</span>
      <div class="plan-member">
        <span class="people-number">人</span>
        <i class="icon2-arrow-right-small arrow-right"></i>
      </div>
    </div>
    <div class="wrap-most">
      <div class="plan-templ">计划模板:</div>
      <div class="wrap-all">
          <div v-for="item in imgs">
            <v-touch @tap=" currentIndex = item.index"  class="wrap-muban">
              <img src="../../assets/img/selected.png" alt="" class="templ cover-img" v-show="currentIndex === item.index">
              <img :src=item.addr alt="" class="templ">
              <div class="templName">{{item.word}}</div>
            </v-touch>
          </div>
      </div>
    </div>
    <v-touch @tap="create">
      <div class="postPlan">创建</div>
    </v-touch>
  </div>
</template>
<script>
  import PlanList from 'com/plan/PlanList'
  export default {
    data () {
      return {
        content: '',
        imgs: [
          {addr: 'https://images.timetask.cn/cover/default/kanban_v1/card-default-1.png', word: '空白模板', index: 0},
          {addr: 'https://images.timetask.cn/cover/custom/kanban/15168660700001345312.png', word: '敏捷开发', index: 1},
          {addr: 'https://images.timetask.cn/cover/custom/kanban/15168660530001345312.png', word: '产品设计', index: 2},
          {addr: 'https://images.timetask.cn/cover/custom/kanban/15168660240001345312.png', word: '需求管理', index: 3}
        ],
        currentIndex: 0
      }
    },
    components: {
      'PlanList': PlanList
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      planItems () {
        return this.$store.state.planlist
      }
    },
    methods: {
      create () {
        var that = this
        var params = {
          name: this.content,
          cover: this.imgs[this.currentIndex].addr
        }
        this.$store.dispatch('postPlan', params).then((res) => {
//          console.log('返回' + JSON.stringify(res))
          that.$router.replace(window.history.back())
        })
      }
    },
    mounted () {
//      this.$store.dispatch('getPlan').then((res) => {
//        this.$store.commit('SAVE_PLANS', res)
//          that.$router.replace(window.history.back())
//      })
    }
  }
</script>
<style>
  input::placeholder{ /*WebKit browsers*/
    color: #B1B1B1;
  }
  .cover-img{
    position: absolute;
    top: 0;
    width: 2.08rem;
    height: 1.173rem;
    /*opacity: 0.3;*/
    left: 0px;
    right: 0;
  }
  .people-number{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: rgba(25,31,37,0.56);
  }
  .plan-member-word{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #666666;
  }
  .wrapPlanMember{
    display: flex;
    justify-content: space-between;
    align-items: center;
     height: 1.466rem;
    background-color: white;
    margin-top: 0.3rem;
    padding-left: 0.3rem;
    padding-right: 0.2rem;
  }
  .plan-member{
    display: flex;
    align-items:  center;
  }
  .arrow-right{
    font-size: 14px;
  }
  .postPlan{
    width: 94%;
    height: 1.263rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2F7DCD;
    border-radius: 5px;
    color: white;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    margin: 0 auto;
    margin-top: 0.3rem;
  }
  .wrap-most{
    background-color: white;
    margin-top: 0.3rem;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
  }
  .plan-templ{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #3D3D3D;
    margin-left: 0.3rem;
  }
  .templName{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #8C8C8C;
  }
  .wrap-all{
    display: flex;
    align-items: center;
    margin-top: 0.6rem;
  }
  .wrap-muban{
    position: relative;
    text-align: center;
    margin-left: 0.3rem;
  }
  .templ{
    width: 2.08rem;
    height: 1.173rem;
  }
  .createPlan{
    height: 1.466rem;
    background-color: white;
    padding: 0.3rem;
    margin-top: 0.2rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
  }
</style>
