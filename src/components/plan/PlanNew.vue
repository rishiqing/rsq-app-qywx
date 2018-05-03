<template>
  <div>
    <input
      v-model="content"
      type="text"
      class="create-plan"
      placeholder="计划名称">
    <div class="wrap-plan-member">
      <span class="plan-member-word">计划成员</span>
      <v-touch
        class="plan-member"
        @tap="showNativeMemberEdit">
        <span class="people-number">{{ selectedLocalList.length }}人</span>
        <avatar
          v-for="item in selectedLocalList"
          :key="item.rsqUserId"
          :src="item.avatar"
          :username="item.name"/>
        <i class="icon2-arrow-right-small arrow-right"/>
      </v-touch>
    </div>
    <div class="wrap-most">
      <div class="plan-templ">计划模板:</div>
      <div class="wrap-all">
        <div
          v-for="item in imgs"
          :key="item.id">
          <v-touch
            class="wrap-muban"
            @tap=" currentTemplate = item">
            <img
              v-show="currentTemplate === item"
              src="../../assets/img/selected.png"
              class="templ cover-img">
            <img
              :src="item.cover"
              class="templ">
            <div class="templ-name">{{ item.name }}</div>
          </v-touch>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="create">
          创建
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import PlanList from 'com/plan/PlanList'
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'

  export default {
    name: 'PlanNew',
    components: {
      'PlanList': PlanList,
      'avatar': Avatar
    },
    data () {
      return {
        content: '',
        currentTemplate: {},
        selectedLocalList: [],
        rsqIdArray: []
      }
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      planItems () {
        return this.$store.state.planList
      },
      selectedItems () {
        return this.selectedLocalList.length > 10 ? this.selectedLocalList.slice(0, 11) : this.selectedLocalList
      },
      imgs () {
        return this.$store.state.plan.coverList
      }
    },
    created () {
      if (this.imgs === null) {
        this.$store.dispatch('getTemplate').then(() => {
          if (this.imgs.length > 0) {
            this.currentTemplate = this.imgs[0]
          }
        })
      } else {
        this.currentTemplate = this.imgs[0]
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '新建计划'})
      var createrId = [this.$store.state.loginUser.rsqUser.id]
      this.getMember(createrId)
    },
    methods: {
      create () {
        var that = this
        if (!this.content) {
          return window.rsqadmg.execute('alert', {message: '请填写计划名称'})
        }
        window.rsqadmg.exec('showLoader', {text: '创建中...'})
        var params = {
          name: this.content,
          cover: this.currentTemplate.cover,
          selectGroupId: 'all',
          tKanbanId: this.currentTemplate.id,
          accessIds: this.rsqIdArray.toString()
        }
        this.$store.dispatch('postPlan', params).then((res) => {
          window.rsqadmg.exec('hideLoader')
          window.rsqadmg.exec('toast', {message: '创建成功'})
          that.$router.go(-1)
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
//        var disabledArray = util.extractProp(this.disabledLocalList, 'userId')
        window.rsqadmg.exec('selectDeptMember', {
          btnText: '确定',  //  选择器按钮文本，pc端需要的参数
          multiple: true, //  默认false，选择单人
          maximum: -1,  //  可选择人数的上限，默认-1不限制人数
          title: that.selectTitle, //  选择器标题，pc端需要的参数
          corpId: corpId,  //  加密的企业 ID，
          selectedIds: selectedArray,
          disabledIds: [], //  不能选的人
          success (res) {
//            var list = res; //返回选中的成员列表[{openid:'联系人openid',name:'联系人姓名',headImg:'联系人头像url'}]
//              that.memberList = res
            if (res.length === 0) {
              return this.$emit('member-changed', [])
            }
            var idArray = util.extractProp(res.result.userList, 'id')
//            window.rsqadmg.exec('showLoader')
            that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
              .then(function (idMap) {
//                  window.rsqadmg.exec('hideLoader')
                var userArray = util.getMapValuePropArray(idMap)
                that.selectedLocalList = userArray
                that.rsqIdArray = util.extractProp(userArray, 'rsqUserId')
//                that.$emit('member-changed', rsqIdArray)
              })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .plan-member avatar{
    margin-right: 0.3rem;
  }
  input::placeholder{
    color: #B1B1B1;
  }
  .cover-img{
    position: absolute;
    top: 0;
    width: 2.08rem;
    height: 1.173rem;
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
    color: #333333;
  }
  .wrap-plan-member{
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
  .post-plan{
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
    color: #333333;
    margin-left: 0.3rem;
  }
  .templ-name{
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
  .create-plan{
    height: 1.466rem;
    background-color: white;
    padding: 0.3rem;
    margin-top: 0.2rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
  }
</style>
