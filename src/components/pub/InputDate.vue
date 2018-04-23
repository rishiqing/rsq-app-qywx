<template>
  <v-touch @tap="gotoDate">
    <div
      class="outer-wrap bottom-border">
      <span class="inner-key">日期</span>
      <span class="inner-value">{{ dateString }}</span>
      <i class="icon2-arrow-right-small arrow"/>
    </div>
  </v-touch>
</template>
<script>
  import dateUtil from 'ut/dateUtil'

  export default {
    name: 'InputDate',
    props: {
      //  是否有左侧的空间，默认是没有的，编辑模式下是有左边的padding
      hasLeftSpace: {
        type: Boolean,
        default: false
      },
      //  是否被禁用编辑
      isDisabled: {
        type: Boolean,
        default: false
      },
      //  被禁用编辑的提示，默认为''，不提示；如果要显示提示文字，需要传入提示的文字
      disabledText: {
        type: String,
        default: ''
      },
      //  todo item对象
      item: {
        type: Object,
        required: true
      },
      //  日期分隔符
      sep: {
        type: String,
        default: ''
      },
      todoType: {
        type: String,
        default: 'sche'
      }
    },
    data () {
      return {}
    },
    computed: {
      dateString () {
        if (this.item.pContainer === 'inbox') {
          return '添至日程'
        } else if (this.item.startDate === null && this.item.endDate === null && this.item.dates === null) {
          return '今天'
        } else {
          var result = dateUtil.repeatDate2Text(this.item)
          if (result.length > 20) {
            result = result.substring(0, 21)
          }
          var time = new Date()
          var newTime = time.getMonth() + 1 + '月' + time.getDate() + '日'
          return newTime === result ? '今天' : result
        }
      },
      fromInbox () {
        return this.item.pContainer === 'inbox'
      }
    },
    methods: {
      gotoDate () {
        if (this.isDisabled) {
          window.rsqadmg.execute('toast', {message: this.disabledText})
          return
        }
        //  将需要用到的属性设置到currentTodoDate中
        var c = this.item
        var obj = {
          startDate: c.startDate || null,
          endDate: c.endDate || null,
          dates: c.dates || null,
          isCloseRepeat: !!c.isCloseRepeat,
          repeatType: c.repeatType || null,
          repeatBaseTime: c.repeatBaseTime || null,
          isLastDate: c.isLastDate === undefined || false
        }
        this.$store.commit('PUB_TODO_DATE_UPDATE', {data: obj})
        this.$router.push('/' + this.todoType + '/todo/date')
//        // 显示之前先将所有获得焦点的元素失去焦点
//        if (document.activeElement) {
//          document.activeElement.blur()
//        }
//        var that = this
//        var defDate = dateUtil.backend2frontend({dates: this.itemDates, startDate: this.itemStartDate, endDate: this.itemEndDate})
//        SelectDate.show({
//          type: defDate.dateType,
//          selectNumDate: defDate.dateResult,
//          success: function (result) {
//            var resObj = dateUtil.frontend2backend({dateType: result.type, dateResult: result.selectNumDate, sep: that.itemSep})
//            that.$emit('date-changed', resObj)
//          }
//        })
      }
    }
  }
</script>
<style lang="scss" scoped>
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
  }
  .arrow{
    color: #999999;
    font-size: 21px;
    position: absolute;
    top:50%;
    margin-top: -0.25rem;
    right: 0.2rem;
  }
  .bottom-border{
    border-bottom: 1px solid #E0E0E0;
  }
</style>

