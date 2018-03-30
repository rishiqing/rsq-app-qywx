<template>
  <div>
    <div class="plan-set-top">
      <div class="wrap-img">
        <img :src=currentPlan.cover alt="" class="plan-set-img">
        <v-touch class="wrap-name" @tap="showEditName">
          <input class="plan-set-name" v-model="currentPlan.name" :class="{'editState': editState}" @blur="savePlanName"/>
          <img src="../../assets/img/set.png" alt="" class="plan-set-sec-img" v-show="!editState">
        </v-touch>
        <span class="creator-time">由 {{creatorName}} 于{{standardTime}}创建</span>
      </div>
    </div>
    <div class="plan-set-second">
      <div class="plan-member-count">
       <span class="plan-member-word">计划成员</span>
        <div class="wrap-plan-member-count-num">
          <span class="plan-member-count-num">{{currentPlan.userRoles.length}}人</span>
          <i class="icon2-arrow-right arrow-right-plan"></i>
        </div>
      </div>
      <v-touch class="wrap-plan-member" @tap="showNativeMemberEdit">
        <avatar v-for="item in selectedLocalList"
                :key="item.rsqUserId"
                :src="item.avatar"
                :username="item.name">
        </avatar>
        <i class="icon2-add add-member"></i>
      </v-touch>
    </div>
    <div class="setStar">
      <span class="plan-set-star">设为星标计划</span>
      <v-touch @tap="toggleAllDay">
        <input class="mui-switch" type="checkbox" :checked=isStar>
      </v-touch>
    </div>
    <v-touch @tap="ifDelPlan">
      <div class="plan-set-bot" v-show="isOwn">删除计划</div>
      <div class="plan-set-bot" v-show="!isOwn">退出计划</div>
    </v-touch>
  </div>
</template>
<script>
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'
  export default {
    data () {
      return {
        editState: false,
        planName: '',
        selectedLocalList: [],
        isOwn: false,
        creatorName: ''
      }
    },
    components: {
      'avatar': Avatar
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      },
      isStar () {
        return this.currentPlan.starMark
      },
      loginUser () {
        return this.$store.getters.loginUser || {}
      },
      userId () {
        return this.loginUser.authUser.userId ? this.loginUser.authUser.userId : 'dingtalkupload'
      },
      standardTime () {
        var date = this.currentPlan.dateCreated.substr(0, 10)
        var year = date.substring(0, 4)
        var month = parseInt(date.substring(5, 7))
        var day = parseInt(date.substring(8, 10))
        return year + '年' + month + '月' + day + '日'
      },
      rsqIds () {
        var rsqIdArray = []
        this.currentPlan.userRoles.forEach(function (item) {
          rsqIdArray.push(item.userId)
        })
        return rsqIdArray
      }
    },
    methods: {
      savePlanName () {
        this.editState = false
        console.log(this.currentPlan.name)
        this.$store.dispatch('updatePlanName', {'name': this.currentPlan.name, 'id': this.currentPlan.id})
      },
      showEditName () {
        this.editState = true
      },
      toggleAllDay () {
//        alert(this.isChecked)
        if (this.isStar) {
          this.$store.dispatch('cancelStar', {kanbanId: this.currentPlan.id})
        } else {
          this.$store.dispatch('saveStar', {kanbanId: this.currentPlan.id})
        }
        this.isChecked = !this.isChecked
      },
      ifDelPlan () {
        if (this.isOwn) {
          var that = this
          this.$store.dispatch('deletePlan', {id: this.currentPlan.id}).then(() => {
            that.$router.replace('/plan/PlanList')
          })
        } else {
          this.$store.dispatch('quitPlan', {id: this.currentPlan.id}).then(() => {
            that.$router.replace('/plan/PlanList')
          })
        }
      },
      getMember (id) {
        var corpId = this.loginUser.authUser.corpId
        //  暂时去掉loader
//        window.rsqadmg.exec('showLoader')
//        alert(id)
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: id})
          .then(idMap => {
//            alert('idmap' + JSON.stringify(util.getMapValuePropArray(idMap)))
            this.selectedLocalList = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
          })
      },
      showNativeMemberEdit () {
        var that = this
        var corpId = that.loginUser.authUser.corpId
//        console.log('提取之前内容是' + JSON.stringify(this.selectedLocalList))
        var selectedArray = util.extractProp(this.selectedLocalList, 'userId')
//        alert('提取之后内容是' + (selectedArray))
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
            if (res.length === 0) {
              return this.$emit('member-changed', [])
            }
//            console.log('返回来的res是' + JSON.stringify(res))
            var idArray = util.extractProp(res.result.userList, 'id')
//            alert('返回来的idarray是' + idArray)
//            window.rsqadmg.exec('showLoader')
            that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
              .then(function (idMap) {
                var userArray = util.getMapValuePropArray(idMap)
                alert('userArray' + JSON.stringify(userArray))
                var rsqIdArray = util.extractProp(userArray, 'rsqUserId')
                alert('rsqIdArray' + rsqIdArray)
                that.$store.dispatch('updatePlanMember', { id: that.currentPlan.id, accessIds: rsqIdArray.toString() }).then((res) => {
                  that.selectedLocalList = userArray
                  alert('res.userRoles' + JSON.stringify(res.userRoles))
                  that.currentPlan.userRoles = res.userRoles
                })
//                var params = {
//                  receiverIds: idArray.join(','),
//                  addJoinUsers: compRes.addList.join(','),
//                  deleteJoinUsers: compRes.delList.join(',')
//                }
//        alert(JSON.stringify(params))
//                window.rsqadmg.execute('showLoader', {text: '保存中...'})
//                this.$store.dispatch('updateTodo', {editItem: params}).then(() => {
//                  this.joinUserRsqIds = idArray
//                  window.rsqadmg.exec('hideLoader')
//                  window.rsqadmg.execute('toast', {message: '保存成功'})
//                that.selectedLocalList = userArray
//                  alert('userArray' + JSON.stringify(userArray))
//                  alert('rsqIdArray' + JSON.stringify(rsqIdArray))
//                that.$emit('member-changed', rsqIdArray)
              })
          }
        })
      }
    },
    mounted () {
      this.getMember(this.rsqIds)
      var corpId = this.loginUser.authUser.corpId
      this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: [this.currentPlan.creatorId]})
        .then(idMap => {
          this.creatorName = util.getMapValuePropArray(idMap)[0].name
          if (parseInt(util.getMapValuePropArray(idMap)[0].userId) === parseInt(this.userId)) {
            this.isOwn = true
          }
        })
    }
  }
</script>
<style>
  .arrow-right-plan{
    margin-left: 0.2rem;
  }
  .wrap-plan-member-count-num{
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
  }
  .plan-set-second{
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    background-color: white;
    margin: 0.5rem 0;
  }
  .wrap-plan-member{
    display: flex;
    align-items: center;
    height: 1.333rem;
  }
  .plan-member-word{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #666666;
  }
  .plan-member-count-num{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: rgba(25,31,37,0.56);
  }
  .plan-member-count{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1rem;
    /*padding-left: 0.3rem;*/
    /*padding-right: 0.3rem;*/
    border-bottom: 1px solid #F5F5F5;
  }
  .add-member, .arrow-right-plan{
    font-size: 14px;
  }
  .add-member{
    color: #D6D6D6;
    font-size: 23px;
    margin-left: 0.3rem;
  }
  .arrow-right-plan {
    color: rgba(25,31,37,0.28);
  }
  .wrap-name .editState{
    background: #F3F3F3;
    max-width: 5rem;
    /*padding-left: 1rem;*/
  }
  .wrap-name{
    display: flex;
    align-items: center;
    /*margin-left: 1rem;*/
    justify-content: center;
    align-items:center;
  }
  .plan-set-sec-img{
    width: 0.5rem;
    height: 0.5rem;
    margin-left: 0.1rem;
  }
  .plan-set-bot{
    height: 1.4rem;
    background-color: #D34435 ;
    width: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #FFFFFF;
    border-radius: 5px;
    margin: 0 auto;
    margin-top: 0.3rem;
  }
  .creator-time{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(177,177,177,0.88);
  }
  .plan-set-star{
    margin-left: 0.3rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #666666;
  }
  .setStar{
    height: 1.52rem;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-top: 0.3rem;
  }
  .wrap-img{
    text-align: center;
  }
  .plan-set-top{
    display: flex;
    justify-content: center;
    background-color: white;
    height: 3.866rem;
    padding: 0.5rem 1rem;
    margin-top: 0.3rem;
  }
  .plan-set-name{
    outline:none;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #666666;
    opacity: 0.66;
    /*background: #F3F3F3;*/
    border: 0 solid #E4E4E4;
    border-radius: 1px;
    max-width:1.98rem;
    height: 0.645rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    /*text-overflow: ellipsis;*/
    /*overflow: hidden;*/
    /*white-space:nowrap;*/
  }
  .plan-set-img{
    width: 1.386rem;
    height: 1.386rem;
    border-radius: 9px;
  }
  .setStar{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
