<template>
  <div>
    <div class="plan-set-top">
      <v-touch
        class="set-plan"
        @tap="upload">
        <span class="set-text">计划封面</span>
        <input
          ref="uploadImg"
          type="file"
          class="upload-img"
          @change="changeImg">
        <img
          :src="currentPlan.cover"
          class="plan-set-img">
        <img
          src="../../assets/img/right.png"
          class="rightab">
      </v-touch>
      <v-touch
        class="set-plan"
        @tap="showEditName">
        <span class="set-text">计划名称</span>
        <v-touch
          class="plan-set-name"
          @tap="showEditPlanName">
          <span>{{ currentPlan.name }}</span>
          <img
            src="../../assets/img/right.png"
            class="rightab">
        </v-touch>
      </v-touch>
      <!-- <span class="creator-time">由 {{ creatorName }} 于{{ standardTime }}创建</span> -->
    </div>
    <div class="plan-set-second">
      <div class="plan-member-count">
        <span class="plan-member-word">计划成员</span>
        <div class="wrap-plan-member-count-num">
          <span class="plan-member-count-num">{{ currentPlan.userRoles.length }}人</span>
        </div>
      </div>
      <v-touch
        class="wrap-plan-member"
        @tap="showNativeMemberEdit">
        <avatar
          v-for="item in selectedLocalList"
          :key="item.rsqUserId"
          :src="item.avatar"
          :username="item.name"
          :background-color="'rgb(74, 144, 226)'"
          :size="34"/>
        <i class="icon2-add add-member"/>
      </v-touch>
    </div>
    <div class="set-star">
      <span class="plan-set-star">设为星标计划</span>
      <v-touch @tap="toggleAllDay">
        <input
          :checked="isStar"
          class="mui-switch"
          type="checkbox">
      </v-touch>
    </div>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="delete-plan-btn weui-btn save"
          href="javascript:;"
          @tap="savePlan">
          保存
        </v-touch>
        <v-touch
          v-if="isOwn"
          tag="a"
          class="delete-plan-btn weui-btnt out"
          href="javascript:;"
          @tap="deletePlan">
          删除
        </v-touch>
        <v-touch
          v-else
          tag="a"
          class="delete-plan-btn weui-btn out"
          href="javascript:;"
          @tap="deletePlan">
          删除
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'
  import moment from 'moment'
  import { Promise } from 'es6-promise'
  import SelectMember from 'com/pub/SelectMember'

  export default {
    name: 'PlanSetting',
    components: {
      'avatar': Avatar
    },
    data () {
      return {
        editState: false,
        planName: '',
        isOwn: false,
        creatorName: '',
        localList: [],  //  人员选择列表
        selectedLocalList: [],  //  已选择的人员选择列表
        disabledLocalList: [],  //  本地禁用的人员列表
        creatorList: [], // 创建者
        memarr: []
      }
    },
    computed: {
      userRsqIds () {
        return this.$store.state.staff.list
      },
      selectedRsqIds () {
        return [this.$store.state.loginUser.rsqUser.id]
      },
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
      corpId () {
        return this.loginUser.authUser.corpId
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
      },
      memberCount () {
        return this.selectedLocalList.length <= 3
      },
      userRsqIdArray () {
        return this.userRsqIds.map(function (staff) {
          return staff.id
        })
      },
      creatorListArray () {
        return this.creatorList.map(function (staff) {
          return staff.rsqUserId
        })
      },
      selectRsqidArray () {
        return this.selectedLocalList.map(function (staff) {
          return staff.rsqUserId
        })
      },
      createrRsqIds () {
        return [this.$store.getters.loginUser.rsqUser.id]
      },
      disableRsqidArray () {
        return this.disabledRsqIds.map(function (staff) {
          return staff.id
        })
      }
    },
    watch: {
      selectedRsqIds () {
        this.fetchUserIds(this.selectedRsqIds, 'selectedLocalList')
      },
      disabledRsqIds () {
        this.fetchUserIds(this.disableRsqidArray, 'disabledLocalList')
      },
      createrRsqIds () {
        this.fetchUserIds(this.createrRsqIds, 'creatorList')
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: '计划设置'})
      this.getMember(this.rsqIds)
      var corpId = this.loginUser.authUser.corpId
      this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: [this.currentPlan.creatorId]})
        .then(idMap => {
          this.creatorName = util.getMapValuePropArray(idMap)[0].name
          if (parseInt(util.getMapValuePropArray(idMap)[0].userId) === parseInt(this.userId)) {
            this.isOwn = true
          }
        })
      this.fetchUserIds(this.userRsqIdArray, 'localList')
    },
    methods: {
      showEditPlanName () {
        this.$router.push('/plan/' + this.currentPlan.id + '/edit-name')
      },
      upload () {
        this.$refs.uploadImg.click()
      },
      changeImg (e) {
        const file = this.$refs.uploadImg.files[0]
        if (!new RegExp('image/').test(file.type)) {
          alert('请传入图片')
          return
        }
        const extNameArray = file.name.split('.')
        const extName = extNameArray[extNameArray.length - 1]
        const time = moment().format('YYYYMMDDHHmmss')
        const savedName = time + '.' + extName
        const task = {
          finished: false,
          isShowProgress: true,  //  刚创建未上传时显示进度条
          progress: 0,
          file: file
        }
        return this.$store.dispatch('uploadKanbanCoverImage', {
          pathId: this.corpId,
          task: task,
          savedName: savedName
        }).then(res => {
          this.$store.dispatch('updatePlanImg', {'cover': 'https://images.timetask.cn/cover/custom/kanban/' + savedName, 'id': this.currentPlan.id})
        })
      },
      showEditName () {
        this.editState = true
      },
      savePlan () {
        this.$router.go(-1)
      },
      toggleAllDay () {
        if (this.isStar) {
          this.$store.dispatch('cancelStar', {kanbanId: this.currentPlan.id})
        } else {
          this.$store.dispatch('saveStar', {kanbanId: this.currentPlan.id})
        }
        this.isChecked = !this.isChecked
      },
      deletePlan () {
        const that = this
        window.setTimeout(() => {
          window.rsqadmg.exec('confirm', {
            message: '确定删除计划：' + that.currentPlan.name + '?',
            success () {
              if (that.isOwn) {
                window.rsqadmg.exec('showLoader', {'text': '删除中'})
                that.$store.dispatch('deletePlan', {id: that.currentPlan.id}).then(() => {
                  window.rsqadmg.exec('hideLoader')
                  window.rsqadmg.exec('toast', {message: '已删除'})
                  that.$router.replace('/plan/list')
                })
              } else {
                window.rsqadmg.exec('showLoader', {'text': '退出中'})
                that.$store.dispatch('quitPlan', {id: that.currentPlan.id}).then((e) => {
                  if (e.message) {
                    window.rsqadmg.exec('alert', {message: e.message})
                  } else {
                    window.rsqadmg.exec('hideLoader')
                    window.rsqadmg.exec('toast', {message: '已退出'})
                    that.$router.replace('/plan/list')
                  }
                })
              }
            }
          })
        }, 50)
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
        const that = this
        SelectMember.show({
          nameAttribute: 'name',
          idAttribute: 'rsqUserId',
          memberList: this.localList,
          selectedIdList: this.selectRsqidArray,
          disabledIdList: this.disabledLocalList,
          // 转换为字符串
          creatorIdList: [this.createrRsqIds[0].toString()],
          success (selList) {
            const arr = selList.map(m => {
              return m.rsqUserId
            })
            window.rsqadmg.exec('setTitle', {title: '计划设置'})
            that.selectedLocalList = [...selList]
            that.memarr = [...arr]
            var arrstr = arr.join(',')
            that.$store.dispatch('updataPlan', {id: that.currentPlan.id, accessIds: arrstr})
              .then(function (res) {
                that.$store.commit('UPDATA_PLAN', res.userRoles)
              })
          },
          cancel () {
          }
        })
      },
      fetchUserIds (ids, targetListName) {
        if (!ids || ids.length === 0) {
          this[targetListName] = []
          return Promise.resolve()
        }
        var corpId = this.loginUser.authUser.corpId
        //  暂时去掉loader
//        window.rsqadmg.exec('showLoader')
        return this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: ids})
          .then(idMap => {
            this[targetListName] = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
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
    border-top: 0.5px solid #d4d4d4;
    border-bottom: 0.5px solid #d4d4d4;
  }
  .wrap-plan-member{
    display: flex;
    align-items: center;
    min-height: 1.333rem;
    height: 1.33rem;
    overflow: auto;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    max-width: 100%;
    width: 100%;
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
    justify-content: center;
    align-items:center;
  }
  .plan-set-sec-img{
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    right: -0.6rem;
  }
  .plan-set-sec-img > img {
    width: 100%;
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
  .set-star{
    height: 1.52rem;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-top: 0.3rem;
    border-top: 0.5px solid #d4d4d4;
    border-bottom: 0.5px solid #d4d4d4;
  }
  .wrap-img{
    text-align: center;
  }
  .plan-set-top{
    border-top: 0.5px solid #d4d4d4;
    background-color: white;
    height: 112px;
    margin-top: 0.3rem;
  }
  .plan-set-name{
    position: relative;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    opacity: 0.66;
    border-radius: 1px;
    height: 56px;
    line-height: 56px;
  }
  .plan-set-name > span {
    float: right;
    margin-right: 31px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #9C9C9C;
    line-height: 56px;
  }
  .plan-set-img{
    margin-right: 31px;
    float: right;
    margin-top: 10px;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    line-height: 56px;
  }
  .set-plan{
    width: 100%;
    height: 56px;
    border-bottom: 0.5px solid #d4d4d4;
    position: relative;
  }
  .set-text{
    float: left;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #000000;
    line-height: 56px;
    margin-left: 15px;
  }
  .upload-img{
    display: none;
  }
  .out{
    color: #000;
    border-radius: 5px;
    background-color: #fff;
  }
  .save{
    color: #fff;
    background: #2F7DCD;
    border-radius: 5px;
  }
  .rightab{
    position: absolute;
    right: 15px;
    top: 22px;
    width: 8px;
    height: 13px;
  }
  .weui-btn{
    border: 0;
  }
</style>
