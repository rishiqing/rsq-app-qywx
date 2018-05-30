<template>
  <div class="child-plan-main">
    <div class="top-child">
      <div class="top-sub">
        <v-touch
          class="top-sub-plan"
          @tap="changeState" >
          <span class="top-sub-plan-name">{{ currentSubPlan.name }}</span>
          <i class="icon2-arrow-down arrow-down"/>
        </v-touch>
        <v-touch
          class="set-plan"
          @tap="delayCall('setPlan', $event)" >
          <img
            src="../../assets/img/setting.png"
            class="icon2-set set">
        </v-touch>
      </div>
    </div>
    <div class="wrap">
      <ul class="card-list">
        <li
          v-for="item in cardList"
          :key="item.id"
          class="card-border">
          <div class="wrap-card-border">
            <div class="card-top">
              <div class="wrap-left-card-name">
                <span class="card-name">{{ item.name }}</span>
                <span
                  v-show="totalNumber(item) !== 0"
                  class="finish-number" >
                  {{ finishNumber(item) }}/{{ totalNumber(item) }}
                </span>
              </div>
              <v-touch @tap="delayCall('editCard', $event, item)">
                <img
                  src="../../assets/img/moreset.png"
                  class="icon2-other other">
              </v-touch>
            </div>
            <ul class="task-border">
              <li
                v-for="kanbanItem in finishDown(item.kanbanItemList)"
                :key="kanbanItem.id"
                :class="{'is-finish':kanbanItem.isDone}"
                class="card-item" >
                <div>
                  <v-touch
                    class="card-item-left"
                    @tap="finish(kanbanItem)">
                    <div class="selected-icon">
                      <i
                        v-show="kanbanItem.isDone"
                        class="icon2-seleced-mult card-selected"/>
                      <i
                        v-show="!kanbanItem.isDone"
                        class="icon2-check-box card-selected"/>
                    </div>
                  </v-touch>
                  <v-touch
                    class="card-item-right"
                    @tap="toEdit(kanbanItem)">
                    <div
                      :class="{'text-grey': kanbanItem.isDone, 'text-mid-line': kanbanItem.isDone}"
                      class="card-item-name">
                      {{ kanbanItem.name }}
                    </div>
                    <div
                      v-show="(finalDate(kanbanItem) !== null || total(kanbanItem.subItems) !== null || kanbanItem.itemLabelIds !== null)"
                      class="task-right-second">
                      <div class="wrap-task-time">
                        <i
                          v-show="finalDate(kanbanItem) !== null"
                          class="icon2-schedule task-schedule" />
                        <span
                          v-show="finalDate(kanbanItem) !== null"
                          class="kanban-item-time">
                          {{ finalDate(kanbanItem) }}
                        </span>
                      </div>
                      <div
                        v-show="total(kanbanItem.subItems) !== null"
                        :class="{'second-margin': finalDate(kanbanItem) !== null}"
                        class="wrap-sub-item-finish" >
                        <img
                          v-show="total(kanbanItem.subItems) !== null"
                          src="../../assets/img/subitem.png"
                          class="sub-item-img">
                        <span
                          v-show="total(kanbanItem.subItems) !== null"
                          class="sub-item-finish" >
                          {{ subItemfinish(kanbanItem.subItems) }}/{{ total(kanbanItem.subItems) }}
                        </span>
                      </div>
                      <span
                        :class="{'if-has-margin': (kanbanItem.subItems !== null || finalDate(kanbanItem) !== null)}"
                        class="label-name" >
                        {{ label(kanbanItem) }}
                      </span>
                    </div>
                    <r-task-member
                      :item="kanbanItem"/>
                  </v-touch>
                </div>
              </li>
            </ul>
            <v-touch
              class="wrap-add-task"
              @tap="addTask(item)">
              <i class="icon2-add2 add-task"/>
              <div class="post-new-task">添加任务</div>
            </v-touch>
          </div>
        </li>
        <li class="card-border">
          <v-touch
            v-show="!createCard"
            class="wrap-post-card"
            @tap="showCreate">
            <img
              v-show="!createCard"
              src="../../assets/img/card.png"
              class="card">
            <div
              v-show="!createCard"
              class="post-card">
              新建任务列表
            </div>
          </v-touch>
          <div
            v-show="createCard"
            \class="post-card-input-main">
            <input
              ref="textareaComment"
              v-model="cardName"
              class="post-card-input"
              type="text"
              placeholder="输入任务列表名称">
            <div class="wrap-button">
              <v-touch @tap="showEmpty">
                <span class="card-input-btn no">取消</span>
              </v-touch>
              <v-touch @tap="postCard">
                <span class="card-input-btn yes">创建</span>
              </v-touch>
            </div>
          </div>
        </li>
      </ul>
      <div class="wrap-index-flag">
        <div class="index-flag">
          <div
            v-for="(item, index) in cardList"
            :key="item.id"
            :class="{'current-selected': currNum === index}"
            class="circle"/>
          <div
            :class="{'current-selected': currNum === cardList.length}"
            class="circle"/>
        </div>
      </div>
    </div>
    <ul
      :class="{'show-child': initialState}"
      class="child-plan">
      <li
        v-for="item in childPlanList"
        :key="item.id">
        <v-touch
          class="child-plan-item"
          @tap="getCardList($event,item)">
          <div class="sub-plan-forward">
            <img
              src="../../assets/img/subplan.png"
              class="sub-plan-img">
            <div class="sub-plan-name">{{ item.name }}</div>
          </div>
          <i
            v-show="item.name === currentSubPlan.name"
            class="icon2-selected selected-icon"/>
        </v-touch>
      </li>
      <v-touch @tap="delayCall('toEditPlan', $event)">
        <li
          v-show="ifShowCreate"
          class="post-sub-plan">
          <img
            src="../../assets/img/edit.png"
            class="sub-plan-img">
          <div class="sub-plan-name">编辑子计划</div>
        </li>
      </v-touch>
    </ul>
    <v-touch
      v-show="initialState"
      class="mask"
      @tap="changeState"/>
  </div>
</template>
<script>
  import TaskMember from 'com/plan/TaskMember'
  import def from 'ut/defaultUtil'
  import util from 'ut/jsUtil'

  export default {
    name: 'ChildPlan',
    components: {
      'r-task-member': TaskMember
    },
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
    computed: {
      currentPlan () {
        return this.$store.state.currentPlan
      },
      childPlanList () {
        return this.$store.state.childPlanList
      },
      cardList () {
        return this.$store.state.cardList
      },
      currentSubPlanOfTask () {
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
      },
      removePlanControl () {
        return this.currentPlan.editControl.removeKB
      }
    },
    mounted () {
      // 拿到看板列表以及看板的任务列表。。。好多数据
      var creatorId = this.$store.state.loginUser.rsqUser.id
      for (var i = 0; i < this.userRoles.length; i++) {
        if (this.userRoles[i].userId === creatorId) {
          this.ifShowCreate = true
        }
      }
      document.title = this.currentPlan.name
      var that = this
      if (this.currentSubPlanOfTask) {
        this.currentSubPlan = this.currentSubPlanOfTask
      } else if (this.childPlanList) {
        this.currentSubPlan = this.childPlanList[0]
      }
      // window.rsqadmg.exec('showLoader', {'text': '加载中'})
      if (this.currentSubPlanOfTask) {
        this.$store.dispatch('getCardList', this.currentSubPlanOfTask).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          }).then(() => {
            that.$nextTick(() => {
              that.initLayout()
              // window.rsqadmg.exec('hideLoader')
            })
          })
      } else {
        this.$store.dispatch('getCardList', this.childPlanList[0]).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          }).then(() => {
            that.$nextTick(() => {
              that.initLayout()
              // window.rsqadmg.exec('hideLoader')
            })
          })
      }
    },
    methods: {
      toEdit (item) {
        // 设置当前todo不管是inbox的todo还是ssche的todo
        this.$store.dispatch('setCurrentKanbanItem', item)
        this.$router.push('/plan/todo/' + item.id)
      },
      finishDown (items) {
        var newItems = []
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
            this.local = util.getMapValuePropArray(idMap)
          })
      },
      label (item) {
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
          for (let i = 0; i < dates.length; i++) {
            if (i === 3) {
              result += '...'
              break
            }
            result += parseInt(dates[i].substring(4, 6)) + '月' + parseInt(dates[i].substring(6, 8)) + '日' + ','
          }
          return result
        } else {
          return null
        }
      },
      regularDate (date) {
        return parseInt(date.substring(5, 7)) + '月' + parseInt(date.substring(8, 10)) + '日'
      },
      initLayout () {
        var that = this
        var aLi = document.getElementsByClassName('card-border')
        var box = document.querySelector('.card-list')
        var wrap = document.querySelector('.wrap')
        // 设置盒子的宽度
        box.style.width = (aLi.length) * 100 + '%'
        for (var i = 0; i < aLi.length; i++) {
          aLi[i].style.width = 1 / (aLi.length) * 100 + '%'
        }
        if (this.currentSubPlanOfTask) {
          box.style.left = this.pos
          this.currNum = this.num
        }
        // 初始化手指坐标点
        var startPoint = 0
        var startEle = 0
        wrap.addEventListener('touchstart', function (e) {
          // e.preventDefault()
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
          // e.preventDefault()
          var left = box.offsetLeft
          // 判断正在滚动的图片距离左右图片的远近，以及是否为最后一张或者第一张
          if (Math.abs(startEle) - Math.abs(left) > 10 && left < 0) {
            that.currNum = that.currNum - 1
          } else if ((left < 0 && Math.abs(left) - Math.abs(startEle) > 10) || (left > 0 && left < startEle)) {
            that.currNum = that.currNum + 1
          }
          that.currNum = that.currNum >= (aLi.length - 1) ? aLi.length - 1 : that.currNum
          that.currNum = that.currNum <= 0 ? 0 : that.currNum
          box.style.left = -that.currNum * wrap.offsetWidth + 'px'
        })
      },
      editCard (e, item) {
        e.preventDefault()
        var that = this
        window.rsqadmg.exec('actionsheet', {
          buttonArray: ['编辑任务列表', '删除任务列表'],
          className: 'delete_IOS',
          success: function (res) {
            switch (res.buttonIndex) {
              case 0:
                that.$prompt('', {
                  title: '编辑任务列表',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  center: true,
                  inputValue: item.name,
                  inputValidator: value => {
                    if (!value) {
                      return '请输入卡片名称'
                    }
                  }
                }).then(({ value }) => {
                  var params = {
                    name: value,
                    id: item.id
                  }
                  that.$store.dispatch('updateCardName', params).then((res) => {
                    item.name = value
                    that.$store.commit('UPDATE_SUBPLAN_NAME', res)
                  })
                }).catch(() => {})
                break
              case 1:
                if (!that.removePlanControl) {
                  alert('没有权限')
                  break
                }
                window.rsqadmg.exec('confirm', {
                  message: '确定删除卡片：' + item.name + '?',
                  success () {
                    const params = {
                      id: item.id
                    }
                    that.$store.dispatch('deleteCard', params)
                  }
                })
                break
              default:
                break
            }
          }
        })
      },
      addTask (item) {
        this.$store.commit('SAVE_CURRENT_CARD_ID', item)
        var pos = document.getElementsByClassName('card-list')[0].style.left
        this.$store.commit('SAVE_CURRENT_SUBPLAN', this.currentSubPlan)
        this.$store.commit('SAVE_CURRENT_LEFT', {pos: pos, num: this.currNum})
        this.$store.dispatch('setCurrentKanbanItem', def.defaultKanbanItem())
        this.$router.push('/plan/todo/create')
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
      //  element ui使用的时候有时会出现连续触发的问题，这里设置50ms的延迟执行
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      },
      setPlan (e) {
        e.preventDefault()
        // 提供弹窗或直接进入的方式
        this.$router.push('/plan/' + this.currentPlan.id + '/plan-setting')
        // var that = this
        // window.rsqadmg.exec('actionsheet', {
        //   buttonArray: ['计划设置', '重命名当前子计划', '删除当前子计划', '取消'],
        //   success: function (res) {
        //     switch (res.buttonIndex) {
        //       case 0:
        //         that.$router.push('/plan/' + that.currentPlan.id + '/plan-setting')
        //         break
        //       case 1:
        //         that.$prompt('请输入子计划名称', '提示', {
        //           confirmButtonText: '确定',
        //           cancelButtonText: '取消',
        //           inputValue: that.currentSubPlan.name,
        //           inputValidator: value => {
        //             if (!value) {
        //               return '请输入子计划名称'
        //             }
        //           }
        //         }).then(({ value }) => {
        //           var params = {
        //             name: value,
        //             id: that.currentSubPlan.id
        //           }
        //           that.$store.dispatch('updateName', params).then((res) => {
        //             that.$store.commit('UPDATE_SUBPLAN_NAME', res)
        //           })
        //         }).catch(() => {})
        //         break
        //       case 2:
        //         that.$store.dispatch('deleteChildPlan', that.currentSubPlan).then(() => {
        //           that.currentSubPlan = that.childPlanList[0]
        //           that.$store.dispatch('getCardList', that.childPlanList[0]).then(
        //             (res) => {
        //               that.$store.commit('SAVE_CARD', res.kanbanCardList)
        //             })
        //         })
        //         break
        //       default:
        //         break
        //     }
        //   }
        // })
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
        e.preventDefault()
        var that = this
        this.initialState = false
        this.currentSubPlan = item
        // window.rsqadmg.exec('showLoader', {'text': '加载中'})
        this.$store.dispatch('getCardList', item).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          }).then(() => {
            that.$nextTick(() => {
              var aLi = document.getElementsByClassName('card-border')
              var box = document.querySelector('.card-list')
              box.style.width = (aLi.length) * 100 + '%'
              for (var i = 0; i < aLi.length; i++) {
                aLi[i].style.width = 1 / (aLi.length) * 100 + '%'
              }
              // window.rsqadmg.exec('hideLoader')
            })
          })
      },
      toEditPlan (e) {
        this.$router.push('/plan/' + this.currentPlan.id + '/edit-child-plan')
      },
      postCard () {
        if (!this.cardName || /^\s+$/.test(this.cardName)) {
          return window.rsqadmg.exec('alert', {message: '请输入任务列表名称'})
        }
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
            var aLi = document.getElementsByClassName('card-border')
            var box = document.querySelector('.card-list')
            box.style.width = (aLi.length) * 100 + '%'
            for (var i = 0; i < aLi.length; i++) {
              aLi[i].style.width = 1 / (aLi.length) * 100 + '%'
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
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
  .wrap-left-card-name{
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
  .card-item-right .text-grey{
    color: #9B9B9B
  }
  .label-name{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #F5F5F5
  }
  .wrap-sub-item-finish{
    height: 0.453rem;
    display: flex;
    align-items: center;
  }
  .task-right-second{
    display: flex;
    align-items: center;
    height: 0.453rem;
    margin-top: 0.2rem;
  }
  .sub-item-img{
    width: 0.3rem;
    height: 0.3rem;
  }
  .sub-item-finish{
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
  .kanban-item-time{
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
  div.current-selected{
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
  .wrap-card-border{
    background-color: #F5F5F5;
    padding: 0.3rem;
    border: 0.5px solid #D4D4D4;
    border-radius: 3px;
  }
  .wrap{
    position: relative;
    overflow: hidden;
    height: 92vh;
    background-color: white;
  }
  .card-border{
    float: left;
    box-sizing: border-box;
    position: relative;
  }
  .card-item-left{
    float: left;
    padding: 0 0 0.5rem 0.2rem;
  }
  .card-item-right{
    margin-left: 1rem;
  }
  .post-new-task{
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #4A4A4A;
    margin-left: 0.2rem;
  }
  .is-finish{
    opacity: 0.6;
  }
  .card-selected{
    font-size: 20px;
    /*border: 1px solid #D8D8D8;*/
    border-radius: 1px;
    color: #D8D8D8;
  }
  .card-item-name{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.96px;
    word-break: break-all;
  }
  .card-item{
    background: #FFFFFF;
    box-shadow: 0 1px 2px 0 rgba(218,218,218,0.58);
    border-radius: 2px;
    margin-top: 0.3rem;
    padding: 0.2rem;
  }
  .card-item:first-child{
    margin-top: 0;
  }
  .card-top{
    display: flex;
    align-items: center;
    height: 46px;
    justify-content: space-between;
  }
  .other{
    color: #D8D8D8;
    border-radius: 100px;
    width: 20px
  }
  .finish-number{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9B9B9B;
    margin-left: 0.2rem;
  }
  .card-list{
    position: relative;
    background: white;
    border-radius: 2px;
    margin-left: 22px;
    transition: 0.1s;
    overflow: hidden;
  }
  .wrap-button{
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
  .yes{
    color: #FFFFFF;
    background-color: #2F7DCD;
    border-radius: 2px;
  }
  .no{
    background-color: #fff;
    color: #000;
    border: 0.5px solid #d4d4d4;
    border-radius: 3px;
    margin-right: 0.3rem;
  }
  .card-input-btn{
    width: 46px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-size: 13px;
  }
  .post-card-input{
    height: 1.25rem;
    padding-left: 0.3rem;
    border-radius: 4px;
  }
  .post-card-input-main{
    height: 2.473rem;
    background: #F5F5F5;
    padding: 0.3rem;
    border: 0.5px solid #d4d4d4;
    border-radius: 3px;
  }
  .child-plan-main{
    background-color: white;
    height: 100vh;
  }
  .wrap-post-card{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 95%;
    height: 1.7rem;
    background: #F5F5F5;
    border-radius: 3px;
    margin: 0 auto;
    border: 0.5px solid #d4d4d4;
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
  .child-plan-item{
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
  .set-plan{
    display: flex;
    align-items: center;
  }
  .set{
    font-size: 14px;
    color: #4F77AA;
    width: 19px;
    height: 19px;
  }
  .arrow-down{
    font-size: 12px;
    margin-left: 0.1rem;
    color: #c7c7c7;
  }
  .top-sub-plan-name{
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
    height: 46px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .top-sub-plan{
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
  .card-list:after{
    clear: both;
  }
  .task-border{
    height: 67vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .card-border{
    margin-top: 20px;
    padding-right: 45px;
    border-radius: 2px;
  }
  .card-border:first-child{
  }
  .card-name{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #000000;
    max-width: 4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .top-child{
    z-index: 100;
    position: relative;
    background-color: white;
    border-bottom: 0.5px solid #D4D4D4;
  }
  ul.show-child{
    top: 1.3rem
  }
  .child-plan {
    position: fixed;
    top:-20rem;
    transition: 0.5s;
    z-index: 50;
    background-color: white;
    width: 96%;
    padding-left: 15px;
    padding-right: 15px;
    box-shadow: 0 2px 2px 0 rgba(233,233,233,0.50);
  }
</style>
