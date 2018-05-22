<template>
  <div
    id="calMain"
    :class="{'animate': isShowAnimate}"
    :style="{'padding-top': paddingTop + 'px'}"
    class="router-view content--cal calendar"
    style="box-sizing:border-box;">
    <r-calendar
      :default-select-date="dateSelect"
      @click-cal-day="fetchItems"
      @after-cal-ready="fetchDatesHasTodo"
      @after-cal-swipe="fetchDatesHasTodo"
      @after-cal-switch="fetchDatesHasTodo"
      @on-cal-pan="onPanMove"
      @on-cal-pan-end="onPanEnd"/>
    <div
      id="bounceDiv"
      style="width:100%;-webkit-overflow-scrolling: touch;margin-top: 27px">
      <r-pull-to-refresh
        :enabled="enablePullToRefresh"
        @on-list-pan-move="checkScroll"
        @on-pull-down="pullRefresh">
        <r-todo-item-list
          v-if="items.length!==0"
          :items="items"
          :is-checkable="true"/>
        <div
          v-else
          class="itm-lst">
          <v-touch @tap="createNew">
            <img src="../../assets/img/todo-empty.png" >
          </v-touch>
          <p class="shouye">还没有日程，赶快去创建吧</p>
        </div>
      </r-pull-to-refresh>
      <v-touch @tap="toInbox">
        <img
          class="main_inbox"
          src="../../assets/img/main_inbox.png">
      </v-touch>
      <r-nav/>
    </div>
  </div>
</template>
<script>
  import def from 'ut/defaultUtil'
  import Calendar from 'com/sche/CalendarV2'
  import Pull from 'com/pub/Pull2Refresh'
  import TodoItemList from 'com/sche/TodoItemList'
  import moment from 'moment'
  import nav from 'com/Nav'
  const CAL_STATE = {
    bar: {
      value: 81
    },
    pane: {
      value: 271
    }
  }

  export default {
    name: 'ScheMain',
    components: {
      'r-calendar': Calendar,
      'r-pull-to-refresh': Pull,
      'r-todo-item-list': TodoItemList,
      'r-nav': nav
    },
    data () {
      return {
        titleName: '日程',
        currentDate: new Date(),
        paddingTop: CAL_STATE['bar'].value,
        isShowAnimate: false,
        enablePullToRefresh: false
      }
    },
    computed: {
      dateSelect () {
        var strDate = this.$store.state.schedule.strCurrentDate
        return strDate ? moment(strDate, 'YYYY-MM-DD').toDate() : new Date()
      },
      items () {
        var items = this.$store.state.schedule.items
        var newItems = []
        if (items !== null && items.length !== 0) {
          for (var i = 0; i < items.length; i++) {
            if (!items[i].pIsDone) {
              newItems.push(items[i])
            }
          }
          for (i = 0; i < items.length; i++) {
            if (items[i].pIsDone) {
              newItems.push(items[i])
            }
          }
          return newItems
        } else {
          return []
        }
      },
      currentNumDate () {
        return this.$store.getters.defaultNumTaskDate
      }
    },
    mounted () {
      window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(this.dateSelect)})
      window.rsqadmg.execute('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: true})

      var main = document.getElementById('calMain')
      main.addEventListener('transitionend', () => {
        this.isShowAnimate = false
      })
      main.addEventListener('webkitTransitionEnd', () => {
        this.isShowAnimate = false
      })
    },
    methods: {
      toInbox () {
        this.$router.push('/inbox')
      },
      createNew () {
        //  过去的日期不允许创建任务
        if (this.currentNumDate + 24 * 3600 * 1000 > new Date().getTime()) {
          this.$store.dispatch('setCurrentTodo', def.allDefaultTodo())
          this.$router.push('/sche/todo/create')
        }
      },
      onPanMove (p) {
        this.paddingTop = CAL_STATE[p.type].value + p.deltaY
      },
      onPanEnd (p) {
        this.paddingTop = CAL_STATE[p.targetType].value
        this.isShowAnimate = true
      },
      checkScroll (p) {
//        this.enablePullToRefresh = false
//        var main = document.getElementById('calMain')
//        main.scrollTop = -p.deltaY
      },
      updateScroll () {
        //  获取列表后，始终错位一个像素，保证上拉刷新
//        this.$nextTick(() => {
//          var main = document.getElementById('calMain')
//          main.scrollTop = 50
//          if (main.scrollTop === 0) {
//            this.enablePullToRefresh = true
//          }
//        })
      },
      formatTitleDate (date) {
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
      },
      fetchItems (strDate) {
//        window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(strDate)})
        this.$store.dispatch('fetchScheduleItems', { strDate })
          .then(() => {
            this.updateScroll()
          })
      },
      pullRefresh (cb) {
        this.enablePullToRefresh = false
        this.$store.dispatch('fetchScheduleItems', { strDate: this.dateSelect, sync: true })
          .then(() => {
            cb()
            this.updateScroll()
          })
      },
      fetchDatesHasTodo (p) {
        if (p.type === 'bar') {
          this.fetchBarHasTodo(p)
        } else {
          this.fetchPaneHasTodo(p)
        }
      },
      fetchBarHasTodo (p) {
        var weekArray = p.daysArray[1]
        var firstDate = weekArray[0].date
        var lastDate = weekArray[weekArray.length - 1].date
        var titleDate = weekArray[3].date
        window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(titleDate)})
        this.$store.dispatch('getDatesHasTodo', {
          startDate: firstDate,
          endDate: lastDate
        }).then(res => {
          weekArray.forEach(day => {
            if (res.indexOf(String(day.date.getTime())) !== -1) {
              this.$set(day, 'showTag', true)
            }
          })
        })
      },
      fetchPaneHasTodo (p) {
        var weekArray = p.daysArray[1]
        var firstDate = weekArray[0][0].date
        var lastDate = weekArray[weekArray.length - 1][6].date
        var titleDate = weekArray[1][0].date
        window.rsqadmg.exec('setTitle', {title: this.formatTitleDate(titleDate)})
        this.$store.dispatch('getDatesHasTodo', {
          startDate: firstDate,
          endDate: lastDate
        }).then(res => {
          weekArray.forEach(week => {
            week.forEach(day => {
              if (res.indexOf(String(day.date.getTime())) !== -1) {
                this.$set(day, 'showTag', true)
              }
            })
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .main_inbox{
    position: fixed;
    bottom: 1.6rem;
    right: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
  }
  .calendar {
    overflow-y: auto;
  }
  .itm-lst{
    text-align: center;
    background-color: #F5F5F5;
    height: 78%;
  }
  img{
    width: 1.866rem;
    height: 1.866rem;
    margin-top:3.653rem ;
  }
  .shouye{
    padding: 0;
    margin:0;
    margin-top:0.418rem;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #55A8FD;
    letter-spacing: 0
  }
  img{
    width: 70px;
    height: 70px;
    margin-top:137px ;
  }
  .animate {
    transition: padding-top 0.3s ease;
  }
</style>
