<template>
  <div>
    <input type="text" v-model="content" class="createPlan" placeholder="计划名称">
    <div class="wrapPlanMember">
      <span class="plan-member-word">计划成员</span>
      <v-touch class="plan-member" @tap="showNativeMemberEdit">
        <span class="people-number">{{selectedLocalList.length}}人</span>
        <avatar v-for="item in selectedLocalList"
                :key="item.rsqUserId"
                :src="item.avatar"
                :username="item.name">
        </avatar>
        <i class="icon2-arrow-right-small arrow-right"></i>
      </v-touch>
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
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'
  export default {
    data () {
      return {
        content: '',
        imgs: [
          {addr: 'https://images.timetask.cn/cover/default/kanban_v1/card-default-1.png', word: '空白模板', index: 0, id: 2137},
          {addr: 'https://images.timetask.cn/cover/custom/kanban/15168660700001345312.png', word: '敏捷开发', index: 1, id: 2089},
          {addr: 'https://images.timetask.cn/cover/custom/kanban/15168660530001345312.png', word: '产品设计', index: 2, id: 2092},
          {addr: 'https://images.timetask.cn/cover/custom/kanban/15168660240001345312.png', word: '需求管理', index: 3, id: 2090}
        ],
        currentIndex: 0,
        selectedLocalList: [],
        rsqIdArray: []
      }
    },
    components: {
      'PlanList': PlanList,
      'avatar': Avatar
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
      },
      selectedItems () {
        return this.selectedLocalList.length > 10 ? this.selectedLocalList.slice(0, 11) : this.selectedLocalList
      }
    },
    methods: {
      create () {
        var that = this
        if (!this.content) {
          return window.rsqadmg.execute('alert', {message: '请填写计划名称'})
        }
        var params = {
          name: this.content,
          cover: this.imgs[this.currentIndex].addr,
          selectGroupId: 'all',
          tKanbanId: this.imgs[this.currentIndex].id,
          accessIds: this.rsqIdArray.toString()
        }
        this.$store.dispatch('postPlan', params).then((res) => {
//          alert(JSON.stringify(res.userRoles))
//          console.log('返回' + JSON.stringify(res))
          that.$router.replace(window.history.back())
        })
      },
      getMember (id) {
        var corpId = this.loginUser.authUser.corpId
        //  暂时去掉loader
//        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: id})
          .then(idMap => {
            this.selectedLocalList = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
          })
      },
      showNativeMemberEdit () {
        var that = this
        var corpId = that.loginUser.authUser.corpId
        var selectedArray = util.extractProp(this.selectedLocalList, 'userId')
//        alert('进来了')
//        console.log('提取之后内容是' + (selectedArray))
//        var disabledArray = util.extractProp(this.disabledLocalList, 'userId')
//        console.log('提取之后禁止内容是' + (selectedArray))
        window.rsqadmg.exec('selectDeptMember', {
          btnText: '确定',  //  选择器按钮文本，pc端需要的参数
          multiple: true, //  默认false，选择单人
          maximum: -1,  //  可选择人数的上限，默认-1不限制人数
          title: that.selectTitle, //  选择器标题，pc端需要的参数
          corpId: corpId,  //  加密的企业 ID，
          selectedIds: selectedArray,
          disabledIds: [], //  不能选的人
          success (res) {
//            alert('cuccess执行了' + JSON.stringify(res.result.userList))
//            var list = res; //返回选中的成员列表[{openid:'联系人openid',name:'联系人姓名',headImg:'联系人头像url'}]
//              that.memberList = res
            if (res.length === 0) {
              return this.$emit('member-changed', [])
            }
//            console.log('返回来的res是' + JSON.stringify(res))
            var idArray = util.extractProp(res.result.userList, 'id')
//            alert('返回来的idarray是' + idArray)
//            window.rsqadmg.exec('showLoader')
            that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
              .then(function (idMap) {
//                alert('idMAP' + JSON.stringify(idMap))
//                  window.rsqadmg.exec('hideLoader')
                var userArray = util.getMapValuePropArray(idMap)
//                alert('userArray' + JSON.stringify(userArray))
                that.selectedLocalList = userArray
                that.rsqIdArray = util.extractProp(userArray, 'rsqUserId')
//                alert('userArray' + JSON.stringify(that.rsqIdArray))
//                  alert('rsqIdArray' + JSON.stringify(rsqIdArray))
//                that.$emit('member-changed', rsqIdArray)
              })
          }
        })
      }
    },
    mounted () {
      var createrId = [this.$store.state.loginUser.rsqUser.id]
      this.getMember(createrId)
    }
  }
</script>
<style>
  .plan-member avatar{
    margin-right: 0.3rem;
  }
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
    font-size: 20px;
    color:rgba(25,31,37,0.28);
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
    overflow-x: hidden;
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
