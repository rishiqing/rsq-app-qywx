<template>
  <v-touch class="" @tap="showMemberEdit">
    <div class="outer-wrap":class="{'hasPadding':newItem, 'bottom-border': editTime}">
      <span class="inner-key">{{indexTitle}}</span>
      <span class="inner-value">{{nameConcat}}{{selectedLocalList.length > 3 ? '等':''}}{{selectedLocalList.length}}人</span>
      <i class="icon2-arrow-right-small arrow"></i>
    </div>
  </v-touch>
</template>
<style scoped>
  .outer-wrap{
    display: flex;
    align-items: center;
    position: relative;
    line-height: 1.3rem;
    background-color: white;
  }
  .inner-key{
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #333333;
  }
  .inner-value {
    display: block;
    position: absolute;
    top:50%;
    margin-top: -0.65rem;
    right: 0.94rem;
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #999999;
    letter-spacing: 0;
    /* 防止溢出 */
    max-width: 7rem;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:50%;
    margin-top: -0.25rem;
    right: 0.2rem;
  }
  .isInbox{
    border-bottom: 1px solid #E3E3E3;
  }
  .hasPadding{
    padding-left: 3%;
  }
  .edit-padding-left{
    left:1.3rem
  }
  .bottom-border{
    border-bottom: 1px solid #E0E0E0;
  }
</style>
<script>
  import { Promise } from 'es6-promise'
  import util from 'ut/jsUtil'
  import SelectMember from 'com/pub/SelectMember'
  import Avatar from 'com/pub/TextAvatar'

  export default {
    data () {
      return {
        localList: [],  //  人员选择列表
        selectedLocalList: [],  //  已选择的人员选择列表
        disabledLocalList: []  //  本地禁用的人员列表
      }
    },
    props: {
      disabled: Boolean,
      isNative: Boolean,  //  是否使用钉钉应用本地的选择框
      indexTitle: String,
      selectTitle: String,
      userRsqIds: Array,    //  可选人
      selectedRsqIds: Array,  //  当前选中的人
      disabledRsqIds: Array,   //  不可选的人
      newItem: Boolean,
      editTime: Boolean
    },
    computed: {
      loginUser () {
        return this.$store.getters.loginUser
      },
      selectedItems () {
        return this.selectedLocalList.slice(this.selectedLocalList.length - 3)
      },
      nameConcat () {
        return this.selectedLocalList.map(function (o) {
          return o.name
        }).join('、')
      },
      memberCount () {
        return this.selectedLocalList.length <= 3
      },
      newMemberlessThree () {
        return this.newItem && this.memberCount
      },
      newMemberMoreThree () {
        return this.newItem && !this.memberCount
      }
    },
    watch: {
      userRsqIds (ids) {
        this.fetchUserIds(ids, 'localList')
      },
      selectedRsqIds (ids) {
        this.fetchUserIds(ids, 'selectedLocalList')
      },
      disabledRsqIds (ids) {
        this.fetchUserIds(ids, 'disabledLocalList')
      }
    },
    components: {
      'avatar': Avatar
    },
    methods: {
      fetchUsers () {
        this.$store.dispatch('fetchUsers')
      },

      showMemberEdit (e) {
        if (this.disabled) {
          window.rsqadmg.execute('topTips', {message: '过去的任务不能编辑'})
          return
        }
//        this.fetchUsers()
//        this.$router.push('/pub/MemberEdit')
        return this.isNative ? this.showNativeMemberEdit(e) : this.showWebMemberEdit(e)
      },
      showNativeMemberEdit () {
        var that = this
        var corpId = that.loginUser.authUser.corpId
        var selectedArray = util.extractProp(this.selectedLocalList, 'userId')
        var disabledArray = util.extractProp(this.disabledLocalList, 'userId')
        window.rsqadmg.exec('selectDeptMember', {
          btnText: '确定',  //  选择器按钮文本，pc端需要的参数
          multiple: true, //  默认false，选择单人
          maximum: -1,  //  可选择人数的上限，默认-1不限制人数
          title: that.selectTitle, //  选择器标题，pc端需要的参数
          corpId: corpId,  //  加密的企业 ID，
          selectedIds: selectedArray,
          disabledIds: disabledArray || [], //  不能选的人
          success (res) {
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
//                  alert('idMAP' + JSON.stringify(idMap))
//                  window.rsqadmg.exec('hideLoader')
                  var userArray = util.getMapValuePropArray(idMap)
//                  alert('userId是' + JSON.stringify(userArray))
                  var rsqIdArray = util.extractProp(userArray, 'rsqUserId')
//                  alert('userArray' + JSON.stringify(userArray))
//                  alert('rsqIdArray' + JSON.stringify(rsqIdArray))
                  that.$emit('member-changed', rsqIdArray)
                })
          }
        })
      },
      showWebMemberEdit () {
        // 显示之前先将所有获得焦点的元素失去焦点
        if (document.activeElement) {
          document.activeElement.blur()
        }
        var that = this
        var corpId = that.loginUser.authUser.corpId
        SelectMember.show({
          memberList: this.localList,
          selectedList: this.selectedLocalList,
          disabledIdList: this.disabledLocalList,
          success (selList) {
            var idArray = util.extractProp(selList, 'emplId')
            that.$store.dispatch('fetchRsqidFromUserid', {corpId: corpId, idArray: idArray})
                .then(function (idMap) {
                  that.selectedLocalList = util.getMapValuePropArray(idMap)
                  that.$emit('member-changed', that.selectedLocalList)
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
//            alert('idmap' + JSON.stringify(idMap))
            this[targetListName] = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
          })
      }
    },
    mounted () {
//      alert('传进来的selectedLocalList' + this.selectedLocalList)
    }
  }
</script>
