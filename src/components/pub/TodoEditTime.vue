<template>
  <div class="edit-time">
    <div class="sec">
      <v-touch class="chosetime">
        <div @click="setStartTime">
          <div class="list-key">开始时间</div>
          <div class="list-value">
            {{ clock.startTime ? clock.startTime : '点击设置' }}
          </div>
        </div>
      </v-touch>
      <i class="icon2-arrow-right-small arrow ab"/>
      <v-touch class="chosetime">
        <div
          class="setEndTime"
          @click="setEndTime">
          <div class="list-key">结束时间</div>
          <div class="list-value">
            {{ clock.endTime ? clock.endTime : '点击设置' }}
          </div>
        </div>
      </v-touch>
    </div>
    <ul class="last">
      <v-touch
        tag="li"
        @tap="gotoAlert">
        <span class="list-key">{{ alertText }}</span>
        <i class="icon2-arrow-right-small arrow"/>
      </v-touch>
    </ul>
    <div class="btn-group">
      <div class="btn-wrap">
        <v-touch
          tag="a"
          class="weui-btn weui-btn_primary"
          href="javascript:;"
          @tap="accept">
          完成
        </v-touch>
        <v-touch
          class="weui-btn clear"
          tag="a"
          @tap="tapEmpty">
          清除日期
        </v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import jsUtil from 'ut/jsUtil'

  export default {
    name: 'TodoEditTime',
    data () {
      return {
        autoStart: true,
        autoEnd: true,
        // isChecked: true,
        // isAllDay: true,
        clock: {
          startTime: '',
          endTime: ''
        }
      }
    },
    computed: {
      currentTodo () {
        return this.$store.state.todo.currentTodo
      },
      // isAllDay () {
      //   return !(this.clock.startTime && this.clock.endTime)
      // },
      isEdit () {
        return !!this.currentTodo.id
      },
      todoTime () {
        return this.$store.state.pub.currentTodoTime
      },
      clockData () {
        // if (this.isAllDay) return {}
        return this.clock
      },
      alertText () {
        var arr = this.clock.alert || []
        if (arr.length > 0) {
          return arr.map(a => {
            var str
            if (!a.isUserDefined) {
              str = jsUtil.alertCode2Text(a.schedule)
            } else {
              str = jsUtil.alertCode2Text(a.schedule)
            }
            return str
          }).join(',')
        } else {
          return '不提醒'
        }
      }
    },
    created () {
      this.initData()
      window.rsqadmg.exec('setTitle', {title: '时间和提醒'})
      window.rsqadmg.exec('setOptionButtons', {hide: true})
      this.$store.dispatch('setNav', {isShow: false})
    },
    methods: {
      /**
       * 初始化数据
       */
      initData () {
        //  检查pub区是否有缓存，有缓存则读缓存，否则从currentTodo上读取
        jsUtil.extendObject(this.clock, this.todoTime.clock)
        // this.isAllDay = !this.clock.startTime
        // this.isChecked = this.isAllDay

        //  todoTime.startTime存在，说明之前设置过提醒，不再自动设置
        if (this.clock.startTime && this.clock.endTime) {
          this.autoStart = false
          this.autoEnd = false
        }
        //  自动调整时间
        // this.autoChangeTime()
      },
      /**
       * 在用户修改具体时间前自动调整起止时间间隔1小时
       */
      autoChangeTime () {
        var base
        //  开始时间和结束时间都是自动调整，那么就设置为当前时间
        if (this.autoStart && this.autoEnd) {
          //  设置为延后2分钟
          base = moment(new Date().getTime() + 2 * 60 * 1000)
          this.clock.startTime = base.format('HH:mm')
          this.clock.endTime = base.add(1, 'h').format('HH:mm')
        } else {
          //  如果是自动调整开始时间，那么将开始时间调整至结束时间前1小时
          if (this.autoStart) {
            base = moment(this.clock.endTime, 'HH:mm')
            this.clock.startTime = base.subtract(1, 'h').format('HH:mm')
          }
          //  如果是自动调整结束时间，那么将结束时间调整至开始时间后1小时
          if (this.autoEnd) {
            base = moment(this.clock.startTime, 'HH:mm')
            this.clock.endTime = base.add(1, 'h').format('HH:mm')
          }
        }
      },
      // empty () {},
      // toggleAllDay (e) {
      //   this.isAllDay = !this.isAllDay
      //   this.isChecked = this.isAllDay
      // },
      /**
       * 设置开始时间
       */
      setStartTime () {
        var that = this
        const defStartTime = that.clock.startTime ? that.clock.startTime : moment().format('HH:mm')
        const defEndTime = that.clock.endTime ? that.clock.endTime : ''
        window.rsqadmg.exec('timePicker2', {
          strInit: defStartTime,
          strInit2: defEndTime,
          start: true,
          success (start, end) {
            if (!start || !end) {
              window.rsqadmg.exec('alert', {message: '请选择开始与结束时间'})
              return
            }
            if (moment(start, 'HH:mm').isAfter(moment(end, 'HH:mm'))) {
              window.rsqadmg.exec('alert', {message: '开始时间不能晚于结束时间'})
            } else {
              that.clock.startTime = start
              that.clock.endTime = end
              that.autoStart = false
              // that.autoChangeTime()
            }
          }
        })
      },
      /**
       * 设置结束时间
       */
      setEndTime () {
        var that = this
        const defStartTime = that.clock.startTime ? that.clock.startTime : moment().format('HH:mm')
        const defEndTime = that.clock.endTime ? that.clock.endTime : ''
        window.rsqadmg.exec('timePicker2', {
          strInit: defStartTime,
          strInit2: defEndTime,
          start: false,
          success (start, end) {
            if (!start || !end) {
              window.rsqadmg.exec('alert', {message: '请选择开始与结束时间'})
              return
            }
            if (moment(start, 'HH:mm').isAfter(moment(end, 'HH:mm'))) {
              window.rsqadmg.exec('alert', {message: '开始时间不能晚于结束时间'})
            } else {
              that.clock.startTime = start
              that.clock.endTime = end
              that.autoStart = false
              // that.autoChangeTime()
            }
          }
        })
      },
      tapEmpty () {
        this.clock.startTime = ''
        this.clock.endTime = ''
        this.autoStart = false
        this.autoEnd = false
        this.clock.alert = ''
      },
      /**
       * 保存当前todoTime的数据并跳转到提醒页面
       */
      gotoAlert () {
        if (!this.checkTimeValid()) {
          window.rsqadmg.exec('alert', {message: '必须设置合理的时间才能使用提醒功能'})
          return
        }
        this.saveTodoTimeState()
        this.$router.push('/sche/todo/alert')
      },
      /**
       * 检查开始时间和结束时间设置的是否正确，需要满足一下两个条件：
       * 1  开始时间和结束时间都不能为空；
       * 2  开始时间不能晚于结束时间；
       */
      checkTimeValid () {
        return this.clock && this.clock.startTime && this.clock.endTime &&
          moment(this.clock.startTime, 'HH:mm').isBefore(moment(this.clock.endTime, 'HH:mm'))
      },
      /**
       * 当设置提醒的时候开始时间不能早于当前时间
       */
      checkWarn () {
        // if (this.clockData.alert &&
        //   this.clockData.alert.length > 0 &&
        //   moment().isAfter(moment(this.clock.startTime, 'HH:mm'))) {
        //   return '提醒时间早于当前时间，可能不会收到提醒!'
        // }
      },
      /**
       * 检查用户是否更新过，
       * currentTodo.id不存在（新建）：isAllDay为false即为modified
       * currentTodo.id存在（更新）：比对localTodoTime和todoTime的每一项是否都一样
       */
      isModified () {
        return !jsUtil.objectEqual(this.clock, (this.currentTodo.clock || {}))
      },
      accept () {
        this.$router.go(-1)
      },
      /**
       * 保存todoTime的状态到state中
       */
      saveTodoTimeState () {
        this.$store.commit('PUB_TODO_TIME_SET', {data: {clock: this.clock}})
      },
      beforeSubmitTodo (next) {
        if (this.isModified()) {
          //  提交
          var that = this
          var warn = this.checkWarn()
          if (warn) {
            window.rsqadmg.exec('confirm', {
              message: warn,
              success () {
                that.submitTodo(next)
              },
              cancel () {
                next(false)
              }
            })
          } else {
            that.submitTodo(next)
          }
        } else {
          next()
        }
      },
      /**
       * 提交todoTime的更新
       * @param next
       * @returns {Promise<U>|Promise.<TResult>|*|Thenable<U>}
       */
      submitTodo (next) {
        if (this.isEdit) {
          window.rsqadmg.exec('showLoader', {text: '保存中'})
        }
        //  在有提醒的情况下返回值中居然不包括clock.alert的数据，需要前端组合传入
        let clockObject = {}
        if (this.clock && this.clock.startTime && this.clock.endTime) {
          clockObject = this.clock
        }

        return this.$store.dispatch('updateTodoTime', {clock: clockObject})
          .then(item => {
            if (item.clock && item.clock.alert) {
              jsUtil.extendObject(item.clock, clockObject)
              return this.$store.dispatch('handleRemind', {item})
            } else {
              return item
            }
          })
          .then(() => {
            this.$store.commit('PUB_TODO_TIME_DELETE')
            if (this.isEdit) {
              window.rsqadmg.exec('hideLoader')
            }
            next()
          })
      }
    },
    /**
     * vue-router hook
     * @param to
     * @param from
     * @param next
     * @returns {*}
     */
    beforeRouteLeave (to, from, next) {
      //  做pub区缓存
      this.saveTodoTimeState()
      if (to.name !== 'todoNew' && to.name !== 'todoEdit' && to.name !== 'demo') {
        return next()
      }
      this.beforeSubmitTodo(next)
    }
  }
</script>
<style lang="scss" scoped>
  .setEndTime{
  }
  .weui-picker__item{
    font-size: 18px;
  }
  .weui-picker__action:first-child, .weui-picker__action{
    color: skyblue;
  }
  .edit-time {
    .switch-wrapper {
      position: absolute;
      top:0.15rem;
      right:0.25rem;
      color: #333333;
    }
    input.mui-switch-time {
      display: block;
      width: 50px;
      height: 31px;
      border: 1px solid #dfdfdf;
      background-color: #fdfdfd;
      box-shadow: #dfdfdf 0 0 0 0 inset;
      border-radius: 20px;
      background-clip: content-box;
      -webkit-appearance: none;
      user-select: none;
      outline: none; }
    input.mui-switch-time:before {
      content: '';
      width: 29px;
      height: 30px;
      position: absolute;
      top: 0px;
      left: 0;
      border-radius: 20px;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }
    input.mui-switch-time:checked {
      border-color: #67B2FE;
      box-shadow: #67B2FE 0 0 0 16px inset;
      background-color: #67B2FE; }
    input.mui-switch-time:checked:before {
      left: 21px; }

    .is-text-disabled span {color: #DDDDDD;}
    .is-text-disabled .arrow {color:#E0E0E0;}
    .arrow{
      position: absolute;
      right: 0.2rem;
      top: 50%;
      margin-top: -0.25rem;
      font-size: 21px;
      color: #999999;
    }
    ul{
      background-color: white;
      border-top:0.5px solid #DADADA;
    }
    .edit-time-all-day{
      margin-top: 0.231rem;
      border-top:0.5px solid #DADADA;
    }
    .edit-time-all-day>li{
      padding-left: 3%;
    }
    .last>li{
      padding-left: 3%;
    }
    li{
      position: relative;
      line-height:1.2rem ;
      height: 1.2rem;
      border-bottom:0.5px solid #d4d4d4;
      box-sizing: border-box;
      padding-left: 3%;
    }
    .sec{
      margin-top:20px;
      border-top: 0.5px solid #d4d4d4;
      border-bottom:0.5px solid #d4d4d4;
      height: 80px;
      background-color: #fff;
      text-align: center;
      position: relative;
      .chosetime{
        float: left;
        width: 50%;
        height: 100%;
        .list-key{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #9B9B9B;
          line-height: 22px;
          margin-top: 13px;
          margin-bottom: 6px;
        }
        .list-value{
          font-family: PingFangSC-Regular;
          font-size: 17px;
          color: #000000;
          line-height: 24px;
        }
      }
      .ab{
          position: absolute;
          left: 0;
          top: 50%;
        }
    }
    .last{
      margin-top:20px ;
    }
    span{
      display: block;
      font-family: PingFangSC-Regular;
      font-size: 17px;
      letter-spacing: 0;
    }
    span.list-key {
      float:left;
      width: 80%;
      height: 100%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;;

    }
    span.list-value {float:right;margin-right:0.94rem;
      max-width:7rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;
      color: #999999;
    }
  }
  .date-clear {
    text-align: center;
    line-height: 1.2rem;
    font-size: 0.4rem;
    background-color: #FFF;
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .weui-picker__action{
    background:red;
  }
  .clear{
    color: #000 !important;
    background-color: #fff;
    border: 0.5px solid #d4d4d4
  }
</style>
