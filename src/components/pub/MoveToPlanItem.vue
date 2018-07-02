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
      </div>
    </div>
    <ul
      v-if="cardListNum !== 0"
      class="ul-list">
      <v-touch
        v-for="item in cardList"
        :key="item.id"
        :data-id="item.id"
        tag="li"
        class="li-item"
        @tap="select(item.id)">
        <span>
          {{ item.name }}
        </span>
        <i
          :class="{ 'icon2-selected': item.id === clickId ? true : false}"
          class="selected-icon"/>
      </v-touch>
    </ul>
    <div
      v-if="cardListNum !== 0"
      class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="delayCall('move')">
          确定
        </v-touch>
      </div>
    </div>
    <div
      v-else
      class="item-list">
      <img src="../../assets/img/cardlist.svg">
      <p class="shouye">当前子计划下，没有任务列表</p>
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
        </v-touch>
      </li>
    </ul>
    <v-touch
      v-show="initialState"
      class="mask"
      @tap="changeState"/>
  </div>
</template>
<script>
  import dateUtil from 'ut/dateUtil'

  export default {
    name: 'ChildPlan',
    components: {
    },
    data () {
      return {
        initialState: false,
        currentSubPlan: {
          name: ''
        },
        clickId: 0
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
      cardListNum () {
        return this.$store.state.cardList.length
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
      },
      kanbanItem () {
        return this.$store.state.todo.currentTodo.kanbanItem.kanbanItemId || null
      },
      levelTwoId () {
        if (this.$store.state.todo.currentTodo.from) {
          return this.$store.state.todo.currentTodo.from.levelTwoId || null
        }
      },
      id () {
        return this.$store.state.todo.currentTodo.id
      }
    },
    mounted () {
      var that = this
      this.clickId = this.levelTwoId || null
      window.rsqadmg.exec('setTitle', {title: '选择任务列表'})
      // 拿到看板列表以及看板的任务列表。。。好多数据
      var creatorId = this.$store.state.loginUser.rsqUser.id
      for (var i = 0; i < this.userRoles.length; i++) {
        if (this.userRoles[i].userId === creatorId) {
          this.ifShowCreate = true
        }
      }
      var id = this.$store.state.todo.currentTodo.from ? this.$store.state.todo.currentTodo.from.levelFourId : null
      if (this.$store.state.todo.currentTodo.kanbanItem && this.childPlanList.some(function (o) {
        return o.id === id
      })) {
        that.$store.dispatch('getCardList', {id: id}).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
            that.currentSubPlan.name = that.$store.state.todo.currentTodo.from.levelFourName
          })
      } else {
        if (this.childPlanList) {
          this.currentSubPlan = this.childPlanList[0]
        }
        // window.rsqadmg.exec('showLoader', {'text': '加载中'})
        this.$store.dispatch('getCardList', this.childPlanList[0]).then(
          (res) => {
            that.$store.commit('SAVE_CARD', res.kanbanCardList)
          })
      }
    },
    methods: {
      delayCall (func) {
        window.setTimeout(() => {
          this[func].apply(this, Array.prototype.slice.call(arguments, 1))
        }, 50)
      },
      move () {
        var that = this
        if (this.clickId) {
          console.log(this.clickId)
          this.$store.dispatch('moveToPlan', {todoId: this.id, cardId: this.clickId, createTaskDate: Number(dateUtil.dateNum2Text(new Date().getTime()))})
        }
        that.$router.go(-2)
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
          })
      },
      select (id) {
        this.clickId = id
      }
    }
  }
</script>
<style lang="scss" scoped>
  .selected-icon{
    display: none;
    align-items: flex-start;
    padding-top: 0.05rem;
    line-height: 56px
  }
  .child-plan-main{
    background-color: #f5f5f5;
    height: 100vh;
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
    border-bottom: 0.5px solid #d4d4d4;
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
    width: 94%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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
    margin:0 auto
  }
  .mask{
    width: 100%;
    height: 100%;
    background: #000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    opacity: 0.6;
  }

  .top-child{
    z-index: 100;
    position: relative;
    background-color: #fafafa;
    border-bottom: 0.5px solid #D4D4D4;
  }
  ul.show-child{
    top: 46px
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
    // box-shadow: 0 2px 2px 0 rgba(233,233,233,0.50);
  }
  .ul-list{
    margin-top: 20px;
    background-color: #fff;
    border-bottom: 0.5px solid #d4d4d4;
    border-top: 0.5px solid #d4d4d4;
  }
  .li-item{
    height: 56px;
    line-height: 56px;
    margin-left: 15px;
    border-bottom: 0.5px solid #d4d4d4;
    display: flex;
    justify-content: space-between;
  }
  .li-item:last-child{
    border-bottom: 0;
    font-size: 15px;

  }
  .icon2-selected{
    display: flex
  }
  .item-list{
    text-align: center;
    background-color: #F5F5F5;
    height: 78%;

    img{
      width: 1.866rem;
      height: 1.866rem;
      margin-top:3.653rem ;
      vertical-align: bottom;
    }
    .shouye{
      padding: 0;
      margin:0;
      margin-top:30px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #55A8FD;
      letter-spacing: 0;
    }
  }
</style>
