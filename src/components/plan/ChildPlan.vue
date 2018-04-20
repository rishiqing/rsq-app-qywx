<template>
  <div class="child-plan-main">
    <div class="topChild">
      <div class="top-sub">
        <v-touch class="top-subPlan"  @tap="changeState($event)" >
          <span class="top-subPlan-name">{{currentSubPlan.name}}</span>
          <i class="icon2-arrow-down arrow-down"></i>
        </v-touch>
        <v-touch @tap="delaySetPlan($event)" class="setPlan">
          <i class="icon2-set set"></i>
        </v-touch>
      </div>
    </div>
    <div class="wrap">
      <ul class="cardList">
        <li v-for="item in cardList" class="cardBorder">
          <div class="wrap-cardBorder">
            <div class="card-top">
              <div class="wrap-left-cardName">
                <span class="cardName">{{item.name}}</span>
                <span class="finish-number" v-show="totalNumber(item) != 0">{{finishNumber(item)}}/{{totalNumber(item)}}</span>
              </div>
              <v-touch @tap="editCard($event,item)">
                <i class="icon2-other other"></i>
              </v-touch>
            </div>
            <ul class="task-border">
              <li v-for="kanbanItem in finishdown(item.kanbanItemList)" class="cardItem" :class="{'isFinish':kanbanItem.isDone}">
                <v-touch @tap="toEdit(kanbanItem)">
                  <div class="cardItem-left">
                    <v-touch @tap="finish(kanbanItem)" class="selected-icon">
                      <i class="icon2-seleced-mult card-selected" v-show="kanbanItem.isDone"></i>
                    </v-touch>
                    <v-touch @tap="finish(kanbanItem)" class="selected-icon">
                      <i class="icon2-check-box card-selected" v-show="!kanbanItem.isDone"></i>
                    </v-touch>
                  </div>
                  <div class="cardItem-right">
                    <div class="cardItem-name" :class="{'text-grey': kanbanItem.isDone, 'text-mid-line': kanbanItem.isDone}">{{kanbanItem.name}}</div>
                    <div class="task-right-second" v-show="(finalDate(kanbanItem) !== null || total(kanbanItem.subItems) !== null || kanbanItem.itemLabelIds !== null)">
                      <div class="wrap-task-time">
                        <i class="icon2-schedule task-schedule" v-show="finalDate(kanbanItem) !== null"></i>
                        <span v-show="finalDate(kanbanItem) !== null" class="kanbanItem-time">{{finalDate(kanbanItem)}}</span>
                      </div>
                      <div class="wrap-subitem-finish" v-show="total(kanbanItem.subItems) !== null" :class="{'second-margin': finalDate(kanbanItem) !== null}">
                        <img src="../../assets/img/subitem.png" alt="" class="subitem-img" v-show="total(kanbanItem.subItems) !== null">
                        <span class="subItem-finish" v-show="total(kanbanItem.subItems) !== null">{{subItemfinish(kanbanItem.subItems)}}/{{total(kanbanItem.subItems)}}</span>
                      </div>
                      <span class="label-name" :class="{'if-has-margin': (kanbanItem.subItems !== null || finalDate(kanbanItem) !== null)}">{{label(kanbanItem)}}</span>
                    </div>
                      <r-task-member
                       :item="kanbanItem"
                      >

                      </r-task-member>
                      <!--<avatar v-for="item in selectedItems(kanbanItem.joinUserIds)"-->
                              <!--:key="item.rsqUserId"-->
                              <!--:src="item.avatar"-->
                              <!--:username="item.name">-->
                      <!--</avatar>-->
                  </div>
                </v-touch>
              </li>
            </ul>
            <v-touch @tap="addTask(item)"  class="wrap-add-task">
              <i class="icon2-add2 add-task"></i>
              <div class="post-new-task">添加任务</div>
            </v-touch>
          </div>
        </li>
        <li class="cardBorder">
          <v-touch @tap="showCreate" class="wrap-post-card" v-show=!createCard>
            <img src="../../assets/img/card.png" alt="" class="card" v-show=!createCard>
            <div v-show=!createCard class="post-card">新建任务列表</div>
          </v-touch>
          <div v-show="createCard" class="post-card-input-main">
            <input type="text" placeholder="输入列表名称" v-model="cardName" class="post-card-input" ref="textareaComment">
            <div class="wrap-button">
              <v-touch @tap="showEmpty">
                <span class="card-input-btn no">取消</span>
              </v-touch>
              <v-touch @tap="postCard">
                <span class="card-input-btn yes">确定</span>
              </v-touch>
            </div>
          </div>
        </li>
      </ul>
      <div class="wrap-index-flag">
        <div class="index-flag">
          <div v-for="(item, index) in cardList" class="circle" :class="{'currentSelected': currNum === index}"></div>
          <div class="circle" :class="{'currentSelected': currNum === cardList.length}"></div>
        </div>
      </div>
    </div>
    <ul class="childPlan" :class="{'showChild': initialState}">
        <li v-for="item in childPlanlist">
          <v-touch @tap="getCardList($event,item)" class="childPlan-item">
            <div class="sub-plan-forward">
              <img src="../../assets/img/subplan.png" alt="" class="sub-plan-img">
              <div class="sub-plan-name">{{item.name}}</div>
            </div>
            <i class="icon2-selected selected-icon" v-show="item.name === currentSubPlan.name"></i>
          </v-touch>
        </li>
      <v-touch @tap="toEditPlan($event)" class="">
        <li class="post-sub-plan" v-show="ifShowCreate">
          <img src="../../assets/img/edit.png" alt="" class="sub-plan-img">
          <div class="sub-plan-name">新建子计划</div>
        </li>
      </v-touch>
    </ul>
    <div class="mask" v-show="initialState"></div>
  </div>
</template>
<script>
  import TaskMember from 'com/plan/TaskMember'
  import def from 'ut/defaultUtil'
  import util from 'ut/jsUtil'
  import Avatar from 'com/pub/TextAvatar'
  export default {
    data () {
      return {
        initialState: false,
        currentSubPlan: '',
        emptyCard: false,
        createCard: false,
        cardName: '',
        currNum: 0,
        local: [],
        ifShowCreate: false
      }
    },
    components: {
      'avatar': Avatar,
      'r-task-member': TaskMember
    },
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      },
      childPlanlist () {
        return this.$store.state.childPlanlist
      },
      cardList () {
        return this.$store.state.cardList
      },
      currentSubPlanOftask () {
        return this.$store.state.currentSubPlan
      },
      pos () {
        return this.$store.state.pos
      },
      num () {
        return this.$store.state.num
      },
      labels () {
        return this.$store.state.labels
      },
      userRoles () {
        return this.currentPlan.userRoles
      }
    },
    methods: {
      toEdit (item) {
        this.$store.dispatch('setCurrentTodo', item)// 设置当前todo不管是inbox的todo还是ssche的todo
        this.$router.push('/todo/' + item.id)
      },
      finishdown (items) {
        var newItems = []
//        console.log(JSON.stringify(items))
        if (items !== null && items.length !== 0) {
          for (var i = 0; i < items.length; i++) {
            if (!items[i].isDone) {
              newItems.push(items[i])
            }
          }
          newItems.sort(function (item1, item2) {
            return item1.displayOrder - item2.displayOrder > 0
          })
          for (i = 0; i < items.length; i++) {
            if (items[i].isDone) {
              newItems.push(items[i])
            }
          }
          return newItems
        } else {
          return []
        }
      },
      selectedItems (ids) {
        var corpId = this.loginUser.authUser.corpId
        this.$store.dispatch('fetchUseridFromRsqid', {corpId: corpId, idArray: [ids]})
          .then(idMap => {
//            alert('idmap' + JSON.stringify(idMap))
            this.local = util.getMapValuePropArray(idMap)
//            window.rsqadmg.exec('hideLoader')
          })
      },
      label (item) {
//        console.log('this.lables' + this.labels)
        if (item.itemLabelIds && this.labels) {
          var a = this.labels.filter(function (lable) {
            return lable.id === parseInt(item.itemLabelIds)
          })
          if (a.length > 0) {
            return a[0].name
          }
        }
      },
      total (item) {
        return item ? item.length : null
      },
      subItemfinish (items) {
        if (items) {
          return items.filter(function (item) {
            return item.isDone
          }).length
        }
      },
      finalDate (item) {
        if (item.startDate && (item.startDate === item.endDate)) {
          return this.regularDate(item.startDate)
        } else if (item.startDate && (item.startDate !== item.endDate)) {
          return this.regularDate(item.startDate) + '-' + this.regularDate(item.endDate)
        } else if (item.dates) {
          var result = ''
          var dates = item.dates.split(',')
          for (var i = 0; i < dates - 1; i++) {
            result += parseInt(dates[i].substring(4, 6)) + '月' + parseInt(dates[i].substring(6, 8)) + '日' + ','
          }
          return result + parseInt(dates[dates.length - 1].substring(4, 6)) + '月' + parseInt(dates[dates.length - 1].substring(6, 8)) + '日'
        } else {
          return null
        }
      },
      regularDate (date) {
        return parseInt(date.substring(5, 7)) + '月' + parseInt(date.substring(8, 10)) + '日'
      },
      initLayout () {
        var that = this
        var aLi = document.getElementsByClassName('cardBorder')
        var box = document.querySelector('.cardList')
        var wrap = document.querySelector('.wrap')
//        console.log(box)
//        console.log(aLi)
//        console.log(aLi.length)
//        var aLiWidth = box.offsetWidth
//        var aLiWidth = 375
//        wrap.style.height = aLi[0].offsetHeight + 'px'
        // 设置盒子的宽度
        box.style.width = (aLi.length) * 100 + '%'
        for (var i = 0; i < aLi.length; i++) {
          aLi[i].style.width = 1 / (aLi.length) * 100 + '%'
        }
        if (this.currentSubPlanOftask) {
          box.style.left = this.pos
//          console.log(this.num)
//          console.log('wrap' + wrap)
          this.currNum = this.num
        }
        // 初始化手指坐标点
        var startPoint = 0
        var startEle = 0
//        var currNum = 0
        wrap.addEventListener('touchstart', function (e) {
          e.preventDefault()
          console.log('触发了')
          startPoint = e.changedTouches[0].pageX
          startEle = box.offsetLeft
        })
        wrap.addEventListener('touchmove', function (e) {
          var currPoint = e.changedTouches[0].pageX
          var disX = currPoint - startPoint
          var left = startEle + disX
          if (Math.abs(Math.abs(startEle) - Math.abs(left)) > 20) {
            box.style.left = left + 'px'
          }
        })
        wrap.addEventListener('touchend', function (e) {
          e.preventDefault()
          var left = box.offsetLeft
//          console.log('aLiWidth' + aLiWidth)
          console.log('startEle' + startEle)
          console.log('left' + left)
// 判断正在滚动的图片距离左右图片的远近，以及是否为最后一张或者第一张
          if (Math.abs(startEle) - Math.abs(left) > 10 && left < 0) {
//            var currNum = Math.floor(-left / aLiWidth)
            that.currNum = that.currNum - 1
          } else if ((left < 0 && Math.abs(left) - Math.abs(startEle) > 10) || (left > 0 && left < startEle)) {
//            currNum = Math.ceil(-left / aLiWidth)
            that.currNum = that.currNum + 1
          }
//          console.log('currNum' + that.currNum)
          that.currNum = that.currNum >= (aLi.length - 1) ? aLi.length - 1 : that.currNum
          console.log('currNum' + that.currNum)
          that.currNum = that.currNum <= 0 ? 0 : that.currNum
          box.style.left = -that.currNum * wrap.offsetWidth + 'px'
//          console.log(box.style.left)
//          console.log('wrap.offsetWidth' + wrap.offsetWidth)
        })
      },
      editCard (e, item) {
        console.log(e)
        e.preventDefault()
//        e.cancelBubble()
        var that = this
        window.rsqadmg.exec('actionsheet', {
          buttonArray: ['编辑卡片名称', '删除卡片'],
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                that.$prompt('请输入卡片名称', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  var params = {
                    name: value,
                    id: item.id
                  }
                  that.$store.dispatch('updateCardName', params).then((res) => {
                    item.name = value
                    that.$store.commit('UPDATE_SUBPLAN_NAME', res)
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '取消输入'
                  })
                })
//                var name = prompt('请输入卡片名称', item.name)
//                if (name) {
//                  var params = {
//                    name: name,
//                    id: item.id
//                  }
//                  var that = this
//                  that.$store.dispatch('updateCardName', params).then((res) => {
//                    item.name = name
//                    that.$store.commit('UPDATE_SUBPLAN_NAME', res)
//                  })
//                }
                break
              case 1:
                var params = {
                  name: name,
                  id: item.id
                }
                that.$store.dispatch('deleteCard', params)
                break
              default:
                break
            }
          }
        })
      },
      addTask (item) {
        this.$store.commit('SAVE_CURRENT_CARD_ID', item)
        var pos = document.getElementsByClassName('cardList')[0].style.left
//        console.log(pos)
        this.$store.commit('SAVE_CURRENT_SUBPLAN', this.currentSubPlan)
        this.$store.commit('SAVE_CURRENT_LEFT', {pos: pos, num: this.currNum})
        this.$store.dispatch('setCurrentTodo', def.allDefaultTodo())
        this.$router.push('/todo/new/schedule')
      },
      finish (item) {
        this.$store.dispatch('finishCardItem', {id: item.id, isDone: !item.isDone}).then(() => {
          item.isDone = !item.isDone
        })
      },
      finishNumber (item) {
        if (item.kanbanItemList) {
          return item.kanbanItemList.filter(function (item) {
            return item.isDone
          }).length
        }
      },
      totalNumber (item) {
        return item.kanbanItemList ? item.kanbanItemList.length : 0
      },
      delaySetPlan (e) {
        window.setTimeout(() => {
          this.setPlan(e)
        }, 50)
      },
      setPlan (e) {
        e.preventDefault()
        console.log(e)
        var that = this
        window.rsqadmg.exec('actionsheet', {
          buttonArray: ['计划设置', '重命名当前子计划', '删除当前子计划', '取消'],
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                that.$router.push('/plan/setPlan')
                break
              case 1:
                that.$prompt('请输入子计划名称', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
//                var name = prompt('请输入子计划名称', that.currentSubPlan.name)
//                if (name) {
                  var params = {
                    name: value,
                    id: that.currentSubPlan.id
                  }
//                  var that = this
                  that.$store.dispatch('updateName', params).then((res) => {
                    that.$store.commit('UPDATE_SUBPLAN_NAME', res)
                  })
                })
                break
              case 2:
                that.$store.dispatch('deleteChildPlan', that.currentSubPlan).then(() => {
                  that.currentSubPlan = that.childPlanlist[0]
                  that.$store.dispatch('getCardList', that.childPlanlist[0]).then(
                    (res) => {
                      that.$store.commit('SAVE_CARD', res.kanbanCardList)
                    })
                })
                break
              default:
                break
            }
          }
        })
      },
      showEmpty () {
        this.emptyCard = true
        this.createCard = false
        this.cardName = ''
      },
      showCreate () {
        this.emptyCard = false
        this.createCard = true
        this.$nextTick(() => {
          this.$refs.textareaComment.focus()
        }) //
      },
      changeState (e) {
        e.preventDefault()
        this.initialState = !this.initialState
      },
      getCardList (e, item) {
        console.log('进来getcard')
        e.preventDefault()
        var that = this
        this.initialState = false
        this.currentSubPlan = item
        window.rsqadmg.exec('showLoader', {'text': '加载中'})
        this.$store.dispatch('getCardList', item).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
//            that.initLayout()
          }).then(() => {
            that.$nextTick(() => {
              var aLi = document.getElementsByClassName('cardBorder')
              var box = document.querySelector('.cardList')
              box.style.width = (aLi.length) * 100 + '%'
              for (var i = 0; i < aLi.length; i++) {
                aLi[i].style.width = 1 / (aLi.length) * 100 + '%'
              }
              window.rsqadmg.exec('hideLoader')
            })
          })
      },
      toEditPlan (e) {
        e.preventDefault()
        this.initialState = !this.initialState
        this.$prompt('请输入新建子计划名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          var params = {
            name: value,
            kanbanId: this.currentPlan.id
          }
          var that = this
          this.$store.dispatch('postSubPlan', params).then((res) => {
            that.$store.commit('ADD_SUB_PLAN', res)
          })
        })
//        var name = prompt('请输入子计划名称', '')
//        if (name) {
//          var params = {
//            name: name,
//            kanbanId: this.currentPlan.id
//          }
//          var that = this
//          this.$store.dispatch('postSubPlan', params).then((res) => {
//            that.$store.commit('ADD_SUB_PLAN', res)
//          })
//        } else {
//        }
//        this.$router.push('/plan/createSubplan')
      },
      postCard () {
        var params = {
          name: this.cardName,
          childKanbanId: this.currentSubPlan.id
        }
        var that = this
        this.$store.dispatch('postCard', params).then((res) => {
          that.cardName = ''
          that.$store.commit('ADD_CARD', res)
        }).then(() => {
          that.$nextTick(() => {
            var aLi = document.getElementsByClassName('cardBorder')
            var box = document.querySelector('.cardList')
            box.style.width = (aLi.length) * 100 + '%'
            for (var i = 0; i < aLi.length; i++) {
              aLi[i].style.width = 1 / (aLi.length) * 100 + '%'
            }
          })
        })
      },
      deleteItem () {
        var that = this
//        that.$store.dispatch('deleteChildPlan', that.currentSubPlan).then(() => {
//          alert('回到vue')
//          that.currentSubPlan = that.childPlanlist[0]
//          that.$store.dispatch('getCardList', that.childPlanlist[0]).then(
//            (res) => {
//              that.$store.commit('SAVE_CARD', res.kanbanCardList)
//            })
//        })
        that.$router.push('/plan/setPlan')
      }
    },
    created () {
//      var that = this
    },
    mounted () {
      // 拿到看板列表以及看板的任务列表。。。好多数据
//      var that = this
      var createrId = this.$store.state.loginUser.rsqUser.id
      for (var i = 0; i < this.userRoles.length; i++) {
        if (this.userRoles[i].userId === createrId) {
          this.ifShowCreate = true
        }
      }
      document.title = this.currentPlan.name
      var that = this
      if (this.currentSubPlanOftask) {
        this.currentSubPlan = this.currentSubPlanOftask
      } else if (this.childPlanlist) {
        this.currentSubPlan = this.childPlanlist[0]
      }
      window.rsqadmg.exec('showLoader', {'text': '加载中'})
      if (this.currentSubPlanOftask) {
        this.$store.dispatch('getCardList', this.currentSubPlanOftask).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          }).then(() => {
            that.$nextTick(() => {
              that.initLayout()
              window.rsqadmg.exec('hideLoader')
            })
          })
      } else {
        this.$store.dispatch('getCardList', this.childPlanlist[0]).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          }).then(() => {
            that.$nextTick(() => {
              that.initLayout()
              window.rsqadmg.exec('hideLoader')
            })
          })
      }
    }
//    beforeRouteEnter (to, from, next) {
//      next(vm => {
//        if (from.name === 'PlanList') {
//          vm.currentSubPlanOftask = ''
//          alert(' this.currentSubPlanOftask' + vm.currentSubPlanOftask)
//        }
//      })
//    }
  }
</script>
<style>
  .el-input__inner:focus{
    border: 1px solid #dcdfe6
  }
  .el-message-box{
    width: 8rem;
    height: 6rem;
  }
  .wrap-index-flag{
    width: 96%;
    display: flex;
    justify-content: center;
  }
  .wrap-left-cardName{
    display: flex;
    align-items: center;
  }
  .second-margin{
    margin-left: 0.2rem;
  }
  .if-has-margin{
    margin-left: 0.2rem;
  }
  .selected-icon{
    display: flex;
    align-items: flex-start;
    padding-top: 0.05rem;
  }
  .cardItem-right .text-grey{
    color: #9B9B9B
  }
  .label-name{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FF7A7A
  }
  .wrap-subitem-finish{
    height: 0.453rem;
    display: flex;
    align-items: center;
  }
  .task-right-second{
    display: flex;
    align-items: center;
    height: 0.453rem;
    margin-top: 0.2rem;
    /*justify-content: space-around;*/
  }
  .subitem-img{
    width: 0.3rem;
    height: 0.3rem;
  }
  .subItem-finish{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #B1B1B1;
    margin-left: 0.2rem;
  }
  .wrap-task-time{
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
  }
  .kanbanItem-time{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #B1B1B1;
    margin-left: 0.2rem;
  }
  .task-schedule{
    font-size: 14px;
    display: block;
    margin-top: -0.1rem;
    color: #B1B1B1;
  }
  div.currentSelected{
    background: rgba(0,0,0,0.22);
    border: 1px solid rgba(255,255,255,0.32);
  }
  .index-flag{
    display: flex;
    align-items: center;
    /*width: 4rem;*/
    height: 20px;
    margin: 0 auto;
    justify-content: space-around;
  }
  .circle{
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    background-color: white;
    border: 1px solid rgba(0,0,0,0.22);
    margin-left: 0.2rem;
  }
  .wrap-add-task{
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
  }
  .add-task{
    font-size: 14px;
  }
  .wrap-cardBorder{
    background-color: #F7F7F7;
    padding: 0.3rem;
    /*height: 95%;*/
  }
  .cardList{
    /*height: 13rem;*/
    /*height: 80vh;*/
    /*height: 95%;*/
    /*display: flex;*/
    /*width:400%;*/
    position: relative;
    /*transition: 0.1s;*/
  }
  .wrap{
    position: relative;
    overflow: hidden;
    /*height: 97%;*/
    height: 92vh;
    background-color: white;
    /*height: 14rem;*/
  }
  .cardBorder{
    float: left;
    box-sizing: border-box;
    /*height: 100%;*/
    position: relative;
    /*margin: 0.6rem;*/
    /*width: 25%;*/
  }
  .cardItem-left{
    float: left;
    margin-left: 0.2rem;
  }
  .cardItem-right{
    margin-left: 1rem;
  }
  .post-new-task{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #4A4A4A;
    /*color:red;*/
    margin-left: 0.2rem;
  }
  .isFinish{
    opacity: 0.6;
  }
  .card-selected{
    font-size: 14px;
    /*border: 1px solid #D8D8D8;*/
    border-radius: 1px;
    color: #D8D8D8;
  }
  .cardItem-name{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.96px;
    word-break: break-all;
    /*line-height: 10px;*/
  }
  .cardItem{
    background: #FFFFFF;
    box-shadow: 0 1px 2px 0 rgba(218,218,218,0.58);
    border-radius: 2px;
    margin-top: 0.3rem;
    padding: 0.2rem;
  }
  .cardItem:first-child{
    margin-top: 0;
  }
  .card-top{
    display: flex;
    align-items: center;
    height: 1.5rem;
    justify-content: space-between;
  }
  /*.el-message-box{*/
    /*width: 220px;*/
  /*}*/
  .other{
    color: #D8D8D8;
    border-radius: 100px;
  }
  .finish-number{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9B9B9B;
    margin-left: 0.2rem;
  }
  .cardList{
    background: white;
    border-radius: 2px;
    margin: 0.4rem;
    margin-top: 0;
    margin-bottom: 0;
    transition: 0.1s;
    overflow: hidden;
    /*padding: 0.3rem;*/
  }
  .wrap-button{
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
  .yes{
    color: #FFFFFF;
    background-color: #48A1FA ;
    border-radius: 3px;
  }
  .no{
    background-color: #F5F5F5;
    color: #959595;
    border: 1px solid #959595;
    border-radius: 3px;
    margin-right: 0.3rem;
  }
  .card-input-btn{
    width: 1.76rem;
    height: 0.93rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 17px;
  }
  .post-card-input{
    height: 1.25rem;
    padding-left: 0.3rem;
    border-radius: 4px;
  }
  .post-card-input-main{
    height: 3.173rem;
    background: #F5F5F5;
    padding: 0.3rem;
  }
  .child-plan-main{
    background-color: white;
    /*overflow: hidden;*/
    height: 100vh;
  }
  .wrap-post-card{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 95%;
    height: 1.7rem;
    background: #F5F5F5;
    border-radius: 1px;
    margin: 0 auto;
  }
  .post-card{
    font-family: PingFangSC-Medium;
    font-size: 17px;
    color: #666666;
    margin-left: 0.3rem;
  }
  .card{
    width: 20px;
    height: 20px;
  }
  .post-sub-plan{
    display: flex;
    align-items: center;
    height: 1.1rem;
  }
  .sub-plan-forward{
    display: flex;
    align-items: center;
  }
  .childPlan-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.1rem;
    border-bottom: 1px solid #E0E0E0;
  }
  .selected-icon{
    color: #55A8FD;
    font-size: 14px;
    margin-right: 0.3rem
  }
  .sub-plan-img{
    width: 20px;
    height: 20px;
  }
  .sub-plan-name{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #3D3D3D;
    margin-left: 0.3rem;
    width: 8rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .setPlan{
    display: flex;
    align-items: center;
  }
  .set{
    font-size: 14px;
    color: #4F77AA;
  }
  .arrow-down{
    font-size: 14px;
    margin-left: 0.1rem;
  }
  .top-subPlan-name{
    max-width: 4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #3D3D3D;
  }
  .top-sub{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.3rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
  }
  .top-subPlan{
    display: flex;
    align-items: center;
  }
  .mask{
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    opacity: 0.5;
  }
  .card{
    position: relative;
    z-index: 2
  }
  .cardList:after{
    clear: both;
  }
  .task-border{
    /*height: 10rem;*/
    height: 67vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    /*border: 1px solid yellow;*/
    /*background-color: white;*/
  }
  .cardBorder{
    margin-top: 0.3rem;
    padding-right: 0.7rem;
    /*background: #F7F7F7;*/
    border-radius: 2px;
    /*padding: 0.3rem;*/
    /*border: 3px solid blue*/
  }
  .cardBorder:first-child{
    /*margin-left: 0.3rem;*/
  }
  .cardName{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #000000;
    max-width: 4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .topChild{
    z-index: 100;
    position: relative;
    background-color: white;
    border-bottom: 1px solid #EAEAEA;
  }
  ul.showChild{
    top: 1.3rem
  }
  .childPlan {
    position: fixed;
    top:-20rem;
    transition: 0.5s;
    z-index: 50;
    background-color: white;
    width: 96%;
    padding-left: 0.3rem;
    box-shadow: 0 2px 2px 0 rgba(233,233,233,0.50);
  }
</style>
